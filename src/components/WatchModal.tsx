import { useState, useCallback, useEffect, useRef } from "react";
import { ContentItem } from "../data/content";

interface Props { item: ContentItem; onClose: () => void; }

const SOURCES = [
  (t: string, id: string) => `https://vidsrc.xyz/embed/${t}/${id}`,
  (t: string, id: string) => `https://moviesapi.club/${t}/${id}`,
  (t: string, id: string) => `https://vidsrc.to/embed/${t}/${id}`,
  (t: string, id: string) => `https://vidsrc.mov/embed/${t}/${id}`,
];

const SOURCE_LABELS = ["vidsrc.xyz", "moviesapi", "vidsrc.to", "vidsrc.mov"];

// How long to wait before auto-trying the next source (ms)
const AUTO_SWITCH_DELAY = 7000;

export default function WatchModal({ item, onClose }: Props) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "playing" | "trying-next" | "all-failed">("loading");
  const [countdown, setCountdown] = useState(AUTO_SWITCH_DELAY / 1000);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  const tryNextSource = useCallback((currentIndex: number) => {
    const next = currentIndex + 1;
    if (next >= SOURCES.length) {
      setStatus("all-failed");
      return;
    }
    setStatus("trying-next");
    setTimeout(() => {
      setSourceIndex(next);
      setStatus("loading");
      setCountdown(AUTO_SWITCH_DELAY / 1000);
      playingRef.current = false;
    }, 800);
  }, []);

  // When source changes, start the auto-switch countdown
  useEffect(() => {
    playingRef.current = false;
    setStatus("loading");
    setCountdown(AUTO_SWITCH_DELAY / 1000);
    clearTimers();

    // Tick countdown every second
    countdownRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    // Auto-switch after delay if user hasn't interacted
    timerRef.current = setTimeout(() => {
      if (!playingRef.current) {
        tryNextSource(sourceIndex);
      }
    }, AUTO_SWITCH_DELAY);

    return clearTimers;
  }, [sourceIndex, item.id]);

  // Detect user clicking inside the iframe = video is playing
  useEffect(() => {
    const detectPlay = () => {
      if (document.activeElement === iframeRef.current && !playingRef.current) {
        playingRef.current = true;
        clearTimers();
        setStatus("playing");
      }
    };
    window.addEventListener("blur", detectPlay);
    return () => window.removeEventListener("blur", detectPlay);
  }, []);

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!item.imdbId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
        <div className="bg-[#1e1e1e] rounded-xl max-w-md w-full mx-4 p-8 text-center" onClick={e => e.stopPropagation()}>
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-white font-bold text-xl mb-2">{item.title}</h2>
          <p className="text-white/50 text-sm mb-6">
            This is a regional release and is not yet available for streaming. Check back soon.
          </p>
          <button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  const apiType = item.type === "Movie" ? "movie" : "tv";
  const src = SOURCES[sourceIndex](apiType, item.imdbId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={handleBackdrop}>
      <div className="w-full max-w-5xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-white font-bold text-lg truncate">{item.title}</h2>
            {/* Status indicator */}
            {status === "loading" && (
              <span className="text-white/40 text-xs whitespace-nowrap flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                Finding stream… {countdown}s
              </span>
            )}
            {status === "trying-next" && (
              <span className="text-white/40 text-xs whitespace-nowrap flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Trying next source…
              </span>
            )}
            {status === "playing" && (
              <span className="text-green-400 text-xs whitespace-nowrap flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                {SOURCE_LABELS[sourceIndex]}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white flex-shrink-0 ml-4 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Player */}
        <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
          {status === "trying-next" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 gap-3">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-white/60 text-sm">Switching to next source…</p>
            </div>
          )}
          {status === "all-failed" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 gap-4">
              <p className="text-4xl">😔</p>
              <p className="text-white font-semibold">No stream found for this title</p>
              <p className="text-white/40 text-sm text-center max-w-xs">
                All sources were tried automatically. This title may not be available yet.
              </p>
              <button
                onClick={() => { setSourceIndex(0); setStatus("loading"); setCountdown(AUTO_SWITCH_DELAY / 1000); playingRef.current = false; }}
                className="mt-2 bg-white/10 hover:bg-white/20 text-white text-sm px-5 py-2 rounded-lg transition-colors"
              >
                Try again from Source 1
              </button>
            </div>
          )}
          <iframe
            key={`${item.imdbId}-${sourceIndex}`}
            ref={iframeRef}
            src={src}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            title={item.title}
          />
        </div>

        {/* Source progress dots */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {SOURCES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < sourceIndex
                  ? "w-2 h-2 bg-white/20"
                  : i === sourceIndex
                  ? "w-4 h-2 bg-red-500"
                  : "w-2 h-2 bg-white/10"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
