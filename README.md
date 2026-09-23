# akim

Small Vite + TypeScript front end with Supabase email authentication.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add the Project URL and publishable key (`sb_publishable_...`) from Supabase → Project Settings → API Keys.
3. Run `npm run dev`.

Email/password authentication must be enabled in Supabase → Authentication → Providers. If email confirmation is enabled, new users are sent back to `#/login` after confirming their address.

## Routes

- `#/login` — sign in
- `#/signup` — create an account
- `#/app` — protected workspace screen

Routing lives in `src/lib/router.ts`; Supabase client setup lives in `src/lib/supabase.ts`; route views live in `src/views/`.
