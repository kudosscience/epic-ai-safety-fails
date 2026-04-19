# 1-1 reCAPTCHA Guide

Date: 2026-04-19

## Purpose

Cache implementation-critical notes for reCAPTCHA v3 integration in signup flow.

## Sources

- https://developers.google.com/recaptcha/docs/v3
- https://developers.google.com/recaptcha/docs/verify

## Key Implementation Notes

- v3 is score-based and does not require an explicit challenge UI.
- Tokens expire quickly (about 2 minutes) and should be generated right before protected action submission.
- Verification must happen server-side at `https://www.google.com/recaptcha/api/siteverify` via POST.
- Required verification parameters: `secret`, `response`; optional: `remoteip`.
- For v3, validate both `action` and `score` server-side (default threshold guidance is 0.5).
- Reject duplicate or timed-out tokens (error code includes `timeout-or-duplicate`).

## API Patterns Used In This Task

- Client side: load script `https://www.google.com/recaptcha/api.js?render=<site_key>` and call `grecaptcha.execute(siteKey, { action: 'signup' })`.
- Server side: submit URL-encoded form body to `siteverify`, parse JSON response, and enforce score/action checks.