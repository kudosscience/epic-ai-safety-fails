import { NextResponse } from "next/server";
import { z } from "zod";

import { hasServerEnv } from "@/lib/env";
import { SIGNUP_RECAPTCHA_ACTION, verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const PASSWORD_MIN_LENGTH = 12;
const USERNAME_PATTERN = /^[a-z0-9_]{3,32}$/;

const signupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(PASSWORD_MIN_LENGTH),
  username: z.string().regex(USERNAME_PATTERN),
  fullName: z.string().min(2).max(80),
  titleAffiliation: z.string().max(120).optional().default(""),
  inviteCode: z.string().min(8).max(64),
  recaptchaToken: z.string().min(10),
});

function getRequesterIp(request: Request): string | undefined {
  const headerValue = request.headers.get("x-forwarded-for");

  if (!headerValue) {
    return undefined;
  }

  return headerValue.split(",")[0]?.trim();
}

async function rollbackProvisionedUser(userId: string): Promise<void> {
  const adminClient = createSupabaseAdminClient();

  await adminClient.from("profiles").delete().eq("id", userId);
  await adminClient.auth.admin.deleteUser(userId);
}

export async function POST(request: Request) {
  if (!hasServerEnv()) {
    return NextResponse.json(
      {
        error: "Server authentication configuration is incomplete.",
      },
      { status: 500 },
    );
  }

  const requestBody = await request.json().catch(() => null);
  const parsedBody = signupRequestSchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Invalid signup payload.",
      },
      { status: 400 },
    );
  }

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
    .eq("code", parsedBody.data.inviteCode)
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
    await rollbackProvisionedUser(createdUserId);
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
    await rollbackProvisionedUser(createdUserId);
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
