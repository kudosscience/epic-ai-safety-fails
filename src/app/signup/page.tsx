import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Invite-Only Access</p>
        <h1 className="mt-2 text-2xl font-semibold text-[color:var(--ink)] sm:text-3xl">Create contributor account</h1>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
          Account creation requires a valid invite code and a successful reCAPTCHA check to keep the platform focused on human
          researchers doing safety-relevant work.
        </p>
      </section>

      <SignupForm />
    </main>
  );
}
