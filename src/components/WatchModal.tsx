import { useState, useCallback, useEffect } from "react";
import { ContentItem } from "../data/content";

interface Props { item: ContentItem; onClose: () => void; }

interface Source { label: string; build: (type: string, id: string) => string; }

const SOURCES: Source[] = [
  {
    label: "Source 1",
    build: (t, id) => `https://vidsrc.xyz/embed/${t}/${id}`,
  },
  {
    label: "Source 2",
    build: (t, id) => `https://moviesapi.club/${t}/${id}`,
  },
  {
    label: "Source 3",
    build: (t, id) => `https://vidsrc.to/embed/${t}/${id}`,
  },
  {
    label: "Source 4",
    build: (t, id) => `https://vidsrc.mov/embed/${t}/${id}`,
  },
];

export default function WatchModal({ item, onClose }: Props) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // After 6 seconds, show the "try another source" hint
  useEffect(() => {
    setShowHint(false);
    const timer = setTimeout(() => setShowHint(true), 6000);
    return () => clearTimeout(timer);
  }, [sourceIndex, item.id]);

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const switchSource = useCallback((i: number) => {
    setSourceIndex(i);
    setShowHint(false);
  }, []);

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
  const src = SOURCES[sourceIndex].build(apiType, item.imdbId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={handleBackdrop}>
      <div className="w-full max-w-5xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-white font-bold text-lg truncate pr-4">{item.title}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white flex-shrink-0 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Player */}
        <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
          <iframe
            key={`${item.imdbId}-${sourceIndex}`}
            src={src}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            title={item.title}
          />
        </div>

        {/* "Video unavailable?" hint — appears after 6s */}
        {showHint && (
          <div className="flex items-center justify-center gap-2 mt-2 animate-fade-in">
            <span className="text-yellow-400 text-xs">⚠ Video not loading?</span>
            {sourceIndex < SOURCES.length - 1 && (
              <button
                onClick={() => switchSource(sourceIndex + 1)}
                className="text-xs bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 border border-yellow-400/30 px-3 py-1 rounded-full transition-colors"
              >
                Try {SOURCES[sourceIndex + 1].label} →
              </button>
            )}
          </div>
        )}

        {/* Source selector */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {SOURCES.map((s, i) => (
            <button
              key={i}
              onClick={() => switchSource(i)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150 ${
                sourceIndex === i
                  ? "bg-red-600 border-red-500 text-white"
                  : "bg-white/5 border-white/20 text-white/50 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-center text-white/30 text-xs mt-2">
          If video shows "unavailable", tap another source above
        </p>

      </div>
    </div>
  );
}
