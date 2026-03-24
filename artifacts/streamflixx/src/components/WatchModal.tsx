import { useState, useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ContentItem } from "../data/content";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { bwmSources, imdbSearch, BwmSource, BwmSubtitle } from "../api/bwm";

interface Props {
  item: ContentItem;
  onClose: () => void;
  initialSeason?: number;
  initialEpisode?: number;
  trailerUrl?: string;
  totalSeasons?: number;
}

const EMBED_SOURCES = [
  { name: "VidSrc",    build: (t: string, id: string, s: number, e: number) => t === "tv" ? `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` : `https://vidsrc.xyz/embed/movie/${id}` },
  { name: "MoviesAPI", build: (t: string, id: string, s: number, e: number) => t === "tv" ? `https://moviesapi.club/tv/${id}-${s}-${e}` : `https://moviesapi.club/movie/${id}` },
  { name: "VidSrc2",   build: (t: string, id: string, s: number, e: number) => t === "tv" ? `https://vidsrc.to/embed/tv/${id}?season=${s}&episode=${e}` : `https://vidsrc.to/embed/movie/${id}` },
  { name: "VidSrc3",   build: (t: string, id: string, s: number, e: number) => t === "tv" ? `https://vidsrc.mov/embed/tv/${id}/${s}/${e}` : `https://vidsrc.mov/embed/movie/${id}` },
];

const QUALITY_ORDER = ["1080p", "720p", "480p", "360p"];
type PlayerMode = "resolving" | "direct" | "embed" | "trailer" | "unavailable";

interface BwmCacheEntry { sources: BwmSource[]; subtitles: BwmSubtitle[] }
const bwmCache = new Map<string, BwmCacheEntry | null>();
const imdbCache = new Map<string, string | null>();

function qualitySort(s: BwmSource[]): BwmSource[] {
  return [...s].sort((a, b) => QUALITY_ORDER.indexOf(a.quality) - QUALITY_ORDER.indexOf(b.quality));
}

function withTimeout<T>(p: Promise<T | null>, ms: number): Promise<T | null> {
  return Promise.race([p, new Promise<null>(r => setTimeout(() => r(null), ms))]);
}

