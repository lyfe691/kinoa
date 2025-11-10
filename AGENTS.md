# AGENTS.md

## NOTE, THIS FILE MIGHT NOT BE UP TO DATE, MEANING THAT THE OWNER ("we", "prompter", "developer", "owner") NO LONGER RELY ON SOME OF THE INFORMATION IN THIS FILE.

## Project Overview

Kinoa is a frontend-only streaming platform built with **Next.js** and **shadcn/ui**.  
It fetches metadata from **TMDB** and uses **VidFast** for seamless video embedding.  
The project does **not** host or serve any media files — all playback occurs via third-party VidFast iframes.

### Core Technologies

- Framework: Next.js
- Styling: TailwindCSS + shadcn/ui
- Data: TMDB API (The Movie Database)
- Player: VidFast Embeds
- Deployment: Vercel

---

## Setup Commands

- Install dependencies:
  ```bash
  pnpm install
  ```

````

* Start development server:

  ```bash
  pnpm dev
  ```
* Lint code:

  ```bash
  pnpm lint
  ```
* Build for production:

  ```bash
  pnpm build
  ```
* Preview production build:

  ```bash
  pnpm start
  ```

Environment variables:

```
NEXT_PUBLIC_TMDB_API_KEY=<your_tmdb_api_key>
```

---

## Code Style

* TypeScript strict mode enabled.
* Use **single quotes**, no semicolons.
* Functional components preferred.
* TailwindCSS for layout and spacing.
* Keep React hooks minimal and pure.
* Use shadcn/ui components for all UI primitives (e.g. Button, Card, Input).

---

## Testing Instructions

* Run lint and type checks:

  ```bash
  pnpm lint
  pnpm tsc --noEmit
  ```
* Visual check: open `http://localhost:3000/movie/tt1375666` (Inception) to verify that the VidFast player loads correctly and TMDB metadata renders.
* Confirm responsive player behavior using Chrome dev tools (mobile/desktop breakpoints).

---

## PR / Commit Guidelines

* Branch name: `feature/<short-description>` or `fix/<short-description>`
* PR title format: `[kinoa] <short summary>`
* Run all checks (`pnpm lint`, `pnpm build`) before committing.
* Write concise commits; reference issue numbers if relevant.

---

## VidFast Integration Guide (for Agents)

Kinoa’s player embeds come exclusively from VidFast.
Agents should **not modify** the iframe domain list or attempt to fetch content directly.

### Movie Endpoint

```
https://vidfast.pro/movie/{id}?autoPlay=true
```

* `{id}` is a TMDB or IMDb identifier (e.g., `tt6263850` or `533535`).

Optional parameters:

```
theme, title, poster, startAt, sub, autoPlay, hideServerControls
```

### TV Endpoint

```
https://vidfast.pro/tv/{id}/{season}/{episode}?autoPlay=true
```

### Allowed Domains

```
vidfast.pro
vidfast.in
vidfast.io
vidfast.me
vidfast.net
vidfast.pm
vidfast.xyz
```

### Standard React Implementation

```tsx
<div className="relative w-full pt-[56.25%]">
  <iframe
    src={`https://vidfast.pro/movie/${imdbId}?autoPlay=true&theme=16A085`}
    className="absolute top-0 left-0 w-full h-full"
    frameBorder="0"
    allowFullScreen
    allow="encrypted-media"
  ></iframe>
</div>
```

### Event Listener (PostMessage)

VidFast sends playback events to `window`:

```ts
window.addEventListener('message', ({ origin, data }) => {
  const validOrigins = [
    'https://vidfast.pro','https://vidfast.in','https://vidfast.io',
    'https://vidfast.me','https://vidfast.net','https://vidfast.pm','https://vidfast.xyz'
  ];
  if (!validOrigins.includes(origin) || !data) return;
  if (data.type === 'PLAYER_EVENT') {
    const { event, currentTime, duration } = data.data;
    console.log(`Player ${event} at ${currentTime}s / ${duration}s`);
  }
});
```

---

## Security and Compliance Notes

* Never store or proxy video files.
* Never modify or scrape VidFast content.
* All requests to TMDB must include a valid API key.
* Legal disclaimers and TOS must remain visible to users.
* If adding analytics, anonymize all data (no personal identifiers).

---

## Deployment

* Deploy via [Vercel](https://vercel.com/).
* Environment variable required: `NEXT_PUBLIC_TMDB_API_KEY`.
* Domain suggestion: `kinoa.<tld>` (example: `kinoa.to`, `kinoa.me`, `kinoa.watch`).
* CI/CD: use Vercel auto-build on push to `main`.

---

## Future Tasks

* [ ] Add search with TMDB `/search/movie` and `/search/tv`.
* [ ] Local storage watch progress (using VidFast `MEDIA_DATA` events).
* [ ] Dark/light theme toggle.
* [ ] Optional watch-party integration via VidFast PostMessage API.
* [ ] Optional backend for user sessions (Supabase).

---

## Quick Reference

| Function                   | Purpose                                    |
| -------------------------- | ------------------------------------------ |
| `/app/page.tsx`            | Homepage with featured movies              |
| `/app/movie/[id]/page.tsx` | Movie page with TMDB data + VidFast iframe |
| `/lib/tmdb.ts`             | TMDB fetch utilities                       |
| `/components/ui`           | shadcn components                          |
| `/components/Player.tsx`   | iframe player logic                        |

---

## Notes for Agents

* Always prefer TMDB IDs or IMDb IDs for video links.
* Validate domains before adding iframe embeds.
* Do **not** alter the VidFast origin list.
* When adding new player features, reference VidFast documentation for supported parameters.
* When committing generated files, ensure no API keys or user data are included.

---

© 2025 Kinoa. All rights reserved.
````
