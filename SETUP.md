# MoneyMitra — Setup Guide

## 1. Database (Supabase)

Create a Supabase project, then run the full DDL in `supabase-schema.sql`
in the Supabase SQL Editor. It creates these tables and seeds initial data:

- `email_subscribers` — newsletter signups
- `faq_cache` — cached AI answers for the FAQ search
- `rbi_policy_rates` — RBI policy rates (seeded)
- `bank_rates` — home loan / FD / personal loan rates (seeded)
- `rates_last_updated` — "last updated" marker

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, keep secret
ADMIN_PASSWORD=your-admin-password                # gates /admin/rates writes
ANTHROPIC_API_KEY=sk-ant-...                       # for AI FAQ fallback
```

`.env.local` is created with empty values so the app builds without secrets.
The app degrades gracefully if Supabase / Anthropic are unavailable.

## 3. Admin page

Visit `/admin/rates` to update RBI and bank rates. Enter the `ADMIN_PASSWORD`
in the password field; it is sent as the `x-admin-password` header to the
`/api/admin/rates` route, which verifies it server-side before writing.

The page (`robots: noindex`) lets you:
- Upsert RBI policy rates
- Add / update a bank rate
- Mark rates as "updated now"

## 4. Running

```
npm install
npm run dev          # local dev
npm run build        # production build
```

## 5. Tests

```
npm test             # run all Jest tests
npm run test:coverage  # with coverage (lib/calculators targeted at 95%)
```

Pure calculator logic lives in `lib/calculators/*` and is unit-tested in
`__tests__/lib/calculators/*`. API and component tests live under
`__tests__/api` and `__tests__/components`.
