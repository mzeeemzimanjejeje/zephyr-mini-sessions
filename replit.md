# StreamFlixx

A modern Netflix-style video streaming platform built with React and TypeScript, enhanced with live data from the Cineverse/MovieBox API.

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
│   ├── components/     # Reusable UI (Navbar, Hero, MovieCard, WatchModal, etc.)
│   ├── pages/          # Route pages (Home, Genres, Search, DetailPage)
│   ├── data/           # Static mock content + cast/genre metadata
│   ├── hooks/          # useWatchHistory, useRecommendations
│   ├── lib/
│   │   └── cineverse.ts   # Cineverse/MovieBox API client
│   ├── App.tsx
│   └── main.tsx        # Entry point + QueryClientProvider
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

## Cineverse API Integration

Base URL: `https://moviebox.davidcyril.name.ng/api`
Required headers: `User-Agent` (Android Chrome), `Referer` and `Origin` set to `https://cineverse.name.ng/`

Key endpoints:
- `/api/search/{query}?type=1|2` — live search (type 1=Movie, 2=Series, 6=Music filtered out)
- `/api/info/{subjectId}` — metadata, seasons, trailer
- `/api/sources/{subjectId}?season=X&episode=Y` — direct MP4 downloads + SRT captions
- `/api/trending` — 18 trending titles in `subjectList`

## Video Player Strategy

**API items** (`item.subjectId` present): Native HTML5 `<video>` with quality selector (360p–1080p), subtitle tracks (SRT), "Use embeds" fallback toggle.

**Static-only items** (IMDB ID only): Rotating iframe embeds (vidsrc.xyz → moviesapi.club → vidsrc.to → vidsrc.mov) with 8s auto-switch and source picker.

## Routing

- Static content: routes by numeric `id` (1–330), e.g. `/title/1`
- API content: routes by `subjectId` (18-digit string), e.g. `/title/112345678901234567`
- DetailPage detects which mode by checking if a static item exists for the numeric ID

## Key Features

- Live trending row fetched from Cineverse API
- Live search with debounce against Cineverse API
- Direct MP4 streaming with quality and subtitle selection
- Watch history with progress tracking (localStorage)
- Personalised recommendations from watch history
- Hero banner, genre browsing, content carousels
- Detail pages with cast, genres, seasons info

## Mobile App (Courtney ENT)

Located in `mobile/` — Expo SDK 55 + React Native + Expo Router.

**Workflow:** `Courtney ENT Mobile` runs on **port 5000** (webview/preview pane)  
`cd mobile && CI=1 npx expo start --port 5000 --web`

**StreamFlixx runs on port 3000** (switch in the port selector to see it)

**Screens:**
- Home — Hero banner + trending rows from Cineverse API
- Search — Real-time search with results grid
- Watch — WebView player cycling through 5 embed sources, with episode navigation for series

**Mobile Logo:** "CE" red badge in the header and app icon

**Test on device:** Scan the QR code shown in the mobile workflow console with Expo Go app

**PWA Support:** `mobile/app.json` has full `web` PWA config (standalone display, theme #e50914).  
Service worker at `mobile/web/sw.js` caches the app for offline use.

## App Banner (StreamFlixx Website)

`src/components/AppBanner.tsx` — always-visible sticky bar at the very top of the StreamFlixx website.
- Shows CE logo + "Courtney ENT" name + tagline
- "Get App" button opens the Courtney ENT web app (or triggers PWA install prompt if available)
- Dismiss button (X) — stores dismissal in localStorage
- URL configured via `VITE_MOBILE_APP_URL` env var (set in `.env.local` for dev)

**To update the app URL for production:** set `VITE_MOBILE_APP_URL` in Vercel environment variables to the deployed Courtney ENT app URL.

## Deployment

Static site:
- Build: `PORT=3000 BASE_PATH=/ pnpm run build`
- Output: `dist/public`
