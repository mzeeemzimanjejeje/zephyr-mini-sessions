import { useQuery } from "@tanstack/react-query";
import Hero from "../components/Hero";
import GenreBar from "../components/GenreBar";
import ContentRow from "../components/ContentRow";
import ContinueWatching from "../components/ContinueWatching";
import { hero, trending, hotAndPopular, popularMovies, topSeries } from "../data/content";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { useRecommendations } from "../hooks/useRecommendations";
import { fetchCineverseTrending, cineverseItemToContentItem } from "../lib/cineverse";

export default function Home() {
  const { history, removeEntry } = useWatchHistory();
  const recommendations = useRecommendations(history);

  const { data: liveTrending } = useQuery({
    queryKey: ["cineverseTrending"],
    queryFn: fetchCineverseTrending,
    staleTime: 1000 * 60 * 10,
  });

  const liveTrendingItems = liveTrending
    ?.filter(i => i.subjectType !== 6 && i.hasResource)
    .map(cineverseItemToContentItem) ?? [];

  return (
    <div className="bg-[#141414] min-h-screen">
      <Hero item={hero} />

      <div className="-mt-8 relative z-10">
        <GenreBar />

        <ContinueWatching history={history} onRemove={removeEntry} />

        {history.length > 0 && (
          <ContentRow
            title="Recommended For You"
            subtitle="Based on what you've watched"
            badge="Personalised"
            items={recommendations}
          />
        )}

        {liveTrendingItems.length > 0 && (
          <ContentRow
            title="Live Trending"
            subtitle="Updating in real time"
            badge="🔴 Live"
            items={liveTrendingItems}
          />
        )}

        <ContentRow
          title="Trending Now"
          subtitle="18 titles"
          badge="Updated Daily"
          items={trending}
        />

        <ContentRow
          title="Hot & Popular"
          badge="Most Watched"
          items={hotAndPopular}
        />

        <ContentRow
          title="Popular Movies"
          subtitle="All-time hits & new releases"
          badge="Top Rated"
          items={popularMovies}
        />

        <ContentRow
          title="Top TV Series"
          subtitle="Binge-worthy shows"
          badge="Fan Favourites"
          items={topSeries}
        />
      </div>
    </div>
  );
}
