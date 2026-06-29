# Umami Analytics — Self-Hosted Deploy Guide (Zero Cost)

## Stack
- **Umami** self-hosted on Vercel (free tier)
- **PostgreSQL** via your existing Supabase project (free tier)

---

## 1. Fork Umami

```bash
# Go to https://github.com/umami-software/umami and click Fork
# Or use GitHub CLI:
gh repo fork umami-software/umami --clone
```

---

## 2. Set Up Database

In your Supabase project, run the Umami schema SQL:

1. Go to Supabase Dashboard → SQL Editor
2. Run the schema from: https://github.com/umami-software/umami/blob/master/db/postgresql/schema.prisma
3. Or use the Umami CLI: `npx @umami/migrate-db-v2`

Your Supabase connection string:
```
postgresql://postgres:[PASSWORD]@db.cfdfzmrnaodiidzmppmh.supabase.co:5432/postgres
```

---

## 3. Deploy to Vercel

1. Go to https://vercel.com/new and import your forked Umami repo
2. Set environment variables:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.cfdfzmrnaodiidzmppmh.supabase.co:5432/postgres
   APP_SECRET=<random 32+ char string>
   ```
3. Deploy. Vercel will auto-detect Next.js.

---

## 4. Create Website in Umami

1. Open your Umami dashboard at `https://your-umami-deploy.vercel.app`
2. Default login: `admin` / `umami` — **change immediately**
3. Go to Settings → Websites → Add Website
4. Enter `moneymitra.in` (or your domain)
5. Copy the **Website ID** (UUID)

---

## 5. Add Env Vars to MoneyMitra

In your MoneyMitra `.env.local` (and Vercel dashboard → Environment Variables):

```bash
NEXT_PUBLIC_UMAMI_URL=https://your-umami-deploy.vercel.app
NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

The tracking script is already wired in `app/layout.tsx` — it loads only when both vars are set.

---

## 6. Custom Events Tracked

| Event | Data | Where |
|-------|------|-------|
| `calculator-used` | `{ type, loan_range }` | EMI calculator (2s debounce) |
| `email-subscribed` | `{ source_page }` | Email capture |
| `faq-searched` | `{ result_type: 'faq' \| 'ai' }` | FAQ search |
| `rates-tab-viewed` | `{ tab }` | Rates page tab switch |
| `bank-link-clicked` | `{ bank, rate_type }` | Bank link in rates table |

**Privacy**: No personal data, no input values. Only bucketed ranges.

---

## 7. Dev Debugging

Run in development (`NODE_ENV=development`):
```bash
npm run dev
```

A floating "📊 Analytics" button appears in the bottom-right corner showing all tracked events in real time. It's stripped from production builds automatically.

---

## 8. Loan Range Buckets

| Range | Value |
|-------|-------|
| `<10L` | < ₹10,00,000 |
| `10-30L` | ₹10L – ₹30L |
| `30-50L` | ₹30L – ₹50L |
| `50L-1Cr` | ₹50L – ₹1Cr |
| `>1Cr` | > ₹1,00,00,000 |
