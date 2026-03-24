import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { allContent } from "../data/content";
import { titleDetails, genreInfo } from "../data/cast";
import WatchModal from "../components/WatchModal";
import MovieCard from "../components/MovieCard";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { useRecommendations } from "../hooks/useRecommendations";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activeActor, setActiveActor] = useState<string | null>(null);
  const { history, getProgress } = useWatchHistory();

  const item = allContent.find(c => c.id === Number(id));
  const recommendations = useRecommendations(history, item?.id);

  useEffect(() => { window.scrollTo(0, 0); setShowModal(false); }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white gap-4 pt-16">
        <p className="text-5xl">🎬</p>
        <p className="text-xl font-bold">Title not found</p>
        <Link to="/" className="text-red-500 hover:text-red-400">← Back to Home</Link>
      </div>
    );
  }

  const detail = titleDetails[item.id];
  const cast = detail?.cast ?? [];
  const isTV = item.type === "Series";

  // Find last watched episode for this item
  const lastWatch = history.find(e => e.id === item.id);
  const progress = lastWatch ? lastWatch.progress : 0;

  // Related by genre
  const related = allContent
    .filter(c => c.id !== item.id && c.genres.some(g => item.genres.includes(g)))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 12);

  const actorTitles = activeActor
    ? allContent.filter(c =>
        c.id !== item.id &&
        cast.find(a => a.name === activeActor)?.knownFor.some(t =>
          c.title.toLowerCase().includes(t.toLowerCase()) ||
          t.toLowerCase().includes(c.title.toLowerCase())
        )
      )
    : [];

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Hero */}
      <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover object-top" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/40" />

        <button onClick={() => navigate(-1)} className="absolute top-20 left-6 md:left-16 flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="absolute bottom-8 left-6 md:left-16 max-w-2xl">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-xs font-bold px-2 py-1 rounded ${isTV ? "bg-blue-600" : "bg-red-600"} text-white`}>
              {item.type.toUpperCase()}
            </span>
            <span className="text-white/60 text-sm">{item.country}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/60 text-sm">{item.year}</span>
            {item.rating && (
              <>
                <span className="text-white/40">•</span>
                <span className="text-yellow-400 font-bold text-sm">⭐ {item.rating}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">{item.title}</h1>
          {detail?.director && (
            <p className="text-white/50 text-sm mb-3">by <span className="text-white/80">{detail.director}</span></p>
          )}

          {/* Watch progress bar */}
          {progress > 0 && (
            <div className="mb-3 max-w-xs">
              <div className="flex justify-between text-xs text-white/50 mb-1">
                <span>{lastWatch?.season ? `S${lastWatch.season}E${lastWatch.episode}` : "Watched"}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            {item.imdbId ? (
              <>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-colors text-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  {progress > 0 ? "Continue" : "Watch Now"}
                </button>
                {progress > 0 && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-lg transition-colors text-sm"
                  >
                    Start Over
                  </button>
                )}
              </>
            ) : (
              <span className="text-white/40 text-sm py-3">Streaming not available</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-16 pb-16 -mt-2">

        {/* Overview */}
        {detail?.plot && (
          <section className="mb-8 max-w-3xl">
            <h2 className="text-white font-bold text-lg mb-2">Overview</h2>
            <p className="text-white/70 leading-relaxed">{detail.plot}</p>
          </section>
        )}

        {/* Genre classification */}
        <section className="mb-8">
          <h2 className="text-white font-bold text-lg mb-3">Genres & Classification</h2>
          {detail?.classification && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 max-w-2xl">
              <p className="text-white/80 text-sm leading-relaxed">
                <span className="text-white font-semibold">What is this? </span>
                {detail.classification}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.genres.map(genre => {
              const info = genreInfo[genre];
              return (
                <Link key={genre} to={`/genres/${genre.toLowerCase()}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all hover:scale-105 ${info?.color ?? "bg-white/10 text-white/70 border-white/20"}`}>
                  <span>{info?.icon ?? "🎬"}</span><span>{genre}</span>
                </Link>
              );
            })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {item.genres.map(genre => {
              const info = genreInfo[genre];
              if (!info) return null;
              return (
                <div key={genre} className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                  <span className="text-2xl">{info.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{genre}</p>
                    <p className="text-white/50 text-xs mt-0.5">{info.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mb-10">
            <h2 className="text-white font-bold text-lg mb-1">Cast & Characters</h2>
            <p className="text-white/40 text-sm mb-4">Click on an actor to see their other work</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((member, i) => (
                <button key={i} onClick={() => setActiveActor(activeActor === member.name ? null : member.name)}
                  className={`text-left rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${activeActor === member.name ? "ring-2 ring-red-500 scale-105" : ""}`}>
                  <img src={member.photo} alt={member.name} loading="lazy"
                    className="w-full aspect-square object-cover bg-[#1a1a1a]" />
                  <div className="bg-[#1e1e1e] p-2">
                    <p className="text-white text-xs font-bold truncate">{member.name}</p>
                    <p className="text-white/50 text-xs truncate">as {member.character}</p>
                  </div>
                </button>
              ))}
            </div>
            {activeActor && (
              <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold">{activeActor}</h3>
                    <p className="text-white/50 text-sm">Known for: {cast.find(a => a.name === activeActor)?.knownFor.join(", ")}</p>
                  </div>
                  <button onClick={() => setActiveActor(null)} className="text-white/40 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {actorTitles.length > 0
                  ? <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                      {actorTitles.map(t => <MovieCard key={t.id} item={t} />)}
                    </div>
                  : <p className="text-white/40 text-sm">Other titles by this actor are not currently in our catalog.</p>
                }
              </div>
            )}
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-white font-bold text-lg mb-1">Recommended For You</h2>
            <p className="text-white/40 text-sm mb-4">Based on your watch history</p>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {recommendations.slice(0, 8).map(r => <MovieCard key={r.id} item={r} />)}
            </div>
          </section>
        )}

        {/* More like this */}
        {related.length > 0 && (
          <section>
            <h2 className="text-white font-bold text-lg mb-1">More Like This</h2>
            <p className="text-white/40 text-sm mb-4">Similar genres</p>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {related.map(r => <MovieCard key={r.id} item={r} />)}
            </div>
          </section>
        )}
      </div>

      {showModal && (
        <WatchModal
          item={item}
          initialSeason={lastWatch?.season}
          initialEpisode={lastWatch?.episode}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
