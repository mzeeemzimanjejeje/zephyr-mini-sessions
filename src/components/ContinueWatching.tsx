import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { WatchEntry } from "../hooks/useWatchHistory";
import WatchModal from "./WatchModal";
import { allContent } from "../data/content";

interface Props {
  history: WatchEntry[];
  onRemove: (id: number) => void;
}

const ContinueWatching = memo(function ContinueWatching({ history, onRemove }: Props) {
  const [watchingEntry, setWatchingEntry] = useState<WatchEntry | null>(null);

  if (history.length === 0) return null;

  const recent = history.slice(0, 10);
  const watchItem = watchingEntry ? allContent.find(c => c.id === watchingEntry.id) : null;

  return (
    <>
      <section className="px-4 md:px-8 py-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-white text-xl md:text-2xl font-bold">Continue Watching</h2>
          <span className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded font-medium">
            {recent.length} {recent.length === 1 ? "title" : "titles"}
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {recent.map(entry => (
            <div key={`${entry.id}-${entry.season}-${entry.episode}`} className="relative flex-shrink-0 w-44 md:w-52 group">
              <button
                onClick={() => setWatchingEntry(entry)}
                className="w-full text-left"
              >
                <div className="relative rounded-lg overflow-hidden aspect-video bg-[#1a1a1a]">
                  <img
                    src={entry.image}
                    alt={entry.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-red-500 transition-all"
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 fill-white ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                  {/* Episode badge */}
                  {entry.type === "Series" && entry.season && (
                    <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                      S{entry.season}E{entry.episode}
                    </div>
                  )}
                </div>
              </button>

              {/* Remove button */}
              <button
                onClick={() => onRemove(entry.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-black/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                title="Remove from list"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mt-1.5">
                <Link to={`/title/${entry.id}`} className="text-white text-xs font-semibold truncate block hover:text-red-400 transition-colors">
                  {entry.title}
                </Link>
                <p className="text-white/40 text-xs">
                  {entry.progress > 0 ? `${entry.progress}% watched` : "Just started"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {watchingEntry && watchItem && (
        <WatchModal
          item={watchItem}
          initialSeason={watchingEntry.season}
          initialEpisode={watchingEntry.episode}
          onClose={() => setWatchingEntry(null)}
        />
      )}
    </>
  );
});

export default ContinueWatching;
