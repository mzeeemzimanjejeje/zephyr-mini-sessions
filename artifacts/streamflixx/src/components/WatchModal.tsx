import { useState, useCallback, useEffect, useRef } from "react";
import { ContentItem } from "../data/content";
import { useWatchHistory } from "../hooks/useWatchHistory";

interface Props {
  item: ContentItem;
  onClose: () => void;
  initialSeason?: number;
  initialEpisode?: number;
  trailerUrl?: string;
  totalSeasons?: number;
}

const SOURCES = [
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

export default function WatchModal({ item, onClose, initialSeason, initialEpisode, trailerUrl, totalSeasons }: Props) {
  const isTV = item.type === "Series";
  const numSeasons = totalSeasons ?? (isTV ? 8 : 0);
  const [season, setSeason] = useState(initialSeason ?? 1);
  const [episode, setEpisode] = useState(initialEpisode ?? 1);
  const [srcIdx, setSrcIdx] = useState(0);
  const [phase, setPhase] = useState<"loading" | "playing" | "switching" | "failed">("loading");
  const [countdown, setCountdown] = useState(AUTO_SWITCH_MS / 1000);
  const playingRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { recordWatch, updateProgress } = useWatchHistory();
  const startTimeRef = useRef(Date.now());
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const useTrailer = !item.imdbId && !!trailerUrl;

  function clearAll() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }

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
    if (useTrailer) return;
    playingRef.current = false;
    setPhase("loading");
    setCountdown(AUTO_SWITCH_MS / 1000);
    clearAll();

    const tick = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    timersRef.current.push(tick as unknown as ReturnType<typeof setTimeout>);

    const auto = setTimeout(() => {
      if (!playingRef.current) {
        const next = srcIdx + 1;
        if (next >= SOURCES.length) { setPhase("failed"); return; }
        setPhase("switching");
        const t = setTimeout(() => {
          setSrcIdx(next);
          setPhase("loading");
          setCountdown(AUTO_SWITCH_MS / 1000);
        }, 700);
        timersRef.current.push(t);
      }
    }, AUTO_SWITCH_MS);
    timersRef.current.push(auto);

    return clearAll;
  }, [srcIdx, season, episode, useTrailer]);

  useEffect(() => {
    if (useTrailer) return;
    const onBlur = () => {
      if (document.activeElement === iframeRef.current && !playingRef.current) {
        playingRef.current = true;
        clearAll();
        setPhase("playing");
      }
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [useTrailer]);

  const goEpisode = useCallback((s: number, e: number) => {
    setSeason(s); setEpisode(e); setSrcIdx(0);
    setPhase("loading"); setCountdown(AUTO_SWITCH_MS / 1000);
    playingRef.current = false;
  }, []);

  const retry = useCallback(() => {
    setSrcIdx(0); setPhase("loading"); setCountdown(AUTO_SWITCH_MS / 1000);
    playingRef.current = false;
  }, []);

  if (!item.imdbId && !trailerUrl) {
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

  if (useTrailer) {
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
          <video
            src={trailerUrl}
            autoPlay
            controls
            className="w-full h-full max-h-full object-contain"
            onEnded={onClose}
          />
        </div>
      </div>
    );
  }

  const apiType = isTV ? "tv" : "movie";
  const src = SOURCES[srcIdx].build(apiType, item.imdbId!, season, episode);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
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
          {phase === "loading" && (
            <span className="flex items-center gap-1.5 text-yellow-400 text-xs bg-yellow-400/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Finding stream {countdown}s
            </span>
          )}
          {phase === "switching" && (
            <span className="flex items-center gap-1.5 text-blue-400 text-xs bg-blue-400/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Trying next…
            </span>
          )}
          {phase === "playing" && (
            <span className="flex items-center gap-1.5 text-green-400 text-xs bg-green-400/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {SOURCES[srcIdx].name}
            </span>
          )}
          <div className="flex gap-1 ml-2">
            {SOURCES.map((s, i) => (
              <button
                key={i}
                onClick={() => { setSrcIdx(i); setPhase("loading"); setCountdown(AUTO_SWITCH_MS / 1000); playingRef.current = false; }}
                title={`Force ${s.name}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i < srcIdx ? "bg-white/20" : i === srcIdx ? "bg-red-500 w-3" : "bg-white/10 hover:bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex-1 bg-black">
        {phase === "switching" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50 text-sm">Switching source…</p>
          </div>
        )}
        {phase === "failed" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black px-6 text-center">
            <p className="text-4xl">😔</p>
            <p className="text-white font-bold text-lg">Stream not found</p>
            <p className="text-white/40 text-sm max-w-xs">All sources were tried. This title may not be available yet.</p>
            {trailerUrl && (
              <button
                onClick={() => { /* switch to trailer mode via re-render trick */ onClose(); }}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Watch Trailer Instead
              </button>
            )}
            <button onClick={retry} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              Try again
            </button>
          </div>
        )}
        <iframe
          key={`${item.imdbId}-${srcIdx}-${season}-${episode}`}
          ref={iframeRef}
          src={src}
          className="w-full h-full border-0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          title={item.title}
        />
      </div>

      {isTV && (
        <div className="bg-[#0a0a0a] border-t border-white/10 px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-white/50 text-xs font-medium">Season</span>
              <div className="flex gap-1">
                {Array.from({ length: Math.max(1, numSeasons) }, (_, i) => i + 1).map(s => (
                  <button
                    key={s}
                    onClick={() => goEpisode(s, 1)}
                    className={`w-7 h-7 rounded text-xs font-bold transition-all ${season === s ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-px h-6 bg-white/10 flex-shrink-0" />

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-white/50 text-xs font-medium">Episode</span>
              <div className="flex gap-1">
                {Array.from({ length: 20 }, (_, i) => i + 1).map(e => (
                  <button
                    key={e}
                    onClick={() => goEpisode(season, e)}
                    className={`w-7 h-7 rounded text-xs font-bold transition-all flex-shrink-0 ${episode === e ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
              <button
                onClick={() => episode > 1 ? goEpisode(season, episode - 1) : season > 1 && goEpisode(season - 1, 1)}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => goEpisode(season, episode + 1)}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
