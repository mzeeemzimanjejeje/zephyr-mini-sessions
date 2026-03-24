import { useState, useCallback } from "react";
import { ContentItem } from "../data/content";

interface Props { item: ContentItem; onClose: () => void; }

function buildSrc(type: string, imdbId: string, sourceIndex: number) {
  const t = type === "Movie" ? "movie" : "tv";
  const sources = [
    `https://vidsrc.xyz/embed/${t}/${imdbId}`,
    `https://vidsrc.to/embed/${t}/${imdbId}`,
    `https://vidsrc.mov/embed/${t}/${imdbId}`,
  ];
  return { url: sources[sourceIndex], total: sources.length };
}

export default function WatchModal({ item, onClose }: Props) {
  const [sourceIndex, setSourceIndex] = useState(0);

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!item.imdbId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
        <div className="bg-[#1e1e1e] rounded-xl max-w-md w-full mx-4 p-8 text-center" onClick={e => e.stopPropagation()}>
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-white font-bold text-xl mb-2">{item.title}</h2>
          <p className="text-white/50 text-sm mb-6">This title is a regional release and is not yet available for streaming. Check back soon.</p>
          <button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold transition-colors">Close</button>
        </div>
      </div>
    );
  }

  const { url, total } = buildSrc(item.type, item.imdbId, sourceIndex);

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
            src={url}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            title={item.title}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Source switcher — subtle dots + label */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="text-white/30 text-xs">If video is unavailable, try:</span>
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setSourceIndex(i)}
              title={`Source ${i + 1}`}
              className={`transition-all duration-200 rounded-full ${
                sourceIndex === i
                  ? "w-5 h-2 bg-red-500"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
