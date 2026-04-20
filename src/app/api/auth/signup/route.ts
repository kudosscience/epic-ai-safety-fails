import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerEnvDiagnostics, hasServerEnv } from "@/lib/env";
import { SIGNUP_RECAPTCHA_ACTION, verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const PASSWORD_MIN_LENGTH = 12;
const USERNAME_PATTERN = /^[a-z0-9_]{3,32}$/;
const POSTGRES_UNIQUE_VIOLATION_CODE = "23505";
const INVITE_CODE_MIN_LENGTH = 8;
const INVITE_CODE_MAX_LENGTH = 64;

const signupRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(PASSWORD_MIN_LENGTH),
  username: z.string().regex(USERNAME_PATTERN),
  fullName: z.string().min(2).max(80),
  titleAffiliation: z.string().max(120).optional().default(""),
  inviteCode: z.string().trim().min(INVITE_CODE_MIN_LENGTH).max(INVITE_CODE_MAX_LENGTH),
  recaptchaToken: z.string().min(10),
});

interface RollbackProvisionedUserResult {
  profileDeleted: boolean;
  authUserDeleted: boolean;
}

function formatMissingEnvMessage(label: string, keys: string[]): string {
  return `${label} configuration is incomplete. Missing required environment variables: ${keys.join(", ")}.`;
}

function getRequesterIp(request: Request): string | undefined {
  const headerValue = request.headers.get("x-forwarded-for");

  if (!headerValue) {
    return undefined;
  }

  return headerValue.split(",")[0]?.trim();
}

async function rollbackProvisionedUser(userId: string): Promise<RollbackProvisionedUserResult> {
  const adminClient = createSupabaseAdminClient();

  let profileDeleted = true;
  let authUserDeleted = true;

  const profileDeleteResult = await adminClient.from("profiles").delete().eq("id", userId);
  if (profileDeleteResult.error) {
    profileDeleted = false;
    console.error("Failed to rollback profile during signup cleanup.", {
      userId,
      error: profileDeleteResult.error,
    });
  }

  const authDeleteResult = await adminClient.auth.admin.deleteUser(userId);
  if (authDeleteResult.error) {
    authUserDeleted = false;
    console.error("Failed to rollback auth user during signup cleanup.", {
      userId,
      error: authDeleteResult.error,
    });
  }

  return {
    profileDeleted,
    authUserDeleted,
  };
}

function isUsernameUniqueViolation(error: {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}): boolean {
  if (error.code !== POSTGRES_UNIQUE_VIOLATION_CODE) {
    return false;
  }

  const normalizedErrorContext = [error.message, error.details, error.hint]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();

  return normalizedErrorContext.includes("profiles_username_key") || normalizedErrorContext.includes("username");
}

export async function POST(request: Request) {
  if (!hasServerEnv()) {
    const envDiagnostics = getServerEnvDiagnostics();

    if (envDiagnostics.missingRecaptchaKeys.length && envDiagnostics.missingSupabaseKeys.length) {
      return NextResponse.json(
        {
          error:
            `${formatMissingEnvMessage("reCAPTCHA", envDiagnostics.missingRecaptchaKeys)} ` +
            `${formatMissingEnvMessage("Supabase", envDiagnostics.missingSupabaseKeys)}`,
        },
        { status: 500 },
      );
    }

    if (envDiagnostics.missingRecaptchaKeys.length) {
      return NextResponse.json(
        {
          error: formatMissingEnvMessage("reCAPTCHA", envDiagnostics.missingRecaptchaKeys),
        },
        { status: 500 },
      );
    }

    if (envDiagnostics.missingSupabaseKeys.length) {
      return NextResponse.json(
        {
          error: formatMissingEnvMessage("Supabase", envDiagnostics.missingSupabaseKeys),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: "Server authentication configuration is invalid. Check Supabase and reCAPTCHA environment values.",
      },
      { status: 500 },
    );
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Malformed JSON request body.",
      },
      { status: 400 },
    );
  }
  const parsedBody = signupRequestSchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid signup payload.",
      },
      { status: 400 },
    );
  }

  const normalizedInviteCode = parsedBody.data.inviteCode.trim().toUpperCase();

  const recaptchaResult = await verifyRecaptchaToken({
    token: parsedBody.data.recaptchaToken,
    expectedAction: SIGNUP_RECAPTCHA_ACTION,
    remoteIp: getRequesterIp(request),
  });

  if (!recaptchaResult.ok) {
    return NextResponse.json(
      {
        error: recaptchaResult.reason ?? "CAPTCHA verification failed.",
      },
      { status: 403 },
    );
  }

  const adminClient = createSupabaseAdminClient();

  const inviteLookup = await adminClient
    .from("research_invites")
    .select("id, invited_by, used_by, revoked_at")
    .eq("code", normalizedInviteCode)
    .maybeSingle();

  if (inviteLookup.error) {
    return NextResponse.json({ error: "Failed to validate invite code." }, { status: 500 });
  }

  if (!inviteLookup.data || inviteLookup.data.used_by || inviteLookup.data.revoked_at) {
    return NextResponse.json({ error: "Invite code is invalid, used, or revoked." }, { status: 403 });
  }

  const existingUsername = await adminClient
    .from("profiles")
    .select("id")
    .eq("username", parsedBody.data.username)
    .maybeSingle();

  if (existingUsername.error) {
    return NextResponse.json({ error: "Failed to validate username availability." }, { status: 500 });
  }

  if (existingUsername.data) {
    return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
  }

  const createUserResult = await adminClient.auth.admin.createUser({
    email: parsedBody.data.email,
    password: parsedBody.data.password,
    email_confirm: false,
    user_metadata: {
      full_name: parsedBody.data.fullName,
    },
  });

  if (createUserResult.error || !createUserResult.data.user) {
    return NextResponse.json(
      {
        error: createUserResult.error?.message ?? "Unable to create user account.",
      },
      { status: 400 },
    );
  }

  const createdUserId = createUserResult.data.user.id;

  const profileInsertResult = await adminClient.from("profiles").insert({
    id: createdUserId,
    username: parsedBody.data.username,
    full_name: parsedBody.data.fullName,
    title_affiliation: parsedBody.data.titleAffiliation || null,
    invited_by: inviteLookup.data.invited_by,
    role: "researcher",
  });

  if (profileInsertResult.error) {
    const rollbackResult = await rollbackProvisionedUser(createdUserId);

    if (!rollbackResult.authUserDeleted) {
      return NextResponse.json(
        {
          error: "Failed to clean up a partially created account. Please contact support.",
        },
        { status: 500 },
      );
    }

    if (isUsernameUniqueViolation(profileInsertResult.error)) {
      return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create contributor profile." }, { status: 500 });
  }

  const claimInviteResult = await adminClient
    .from("research_invites")
    .update({
      used_by: createdUserId,
      used_at: new Date().toISOString(),
    })
    .eq("id", inviteLookup.data.id)
    .is("used_by", null)
    .is("revoked_at", null)
    .select("id")
    .maybeSingle();

  if (claimInviteResult.error || !claimInviteResult.data) {
    const rollbackResult = await rollbackProvisionedUser(createdUserId);

    if (!rollbackResult.authUserDeleted) {
      return NextResponse.json(
        {
          error: "Failed to clean up a partially created account. Please contact support.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "Invite code could not be claimed." }, { status: 409 });
  }

  return NextResponse.json(
    {
      message:
        "Account created. If email confirmation is enabled in Supabase Auth, confirm your email before first login.",
    },
    { status: 201 },
  );
}
