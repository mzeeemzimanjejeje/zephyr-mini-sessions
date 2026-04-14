# Courtney Movies

A modern Netflix-style video streaming and download platform built with React and TypeScript, powered by live data from the Cineverse/MovieBox API and the FZMovies download API.

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite (requires `PORT` and `BASE_PATH` env vars)
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Routing:** React Router DOM v6
- **Data Fetching:** TanStack React Query v5
- **Package Manager:** pnpm (with workspace catalog)

## Project Structure

```
/
├── src/
│   ├── components/     # Reusable UI (Navbar, Hero, MovieCard, WatchModal, AppBanner, etc.)
│   ├── pages/          # Route pages (Home, Genres, Search, DetailPage, Downloads, DownloadDetail)
│   ├── data/           # Static mock content + cast/genre metadata
│   ├── hooks/          # useWatchHistory, useRecommendations
│   ├── lib/
│   │   ├── cineverse.ts   # Cineverse/MovieBox API client + IMDB lookup + embed sources
│   │   └── fzmovies.ts    # FZMovies download API client
│   ├── App.tsx
│   └── main.tsx        # Entry point + QueryClientProvider
├── mobile/             # Expo SDK 55 React Native app
├── public/
├── pnpm-workspace.yaml
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

## Development

```
PORT=5000 BASE_PATH=/ pnpm run dev
```

## Routing

- `/` — Home (live trending + hero from Cineverse API)
- `/title/:id` — Detail page (static or Cineverse item)
- `/genres` — Genre browser
- `/genres/:genre` — Genre-filtered content
- `/search` — Live search
- `/downloads` — FZMovies latest + search
- `/downloads/:slug` — FZMovies movie detail + download links

Static content: routes by numeric `id` (1–330), e.g. `/title/1`
API content: routes by `subjectId` (18-digit string), e.g. `/title/112345678901234567`

---

## Cineverse API Integration

Base URL: `https://moviebox.davidcyril.name.ng/api`
Required headers: `User-Agent` (Android Chrome), `Referer` and `Origin` set to `https://cineverse.name.ng/`

Key endpoints:
- `/api/search/{query}?type=1|2` — live search (type 1=Movie, 2=Series, 6=Music filtered out)
- `/api/info/{subjectId}` — metadata, seasons, trailer
- `/api/sources/{subjectId}?season=X&episode=Y` — direct MP4 downloads + SRT captions
- `/api/trending` — trending titles in `subjectList`
- `/api/homepage` — banner + curated sections
- `/api/stream?url=...` — stream proxy for direct MP4 URLs

---

## FZMovies Download API

Base URL: `https://apis.davidcyril.name.ng/movies/fzmovies`

Key endpoints:
- `/latest?page=N` — 10 latest movies per page, supports `?search=query`
- `/info?slug=...` — movie details: poster, description, categories, download_links[]
- `/download?url=...` — resolve download_link URL → `{ download_url, meetdownload_url, filename }`

Client: `src/lib/fzmovies.ts`
- `fetchFZLatest(page?)` — paginated latest movies
- `fetchFZSearch(query)` — search via `/latest?search=`
- `fetchFZInfo(slug)` — full movie details
- `fetchFZDownload(url)` — get actual download URLs from episode-download page URL
- `extractGenres(categories[])` — filters raw FZMovies categories to clean genre names
- `decodeHtml(str)` — decodes HTML entities in descriptions

---

## Video Player Strategy

**API items** (`item.subjectId` present):
- Native HTML5 `<video>` with quality selector (360p–1080p), subtitle tracks (SRT)
- Falls back to embed player on failure with "Try another player" button

**Static-only items / fallback** (IMDB ID lookup):
- OMDB API (primary) → IMDB suggestions (fallback)
- `imdbLookupDone` state tracks completion — shows clear error if ID not found (no infinite spin)
- 10 rotating iframe embed sources: VidLink, VidSrc variants, Videasy, embed.su, autoembed.cc, 2embed.org, vidbinge.dev
- "Next Player" button to cycle sources manually
- Iframe sandbox: `allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-pointer-lock allow-orientation-lock allow-modals allow-downloads allow-top-navigation-by-user-activation`

---

## Key Features

- Live trending hero banner and carousels from Cineverse API
- Live search with debounce against Cineverse API
- Direct MP4 streaming with quality and subtitle selection
- 10 embed player sources with manual next-player cycling
- Watch history with progress tracking (localStorage)
- Personalised recommendations from watch history
- Hero banner, genre browsing, content carousels
- Detail pages with cast, genres, seasons info
- Downloads section: browse/search FZMovies, get direct download links
- HTML entity decoding for clean descriptions
- Navbar with active-state links: Home, Genres, Downloads

---

## Mobile App (Courtney ENT)

Located in `mobile/` — Expo SDK 55 + React Native + Expo Router.

**Workflow:** `Courtney ENT Mobile` runs on port 8080 (console output)
`cd mobile && CI=1 npx expo start --port 8080 --web`

**Main web app:** `Start application` runs on port 5000 (webview/preview pane)

**Screens:**
- Home — Hero banner + trending rows from Cineverse API
- Search — Real-time search with results grid
- Watch — WebView player cycling through embed sources, with episode navigation for series

**Imports web lib:** Mobile screens import directly from `../../src/lib/cineverse` for shared API logic.

**Test on device:** Scan the QR code shown in the mobile workflow console with Expo Go app

---

## App Banner (AppBanner.tsx)

Sticky bar at the very top of the website.
- Shows CE logo + "Courtney ENT" name + tagline
- "Download APK" button links to GitHub releases
- iOS: shows "Add to Home Screen" hint
- Chrome/Android: triggers native PWA install prompt if available
- Dismiss stores in localStorage (`ce_banner_dismissed`)

---

## Deployment

Static site:
- Build: `PORT=5000 BASE_PATH=/ pnpm run build`
- Output: `dist/public`
- Target: `deploymentTarget = "static"` in `.replit`
