# Avanti Landscaping — Website

Marketing site and admin dashboard for Avanti Landscaping LLC (Waxhaw, NC).
Next.js (App Router) + PostgreSQL, deployed on Railway.

## Stack
- **Next.js 16 / React 19** — App Router, server components, server actions
- **PostgreSQL + Prisma** — all page copy, services, gallery, and leads live in the DB
- **NextAuth (credentials)** — admin login, guarded by `proxy.ts`
- **Cloudinary** — stores images and video uploaded through the admin
- **Resend** — emails a notification when the contact form is submitted

## Structure
- `app/` — public pages (home, services, areas, about, gallery, contact, blog)
  and `app/admin/` for the dashboard
- `components/` — header, footer, contact form, hero media, before/after carousel
- `lib/` — db client, content helpers, Cloudinary, email
- `prisma/` — schema, migrations, seed
- `public/assets/` — logo, hero video, and the default project photos
- `legacy-static/` — the original static HTML site, kept for reference

## Content model
Page copy is stored as `ContentBlock` rows keyed by `page` + `key`, edited under
**Page Content** in the admin. Two areas have dedicated screens instead:

- **Before & After** — `BeforeAfterProject` rows, managed under **Gallery**.
  Each row is one slide in the comparison carousel on the home and gallery pages.
  The section is hidden entirely when there are no rows.
- **Hero video** — managed from its own card on the home page content editor.

## Local development

Requires a PostgreSQL database. Copy `.env.example` to `.env` and fill it in.

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

`npm run db:seed` is fine for a fresh database, but **never run it against
production** — it resets the admin password, overwrites every content block back
to its default, and wipes the services and gallery tables.

## Deploy (Railway)

`npm start` runs `prisma migrate deploy` before booting, so schema changes and
data migrations in `prisma/migrations/` apply automatically on each deploy.
The seed does **not** run — production data is either migrated in or entered
through the admin.

Required environment variables are listed in `.env.example`. Without the
`CLOUDINARY_*` keys the admin hides every upload form, so the owner cannot add
photos or before/after projects.
