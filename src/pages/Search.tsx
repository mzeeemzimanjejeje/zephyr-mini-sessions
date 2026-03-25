import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { allContent } from "../data/content";
import { searchCineverse, cineverseItemToContentItem } from "../lib/cineverse";
import MovieCard from "../components/MovieCard";

type Filter = "all" | "movie" | "series";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  const typeParam = filter === "movie" ? 1 : filter === "series" ? 2 : undefined;

  const { data: apiData, isLoading, isError } = useQuery({
    queryKey: ["search", q, typeParam, page],
    queryFn: () => searchCineverse(q, typeParam, page),
    enabled: q.length >= 2,
    staleTime: 1000 * 60 * 3,
    keepPreviousData: true,
  } as any);

  const staticFallback = allContent.filter(item =>
    item.title.toLowerCase().includes(q.toLowerCase()) ||
    item.genres.some(g => g.toLowerCase().includes(q.toLowerCase())) ||
    item.country.toLowerCase().includes(q.toLowerCase())
  );

  const apiItems = apiData?.items ?? [];
  const hasMore = apiData?.hasMore ?? false;

  const deduped = apiItems.filter(
    (item: any, idx: number, arr: any[]) =>
      arr.findIndex((x: any) => x.subjectId === item.subjectId) === idx
  );

  const results = apiData
    ? deduped.filter((i: any) => i.subjectType !== 6).map(cineverseItemToContentItem)
    : staticFallback;

  const handleFilterChange = (f: Filter) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <div className="bg-[#141414] min-h-screen pt-20 px-4 md:px-8 pb-16">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Link to="/" className="text-white/50 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white text-xl font-bold">
          Results for "<span className="text-red-500">{q}</span>"
        </h1>
        {!isLoading && (
          <span className="text-white/40 text-sm">{results.length}{hasMore ? "+" : ""} found</span>
        )}
        {apiData && (
          <span className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded font-medium">
            Live
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-6">
        {(["all", "movie", "series"] as Filter[]).map(f => (
          <button key={f} onClick={() => handleFilterChange(f)}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-all capitalize ${filter === f ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
          >
            {f === "all" ? "All" : f === "movie" ? "Movies" : "TV Series"}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Searching millions of titles...</p>
        </div>
      )}

      {isError && (
        <div className="mb-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg px-4 py-2 text-yellow-400 text-sm">
          Live search unavailable — showing local results.
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item: any, i: number) => (
              <MovieCard key={item.subjectId ?? item.id ?? i} item={item} />
            ))}
          </div>

          {apiData && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 rounded-lg bg-white/10 text-white/60 text-sm font-semibold disabled:opacity-30 hover:bg-white/20 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-white/40 text-sm">Page {page}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-30 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {!isLoading && results.length === 0 && (
        <div className="text-center py-20 text-white/40">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No results for "<span className="text-white">{q}</span>"</p>
          <Link to="/" className="mt-4 inline-block text-red-500 hover:text-red-400">Back to Home</Link>
        </div>
      )}
    </div>
  );
}
