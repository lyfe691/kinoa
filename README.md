# kinoa

A cinematic front room for browsing movies & shows without the noise.  
Built with Next.js + Supabase, styled with [shadcn/ui](https://ui.shadcn.com/) and Tailwind. Data is fetched from [The Movie Database (TMDb)](https://www.themoviedb.org/).

- [`/`](./app/(main)/page.tsx) — trending, popular, and quick picks  
- [`/movie`](./app/(main)/movie) — movie watcher 
- [`/tv`](./app/(main)/tv) — episodic watcher  
- [`/search`](./app/(main)/search/page.tsx) — instant lookup across catalog  
- [`/watchlist`](./app/(main)/watchlist/page.tsx) — track what you want to see  
- [`/settings`](./app/(main)/settings/page.tsx) — profile & preferences  

---

## Highlights

- **Universal Player** — Seamless playback for movies and episodes.
- **Clean Design** — A minimal, distraction-free interface built for immersion.
- **Personalized** — Save favorites and track your history.

---

## Development

```bash
pnpm install
pnpm dev
```

Runs on [Next.js](https://nextjs.org/) with [Supabase](https://supabase.com/).
