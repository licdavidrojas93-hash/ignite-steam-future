# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Niños STEAM** — a nonprofit landing site for a Mexican STEAM education initiative based in Hermosillo. Single-page marketing site in Spanish with an authenticated admin panel for managing blog posts.

## Commands

```bash
# Development
bun run dev          # Start Vite dev server
bun run build        # Production build
bun run lint         # ESLint
bun run preview      # Preview production build

# Testing
bun run test         # Run tests once (vitest)
bun run test:watch   # Run tests in watch mode
```

Run a single test file:
```bash
bunx vitest run src/path/to/file.test.ts
```

## Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Supabase + TanStack Query + Framer Motion

### Routing (`src/App.tsx`)
Three routes: `/` (public landing), `/admin/login` (Supabase email/password auth), `/admin` (protected blog CMS).

### Public Landing (`src/pages/Index.tsx`)
Composed entirely of section components from `src/components/sections/`. Order: `Navbar → Hero → WhatIsSteam → Mission → Team → Programs → Collaborators → Donations → Blog → Footer`. Each section has an `id` matching the navbar anchor links for smooth-scroll navigation.

### Admin Panel (`src/pages/Admin.tsx`)
Full CRUD for `blog_posts`. Auth guard via `supabase.auth.onAuthStateChange` — redirects to `/admin/login` on session loss. Inline modal form (no separate route). The slug is auto-generated from the title via a `slugify` helper (strips accents, special chars).

### Supabase Integration (`src/integrations/supabase/`)
- `client.ts` — singleton Supabase client (auto-generated, do not edit manually). Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from env.
- `types.ts` — auto-generated DB types. Only table: `blog_posts` (id, title, slug, excerpt, content, cover_image_url, author, published, published_at, created_at, updated_at).

**RLS rules:** Public visitors can only SELECT where `published = true`. Authenticated users have full CRUD access.

### Styling
Custom design tokens defined as CSS variables in `src/index.css`. Key custom utilities:
- `text-gradient-warm` — accent-to-secondary-to-primary gradient text
- `bg-navy` — dark blue navbar background
- `shadow-soft` / `shadow-medium` / `shadow-playful` — custom box-shadows
- `font-display` — Fredoka/Poppins for headings; `font-sans` — Inter for body text
- `animate-blob` / `animate-bounce-fun` — decorative animations

### Path Alias
`@/` resolves to `src/` (configured in both `vite.config.ts` and `vitest.config.ts`).

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

## Database

Migrations in `supabase/migrations/`. The single migration creates `blog_posts` with RLS and a `set_updated_at` trigger. When adding new tables, always enable RLS and create appropriate policies.
