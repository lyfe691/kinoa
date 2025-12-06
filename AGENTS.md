# AGENTS.md

## NOTE, THIS FILE MIGHT NOT BE UP TO DATE, MEANING THAT THE OWNER ("we", "prompter", "developer", "owner") NO LONGER RELY ON SOME OF THE INFORMATION IN THIS FILE.

## Project Overview

Kinoa is a streaming platform built with **Next.js**, **Supabase**, and **shadcn/ui**.  
It fetches metadata from **TMDB** and uses **VidFast** (or other third-party hosters) for seamless video embedding.  
The project does **not** host or serve any media files — all playback occurs via third-party hosters iframes.

### Core Technologies

- Framework: Next.js
- Styling: TailwindCSS + shadcn/ui
- Data: TMDB API (The Movie Database)
- Player: VidFast (or other third-party hosters) Embeds
- Deployment: Vercel

---

## Setup Commands

- Install dependencies:
  ```bash
  pnpm install
  ```

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
NEXT_PUBLIC_TMDB_API_KEY=<your_tmdb_api_key_here>
OMDB_API_KEY=<your_omdb_api_key_here>
MAINTENANCE_MODE=false
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url_here>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key_here>
SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key_here>
NEXT_PUBLIC_SITE_URL=<your_site_url_here>
```

more might to come as we add more hosters or features.

---

## Code Style

- TypeScript strict mode enabled.
- Use **single quotes**, no semicolons.
- Functional components preferred.
- TailwindCSS for layout and spacing.
- Keep React hooks minimal and pure.
- Use shadcn/ui components for all UI primitives (e.g. Button, Card, Input). If youre unsure, check components/ui for the available components.
- Clean code is key.
- Code splitting if needed.

---

## Testing Instructions

- Run lint and type checks:

  ```bash
  pnpm lint
  pnpm tsc --noEmit
  pnpm build
  ```

---

## PR / Commit Guidelines

- Branch name: `feature/<short-description>` or `fix/<short-description>`
- PR title format: `[kinoa] <short summary>`
- Run all checks (`pnpm lint`, `pnpm build`) before committing.
- Write concise commits; reference issue numbers if relevant. Don't exaggerate.

---

## VidFast Integration Guide (for Agents)

Kinoa’s player embeds come exclusively from VidFast.
Agents should **not modify** the iframe domain list or attempt to fetch content directly.

### Movie Endpoint

```
https://vidfast.pro/movie/{id}?autoPlay=true
```

- `{id}` is a TMDB or IMDb identifier (e.g., `tt6263850` or `533535`).

Optional parameters:

```
theme, title, poster, startAt, sub, autoPlay, hideServerControls
```

### TV Endpoint

```
https://vidfast.pro/tv/{id}/{season}/{episode}?autoPlay=true
```

## More Hosters

If the owner, aka. the developer, wants to add a new hoster, you comply.

As of this moment, we're only using VidFast. But in the future its likely that the owner will want to add more hosters. So if asked, you can do so.

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

& more might to come as we add more hosters. Meaning that youre allowed to add more hosters.

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
window.addEventListener("message", ({ origin, data }) => {
  const validOrigins = [
    "https://vidfast.pro",
    "https://vidfast.in",
    "https://vidfast.io",
    "https://vidfast.me",
    "https://vidfast.net",
    "https://vidfast.pm",
    "https://vidfast.xyz",
  ];
  if (!validOrigins.includes(origin) || !data) return;
  if (data.type === "PLAYER_EVENT") {
    const { event, currentTime, duration } = data.data;
    console.log(`Player ${event} at ${currentTime}s / ${duration}s`);
  }
});
```

---

## Security and Compliance Notes

- Never store or proxy video files.
- Never modify or scrape VidFast content.
- All requests to TMDB must include a valid API key.
- Legal disclaimers and TOS must remain visible to users.

---

## Notes for Agents

- Always prefer TMDB IDs or IMDb IDs for video links.
- Validate domains before adding iframe embeds.
- Do **not** alter the origin list unless asked by the owner, aka. the developer.
- When adding new player features, reference the hosters documentation for supported parameters.
- When committing generated files, ensure no API keys or user data are included.
- Important: If youre unsure about something, gather more context. If youre still unsure, ask the owner, aka. the developer.

---

© 2025 Kinoa. All rights reserved.
