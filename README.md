# create-brutalist-medusa-storefront

CLI package that scaffolds a Brutalist Medusa storefront (Next.js + TypeScript).

## Install and Use

Use with npx (recommended):

```bash
npx create-brutalist-medusa-storefront my-storefront
```

Then:

```bash
cd my-storefront
npm install
cp .env.example .env.local
npm run dev
```

## What Gets Generated

- Full storefront source (`src/`, `public/`)
- Next.js/Tailwind/TypeScript config files
- `.env.example` with required variables
- Setup notes in `STOREFRONT_SETUP.md`

## Environment Variables

Required:

- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`

Common local defaults are included in `.env.example`.

## Publishing This Package

1. Login:

```bash
npm login
```

2. Dry run pack:

```bash
npm run pack:dry-run
```

3. Publish:

```bash
npm publish --access public
```

## Notes

- This npm package is a starter generator, not a runtime storefront dependency.
- Generated projects are set to `private: true` by default.
