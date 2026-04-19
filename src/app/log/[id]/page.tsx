import Link from "next/link";
import { notFound } from "next/navigation";

import { CommentThread } from "@/components/comment-thread";
import { TIME_WASTED_LABELS } from "@/lib/domain";
import { contributors, getCommentsForLog, getContributorById, getLogById } from "@/lib/mock-data";

interface LogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LogDetailPage({ params }: LogDetailPageProps) {
  const { id } = await params;
  const log = getLogById(id);

  if (!log || log.status !== "visible") {
    notFound();
  }

  const author = getContributorById(log.authorId);
  const logComments = getCommentsForLog(log.id);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <Link href="/" className="text-sm font-semibold text-[color:var(--accent-2)] hover:underline">
        Back to feed
      </Link>

      <article className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
          <span className="rounded-full bg-[color:var(--chip)] px-2 py-1 font-semibold text-[color:var(--ink)]">
            {log.modelName}
          </span>
          <span className="rounded-full border border-[color:var(--line)] px-2 py-1">{TIME_WASTED_LABELS[log.timeWasted]}</span>
          <span>{new Date(log.createdAt).toLocaleString()}</span>
        </div>

        <h1 className="text-2xl font-semibold leading-tight text-[color:var(--ink)] sm:text-3xl">{log.title}</h1>

        <p className="mt-3 text-sm text-[color:var(--muted)]">
          <span className="font-semibold text-[color:var(--ink)]">Task Attempted:</span> {log.taskAttempted}
        </p>

        <p className="mt-4 text-sm leading-7 text-[color:var(--ink)]">{log.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {log.tags.map((tag) => {
            return (
              <span key={tag} className="rounded-full border border-[color:var(--line)] px-2 py-1 text-xs text-[color:var(--muted)]">
                #{tag}
              </span>
            );
          })}
        </div>

        <div className="mt-5 border-t border-[color:var(--line)] pt-4">
          <p className="text-sm font-semibold text-[color:var(--ink)]">{author?.fullName ?? "Unknown contributor"}</p>
          <p className="text-xs text-[color:var(--muted)]">{author?.titleAffiliation ?? "Contributor"}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-[color:var(--accent-2)]">
            {author?.promoUrl ? (
              <a href={author.promoUrl} target="_blank" rel="noreferrer noopener" className="hover:underline">
                Promote
              </a>
            ) : null}
            {author?.donationUrl ? (
              <a href={author.donationUrl} target="_blank" rel="noreferrer noopener" className="hover:underline">
                Donate
              </a>
            ) : null}
          </div>
        </div>
      </article>

      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">Discussion ({logComments.length})</h2>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Threaded comments are active. Voting and posting flows are next implementation slice.
        </p>
        <div className="mt-4">
          <CommentThread comments={logComments} contributors={contributors} />
        </div>
      </section>
    </main>
  );
}
