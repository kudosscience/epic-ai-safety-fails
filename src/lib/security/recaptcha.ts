import { z } from "zod";

import { getServerEnv } from "@/lib/env";

const RECAPTCHA_VERIFY_ENDPOINT = "https://www.google.com/recaptcha/api/siteverify";
const RECAPTCHA_MIN_SCORE = 0.5;
const RECAPTCHA_VERIFY_TIMEOUT_MS = 5_000;

export const SIGNUP_RECAPTCHA_ACTION = "signup";

const recaptchaResponseSchema = z.object({
  success: z.boolean(),
  score: z.number().optional(),
  action: z.string().optional(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
});

export interface VerifyRecaptchaInput {
  token: string;
  expectedAction: string;
  remoteIp?: string;
}

export interface VerifyRecaptchaResult {
  ok: boolean;
  reason?: string;
  score?: number;
}

export async function verifyRecaptchaToken({
  token,
  expectedAction,
  remoteIp,
}: VerifyRecaptchaInput): Promise<VerifyRecaptchaResult> {
  const env = getServerEnv();

  const payload = new URLSearchParams({
    secret: env.RECAPTCHA_SECRET_KEY,
    response: token,
  });

  if (remoteIp) {
    payload.set("remoteip", remoteIp);
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    abortController.abort();
  }, RECAPTCHA_VERIFY_TIMEOUT_MS);

  try {
    const response = await fetch(RECAPTCHA_VERIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload,
      signal: abortController.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      return { ok: false, reason: "CAPTCHA verification request failed." };
    }

    const json = await response.json();
    const parsed = recaptchaResponseSchema.safeParse(json);

    if (!parsed.success) {
      return { ok: false, reason: "Malformed CAPTCHA verification response." };
    }

    if (!parsed.data.success) {
      return {
        ok: false,
        reason: parsed.data["error-codes"]?.join(", ") || "CAPTCHA challenge was rejected.",
      };
    }

    if (parsed.data.action && parsed.data.action !== expectedAction) {
      return { ok: false, reason: "CAPTCHA action mismatch." };
    }

    const score = parsed.data.score ?? 0;
    if (score < RECAPTCHA_MIN_SCORE) {
      return { ok: false, reason: "CAPTCHA score below threshold.", score };
    }

    return { ok: true, score };
  } catch {
    return { ok: false, reason: "CAPTCHA verification timed out or failed." };
  } finally {
    clearTimeout(timeoutId);
  }
}
