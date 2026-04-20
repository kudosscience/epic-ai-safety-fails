import type { ReactNode } from "react";

import type { Contributor, LogComment } from "@/lib/domain";

const MAX_COMMENT_DEPTH = 4;

interface CommentThreadProps {
  comments: LogComment[];
  contributors: Contributor[];
}

function byCreatedAtAscending(left: LogComment, right: LogComment): number {
  return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
}

export function CommentThread({ comments, contributors }: CommentThreadProps) {
  const commentList = [...comments].sort(byCreatedAtAscending);
  const contributorMap = new Map(contributors.map((item) => [item.id, item]));
  const childrenMap = new Map<string | undefined, LogComment[]>();

  commentList.forEach((item) => {
    const bucket = childrenMap.get(item.parentId);

    if (bucket) {
      bucket.push(item);
      return;
    }

    childrenMap.set(item.parentId, [item]);
  });

  function renderNodes(parentId: string | undefined, depth: number): ReactNode {
    if (depth > MAX_COMMENT_DEPTH) {
      return null;
    }

    const children = childrenMap.get(parentId) ?? [];
    if (!children.length) {
      return null;
    }

    return (
      <ul className="space-y-3">
        {children.map((item) => {
          const contributor = contributorMap.get(item.authorId);
          return (
            <li key={item.id}>
              <article className="rounded-xl border border-[color:var(--line)] bg-white/65 p-3">
                <header className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
                  <span className="font-semibold text-[color:var(--ink)]">{contributor?.fullName ?? "Contributor"}</span>
                  <span>Score: {item.score}</span>
                </header>
                <p className="text-sm leading-6 text-[color:var(--ink)]">{item.content}</p>
              </article>

              <div className="mt-3 border-l border-[color:var(--line)] pl-4">
                {renderNodes(item.id, depth + 1)}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return <section className="space-y-4">{renderNodes(undefined, 0)}</section>;
}
