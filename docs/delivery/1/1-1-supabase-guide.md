# 1-1 Supabase Guide

Date: 2026-04-19

## Purpose

Cache implementation-critical notes for `@supabase/supabase-js` and `@supabase/ssr` in this task.

## Sources

- https://supabase.com/docs/guides/auth/server-side/nextjs
- https://supabase.com/docs/guides/auth/server-side/creating-a-client

## Key Implementation Notes

- Use `@supabase/ssr` helper clients for browser and server contexts in Next.js.
- Server-side client should be cookie-aware to support auth session refresh behavior.
- Use separate service-role admin client for privileged operations like invite checks and user provisioning.
- Use publishable/anon key in public contexts and secret/service-role key only in server route handlers.
- In server protection logic, use claims validation patterns instead of trusting raw session cookies.

## API Patterns Used In This Task

- Browser client: `createBrowserClient(url, anonKey)`
- Server client: `createServerClient(url, anonKey, { cookies })`
- Admin auth: `supabase.auth.admin.createUser(...)`
- Data reads/writes: `supabase.from('table').select(...)`, `.insert(...)`, `.update(...)`