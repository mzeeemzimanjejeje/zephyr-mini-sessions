import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { allContent, imdbByTitle } from "../data/content";
import { genreInfo } from "../data/cast";
import { casperDetail, casperToContentItem, type CasperItem } from "../api/casper";
import { prefetchItem } from "../api/prefetch";
import WatchModal from "../components/WatchModal";
import MovieCard from "../components/MovieCard";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { useRecommendations } from "../hooks/useRecommendations";
import type { ContentItem } from "../data/content";

let nextCasperId = 300000;

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [casperData, setCasperData] = useState<CasperItem | null>(null);
  const [casperLoading, setCasperLoading] = useState(false);
  const { history } = useWatchHistory();

  // Route /title/c-:id → isCasper=true, id param is the raw subjectId
  // Route /title/:id   → isCasper=false, id param is a numeric string
  const isCasper = pathname.includes("/title/c-");
  const subjectId = isCasper ? id ?? null : null;
  const numericId = isCasper ? null : Number(id);

  const staticItem = numericId !== null ? allContent.find(c => c.id === numericId) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowModal(false);
    setCasperData(null);
    if (subjectId) {
      setCasperLoading(true);
      casperDetail(subjectId)
        .then(d => {
          setCasperData(d);
          if (d) {
            const key = d.title.toLowerCase().replace(/[^a-z0-9]/g, "");
            const imdbId = imdbByTitle.get(key);
            prefetchItem(casperToContentItem(d, imdbId));
          }
        })
        .finally(() => setCasperLoading(false));
    } else if (staticItem) {
      prefetchItem(staticItem);
      if (staticItem.subjectId) {
        setCasperLoading(true);
        casperDetail(staticItem.subjectId)
          .then(d => setCasperData(d))
          .finally(() => setCasperLoading(false));
      }
    }
  }, [id]);

  const recommendations = useRecommendations(history, staticItem?.id);

  if (!staticItem && !subjectId) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white gap-4 pt-16">
        <p className="text-5xl">🎬</p>
        <p className="text-xl font-bold">Title not found</p>
        <Link to="/" className="text-red-500 hover:text-red-400">← Back to Home</Link>
      </div>
    );
  }

  let item: ContentItem;
  if (staticItem) {
    item = staticItem;
    if (casperData && !item.description) {
      item = { ...item, description: casperData.description || item.description };
    }
  } else if (casperData) {
    const key = casperData.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const imdbId = imdbByTitle.get(key);
    item = casperToContentItem(casperData, imdbId);
    item.id = nextCasperId;
  } else if (casperLoading) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white gap-4 pt-16">
        <p className="text-5xl">😔</p>
        <p className="text-xl font-bold">Could not load title</p>
        <Link to="/" className="text-red-500 hover:text-red-400">← Back to Home</Link>
      </div>
    );
  }

  const castFromCasper = casperData?.staffList?.map(s => ({
    name: s.name,
    character: s.character,
    photo: s.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=1a1a1a&color=fff&size=200`,
  })) ?? item.cast ?? [];

  const description = casperData?.description || item.description;
  const isTV = item.type === "Series";
  const lastWatch = history.find(e => e.id === item.id);
  const progress = lastWatch ? lastWatch.progress : 0;
  const trailerUrl = casperData?.trailer?.videoAddress?.url || item.trailerUrl;
  const totalSeasons = casperData?.totalSeasons ?? item.totalSeasons;

  const related = allContent
    .filter(c => c.id !== item.id && c.genres.some(g => item.genres.includes(g)))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 12);

  const canWatch = !!item.imdbId || !!trailerUrl;

  return (
    <div className="min-h-screen bg-[#141414]">
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
            {item.country && <span className="text-white/60 text-sm">{item.country}</span>}
            {item.year > 0 && <><span className="text-white/40">•</span><span className="text-white/60 text-sm">{item.year}</span></>}
            {item.rating && (
              <>
                <span className="text-white/40">•</span>
                <span className="text-yellow-400 font-bold text-sm">⭐ {item.rating}</span>
              </>
            )}
            {isTV && totalSeasons && (
              <>
                <span className="text-white/40">•</span>
                <span className="text-white/50 text-sm">{totalSeasons} Season{totalSeasons > 1 ? "s" : ""}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">{item.title}</h1>

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
            {canWatch ? (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg transition-colors text-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                {progress > 0 ? "Continue" : "Watch Now"}
              </button>
            ) : (
              <span className="text-white/40 text-sm py-3">Streaming not available</span>
            )}
            {trailerUrl && !item.imdbId && (
              <span className="text-white/40 text-xs py-3.5">Trailer available</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-16 pb-16 -mt-2">

        {description && (
          <section className="mb-8 max-w-3xl">
            <h2 className="text-white font-bold text-lg mb-2">Overview</h2>
            <p className="text-white/70 leading-relaxed">{description}</p>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-white font-bold text-lg mb-3">Genres</h2>
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
        </section>

        {castFromCasper.length > 0 && (
          <section className="mb-10">
            <h2 className="text-white font-bold text-lg mb-1">Cast & Characters</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {castFromCasper.slice(0, 12).map((member, i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <img src={member.photo} alt={member.name} loading="lazy"
                    className="w-full aspect-square object-cover bg-[#1a1a1a]" />
                  <div className="bg-[#1e1e1e] p-2">
                    <p className="text-white text-xs font-bold truncate">{member.name}</p>
                    <p className="text-white/50 text-xs truncate">as {member.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {recommendations.length > 0 && (
          <section className="mb-8">
            <h2 className="text-white font-bold text-lg mb-1">Recommended For You</h2>
            <p className="text-white/40 text-sm mb-4">Based on your watch history</p>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {recommendations.slice(0, 8).map(r => <MovieCard key={r.id} item={r} />)}
            </div>
          </section>
        )}

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
          trailerUrl={trailerUrl}
          initialSeason={lastWatch?.season}
          initialEpisode={lastWatch?.episode}
          totalSeasons={totalSeasons}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
