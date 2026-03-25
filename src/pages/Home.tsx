import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import Hero from "../components/Hero";
import GenreBar from "../components/GenreBar";
import ContentRow from "../components/ContentRow";
import ContinueWatching from "../components/ContinueWatching";
import { hero, hotAndPopular, popularMovies, topSeries } from "../data/content";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { useRecommendations } from "../hooks/useRecommendations";
import {
  fetchCineverseTrending,
  fetchCineverseHomepage,
  cineverseItemToContentItem,
} from "../lib/cineverse";
import WatchModal from "../components/WatchModal";
import { ContentItem } from "../data/content";

export default function Home() {
  const { history, removeEntry } = useWatchHistory();
  const recommendations = useRecommendations(history);
  const [watchItem, setWatchItem] = useState<ContentItem | null>(null);

  const { data: homepage } = useQuery({
    queryKey: ["cineverseHomepage"],
    queryFn: fetchCineverseHomepage,
    staleTime: 1000 * 60 * 15,
  });

  const { data: liveTrending } = useQuery({
    queryKey: ["cineverseTrending"],
    queryFn: () => fetchCineverseTrending(),
    staleTime: 1000 * 60 * 10,
  });

  const liveTrendingItems = useMemo(
    () => liveTrending?.filter(i => i.subjectType !== 6 && i.hasResource).map(cineverseItemToContentItem) ?? [],
    [liveTrending]
  );

  const bannerSubjects = useMemo(
    () => homepage?.bannerItems?.filter(b => b.subject?.hasResource).map(b => b.subject) ?? [],
    [homepage]
  );

  const heroSubject = useMemo(
    () => bannerSubjects.length > 0 ? bannerSubjects[0] : null,
    [bannerSubjects]
  );

  const heroContentItem = useMemo(
    () => heroSubject ? cineverseItemToContentItem(heroSubject) : null,
    [heroSubject]
  );

  const homeSections = useMemo(
    () => homepage?.sections?.filter(s => s.subjects.length >= 4).slice(0, 8) ?? [],
    [homepage]
  );

  return (
    <div className="bg-[#141414] min-h-screen">
      {heroContentItem && heroSubject ? (
        <ApiHero item={heroContentItem} subject={heroSubject} onWatch={setWatchItem} />
      ) : (
        <Hero item={hero} />
      )}

      <div className="-mt-8 relative z-10">
        <GenreBar />

        <ContinueWatching history={history} onRemove={removeEntry} />

        {history.length > 0 && (
          <ContentRow
            title="Recommended For You"
            subtitle="Based on what you've watched"
            badge="For You"
            items={recommendations}
          />
        )}

        {liveTrendingItems.length > 0 && (
          <ContentRow
            title="Trending Now"
            subtitle="Live from Cineverse"
            badge="🔴 Live"
            items={liveTrendingItems}
          />
        )}

        {homeSections.map(section => (
          <ContentRow
            key={section.title}
            title={section.title.replace(/[🔥💓📕🤼]/g, "").trim()}
            items={section.subjects.map(cineverseItemToContentItem)}
          />
        ))}

        <ContentRow title="Hot & Popular" badge="Most Watched" items={hotAndPopular} />
        <ContentRow title="Popular Movies" subtitle="All-time hits & new releases" badge="Top Rated" items={popularMovies} />
        <ContentRow title="Top TV Series" subtitle="Binge-worthy shows" badge="Fan Favourites" items={topSeries} />
      </div>

      {watchItem && <WatchModal item={watchItem} onClose={() => setWatchItem(null)} />}
    </div>
  );
}

interface ApiHeroProps {
  item: ContentItem;
  subject: import("../lib/cineverse").CineverseItem;
  onWatch: (item: ContentItem) => void;
}

function ApiHero({ item, subject, onWatch }: ApiHeroProps) {
  const bgImage = subject.stills?.url || subject.cover?.url || item.image;
  const durationMin = subject.duration ? Math.round(subject.duration / 60) : null;

  return (
    <div className="relative w-full h-[80vh] min-h-[500px] overflow-hidden">
      <img src={bgImage} alt={item.title}
        className="absolute inset-0 w-full h-full object-cover object-center" loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />

      <div className="absolute bottom-16 left-6 md:left-16 max-w-2xl">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs font-bold px-2 py-1 rounded text-white ${item.type === "Series" ? "bg-blue-600" : "bg-red-600"}`}>
            {item.type.toUpperCase()}
          </span>
          {item.rating && <span className="text-yellow-400 font-bold text-sm">⭐ {item.rating}</span>}
          {durationMin && <span className="text-white/50 text-sm">{durationMin} min</span>}
          <span className="text-xs bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded font-medium">
            Direct Stream
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 leading-tight drop-shadow-lg">{item.title}</h1>

        {subject.description && (
          <p className="text-white/70 text-sm leading-relaxed mb-4 max-w-xl line-clamp-3">{subject.description}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => onWatch(item)}
            className="flex items-center gap-2 bg-white hover:bg-white/90 text-black font-bold px-8 py-3.5 rounded-lg transition-all text-sm shadow-xl"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            Watch Now
          </button>
          <a href={`/title/${item.subjectId}`}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3.5 rounded-lg transition-all text-sm backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </a>
        </div>
      </div>
    </div>
  );
}
