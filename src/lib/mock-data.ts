import {
  type Contributor,
  type FrustrationLog,
  type LeaderboardScope,
  type LogComment,
  type LogFilters,
} from "@/lib/domain";

const FALLBACK_LOG_COUNT = 0;

export const contributors: Contributor[] = [
  {
    id: "user_ada",
    username: "ada_safety",
    fullName: "Ada Park",
    titleAffiliation: "Interpretability Researcher, Independent",
    bio: "Tracing internal model representations and residual pathways.",
    xUrl: "https://x.com/ada_safety",
    promoUrl: "https://ada-safety.github.io",
    donationUrl: "https://buymeacoffee.com/ada_safety",
    logCounts: {
      weekly: 3,
      monthly: 11,
      allTime: 37,
    },
  },
  {
    id: "user_jonah",
    username: "jonah_eval",
    fullName: "Jonah Reed",
    titleAffiliation: "Safety Evaluations Engineer",
    bio: "Designing robust eval harnesses for frontier model regressions.",
    xUrl: "https://x.com/jonah_eval",
    promoUrl: "https://jonah-evals.com",
    donationUrl: "https://patreon.com/jonah_eval",
    logCounts: {
      weekly: 5,
      monthly: 14,
      allTime: 52,
    },
  },
  {
    id: "user_maya",
    username: "maya_alignment",
    fullName: "Maya Lin",
    titleAffiliation: "Alignment Research Scientist",
    bio: "Monitoring behavior drift and deceptive compliance patterns.",
    xUrl: "https://x.com/maya_alignment",
    promoUrl: "https://maya-alignment.org",
    donationUrl: "https://ko-fi.com/maya_alignment",
    logCounts: {
      weekly: 2,
      monthly: 9,
      allTime: 45,
    },
  },
];

export const logs: FrustrationLog[] = [
  {
    id: "log_001",
    title: "Claude hallucinates related-work citations under pressure",
    authorId: "user_jonah",
    modelName: "Claude 3.7 Sonnet",
    taskAttempted: "Literature survey for scalable oversight",
    description:
      "When asked for obscure but plausible-looking citations, the model frequently returns fabricated references with realistic formatting. This slows our paper triage loop and forces manual bibliographic verification.",
    tags: ["hallucinations", "citations", "literature-review"],
    timeWasted: "1_4h",
    score: 32,
    commentCount: 2,
    createdAt: "2026-04-17T12:12:00.000Z",
    status: "visible",
  },
  {
    id: "log_002",
    title: "Residual stream traces collapse across long-context prompts",
    authorId: "user_ada",
    modelName: "GPT-4.1",
    taskAttempted: "Activation tracing through residual routes",
    description:
      "Even with carefully staged prompts, model responses lose consistency about intermediate reasoning states. Attempts to extract stable residual trajectory snapshots are brittle and require many retries.",
    tags: ["mechanistic-interpretability", "residual-stream", "long-context"],
    timeWasted: "multiple_days",
    score: 47,
    commentCount: 1,
    createdAt: "2026-04-16T09:30:00.000Z",
    status: "visible",
  },
  {
    id: "log_003",
    title: "Codebase orientation still needs repetitive prompt repair",
    authorId: "user_maya",
    modelName: "Gemini 2.5 Pro",
    taskAttempted: "Safety pipeline refactor support",
    description:
      "The model misses architecture boundaries unless repeatedly corrected. It takes many turns to keep edits inside the intended module boundaries and avoid collateral changes.",
    tags: ["coding-agents", "context-window", "architecture"],
    timeWasted: "30_60m",
    score: 28,
    commentCount: 0,
    createdAt: "2026-04-15T15:48:00.000Z",
    status: "visible",
  },
  {
    id: "log_004",
    title: "Tool-using agents fail to preserve experimental config state",
    authorId: "user_jonah",
    modelName: "OpenAI o4-mini",
    taskAttempted: "Automated red-team benchmark runs",
    description:
      "The agent frequently resets assumptions between steps, leading to inconsistent eval parameters and unusable run comparisons.",
    tags: ["agents", "evals", "state-management"],
    timeWasted: "1_day",
    score: 19,
    commentCount: 0,
    createdAt: "2026-04-14T18:05:00.000Z",
    status: "visible",
  },
];

export const comments: LogComment[] = [
  {
    id: "comment_001",
    logId: "log_001",
    authorId: "user_ada",
    content: "We saw similar citation fabrication in multilingual related-work prompts.",
    score: 9,
    status: "visible",
    createdAt: "2026-04-17T13:02:00.000Z",
  },
  {
    id: "comment_002",
    logId: "log_001",
    authorId: "user_jonah",
    parentId: "comment_001",
    content: "Good catch. We now enforce DOI presence before accepting references.",
    score: 4,
    status: "visible",
    createdAt: "2026-04-17T13:19:00.000Z",
  },
  {
    id: "comment_003",
    logId: "log_002",
    authorId: "user_maya",
    content: "Would love a reproducible benchmark for this trace-collapse pattern.",
    score: 6,
    status: "visible",
    createdAt: "2026-04-16T10:11:00.000Z",
  },
];

function includesIgnoreCase(source: string, query: string): boolean {
  return source.toLowerCase().includes(query.toLowerCase());
}

export function getFilteredLogs(filters: LogFilters): FrustrationLog[] {
  return logs
    .filter((item) => item.status === "visible")
    .filter((item) => {
      if (!filters.query) {
        return true;
      }

      const searchable = [item.title, item.description, item.modelName, item.taskAttempted].join(" ");
      return includesIgnoreCase(searchable, filters.query);
    })
    .filter((item) => {
      if (!filters.model) {
        return true;
      }

      return item.modelName === filters.model;
    })
    .filter((item) => {
      if (!filters.tag) {
        return true;
      }

      return item.tags.some((tag) => tag === filters.tag);
    })
    .filter((item) => {
      if (!filters.timeWasted) {
        return true;
      }

      return item.timeWasted === filters.timeWasted;
    })
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function getLogById(id: string): FrustrationLog | undefined {
  return logs.find((item) => item.id === id);
}

export function getCommentsForLog(logId: string): LogComment[] {
  return comments.filter((item) => item.logId === logId && item.status === "visible");
}

export function getContributorById(id: string): Contributor | undefined {
  return contributors.find((item) => item.id === id);
}

export function getContributorByUsername(username: string): Contributor | undefined {
  return contributors.find((item) => item.username === username);
}

export function getLogsByAuthor(authorId: string): FrustrationLog[] {
  return logs
    .filter((item) => item.authorId === authorId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllModels(): string[] {
  return [...new Set(logs.map((item) => item.modelName))].sort();
}

export function getAllTags(): string[] {
  return [...new Set(logs.flatMap((item) => item.tags))].sort();
}

export function getLeaderboard(scope: LeaderboardScope): Contributor[] {
  return [...contributors].sort((a, b) => {
    const left = a.logCounts[scope] ?? FALLBACK_LOG_COUNT;
    const right = b.logCounts[scope] ?? FALLBACK_LOG_COUNT;
    return right - left;
  });
}

export interface FlaggedItem {
  id: string;
  targetType: "log" | "comment";
  reason: string;
  createdAt: string;
}

export function getFlaggedMockItems(): FlaggedItem[] {
  return [
    {
      id: "flag_001",
      targetType: "comment",
      reason: "Off-topic solicitation in thread",
      createdAt: "2026-04-18T08:10:00.000Z",
    },
  ];
}
