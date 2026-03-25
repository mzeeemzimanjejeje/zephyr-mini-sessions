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

**Workflow:** `Courtney ENT Mobile` runs on port 8080  
`cd mobile && CI=1 npx expo start --port 8080 --web`

**Screens:**
- Home — Hero banner + trending rows from Cineverse API
- Search — Real-time search with results grid
- Watch — WebView player cycling through 5 embed sources, with episode navigation for series

**Mobile Logo:** "CE" red badge in the header and app icon

**Test on device:** Scan the QR code shown in the mobile workflow console with Expo Go app

## Deployment

Static site:
- Build: `PORT=5000 BASE_PATH=/ pnpm run build`
- Output: `dist/public`
