import { LogCard } from "@/components/log-card";
import type { TimeWastedBucket } from "@/lib/domain";
import { TIME_WASTED_BUCKETS, TIME_WASTED_LABELS } from "@/lib/domain";
import { contributors, getAllModels, getAllTags, getContributorById, getFilteredLogs } from "@/lib/mock-data";

type SearchParamValue = string | string[] | undefined;

interface HomePageSearchParams {
  [key: string]: SearchParamValue;
}

interface HomePageProps {
  searchParams: Promise<HomePageSearchParams>;
}

function normalizeSearchParam(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = normalizeSearchParam(params.q);
  const model = normalizeSearchParam(params.model);
  const tag = normalizeSearchParam(params.tag);
  const timeWastedParam = normalizeSearchParam(params.timeWasted);

  const activeTimeBucket = TIME_WASTED_BUCKETS.includes(timeWastedParam as TimeWastedBucket)
    ? (timeWastedParam as TimeWastedBucket)
    : undefined;

  const filteredLogs = getFilteredLogs({
    query,
    model,
    tag,
    timeWasted: activeTimeBucket,
  });

  const models = getAllModels();
  const tags = getAllTags();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Failure Registry</p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight text-[color:var(--ink)] sm:text-3xl">
          Log every time AI tooling slows down your safety research.
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-[color:var(--muted)] sm:text-base">
          This feed is invite-only for safety-relevant contributors. Add concrete friction points, vote on recurring bottlenecks,
          and spotlight contributors through profiles, promotion links, and donation links.
        </p>
      </section>

      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4 sm:p-5">
        <form className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <input
            name="q"
            defaultValue={query ?? ""}
            placeholder="Search failures, tasks, models"
            className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[color:var(--accent)] focus:ring-2"
          />

          <select
            name="model"
            defaultValue={model ?? ""}
            className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[color:var(--accent)] focus:ring-2"
          >
            <option value="">All models</option>
            {models.map((model) => {
              return (
                <option key={model} value={model}>
                  {model}
                </option>
              );
            })}
          </select>

          <select
            name="tag"
            defaultValue={tag ?? ""}
            className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[color:var(--accent)] focus:ring-2"
          >
            <option value="">All tags</option>
            {tags.map((tag) => {
              return (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              );
            })}
          </select>

          <select
            name="timeWasted"
            defaultValue={activeTimeBucket ?? ""}
            className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[color:var(--accent)] focus:ring-2"
          >
            <option value="">Any time wasted</option>
            {TIME_WASTED_BUCKETS.map((bucket) => {
              return (
                <option key={bucket} value={bucket}>
                  {TIME_WASTED_LABELS[bucket]}
                </option>
              );
            })}
          </select>

          <button
            type="submit"
            className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--accent-dark)] md:col-span-2 lg:col-span-1"
          >
            Apply Filters
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {filteredLogs.length ? (
          filteredLogs.map((log) => {
            return <LogCard key={log.id} log={log} author={getContributorById(log.authorId)} />;
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-[color:var(--line)] bg-[color:var(--surface)] p-8 text-center">
            <p className="text-sm text-[color:var(--muted)]">No logs matched your filters.</p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">Contributors in this snapshot</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contributors.map((contributor) => {
            return (
              <article key={contributor.id} className="rounded-xl border border-[color:var(--line)] bg-white/70 p-3">
                <p className="font-semibold text-[color:var(--ink)]">{contributor.fullName}</p>
                <p className="text-xs text-[color:var(--muted)]">{contributor.titleAffiliation}</p>
                <p className="mt-2 text-xs text-[color:var(--muted)]">All-time logs: {contributor.logCounts.allTime}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
