# StreamFlixx

A modern Netflix-style video streaming platform built with React and TypeScript.

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Routing:** React Router DOM v6
- **Data Fetching:** TanStack React Query
- **Video Playback:** video.js + hls.js + react-hls-player (HLS streaming)
- **Package Manager:** pnpm (with workspace catalog)

## Project Structure

```
/
├── src/
│   ├── components/     # Reusable UI components (Navbar, Hero, MovieCard, etc.)
│   ├── pages/          # Route-level pages (Home, Genres, Search, DetailPage)
│   ├── data/           # Mock data and content definitions
│   ├── hooks/          # Custom React hooks (useWatchHistory, useRecommendations)
│   ├── App.tsx         # Root component with routing
│   └── main.tsx        # Application entry point
├── public/             # Static assets + service worker
├── artifacts/          # Reference implementations (api-server, streamflixx)
├── pnpm-workspace.yaml # pnpm workspace with catalog dependency versions
├── vite.config.ts      # Vite configuration (requires PORT and BASE_PATH env vars)
├── tsconfig.json       # TypeScript configuration
└── tailwind.config.ts  # Tailwind CSS configuration
```

## Development

The app requires `PORT` and `BASE_PATH` environment variables for Vite. The workflow runs:
```
PORT=5000 BASE_PATH=/ pnpm run dev
```

## Key Features

- Hero banner with featured content
- Genre-based browsing
- Trending/Popular carousels
- Search functionality
- Content detail pages with video player modal
- Watch history tracking
- Service worker for offline caching (production only)

## Deployment

Configured as a static site deployment:
- Build: `PORT=5000 BASE_PATH=/ pnpm run build`
- Output: `dist/public`
