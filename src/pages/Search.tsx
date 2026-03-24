import { useSearchParams, Link } from "react-router-dom";
import { allContent } from "../data/content";
import MovieCard from "../components/MovieCard";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const results = allContent.filter(item =>
    item.title.toLowerCase().includes(q.toLowerCase()) ||
    item.genres.some(g => g.toLowerCase().includes(q.toLowerCase())) ||
    item.country.toLowerCase().includes(q.toLowerCase())
  );

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
        <span className="text-white/40 text-sm">{results.length} found</span>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map(item => (
            <MovieCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-white/40">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No results for "<span className="text-white">{q}</span>"</p>
          <Link to="/" className="mt-4 inline-block text-red-500 hover:text-red-400">Back to Home</Link>
        </div>
      )}
    </div>
  );
}
