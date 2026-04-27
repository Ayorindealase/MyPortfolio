# THE ARCHITECT — Ayorinde Alase Portfolio

## Project Overview
Cyberpunk HUD portfolio site with admin CMS. Next.js 16 + TypeScript + Tailwind CSS 4 + Supabase + Prisma + Groq AI chatbot.

## Key Commands
- `npm run dev` — start dev server (port 3000)
- `npx prisma db push` — push schema to Supabase
- `npx prisma generate` — regenerate Prisma client
- `npx prisma db seed` — seed database with initial data
- `npm run build` — production build (must pass before deploy)
- Use `--cache /tmp/npm-cache` with npm commands to avoid cache permission issues

## Architecture
- `/app/(public routes)` — portfolio pages, server components fetching via Prisma
- `/app/admin/*` — protected admin CMS pages
- `/app/api/admin/*` — CRUD API routes (all check Supabase auth)
- `/app/api/chat` — Groq-powered chatbot streaming endpoint
- `/components/hud/*` — cyberpunk UI components (client components)
- `/components/admin/*` — admin panel components
- `/lib/*` — prisma client, supabase clients, utils

## Design System
Colors: --cyan (#00f3ff), --green (#00ff41), --amber (#ffb800), --red (#ff3e3e), --bg (#030308)
Fonts: Oxanium (display/headers), IBM Plex Mono (system/mono), DM Sans (body)
All cards use .hud-card class (glassmorphism + HUD corner brackets). Border-radius: 2px.
CSS classes: .hud-card, .grid-pattern, .font-oxanium, .font-mono-hud, .text-glow-cyan, etc.

## Tailwind CSS 4 Note
Uses @import "tailwindcss" syntax. Custom theme tokens defined with @theme inline in globals.css.
Do NOT use @tailwind base/components/utilities — that is Tailwind v3 syntax.

## Database
Supabase Postgres via Prisma. See prisma/schema.prisma for all models.
Admin auth via Supabase Auth (email/password).

## Important
- Every admin API route must verify auth session before processing
- Public pages fetch data with Prisma in server components (no API calls needed)
- Chatbot uses Groq free tier (llama-3.3-70b-versatile) — rate limit the endpoint
- Boot sequence only plays once per session (sessionStorage flag)
- All animations must use transform/opacity only for performance
