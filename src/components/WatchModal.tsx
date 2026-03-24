import { ContentItem } from "../data/content";

interface Props { item: ContentItem; onClose: () => void; }

export default function WatchModal({ item, onClose }: Props) {
  if (!item.imdbId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
        <div className="bg-[#1e1e1e] rounded-xl max-w-md w-full mx-4 p-8 text-center" onClick={e => e.stopPropagation()}>
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-white font-bold text-xl mb-2">{item.title}</h2>
          <p className="text-white/50 text-sm mb-6">This title is a regional release and is not yet available. Check back soon.</p>
          <button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold transition-colors">Close</button>
        </div>
      </div>
    );
  }

  const t = item.type === "Movie" ? "movie" : "tv";
  const src = `https://vidsrc.mov/embed/${t}/${item.imdbId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
      <div className="w-full max-w-5xl mx-4" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-white font-bold text-lg truncate pr-4">{item.title}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white flex-shrink-0 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={src}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            title={item.title}
            referrerPolicy="origin"
          />
        </div>

      </div>
    </div>
  );
}
