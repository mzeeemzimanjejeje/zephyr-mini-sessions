import { ContentItem } from "../data/content";

interface Props { item: ContentItem; onClose: () => void; }

export default function WatchModal({ item, onClose }: Props) {
  const embedUrl = `https://vidsrc.to/embed/${item.type === "Movie" ? "movie" : "tv"}/${encodeURIComponent(item.title)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
      <div className="w-full max-w-5xl mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-white font-bold text-lg">{item.title}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full rounded-lg"
            allowFullScreen
            allow="autoplay; fullscreen"
            title={item.title}
          />
        </div>
        <p className="text-white/30 text-xs text-center mt-3">
          If the player doesn't load, try refreshing or a different title.
        </p>
      </div>
    </div>
  );
}
