# Lipa Poster Studio

Modern, shareable payment posters with a genuinely **copyable** Lipa number.

- **Multiple profiles** — one poster per business/agent/purpose (Lipa number, repair number, agent code).
- **PIN-protected admin** at `/admin` — only you can create/edit/delete posters.
- **Public poster pages** at `/p/[slug]` — shareable link with a tap-to-copy button, and PDF/PNG downloads.
- **Real copyable text in the PDF** — built with `@react-pdf/renderer`, which emits actual vector text objects, not a rasterized screenshot. Anyone who opens the PDF can select and copy the number.
- **Shareable image** (PNG, 1080×1350) generated with `@vercel/og`, ideal for WhatsApp/Instagram — from the same design data as the PDF.

## Local setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — any Postgres connection string
   - `ADMIN_PIN` — the PIN you'll use to log into `/admin`
   - `SESSION_SECRET` — random string, e.g. `openssl rand -hex 32`
3. `npm run db:push` — creates the `Profile` table
4. `npm run dev` — open `http://localhost:3000`

## Deploying to Vercel

1. Import this repo into Vercel.
2. In the project's **Storage** tab, create a Postgres database (Vercel Postgres / Neon) and connect it — this auto-fills `DATABASE_URL`.
3. Add `ADMIN_PIN` and `SESSION_SECRET` as environment variables in the Vercel project settings.
4. Deploy. Then run `npx prisma db push` once (locally, pointed at the production `DATABASE_URL`, or via a Vercel deploy hook) to create the table in production.
5. Visit `/admin` on your deployed URL, enter your PIN, and create your first poster.

## How the "copyable number" requirement is met

Most poster/flyer tools (Canva exports, screenshots, canvas-drawn PDFs) turn everything — including the number — into pixels. The PDF route here (`src/app/api/poster/[slug]/pdf/route.tsx`) instead builds the document with `@react-pdf/renderer`'s `<Text>` primitives, which are real PDF text objects. Open the downloaded PDF in any viewer and the Lipa number is selectable and copy-pasteable, same as a Word document.
