# kinoa

A cinematic front room for browsing movies & shows without the noise. Built with Next.js, shadcn/ui, and powered by TMDB + VidFast embeds.

- [`/`](./app/page.tsx) — hero carousel, trending rows, quick picks
- [`/movie/[id]`](./app/movie/[id]/page.tsx) — TMDB detail views with inline playback
- [`/tv/[id]/[season]/[episode]`](./app/tv/[id]/[season]/[episode]/page.tsx) — episodic watcher with server selection
- [`/search`](./app/search/page.tsx) — instant lookup across movies & series
- [`/(legal)`](<./app/(legal)>) — privacy & terms in one place

---

## Development

```bash
pnpm install
pnpm dev
```

Create a `.env.local` with:

```
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
OMDB_API_KEY=your_omdb_api_key
MAINTENANCE_MODE=false
```

---

## Stack

- **Framework:** Next.js App Router + React Server Components
- **UI:** Tailwind CSS, shadcn/ui primitives, Lucide icons
- **Data:** TMDB REST API via typed helpers in [`/lib/tmdb.ts`](./lib/tmdb.ts)
- **Player:** Responsive VidFast iframe wrapper in [`/components/player.tsx`](./components/player.tsx)

---

## Scripts

```bash
pnpm lint   # static analysis & formatting
pnpm build  # production compile
pnpm start  # preview the production build
pnpm format # format the code
```

---

## Notes

- No media files are stored or proxied; playback stays on VidFast domains.
- Keep credentials out of the repo—only the public TMDB key belongs in client bundles.
- Deploy on Vercel for edge caching, image optimization, and auto CI.

---

© 2025 Kinoa. All rights reserved.
