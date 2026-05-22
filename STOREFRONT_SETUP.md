# Storefront Setup and Configuration Guide

This document explains how to set up and run this storefront project, connect it to your Medusa backend and admin dashboard, configure payments, and prepare it for production.

## 1. What This Storefront Includes

This storefront is a Next.js + TypeScript application built for Medusa.

Included capabilities:

- Product listing and product details
- Cart and checkout flow
- Region-aware URLs (for example: `/dk`, `/in`, `/us`)
- Stripe-ready payment wrapper
- Razorpay checkout integration
- Tailwind-based UI with Medusa UI preset
- Sitemap/robots generation setup

## 2. Prerequisites

Install the following before setup:

- Node.js 20+
- npm 10+
- A running Medusa backend (default URL: `http://localhost:9000`)

Optional but recommended:

- Access to Medusa Admin dashboard (`http://localhost:9000/app`)
- Stripe account (if using Stripe)
- Razorpay account (if using Razorpay)

## 3. Project Paths Used in This Guide

This guide is for:

- `storefront/`

Related backend in your workspace:

- `my-medusa-store/apps/backend/`

## 4. Install and Run the Storefront

From workspace root:

```bash
cd storefront
npm install
```

Start development server:

```bash
npm run dev
```

By default in this project:

- Dev server runs on `http://localhost:8001`
- Production start command also runs on port `8001`

## 5. Environment Variables (`storefront/.env.local`)

Create `storefront/.env.local` with:

```env
# Required
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Recommended
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_DEFAULT_REGION=dk
NEXT_PUBLIC_BASE_URL=http://localhost:8001

# Stripe (optional)
NEXT_PUBLIC_STRIPE_KEY=
NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY=
NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID=

# Razorpay (optional)
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# SEO (optional, used by next-sitemap)
NEXT_PUBLIC_VERCEL_URL=https://your-storefront-domain.com

# Optional Medusa Cloud image support
MEDUSA_CLOUD_S3_HOSTNAME=
MEDUSA_CLOUD_S3_PATHNAME=
```

Important notes:

- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` is required. App startup checks this value.
- Set `NEXT_PUBLIC_BASE_URL` to the same host/port where your storefront runs.
- For local HTTP, use `http://localhost:8001` (not `https://...`) unless you have local TLS.
- Never commit real API keys to git.

## 6. Connect Storefront to Medusa Backend and Admin

### 6.1 Start backend

If backend is in this workspace:

```bash
cd my-medusa-store/apps/backend
npm install
npm run dev
```

### 6.2 Configure backend CORS

In backend `.env` make sure storefront URL is allowed:

```env
STORE_CORS=http://localhost:8001
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000,http://localhost:8001
```

If deploying, replace with your production domains.

### 6.3 Create regions in Medusa Admin

The storefront middleware fetches regions from backend and prefixes URLs with country code.

In Medusa Admin:

1. Create at least one region.
2. Add countries to the region.
3. Ensure your default region country exists (for `NEXT_PUBLIC_DEFAULT_REGION`, default is `dk`).

### 6.4 Create and set a publishable key

In Medusa Admin, create a Publishable API Key and put it in:

- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`

Without this key, storefront startup fails.

## 7. Payment Configuration

### 7.1 Stripe (optional)

For Stripe payment sessions, set one of these keys:

- `NEXT_PUBLIC_STRIPE_KEY`
- `NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY`

Optional for Connect account mode:

- `NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID`

If Stripe session is selected and key is missing, checkout throws runtime errors.

### 7.2 Razorpay (optional)

Storefront expects:

- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

Backend expects:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Storefront calls these backend routes:

- `POST /store/razorpay/create-order`
- `POST /store/razorpay/verify-payment`

These are implemented in your backend under:

- `my-medusa-store/apps/backend/src/api/store/razorpay/create-order/route.ts`
- `my-medusa-store/apps/backend/src/api/store/razorpay/verify-payment/route.ts`

## 8. URL, Region, and Middleware Behavior

The middleware:

- Reads backend regions from `GET /store/regions`
- Requires backend URL and publishable key
- Redirects users to region-prefixed routes when needed
- Uses `NEXT_PUBLIC_DEFAULT_REGION` as fallback

Example behavior:

- Request `/products/...`
- Redirect to `/<countryCode>/products/...` if missing country prefix

## 9. Build and Production Commands

From `storefront/`:

```bash
npm run build
npm run start
```

Default production port from scripts: `8001`.

## 10. Deployment Checklist

Before production deploy, verify:

1. Backend is reachable from storefront runtime.
2. `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` is set.
3. CORS (`STORE_CORS`, `AUTH_CORS`) includes storefront production domain.
4. Regions are configured in Medusa Admin.
5. Payment envs are set for providers you use.
6. `NEXT_PUBLIC_BASE_URL` points to production storefront URL.
7. `NEXT_PUBLIC_VERCEL_URL` is set for correct sitemap URL generation.

## 11. SEO and Static Assets Notes

- Sitemap config is in `storefront/next-sitemap.js`.
- `siteUrl` uses `NEXT_PUBLIC_VERCEL_URL`.
- Checkout/account routes are excluded from robots/sitemap policy.
- Next image config allows localhost and S3 host patterns.

## 12. Developer Configuration Notes

- TypeScript path aliases are configured in `storefront/tsconfig.json`:
  - `@lib/*`
  - `@modules/*`
  - `@pages/*`
- Tailwind uses Medusa preset and custom design tokens in `storefront/tailwind.config.js`.
- ESLint extends `next/core-web-vitals` + `next/typescript`.

Build behavior note in this project:

- `next.config.js` currently sets:
  - `eslint.ignoreDuringBuilds = true`
  - `typescript.ignoreBuildErrors = true`

This allows builds to succeed even with lint/type errors. For stricter production quality, consider turning these off.

## 13. Troubleshooting

### Error: Missing required environment variable

Cause:

- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` is missing.

Fix:

- Add it to `storefront/.env.local` and restart dev server.

### Region redirect or region fetch errors

Cause:

- Backend not running, wrong `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, no regions configured, or bad CORS.

Fix:

1. Confirm backend is running on expected URL.
2. Confirm `NEXT_PUBLIC_MEDUSA_BACKEND_URL` value.
3. Create regions/countries in Admin.
4. Ensure `STORE_CORS` allows storefront URL.

### Stripe checkout initialization errors

Cause:

- Stripe publishable key missing.

Fix:

- Set `NEXT_PUBLIC_STRIPE_KEY` (or Medusa payments publishable key).

### Razorpay checkout/key errors

Cause:

- Missing storefront/backend Razorpay keys or backend route issues.

Fix:

1. Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` in storefront env.
2. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend env.
3. Verify backend routes return 200.

## 14. Recommended `.env.local` for Local Development

```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_DEFAULT_REGION=dk
NEXT_PUBLIC_BASE_URL=http://localhost:8001
NEXT_PUBLIC_STRIPE_KEY=
NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY=
NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
NEXT_PUBLIC_VERCEL_URL=http://localhost:8001
```

## 15. Quick Start Summary

```bash
# Terminal 1: backend
cd my-medusa-store/apps/backend
npm install
npm run dev

# Terminal 2: storefront
cd storefront
npm install
# create/update .env.local
npm run dev
```

Then open:

- Storefront: `http://localhost:8001`
- Medusa Admin: `http://localhost:9000/app`
