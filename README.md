# Obroni Akunafo Kuo — website

Public website and admin console for **Obroni Akunafo Kuo (OAK)**, a non-profit
organisation in Mim, Ahafo Region, Ghana. The site presents the organisation's
programmes, stories and governance, accepts enquiries and donations, and gives
staff a private area to review submissions and edit content.

## Stack

- **Next.js 16** (App Router, Server Actions, Proxy middleware)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** via `@tailwindcss/turbopack`
- **Zod** for server-side validation
- **Supabase** (optional) for auth and persistence
- **Resend** + **React Email** (optional) for transactional email

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; defaults work for local demo
npm run dev
```

Open <http://localhost:3000>.

| Command         | Purpose                     |
| --------------- | --------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Production build            |
| `npm start`     | Run the production build    |
| `npm run lint`  | ESLint                      |

## Routes

**Public**

- `/` — homepage
- `/about` — mission, vision, governance, team
- `/programmes` — four core programmes
- `/get-involved` — ways to help
- `/stories`, `/stories/[slug]` — impact stories
- `/contact`, `/donate`, `/partner`, `/volunteer` — enquiry and giving flows
- `/privacy`, `/terms` — legal pages
- Confirmation pages under `/contact/success`, `/donate/success`,
  `/partner/success`, `/volunteer/success`

**Admin** (protected by middleware)

- `/admin/login`
- `/admin` — dashboard
- `/admin/donations` (+ CSV export)
- `/admin/messages`
- `/admin/volunteers`
- `/admin/partnerships`
- `/admin/stories` (+ new/edit)
- `/admin/programmes` (+ edit)
- `/admin/settings`

## Project structure

```
src/
  app/
    (public)/        public pages
    (confirm)/       confirmation pages
    (admin)/admin/   admin console
    (auth)/          admin login
    actions.ts       public form server actions
    admin-actions.ts admin server actions
  components/
    site/            header, footer, logo, hero, success panel
    ui/              button, form controls, primitives, accordion
    forms/           public forms
    admin/           admin shell, forms and UI
  lib/
    site.ts          organisation facts, programmes, navigation
    stories.ts       seeded stories
    validation.ts    Zod schemas and shared form types
    data/            in-memory demo store
    supabase/        server client
    auth.ts          admin session helpers
  proxy.ts           /admin route protection
public/
  images/            photography and logos
  documents/         partner PDFs (profile, constitution summary)
```

## Content and data

- Organisation details, programmes and navigation live in `src/lib/site.ts`.
- Stories live in `src/lib/stories.ts` and can also be managed in the admin.
- Admin edits are stored in an **in-memory demo store**
  (`src/lib/data/content.ts`). They persist for the life of the server process
  and reset on restart. Connect Supabase to persist them.
- Form submissions are stored in `src/lib/data/store.ts` and are visible in the
  admin immediately. They also reset on restart.
- PDFs in `public/documents/` are working drafts for partner due diligence.
  Replace them with the organisation's signed documents before launch.

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for metadata and absolute links |
| `ADMIN_PASSWORD` | Demo only | Password for the mock admin login (default `oak-admin`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Enables Supabase auth when paired with the anon key |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-side writes (never expose to the client) |
| `RESEND_API_KEY` | Optional | Transactional email |
| `RESEND_FROM_EMAIL` | Optional | Verified sender address |
| `ADMIN_NOTIFICATION_EMAIL` | Optional | Recipient for submission notifications |

**Security note:** the mock login uses a shared password and an unsigned cookie.
Do not use it in production. Configure Supabase Auth (or replace `src/lib/auth.ts`
with a real session provider) before going live, and set a strong
`ADMIN_PASSWORD` for staging demos.

## Donations

The site does **not** process card payments. Donors give by Ecobank transfer or
MTN Mobile Money using the details on `/donate`, then optionally record a pledge
through the form. A "monthly" gift is a **manual pledge**, not an automatic
recurring charge. Confirmation pages show the reference and next steps.

## Deployment

The project deploys to Vercel or any Node 24 host:

1. Set the environment variables for the target environment.
2. Run `npm run build` and `npm start`, or connect the repository to Vercel.
3. Replace the demo admin auth and in-memory store with Supabase before
   accepting real submissions.

## Known limitations

- Admin content and settings changes are not yet persisted across restarts.
- Supabase schema/migrations are not included; wire the helpers in
  `src/lib/data/content.ts` and `src/lib/data/store.ts` to tables when ready.
- Email notifications are not sent in the demo; forms validate and store only.
- Legal pages are working drafts and should be reviewed by a qualified adviser.
- Photography is representative and should be confirmed for publication rights.

## Contact

Obroni Akunafo Kuo · Mim, Ahafo Region, Ghana
obroniakunafuo@gmail.com · 0241 936 699 / 0541 597 436
