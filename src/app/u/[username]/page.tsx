import Link from "next/link";
import { notFound } from "next/navigation";

import { LogCard } from "@/components/log-card";
import { getContributorByUsername, getLogsByAuthor } from "@/lib/mock-data";

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

function renderExternalLink(label: string, url?: string) {
  if (!url) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="rounded-full border border-[color:var(--line)] bg-white px-3 py-2 text-xs font-semibold text-[color:var(--ink)] hover:bg-[color:var(--chip)]"
    >
      {label}
    </a>
  );
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = await params;
  const contributor = getContributorByUsername(username);

  if (!contributor) {
    notFound();
  }

  const authoredLogs = getLogsByAuthor(contributor.id);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <Link href="/" className="text-sm font-semibold text-[color:var(--accent-2)] hover:underline">
        Back to feed
      </Link>

      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Contributor Profile</p>
        <h1 className="mt-2 text-2xl font-semibold text-[color:var(--ink)] sm:text-3xl">{contributor.fullName}</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">{contributor.titleAffiliation}</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--ink)]">{contributor.bio}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {renderExternalLink("X", contributor.xUrl)}
          {renderExternalLink("Promo", contributor.promoUrl)}
          {renderExternalLink("Donate", contributor.donationUrl)}
        </div>

        <div className="mt-4 grid gap-3 text-sm text-[color:var(--ink)] sm:grid-cols-3">
          <div className="rounded-xl border border-[color:var(--line)] bg-white/70 p-3">
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">Weekly logs</p>
            <p className="mt-1 text-lg font-semibold">{contributor.logCounts.weekly}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--line)] bg-white/70 p-3">
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">Monthly logs</p>
            <p className="mt-1 text-lg font-semibold">{contributor.logCounts.monthly}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--line)] bg-white/70 p-3">
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">All-time logs</p>
            <p className="mt-1 text-lg font-semibold">{contributor.logCounts.allTime}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[color:var(--ink)]">Contributions</h2>
        {authoredLogs.map((log) => {
          return <LogCard key={log.id} log={log} author={contributor} />;
        })}
      </section>
    </main>
  );
}
