"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const SIGNUP_ENDPOINT = "/api/auth/signup";
const SIGNUP_ACTION = "signup";
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

interface SignupFormState {
  email: string;
  password: string;
  username: string;
  fullName: string;
  titleAffiliation: string;
  inviteCode: string;
}

const INITIAL_FORM_STATE: SignupFormState = {
  email: "",
  password: "",
  username: "",
  fullName: "",
  titleAffiliation: "",
  inviteCode: "",
};

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function InputLabel({ htmlFor, text }: { htmlFor: string; text: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-[color:var(--ink)]">
      {text}
    </label>
  );
}

export function SignupForm() {
  const [formState, setFormState] = useState<SignupFormState>(INITIAL_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(() => {
    if (!SITE_KEY || typeof window === "undefined") {
      return false;
    }

    return Boolean(window.grecaptcha);
  });

  const recaptchaScriptSrc = useMemo(() => {
    if (!SITE_KEY) {
      return "";
    }

    return `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
  }, []);

  useEffect(() => {
    if (!recaptchaScriptSrc) {
      return;
    }

    if (window.grecaptcha) {
      return;
    }

    let createdScript: HTMLScriptElement | null = null;
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${recaptchaScriptSrc}"]`);

    const handleLoad = () => {
      setRecaptchaReady(Boolean(window.grecaptcha));
    };

    const handleError = () => {
      setRecaptchaReady(false);
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);
    } else {
      createdScript = document.createElement("script");
      createdScript.src = recaptchaScriptSrc;
      createdScript.async = true;
      createdScript.defer = true;
      createdScript.addEventListener("load", handleLoad);
      createdScript.addEventListener("error", handleError);
      document.head.appendChild(createdScript);
    }

    if (window.grecaptcha) {
      queueMicrotask(handleLoad);
    }

    return () => {
      if (existingScript) {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      }

      if (createdScript) {
        createdScript.removeEventListener("load", handleLoad);
        createdScript.removeEventListener("error", handleError);
      }
    };
  }, [recaptchaScriptSrc]);

  function updateField<K extends keyof SignupFormState>(key: K, value: SignupFormState[K]) {
    setFormState((previous) => ({ ...previous, [key]: value }));
  }

  async function getRecaptchaToken() {
    if (!window.grecaptcha || !SITE_KEY) {
      throw new Error("reCAPTCHA is not available.");
    }

    return new Promise<string>((resolve, reject) => {
      window.grecaptcha?.ready(() => {
        window.grecaptcha
          ?.execute(SITE_KEY, { action: SIGNUP_ACTION })
          .then(resolve)
          .catch(() => reject(new Error("Failed to generate reCAPTCHA token.")));
      });
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (SITE_KEY && !recaptchaReady) {
      setFeedback("reCAPTCHA is still loading. Please try again in a moment.");
      return;
    }

    setSubmitting(true);

    try {
      const recaptchaToken = await getRecaptchaToken();
      const response = await fetch(SIGNUP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          recaptchaToken,
        }),
      });

      const payload = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        setFeedback(payload.error ?? "Signup failed.");
        return;
      }

      setFeedback(payload.message ?? "Account created.");
      setFormState(INITIAL_FORM_STATE);
    } catch (error) {
      if (error instanceof Error) {
        setFeedback(error.message);
      } else {
        setFeedback("Unexpected error during signup.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <InputLabel htmlFor="fullName" text="Full Name" />
            <input
              id="fullName"
              required
              value={formState.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[color:var(--accent)] focus:ring-2"
            />
          </div>
          <div className="space-y-1">
            <InputLabel htmlFor="username" text="Username" />
            <input
              id="username"
              required
              value={formState.username}
              onChange={(event) => updateField("username", event.target.value)}
              className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[color:var(--accent)] focus:ring-2"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <InputLabel htmlFor="titleAffiliation" text="Title / Affiliation" />
            <input
              id="titleAffiliation"
              value={formState.titleAffiliation}
              onChange={(event) => updateField("titleAffiliation", event.target.value)}
              className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[color:var(--accent)] focus:ring-2"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <InputLabel htmlFor="email" text="Email" />
            <input
              id="email"
              type="email"
              required
              value={formState.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[color:var(--accent)] focus:ring-2"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <InputLabel htmlFor="password" text="Password" />
            <input
              id="password"
              type="password"
              required
              minLength={12}
              value={formState.password}
              onChange={(event) => updateField("password", event.target.value)}
              className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[color:var(--accent)] focus:ring-2"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <InputLabel htmlFor="inviteCode" text="Invite Code" />
            <input
              id="inviteCode"
              required
              value={formState.inviteCode}
              onChange={(event) => updateField("inviteCode", event.target.value.toUpperCase())}
              className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm uppercase outline-none ring-[color:var(--accent)] focus:ring-2"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !SITE_KEY || !recaptchaReady}
          className="w-full rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--accent-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create Contributor Account"}
        </button>

        {!SITE_KEY ? (
          <p className="text-sm text-red-700">
            Missing `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`. Account creation is disabled until CAPTCHA is configured.
          </p>
        ) : null}

        {SITE_KEY && !recaptchaReady ? (
          <p className="text-sm text-[color:var(--muted)]">Loading reCAPTCHA. Submission will unlock once ready.</p>
        ) : null}

        {feedback ? <p className="text-sm text-[color:var(--ink)]">{feedback}</p> : null}
      </form>
    </>
  );
}
