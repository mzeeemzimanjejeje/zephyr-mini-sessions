import { useState, useCallback, useEffect, useRef } from "react";
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
  { name: "S1", build: (t: string, id: string, s: number, e: number) =>
      t === "tv" ? `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` : `https://vidsrc.xyz/embed/movie/${id}` },
  { name: "S2", build: (t: string, id: string, s: number, e: number) =>
      t === "tv" ? `https://moviesapi.club/tv/${id}-${s}-${e}` : `https://moviesapi.club/movie/${id}` },
  { name: "S3", build: (t: string, id: string, s: number, e: number) =>
      t === "tv" ? `https://vidsrc.to/embed/tv/${id}?season=${s}&episode=${e}` : `https://vidsrc.to/embed/movie/${id}` },
  { name: "S4", build: (t: string, id: string, s: number, e: number) =>
      t === "tv" ? `https://vidsrc.mov/embed/tv/${id}/${s}/${e}` : `https://vidsrc.mov/embed/movie/${id}` },
];

const AUTO_SWITCH_MS = 8000;
const QUALITY_ORDER = ["1080p", "720p", "480p", "360p"];

type PlayerMode = "resolving" | "direct" | "embed" | "trailer" | "unavailable";

function qualitySort(sources: BwmSource[]): BwmSource[] {
  return [...sources].sort(
    (a, b) => QUALITY_ORDER.indexOf(a.quality) - QUALITY_ORDER.indexOf(b.quality),
  );
}

