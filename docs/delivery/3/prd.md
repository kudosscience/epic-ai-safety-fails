# PBI-3: Add Login Page for Existing Users

## Overview

Provide a login page so existing users can sign in with email and password and access authenticated features.

[View in Backlog](../backlog.md#user-content-3)

## Problem Statement

After signup, users cannot log in because the product does not yet provide a login page for existing accounts.

## User Stories

- As a researcher, I can log in with my existing account credentials.
- As a maintainer, I can verify login works in the public test environment.

## Technical Approach

- Add a login page with a client-side form for email and password.
- Use the Supabase browser client to perform `signInWithPassword`.
- Show clear error feedback and confirm success with a redirect to the feed.
- Add a Log In link in the header when the user is signed out.

## UX/UI Considerations

- Mirror the signup page layout for consistency.
- Provide concise error messaging for invalid credentials or unconfirmed email.
- Keep the form accessible with clear labels and focus states.

## Acceptance Criteria

- A login page is available for existing users.
- Valid credentials create a session and redirect to the feed.
- Invalid credentials show a user-friendly error message.
- The header shows a Log In link when no user session is present.

## Dependencies

- Supabase Auth email/password enabled.
- Supabase client environment variables configured.

## Open Questions

- Should we add a password reset flow now or defer it?
- Should login support magic link in addition to password?

## Related Tasks

- [3-1 Implement login page for existing users](./3-1.md)
