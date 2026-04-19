import { getFlaggedMockItems } from "@/lib/mock-data";

export default function AdminPage() {
  const flaggedItems = getFlaggedMockItems();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Admin Area</p>
        <h1 className="mt-2 text-2xl font-semibold text-[color:var(--ink)] sm:text-3xl">Moderation Queue</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Flagged content is hidden immediately and listed here for admin review. Restore or delete actions are next slice.
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
                <p className="mt-1 text-xs text-[color:var(--muted)]">Flagged at {new Date(item.createdAt).toLocaleString()}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
