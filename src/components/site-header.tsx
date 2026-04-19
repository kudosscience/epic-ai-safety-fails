import Link from "next/link";

import { APP_NAME } from "@/lib/domain";

const NAV_LINKS = [
  { href: "/", label: "Feed" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/admin", label: "Moderation" },
];

export function SiteHeader() {
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

        <nav className="flex items-center gap-4 text-sm font-medium text-[color:var(--ink)]">
          {NAV_LINKS.map((link) => {
            return (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-[color:var(--accent-2)]">
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/signup"
            className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-white transition-colors hover:bg-[color:var(--accent-dark)]"
          >
            Contributor Signup
          </Link>
        </nav>
      </div>
    </header>
  );
}
