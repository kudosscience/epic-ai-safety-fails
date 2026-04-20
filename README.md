# Epic AI Safety Fails

Invite-only website for AI safety researchers to log AI tooling failures, discuss work blockers, and credit contributors through profiles, links, and leaderboards.

## Current Implementation Slice

- Next.js App Router + TypeScript + Tailwind CSS v4 baseline
- Structured feed, log detail, profile, leaderboard, admin route shells
- Supabase SQL schema foundation for profiles, invites, logs, comments, votes, and moderation flags
- Secure signup route with:
	- invite code validation
	- server-side reCAPTCHA v3 verification
	- admin-provisioned account + profile creation

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

Fill values in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`

3. Apply SQL schema in Supabase SQL editor:

- `supabase/schema.sql`

4. Run development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Delivery Docs

- Backlog: `docs/delivery/backlog.md`
- PBI details: `docs/delivery/1/prd.md`
- Task index: `docs/delivery/1/tasks.md`
- Active task: `docs/delivery/1/1-1.md`

## Security Notes

- Signup is invite-only and CAPTCHA-gated.
- Service-role key is only used in server route handlers.
- RLS policies are enabled for core tables in schema baseline.

