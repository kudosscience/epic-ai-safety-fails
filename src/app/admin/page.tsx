import { redirect } from "next/navigation";

import { getFlaggedMockItems } from "@/lib/mock-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const FLAGGED_AT_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

function hasAdminClaim(appMetadata: unknown): boolean {
  if (!appMetadata || typeof appMetadata !== "object") {
    return false;
  }

  const metadata = appMetadata as {
    role?: unknown;
    roles?: unknown;
  };

  if (typeof metadata.role === "string" && metadata.role.toLowerCase() === "admin") {
    return true;
  }

  if (Array.isArray(metadata.roles)) {
    return metadata.roles.some((role) => typeof role === "string" && role.toLowerCase() === "admin");
  }

  return false;
}

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/signup");
  }

  let isAdmin = hasAdminClaim(user.app_metadata);

  if (!isAdmin) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profileError && profile?.role === "admin") {
      isAdmin = true;
    }
  }

  if (!isAdmin) {
    redirect("/");
  }

  const flaggedItems = getFlaggedMockItems();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Admin Area</p>
        <h1 className="mt-2 text-2xl font-semibold text-[color:var(--ink)] sm:text-3xl">Moderation Queue</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Flagged content is queued as under review. Hidden status is only applied by moderator action.
        </p>
      </section>

      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">Flagged Items ({flaggedItems.length})</h2>
        <div className="mt-4 space-y-3">
          {flaggedItems.map((item) => {
            return (
              <article key={item.id} className="rounded-xl border border-[color:var(--line)] bg-white/70 p-3">
                <p className="text-sm font-semibold text-[color:var(--ink)]">
                  {item.targetType === "comment" ? "Comment" : "Log"} · {item.id}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">Reason: {item.reason}</p>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  Flagged at {FLAGGED_AT_FORMATTER.format(new Date(item.createdAt))} UTC
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
