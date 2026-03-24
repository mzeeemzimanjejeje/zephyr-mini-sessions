import { useState } from "react";
import { ContentItem } from "../data/content";

interface Props { item: ContentItem; onClose: () => void; }

function getUrls(imdbId: string, type: string) {
  const t = type === "Movie" ? "movie" : "tv";
  return [
    { label: "Server 1", src: `https://vidsrc.mov/embed/${t}/${imdbId}` },
    { label: "Server 2", src: `https://vidsrc.me/embed/${t}?imdb=${imdbId}` },
    { label: "Server 3", src: `https://vidsrc.cc/v2/embed/${t}/${imdbId}` },
    { label: "Server 4", src: `https://www.2embed.cc/${type === "Movie" ? "embed" : "embedtv"}/${imdbId}` },
  ];
}

export default function WatchModal({ item, onClose }: Props) {
  const [server, setServer] = useState(0);

  if (!item.imdbId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
        <div className="bg-[#1e1e1e] rounded-xl max-w-md w-full mx-4 p-8 text-center" onClick={e => e.stopPropagation()}>
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-white font-bold text-xl mb-2">{item.title}</h2>
          <p className="text-white/50 text-sm mb-6">This title is a regional release and is not yet available on our streaming servers. Check back soon.</p>
          <button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-semibold transition-colors">Close</button>
        </div>
      </div>
    );
  }

  const servers = getUrls(item.imdbId, item.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
      <div className="w-full max-w-5xl mx-4" onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded ${item.type === "Series" ? "bg-blue-600" : "bg-red-600"} text-white`}>
              {item.type.toUpperCase()}
            </span>
            <h2 className="text-white font-bold text-base truncate">{item.title}</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white flex-shrink-0 ml-4 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
          <iframe
            key={`${item.imdbId}-${server}`}
            src={servers[server].src}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            title={item.title}
            referrerPolicy="origin"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation-by-user-activation"
          />
        </div>

        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-xs mr-1">Servers:</span>
            {servers.map((s, i) => (
              <button
                key={i}
                onClick={() => setServer(i)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  server === i
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-white/25 text-xs hidden sm:block">Switch server if video doesn't load</p>
        </div>

      </div>
    </div>
  );
}
