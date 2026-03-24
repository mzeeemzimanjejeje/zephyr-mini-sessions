import Hero from "../components/Hero";
import GenreBar from "../components/GenreBar";
import ContentRow from "../components/ContentRow";
import { hero, trending, hotAndPopular, movies, series } from "../data/content";

export default function Home() {
  return (
    <div className="bg-[#141414] min-h-screen">
      <Hero item={hero} />

      <div className="-mt-8 relative z-10">
        <GenreBar />

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
          title="Movies"
          subtitle="Films"
          items={movies}
        />

        <ContentRow
          title="TV Series"
          subtitle="Shows"
          items={series}
        />
      </div>
    </div>
  );
}
