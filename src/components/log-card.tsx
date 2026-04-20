import Link from "next/link";

import type { Contributor, FrustrationLog } from "@/lib/domain";
import { TIME_WASTED_LABELS } from "@/lib/domain";

const FALLBACK_AUTHOR_NAME = "Unknown contributor";
const LOG_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

interface LogCardProps {
  log: FrustrationLog;
  author?: Contributor;
}

function renderOptionalLink(label: string, url?: string) {
  if (!url) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="text-xs font-semibold text-[color:var(--accent-2)] hover:underline"
    >
      {label}
    </a>
  );
}

export function LogCard({ log, author }: LogCardProps) {
  const publishedAt = LOG_DATE_FORMATTER.format(new Date(log.createdAt));

  return (
    <article className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
        <span className="rounded-full bg-[color:var(--chip)] px-2 py-1 font-semibold text-[color:var(--ink)]">
          {log.modelName}
        </span>
        <span className="rounded-full border border-[color:var(--line)] px-2 py-1">{TIME_WASTED_LABELS[log.timeWasted]}</span>
        <span>{publishedAt}</span>
      </div>

      <h2 className="text-lg font-semibold leading-tight text-[color:var(--ink)] sm:text-xl">
        <Link href={`/log/${log.id}`} className="hover:text-[color:var(--accent)]">
          {log.title}
        </Link>
      </h2>

      <p className="mt-2 text-sm text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--ink)]">Task:</span> {log.taskAttempted}
      </p>

      <p className="mt-3 text-sm leading-6 text-[color:var(--ink)]/95">{log.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {log.tags.map((tag) => {
          return (
            <span key={tag} className="rounded-full border border-[color:var(--line)] px-2 py-1 text-xs text-[color:var(--muted)]">
              #{tag}
            </span>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
        <span className="font-semibold text-[color:var(--ink)]">Score: {log.score}</span>
        <span>Comments: {log.commentCount}</span>
      </div>

      <div className="mt-4 border-t border-[color:var(--line)] pt-4">
        <p className="text-sm font-semibold text-[color:var(--ink)]">{author?.fullName ?? FALLBACK_AUTHOR_NAME}</p>
        <p className="text-xs text-[color:var(--muted)]">{author?.titleAffiliation ?? "Contributor"}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {renderOptionalLink("Profile", author ? `/u/${author.username}` : undefined)}
          {renderOptionalLink("Promote", author?.promoUrl)}
          {renderOptionalLink("Donate", author?.donationUrl)}
          {renderOptionalLink("X", author?.xUrl)}
        </div>
      </div>
    </article>
  );
}
