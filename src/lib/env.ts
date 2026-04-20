import { z } from "zod";

const CLIENT_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
] as const;

const SERVER_ONLY_ENV_KEYS = ["SUPABASE_SERVICE_ROLE_KEY", "RECAPTCHA_SECRET_KEY"] as const;

const SUPABASE_SERVER_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const RECAPTCHA_SERVER_ENV_KEYS = ["NEXT_PUBLIC_RECAPTCHA_SITE_KEY", "RECAPTCHA_SECRET_KEY"] as const;

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),
});

const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RECAPTCHA_SECRET_KEY: z.string().min(1),
});

type EnvSnapshot = Record<string, string | undefined>;

interface ServerEnvDiagnostics {
  isValid: boolean;
  missingSupabaseKeys: string[];
  missingRecaptchaKeys: string[];
}

function getClientEnvSnapshot() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  };
}

function getServerEnvSnapshot() {
  return {
    ...getClientEnvSnapshot(),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  };
}

function getMissingKeys(snapshot: EnvSnapshot, keys: readonly string[]): string[] {
  return keys.filter((key) => !snapshot[key]);
}

function formatMissingKeyMessage(snapshot: EnvSnapshot, keys: readonly string[]): string {
  const missingKeys = getMissingKeys(snapshot, keys);

  if (!missingKeys.length) {
    return "";
  }

  return `Missing required environment variables: ${missingKeys.join(", ")}.`;
}

function formatSchemaIssueMessage(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "root";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

function buildValidationErrorMessage(
  snapshot: EnvSnapshot,
  keys: readonly string[],
  error: z.ZodError,
): string {
  const missingKeyMessage = formatMissingKeyMessage(snapshot, keys);
  const schemaIssueMessage = formatSchemaIssueMessage(error);

  if (missingKeyMessage) {
    return `${missingKeyMessage} Validation details: ${schemaIssueMessage}`;
  }

  return `Invalid environment variable values. Validation details: ${schemaIssueMessage}`;
}

export function hasClientEnv(): boolean {
  const parsed = clientEnvSchema.safeParse(getClientEnvSnapshot());
  return parsed.success;
}

export function hasServerEnv(): boolean {
  const parsed = serverEnvSchema.safeParse(getServerEnvSnapshot());
  return parsed.success;
}

export function getServerEnvDiagnostics(): ServerEnvDiagnostics {
  const snapshot = getServerEnvSnapshot();
  const parsed = serverEnvSchema.safeParse(snapshot);

  return {
    isValid: parsed.success,
    missingSupabaseKeys: getMissingKeys(snapshot, SUPABASE_SERVER_ENV_KEYS),
    missingRecaptchaKeys: getMissingKeys(snapshot, RECAPTCHA_SERVER_ENV_KEYS),
  };
}

export function getClientEnv() {
  const snapshot = getClientEnvSnapshot();
  const parsed = clientEnvSchema.safeParse(snapshot);

  if (!parsed.success) {
    throw new Error(buildValidationErrorMessage(snapshot, CLIENT_ENV_KEYS, parsed.error));
  }

  return parsed.data;
}

export function getServerEnv() {
  const snapshot = getServerEnvSnapshot();
  const parsed = serverEnvSchema.safeParse(snapshot);

  if (!parsed.success) {
    throw new Error(
      buildValidationErrorMessage(snapshot, [...CLIENT_ENV_KEYS, ...SERVER_ONLY_ENV_KEYS], parsed.error),
    );
  }

  return parsed.data;
}
