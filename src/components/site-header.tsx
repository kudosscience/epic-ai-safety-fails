import { SiteHeaderNav } from "@/components/site-header-nav";
import { APP_NAME } from "@/lib/domain";
import { hasClientEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const NAV_LINKS = [
  { href: "/", label: "Feed" },
  { href: "/leaderboard", label: "Leaderboard" },
];

const MODERATION_LINK = { href: "/admin", label: "Moderation" };

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

export async function SiteHeader() {
  const navigationLinks = [...NAV_LINKS];

  if (hasClientEnv()) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authError && user) {
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

        if (isAdmin) {
          navigationLinks.push(MODERATION_LINK);
        }
      }
    } catch {
      // Keep navigation usable even if auth/session lookup fails.
    }
  }

  return (
    <header className="border-b border-[color:var(--line)] bg-[color:var(--surface)]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[color:var(--accent)] text-sm font-bold text-white grid place-items-center">
            AI
          </div>
          <div>
            <p className="text-[0.67rem] uppercase tracking-[0.2em] text-[color:var(--muted)]">Research Ops</p>
            <p className="text-sm font-semibold text-[color:var(--ink)] sm:text-base">{APP_NAME}</p>
          </div>
        </div>

        <SiteHeaderNav navigationLinks={navigationLinks} />
      </div>
    </header>
  );
}
