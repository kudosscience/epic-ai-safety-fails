"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SiteHeaderNavLink {
  href: string;
  label: string;
}

interface SiteHeaderNavProps {
  navigationLinks: SiteHeaderNavLink[];
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeaderNav({ navigationLinks }: SiteHeaderNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex items-center gap-4 text-sm font-medium text-[color:var(--ink)]">
      {navigationLinks.map((link) => {
        const isActive = isActivePath(pathname, link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className="transition-colors hover:text-[color:var(--accent-2)]"
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/signup"
        aria-current={pathname === "/signup" ? "page" : undefined}
        className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-white transition-colors hover:bg-[color:var(--accent-dark)]"
      >
        Contributor Signup
      </Link>
    </nav>
  );
}
