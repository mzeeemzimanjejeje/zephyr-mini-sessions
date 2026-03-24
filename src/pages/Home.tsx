import Hero from "../components/Hero";
import GenreBar from "../components/GenreBar";
import ContentRow from "../components/ContentRow";
import ContinueWatching from "../components/ContinueWatching";
import { hero, trending, hotAndPopular, popularMovies, topSeries, movies, series } from "../data/content";
import { useWatchHistory } from "../hooks/useWatchHistory";
import { useRecommendations } from "../hooks/useRecommendations";

export default function Home() {
  const { history, removeEntry } = useWatchHistory();
  const recommendations = useRecommendations(history);

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

        <ContentRow
          title="All Movies"
          subtitle="Complete film library"
          items={movies}
        />

        <ContentRow
          title="All Series"
          subtitle="Complete show library"
          items={series}
        />
      </div>
    </div>
  );
}
