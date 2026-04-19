import { z } from "zod";

const CLIENT_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
] as const;

const SERVER_ONLY_ENV_KEYS = ["SUPABASE_SERVICE_ROLE_KEY", "RECAPTCHA_SECRET_KEY"] as const;

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),
});

const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RECAPTCHA_SECRET_KEY: z.string().min(1),
});

function getMissingKeys(keys: readonly string[]): string[] {
  return keys.filter((key) => !process.env[key]);
}

function formatMissingKeyMessage(keys: readonly string[]): string {
  const missingKeys = getMissingKeys(keys);

  if (!missingKeys.length) {
    return "";
  }

  return `Missing required environment variables: ${missingKeys.join(", ")}.`;
}

export function hasClientEnv(): boolean {
  return getMissingKeys(CLIENT_ENV_KEYS).length === 0;
}

export function hasServerEnv(): boolean {
  return getMissingKeys([...CLIENT_ENV_KEYS, ...SERVER_ONLY_ENV_KEYS]).length === 0;
}

export function getClientEnv() {
  const parsed = clientEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(formatMissingKeyMessage(CLIENT_ENV_KEYS));
  }

  return parsed.data;
}

export function getServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(formatMissingKeyMessage([...CLIENT_ENV_KEYS, ...SERVER_ONLY_ENV_KEYS]));
  }

  return parsed.data;
}
