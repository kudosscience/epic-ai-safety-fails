# PBI-1: Build Invite-Only AI Safety Fails Platform

## Overview

Create a web platform for AI safety researchers to record and discuss concrete AI-tool failures that slow down or block safety-relevant work.

[View in Backlog](../backlog.md#product-backlog)

## Problem Statement

Researchers repeatedly hit practical tooling failures, but there is no shared, structured system for tracking and prioritizing those failures. This makes coordination difficult and reduces visibility for recurring bottlenecks.

## User Stories

- As an invited researcher, I can create an account and publish a structured frustration log.
- As a contributor, I can receive visible credit and profile attribution for my logs.
- As a contributor, I can attach donation and promotion links so readers can support my work.
- As a community member, I can filter and search logs by model, tags, and time wasted.
- As a moderator, I can review queued flags and decide when content should be hidden.

## Technical Approach

- Stack: Next.js App Router + TypeScript + Tailwind CSS.
- Backend: Supabase Auth + Postgres + Row Level Security.
- Security: Invite-only onboarding plus reCAPTCHA verification during signup.
- Data model: profiles, invites, logs, votes, comments, moderation flags.
- Routing: server-rendered feed and profile pages with route handlers for mutations.

## UX/UI Considerations

- Prioritize high information density for technical readers.
- Keep logging flow fast with structured fields and minimal friction.
- Present contributor identity and links inline with content.
- Use clear visual status indicators for hidden or moderated items.

## Acceptance Criteria

- Invite-only onboarding is enforced server-side.
- reCAPTCHA token is required and validated server-side for account creation.
- Researchers can create/view logs with model, task, description, tags, and time-wasted bucket.
- Profiles show contribution history and promotion/donation links.
- Leaderboard supports weekly, monthly, and all-time views by logs posted.
- Flagging enqueues content for moderation review; content is marked under review and is only hidden by moderator action or trusted-flag threshold.

## Dependencies

- Supabase project and API keys.
- reCAPTCHA site key and secret key.
- Email provider integration for reply notifications.

## Open Questions

- Should signup support both password and magic-link in v1, or password only?
- Should invite codes be single-use forever, or optionally reusable for internal labs?

## Related Tasks

- [1-1 Bootstrap app foundation and secure onboarding](./1-1.md)