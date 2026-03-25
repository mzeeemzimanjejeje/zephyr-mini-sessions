import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { allContent } from "../data/content";
import { searchCineverse, cineverseItemToContentItem } from "../lib/cineverse";
import MovieCard from "../components/MovieCard";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const { data: apiResults, isLoading, isError } = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchCineverse(q),
    enabled: q.length >= 2,
    staleTime: 1000 * 60 * 3,
  });

  const staticFallback = allContent.filter(item =>
    item.title.toLowerCase().includes(q.toLowerCase()) ||
    item.genres.some(g => g.toLowerCase().includes(q.toLowerCase())) ||
    item.country.toLowerCase().includes(q.toLowerCase())
  );

  const results = apiResults
    ? apiResults.filter(i => i.subjectType !== 6).map(cineverseItemToContentItem)
    : staticFallback;

  return (
    <div className="bg-[#141414] min-h-screen pt-20 px-4 md:px-8 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="text-white/50 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white text-xl font-bold">
          Results for "<span className="text-red-500">{q}</span>"
        </h1>
        {!isLoading && (
          <span className="text-white/40 text-sm">{results.length} found</span>
        )}
        {apiResults && (
          <span className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded font-medium">
            Live
          </span>
        )}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((item, i) => (
            <MovieCard key={item.subjectId ?? item.id ?? i} item={item} />
          ))}
        </div>
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
