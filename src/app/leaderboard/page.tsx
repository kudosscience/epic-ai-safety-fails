import Link from "next/link";

import { type LeaderboardScope, LEADERBOARD_SCOPES } from "@/lib/domain";
import { getLeaderboard } from "@/lib/mock-data";

const SCOPE_LABELS: Record<LeaderboardScope, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  allTime: "All-time",
};

interface LeaderboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const params = await searchParams;
  const requestedScope = Array.isArray(params.scope) ? params.scope[0] : params.scope;
  const scope = LEADERBOARD_SCOPES.includes(requestedScope as LeaderboardScope)
    ? (requestedScope as LeaderboardScope)
    : "allTime";

  const rankings = getLeaderboard(scope);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Contributor Incentives</p>
        <h1 className="mt-2 text-2xl font-semibold text-[color:var(--ink)] sm:text-3xl">Leaderboard by logs posted</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Ranking strictly rewards volume of documented failures to encourage broad signal collection.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {LEADERBOARD_SCOPES.map((candidateScope) => {
            const isActive = candidateScope === scope;
            return (
              <Link
                key={candidateScope}
                href={`/leaderboard?scope=${candidateScope}`}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[color:var(--accent)] text-white"
                    : "border border-[color:var(--line)] bg-white text-[color:var(--ink)] hover:bg-[color:var(--chip)]"
                }`}
              >
                {SCOPE_LABELS[candidateScope]}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[color:var(--chip)] text-[color:var(--ink)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Rank</th>
              <th className="px-4 py-3 font-semibold">Contributor</th>
              <th className="px-4 py-3 font-semibold">Logs ({SCOPE_LABELS[scope]})</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((contributor, index) => {
              return (
                <tr key={contributor.id} className="border-t border-[color:var(--line)]">
                  <td className="px-4 py-3 font-semibold text-[color:var(--ink)]">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-[color:var(--ink)]">{contributor.fullName}</p>
                      <p className="text-xs text-[color:var(--muted)]">@{contributor.username}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[color:var(--ink)]">{contributor.logCounts[scope]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
