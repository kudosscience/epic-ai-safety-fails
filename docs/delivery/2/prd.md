# PBI-2: Plan Public Test Deployment

## Overview

Document a full, practical deployment plan for a public test site using the lowest-cost hosting option that supports this Next.js app.

[View in Backlog](../backlog.md#user-content-2)

## Problem Statement

The project needs a reliable, low-cost path to deploy a public test environment, and current signup issues ("Invalid signup payload") must be triaged during that deployment prep.

## User Stories

- As a maintainer, I can follow a clear plan to deploy a public test site with predictable costs.
- As a maintainer, I can diagnose and resolve the signup payload error in a separate, focused task.

## Technical Approach

- Use the cheapest viable hosting tier for Next.js with API routes.
- Configure production environment variables, Supabase, and reCAPTCHA settings for the test domain.
- Validate end-to-end functionality in the deployed environment.

## UX/UI Considerations

- Keep the public test site visually consistent with current UX.
- Communicate "under review" moderation states without removing content immediately.

## Acceptance Criteria

- A documented deployment plan exists with environment setup, hosting steps, and validation checklist.
- A separate task exists to diagnose and fix the signup "Invalid signup payload" issue.
- Deployment plan targets the lowest-cost hosting option that supports Next.js API routes.

## Dependencies

- Supabase project and credentials.
- reCAPTCHA site/secret keys with the test domain allowlisted.
- Hosting provider account for the chosen plan.

## Open Questions

- Should the public test site use a custom domain or the default provider subdomain?
- Should email confirmation be enabled for the test environment?

## Related Tasks

- [2-1 Plan public test deployment (lowest-cost hosting)](./2-1.md)
- [2-2 Diagnose signup "Invalid signup payload" error](./2-2.md)