export default function WatchModal({ item, onClose, initialSeason, initialEpisode, trailerUrl, totalSeasons }: Props) {
  const isTV = item.type === "Series";
  const numSeasons = totalSeasons ?? (isTV ? 8 : 0);
  const [season, setSeason] = useState(initialSeason ?? 1);
  const [episode, setEpisode] = useState(initialEpisode ?? 1);
  const [resolveStep, setResolveStep] = useState("");

  const [mode, setMode] = useState<PlayerMode>("resolving");
  const [sources, setSources] = useState<BwmSource[]>([]);
  const [subtitles, setSubtitles] = useState<BwmSubtitle[]>([]);
  const [activeSrc, setActiveSrc] = useState<BwmSource | null>(null);
  const [resolvedImdbId, setResolvedImdbId] = useState<string | undefined>(item.imdbId);
  const [embedSrcIdx, setEmbedSrcIdx] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { recordWatch, updateProgress } = useWatchHistory();
  const startTimeRef = useRef(Date.now());
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    recordWatch(item, isTV ? season : undefined, isTV ? episode : undefined);
    startTimeRef.current = Date.now();
    const AVG = item.type === "Movie" ? 5400 : 2700;
    progressIntervalRef.current = setInterval(() => {
      const pct = Math.min(99, ((Date.now() - startTimeRef.current) / 1000 / AVG) * 100);
      updateProgress(item.id, pct, isTV ? season : undefined, isTV ? episode : undefined);
    }, 10000);
    return () => { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); };
  }, [item.id, season, episode]);

  const resolve = useCallback(async () => {
    setMode("resolving");
    setSources([]); setActiveSrc(null); setResolveStep("Connecting…");

    let finalImdbId = resolvedImdbId;

    if (item.subjectId) {
      const bwmKey = `${item.subjectId}:${isTV ? `${season}:${episode}` : ""}`;
      const imdbKey = `${item.title}:${item.type}`;

      const bwmFetch: Promise<BwmCacheEntry | null> = bwmCache.has(bwmKey)
        ? Promise.resolve(bwmCache.get(bwmKey)!)
        : withTimeout(
            bwmSources(item.subjectId, isTV ? season : undefined, isTV ? episode : undefined)
              .then(r => r && r.results.length > 0 ? { sources: r.results, subtitles: r.subtitles } : null),
            4500,
          ).then(r => { bwmCache.set(bwmKey, r); return r; });

      const imdbFetch: Promise<string | null> = finalImdbId
        ? Promise.resolve(finalImdbId)
        : imdbCache.has(imdbKey)
          ? Promise.resolve(imdbCache.get(imdbKey)!)
          : withTimeout(
              imdbSearch(item.title, isTV ? "tvSeries" : "movie")
                .then(id => { imdbCache.set(imdbKey, id); return id; }),
              4000,
            );

      setResolveStep("Fetching direct stream…");
      const [bwmResult, imdbResult] = await Promise.all([bwmFetch, imdbFetch]);

      if (!finalImdbId && imdbResult) { finalImdbId = imdbResult; setResolvedImdbId(imdbResult); }

      if (bwmResult) {
        const sorted = qualitySort(bwmResult.sources);
        setSources(sorted); setSubtitles(bwmResult.subtitles); setActiveSrc(sorted[0]);
        setMode("direct"); return;
      }
    } else if (!finalImdbId) {
      const imdbKey = `${item.title}:${item.type}`;
      if (imdbCache.has(imdbKey)) {
        finalImdbId = imdbCache.get(imdbKey) ?? undefined;
      } else {
        setResolveStep("Looking up title…");
        const found = await withTimeout(imdbSearch(item.title, isTV ? "tvSeries" : "movie"), 4000);
        imdbCache.set(imdbKey, found);
        if (found) finalImdbId = found;
      }
      if (finalImdbId) setResolvedImdbId(finalImdbId);
    }

    if (finalImdbId) { setEmbedSrcIdx(0); setMode("embed"); return; }
    if (trailerUrl) { setMode("trailer"); return; }
    setMode("unavailable");
  }, [item.subjectId, item.title, item.type, isTV, season, episode, resolvedImdbId, trailerUrl]);

  useEffect(() => { resolve(); }, [season, episode]);

  const goEpisode = useCallback((s: number, e: number) => { setSeason(s); setEpisode(e); }, []);

  const topBar = (badge: ReactNode, extra?: ReactNode) => (
    <div className="flex items-center justify-between px-4 py-3 bg-black/90 flex-shrink-0 flex-wrap gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="min-w-0">
          <h2 className="text-white font-bold text-sm md:text-base truncate">{item.title}</h2>
          {isTV && mode !== "resolving" && <p className="text-white/50 text-xs">Season {season} · Episode {episode}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">{badge}{extra && <div className="flex gap-1">{extra}</div>}</div>
    </div>
  );

  const tvBar = isTV && (
    <div className="bg-[#0a0a0a] border-t border-white/10 px-4 py-3 flex-shrink-0">
      <div className="flex items-center gap-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-white/50 text-xs font-medium">Season</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.max(1, numSeasons) }, (_, i) => i + 1).map(s => (
              <button key={s} onClick={() => goEpisode(s, 1)}
                className={`w-7 h-7 rounded text-xs font-bold transition-all ${season === s ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="w-px h-6 bg-white/10 flex-shrink-0" />
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-white/50 text-xs font-medium">Episode</span>
          <div className="flex gap-1">
            {Array.from({ length: 20 }, (_, i) => i + 1).map(e => (
              <button key={e} onClick={() => goEpisode(season, e)}
                className={`w-7 h-7 rounded text-xs font-bold transition-all flex-shrink-0 ${episode === e ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>{e}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
          <button onClick={() => episode > 1 ? goEpisode(season, episode - 1) : season > 1 && goEpisode(season - 1, 1)}
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded transition-colors">← Prev</button>
          <button onClick={() => goEpisode(season, episode + 1)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors">Next →</button>
        </div>
      </div>
    </div>
  );

  if (mode === "resolving") return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {topBar(<span className="flex items-center gap-1.5 text-yellow-400 text-xs bg-yellow-400/10 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />{resolveStep || "Connecting…"}
      </span>)}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div>
            <p className="text-white font-semibold text-sm">{resolveStep || "Finding best stream…"}</p>
            <p className="text-white/40 text-xs mt-1">Checking all sources simultaneously</p>
          </div>
        </div>
      </div>
      {tvBar}
    </div>
  );

  if (mode === "direct" && activeSrc) return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {topBar(
        <span className="flex items-center gap-1.5 text-green-400 text-xs bg-green-400/10 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Direct · {activeSrc.quality}
        </span>,
        <>
          {sources.map(s => (
            <button key={s.id} onClick={() => setActiveSrc(s)}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${activeSrc?.id === s.id ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>
              {s.quality}
            </button>
          ))}
        </>
      )}
      <div className="flex-1 bg-black">
        <video key={`${activeSrc.id}-${season}-${episode}`} ref={videoRef} src={activeSrc.stream_url}
          autoPlay controls className="w-full h-full object-contain"
          onError={() => resolvedImdbId ? (setEmbedSrcIdx(0), setMode("embed")) : trailerUrl ? setMode("trailer") : setMode("unavailable")}>
          {subtitles.filter(s => s.lan === "en").map(s => (
            <track key={s.id} kind="subtitles" src={s.url} srcLang={s.lan} label={s.lanName} />
          ))}
        </video>
      </div>
      {tvBar}
    </div>
  );

  if (mode === "trailer") return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {topBar(<span className="text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">Preview Only</span>)}
      <div className="flex-1 bg-black flex items-center justify-center">
        <video src={trailerUrl} autoPlay controls className="w-full h-full max-h-full object-contain" onEnded={onClose} />
      </div>
    </div>
  );

  if (mode === "unavailable") return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
      <div className="bg-[#1e1e1e] rounded-xl max-w-md w-full mx-4 p-8 text-center" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-4">🎬</div>
        <h2 className="text-white font-bold text-xl mb-2">{item.title}</h2>
        <p className="text-white/50 text-sm mb-6">Regional release — streaming not yet available.</p>
        <button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold transition-colors">Close</button>
      </div>
    </div>
  );

  const apiType = isTV ? "tv" : "movie";
  const embedId = resolvedImdbId;
  const embedSrc = embedId ? EMBED_SOURCES[embedSrcIdx].build(apiType, embedId, season, episode) : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {topBar(
        <span className="flex items-center gap-1.5 text-blue-400 text-xs bg-blue-400/10 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {EMBED_SOURCES[embedSrcIdx].name}
        </span>,
        <>
          {EMBED_SOURCES.map((s, i) => (
            <button key={i} onClick={() => setEmbedSrcIdx(i)} title={s.name}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${i === embedSrcIdx ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>
              {s.name === "MoviesAPI" ? "MA" : s.name.replace("VidSrc", "VS").replace("2","₂").replace("3","₃")}
            </button>
          ))}
        </>
      )}
      <div className="relative flex-1 bg-black">
        {embedSrc
          ? <iframe key={`${embedId}-${embedSrcIdx}-${season}-${episode}`} ref={iframeRef}
              src={embedSrc} className="w-full h-full border-0" allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media" title={item.title} />
          : <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/40 text-sm">No stream ID available</p>
            </div>}
      </div>
      <div className="bg-[#0a0a0a] border-t border-white/10 px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-white/40 text-xs">Not loading? Switch source →</p>
          <div className="flex gap-1">
            {EMBED_SOURCES.map((s, i) => (
              <button key={i} onClick={() => setEmbedSrcIdx(i)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${i === embedSrcIdx ? "bg-red-600 text-white" : "bg-white/10 text-white/50 hover:bg-white/20"}`}>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {tvBar}
    </div>
  );
}