export default function WatchModal({ item, onClose, initialSeason, initialEpisode, trailerUrl, totalSeasons }: Props) {
  const isTV = item.type === "Series";
  const numSeasons = totalSeasons ?? (isTV ? 8 : 0);
  const [season, setSeason] = useState(initialSeason ?? 1);
  const [episode, setEpisode] = useState(initialEpisode ?? 1);

  const [mode, setMode] = useState<PlayerMode>("resolving");
  const [sources, setSources] = useState<BwmSource[]>([]);
  const [subtitles, setSubtitles] = useState<BwmSubtitle[]>([]);
  const [activeSrc, setActiveSrc] = useState<BwmSource | null>(null);
  const [resolvedImdbId, setResolvedImdbId] = useState<string | undefined>(item.imdbId);

  const [embedSrcIdx, setEmbedSrcIdx] = useState(0);
  const [embedPhase, setEmbedPhase] = useState<"loading" | "playing" | "switching" | "failed">("loading");
  const [countdown, setCountdown] = useState(AUTO_SWITCH_MS / 1000);
  const playingRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { recordWatch, updateProgress } = useWatchHistory();
  const startTimeRef = useRef(Date.now());
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearAll() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }

  const resolve = useCallback(async () => {
    setMode("resolving");
    setSources([]);
    setActiveSrc(null);

    let imdbId = resolvedImdbId;

    if (item.subjectId) {
      const result = await bwmSources(
        item.subjectId,
        isTV ? season : undefined,
        isTV ? episode : undefined,
      );
      if (result && result.results.length > 0) {
        const sorted = qualitySort(result.results);
        setSources(sorted);
        setSubtitles(result.subtitles);
        setActiveSrc(sorted[0]);
        setMode("direct");
        return;
      }
    }

    if (!imdbId) {
      const type = isTV ? "tvSeries" : "movie";
      imdbId = (await imdbSearch(item.title, type)) ?? undefined;
      if (imdbId) setResolvedImdbId(imdbId);
    }

    if (imdbId) {
      setEmbedPhase("loading");
      setEmbedSrcIdx(0);
      playingRef.current = false;
      setMode("embed");
      return;
    }

    if (trailerUrl) {
      setMode("trailer");
      return;
    }

    setMode("unavailable");
  }, [item.subjectId, item.title, isTV, season, episode, resolvedImdbId, trailerUrl]);

  useEffect(() => {
    resolve();
  }, [season, episode]);

  useEffect(() => {
    recordWatch(item, isTV ? season : undefined, isTV ? episode : undefined);
    startTimeRef.current = Date.now();
    const AVG_DURATION = item.type === "Movie" ? 5400 : 2700;
    progressIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const pct = Math.min(99, (elapsed / AVG_DURATION) * 100);
      updateProgress(item.id, pct, isTV ? season : undefined, isTV ? episode : undefined);
    }, 10000);
    return () => { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); };
  }, [item.id, season, episode]);

  useEffect(() => {
    if (mode !== "embed") return;
    playingRef.current = false;
    setEmbedPhase("loading");
    setCountdown(AUTO_SWITCH_MS / 1000);
    clearAll();

    const tick = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    timersRef.current.push(tick as unknown as ReturnType<typeof setTimeout>);

    const auto = setTimeout(() => {
      if (!playingRef.current) {
        const next = embedSrcIdx + 1;
        if (next >= EMBED_SOURCES.length) {
          if (trailerUrl) setMode("trailer");
          else setEmbedPhase("failed");
          return;
        }
        setEmbedPhase("switching");
        const t = setTimeout(() => {
          setEmbedSrcIdx(next);
          setEmbedPhase("loading");
          setCountdown(AUTO_SWITCH_MS / 1000);
        }, 700);
        timersRef.current.push(t);
      }
    }, AUTO_SWITCH_MS);
    timersRef.current.push(auto);

    return clearAll;
  }, [embedSrcIdx, mode]);

  useEffect(() => {
    if (mode !== "embed") return;
    const onBlur = () => {
      if (document.activeElement === iframeRef.current && !playingRef.current) {
        playingRef.current = true;
        clearAll();
        setEmbedPhase("playing");
      }
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [mode]);

  const goEpisode = useCallback((s: number, e: number) => {
    setSeason(s); setEpisode(e);
  }, []);

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
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded transition-colors">← Prev</button>
          <button onClick={() => goEpisode(season, episode + 1)}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors">Next →</button>
        </div>
      </div>
    </div>
  );

  if (mode === "resolving") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex items-center justify-between px-4 py-3 bg-black/90 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-white font-bold text-sm md:text-base truncate">{item.title}</h2>
          </div>
          <span className="flex items-center gap-1.5 text-yellow-400 text-xs bg-yellow-400/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" /> Finding best stream…
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/50 text-sm">Connecting to stream sources…</p>
          </div>
        </div>
        {tvBar}
      </div>
    );
  }

  if (mode === "direct" && activeSrc) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex items-center justify-between px-4 py-3 bg-black/90 flex-shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-sm md:text-base truncate">{item.title}</h2>
              {isTV && <p className="text-white/50 text-xs">Season {season} · Episode {episode}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="flex items-center gap-1.5 text-green-400 text-xs bg-green-400/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Direct Stream
            </span>
            <div className="flex gap-1">
              {sources.map(s => (
                <button key={s.id} onClick={() => setActiveSrc(s)}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${activeSrc?.id === s.id ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}>
                  {s.quality}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-black relative">
          <video
            key={`${activeSrc.id}-${season}-${episode}`}
            ref={videoRef}
            src={activeSrc.stream_url}
            autoPlay
            controls
            className="w-full h-full object-contain"
            crossOrigin="anonymous"
            onError={() => {
              if (resolvedImdbId) {
                setEmbedSrcIdx(0);
                setEmbedPhase("loading");
                setMode("embed");
              } else if (trailerUrl) {
                setMode("trailer");
              } else {
                setMode("unavailable");
              }
            }}
          >
            {subtitles.filter(s => s.lan === "en").map(s => (
              <track key={s.id} kind="subtitles" src={s.url} srcLang={s.lan} label={s.lanName} />
            ))}
          </video>
        </div>
        {tvBar}
      </div>
    );
  }

  if (mode === "trailer") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex items-center justify-between px-4 py-3 bg-black/90 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-sm md:text-base truncate">{item.title}</h2>
              <p className="text-white/50 text-xs">Official Trailer</p>
            </div>
          </div>
          <span className="text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">Preview Only</span>
        </div>
        <div className="flex-1 bg-black flex items-center justify-center">
          <video src={trailerUrl} autoPlay controls className="w-full h-full max-h-full object-contain" onEnded={onClose} />
        </div>
      </div>
    );
  }

  if (mode === "unavailable") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
        <div className="bg-[#1e1e1e] rounded-xl max-w-md w-full mx-4 p-8 text-center" onClick={e => e.stopPropagation()}>
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-white font-bold text-xl mb-2">{item.title}</h2>
          <p className="text-white/50 text-sm mb-6">Regional release — streaming not yet available.</p>
          <button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold transition-colors">Close</button>
        </div>
      </div>
    );
  }

  const apiType = isTV ? "tv" : "movie";
  const embedId = resolvedImdbId;
  const embedSrc = embedId ? EMBED_SOURCES[embedSrcIdx].build(apiType, embedId, season, episode) : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-3 bg-black/90 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="min-w-0">
            <h2 className="text-white font-bold text-sm md:text-base truncate">{item.title}</h2>
            {isTV && <p className="text-white/50 text-xs">Season {season} · Episode {episode}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {embedPhase === "loading" && (
            <span className="flex items-center gap-1.5 text-yellow-400 text-xs bg-yellow-400/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Finding stream {countdown}s
            </span>
          )}
          {embedPhase === "switching" && (
            <span className="flex items-center gap-1.5 text-blue-400 text-xs bg-blue-400/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Trying next…
            </span>
          )}
          {embedPhase === "playing" && (
            <span className="flex items-center gap-1.5 text-green-400 text-xs bg-green-400/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> {EMBED_SOURCES[embedSrcIdx].name}
            </span>
          )}
          <div className="flex gap-1 ml-2">
            {EMBED_SOURCES.map((s, i) => (
              <button key={i}
                onClick={() => { setEmbedSrcIdx(i); setEmbedPhase("loading"); setCountdown(AUTO_SWITCH_MS / 1000); playingRef.current = false; }}
                title={`Force ${s.name}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i < embedSrcIdx ? "bg-white/20" : i === embedSrcIdx ? "bg-red-500 w-3" : "bg-white/10 hover:bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex-1 bg-black">
        {embedPhase === "switching" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50 text-sm">Switching source…</p>
          </div>
        )}
        {embedPhase === "failed" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black px-6 text-center">
            <p className="text-4xl">😔</p>
            <p className="text-white font-bold text-lg">Stream not found</p>
            <p className="text-white/40 text-sm max-w-xs">All sources were tried. This title may not be available yet.</p>
            {trailerUrl && (
              <button onClick={() => setMode("trailer")}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                Watch Trailer Instead
              </button>
            )}
            <button onClick={() => { setEmbedSrcIdx(0); setEmbedPhase("loading"); setCountdown(AUTO_SWITCH_MS / 1000); playingRef.current = false; }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              Try again
            </button>
          </div>
        )}
        {embedSrc && (
          <iframe
            key={`${embedId}-${embedSrcIdx}-${season}-${episode}`}
            ref={iframeRef}
            src={embedSrc}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            title={item.title}
          />
        )}
      </div>

      {tvBar}
    </div>
  );
}
