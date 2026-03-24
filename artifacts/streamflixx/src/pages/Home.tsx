import { useMemo } from "react";
import Hero from "../components/Hero";
import GenreBar from "../components/GenreBar";
import ContentRow from "../components/ContentRow";
import ContinueWatching from "../components/ContinueWatching";
import { hero, trending, hotAndPopular, popularMovies, topSeries } from "../data/content";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { useRecommendations } from "../hooks/useRecommendations";
import { useCasperBrowse, useCasperTrending } from "../hooks/useCasperContent";

function SkeletonRow() {
  return (
    <div className="px-4 md:px-8 py-4">
      <div className="h-5 w-40 bg-white/10 rounded mb-3 animate-pulse" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="shrink-0 w-36 md:w-44 aspect-[2/3] rounded-lg bg-white/8 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function DynamicRow({ title, subtitle, badge, type, genre, sort }: {
  title: string;
  subtitle?: string;
  badge?: string;
  type?: "movie" | "tv";
  genre?: string;
  sort?: string;
}) {
  const cacheKey = `browse-${type ?? "all"}-${genre ?? "any"}-${sort ?? "trending"}`;
  const { items, loading } = useCasperBrowse({ type, genre, sort, cacheKey });
  if (loading) return <SkeletonRow />;
  if (!items.length) return null;
  return <ContentRow title={title} subtitle={subtitle} badge={badge} items={items} />;
}

function TrendingRow({ title, badge, type }: { title: string; badge?: string; type: "movie" | "tv" }) {
  const { items, loading } = useCasperTrending(type);
  if (loading) return <SkeletonRow />;
  if (!items.length) return null;
  return <ContentRow title={title} badge={badge} items={items} />;
}

export default function Home() {
  const { history, removeEntry } = useWatchHistory();
  const recommendations = useRecommendations(history);

  return (
    <div className="bg-[#141414] min-h-screen">
      <Hero item={hero} />

      <div className="-mt-8 relative z-10">
        <GenreBar />

        <ContinueWatching history={history} onRemove={removeEntry} />

        {history.length > 0 && recommendations.length > 0 && (
          <ContentRow
            title="Recommended For You"
            subtitle="Based on what you've watched"
            badge="Personalised"
            items={recommendations}
          />
        )}

        <TrendingRow title="Trending Now" badge="Updated Daily" type="movie" />

        <DynamicRow
          title="Hot & Popular"
          subtitle="Everyone's watching"
          badge="Most Watched"
          type="tv"
          genre="Drama"
          sort="trending"
        />

        <DynamicRow
          title="Action & Thriller"
          subtitle="Edge-of-your-seat picks"
          badge="High Octane"
          type="movie"
          genre="Action"
        />

        <TrendingRow title="Trending Series" badge="Top Shows" type="tv" />

        <DynamicRow
          title="Popular Movies"
          subtitle="All-time hits & new releases"
          badge="Top Rated"
          type="movie"
          genre="Crime"
        />

        <DynamicRow
          title="Top TV Series"
          subtitle="Binge-worthy shows"
          badge="Fan Favourites"
          type="tv"
          genre="Fantasy"
        />

        <DynamicRow
          title="Comedy & Drama"
          subtitle="Feel-good & emotional"
          type="movie"
          genre="Comedy"
        />

        <DynamicRow
          title="Horror & Sci-Fi"
          subtitle="Dark side of the screen"
          type="movie"
          genre="Horror"
        />

        <ContentRow
          title="Timeless Classics"
          subtitle="All-time favourites in our library"
          items={popularMovies}
        />

        <ContentRow
          title="Award-Winning Series"
          subtitle="Critically acclaimed shows"
          items={topSeries}
        />

        <ContentRow
          title="Our Picks"
          subtitle="Curated just for you"
          items={[...trending, ...hotAndPopular]}
        />
      </div>
    </div>
  );
}
