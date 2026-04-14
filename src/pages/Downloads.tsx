import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFZLatest, fetchFZSearch, formatFZDate, extractGenres, FZMovie } from "../lib/fzmovies";

function MovieCard({ movie }: { movie: FZMovie }) {
  const genres = extractGenres(movie.categories);
  const year = movie.title.match(/\((\d{4})\)/)?.[1] ?? "";
  const cleanTitle = movie.title.replace(/\s*\(\d{4}\)\s*(Movie|Series|Season \d+)?/i, "").trim();

  return (
    <Link
      to={`/downloads/${movie.slug}`}
      className="group bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-red-600/40 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-900/20"
    >
      <div className="p-4 flex flex-col gap-2 h-full">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
            {cleanTitle}
          </h3>
          {year && (
            <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full font-mono shrink-0">
              {year}
            </span>
          )}
        </div>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genres.map(g => (
              <span key={g} className="text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded">
                {g}
              </span>
            ))}
          </div>
        )}

        {movie.description && (
          <p className="text-white/40 text-xs line-clamp-3 leading-relaxed mt-1">
            {movie.description}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-white/30 text-xs">{formatFZDate(movie.date)}</span>
          <span className="text-red-500 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Download
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 animate-pulse">
      <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
      <div className="h-3 bg-white/5 rounded mb-1 w-1/4" />
      <div className="h-3 bg-white/5 rounded mb-1 w-full" />
      <div className="h-3 bg-white/5 rounded w-2/3" />
    </div>
  );
}

export default function Downloads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const { data: latestData, isLoading: latestLoading } = useQuery({
    queryKey: ["fzLatest", page],
    queryFn: () => fetchFZLatest(page),
    enabled: !debouncedQuery,
    staleTime: 1000 * 60 * 5,
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["fzSearch", debouncedQuery],
    queryFn: () => fetchFZSearch(debouncedQuery),
    enabled: !!debouncedQuery,
    staleTime: 1000 * 60 * 5,
  });

  const movies = debouncedQuery ? (searchResults ?? []) : (latestData?.results ?? []);
  const isLoading = debouncedQuery ? searchLoading : latestLoading;

  return (
    <div className="min-h-screen bg-[#141414] pt-20 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-red-600 rounded-full" />
            <h1 className="text-white text-3xl font-bold tracking-tight">Downloads</h1>
          </div>
          <p className="text-white/40 text-sm ml-4">
            Browse and download the latest Hollywood movies with direct links
          </p>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for a movie..."
            className="w-full bg-[#1a1a1a] border border-white/10 focus:border-red-600/50 text-white text-sm pl-11 pr-4 py-3 rounded-xl outline-none placeholder-white/30 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-white/30 hover:text-white/60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-24">
            <svg className="w-12 h-12 text-white/10 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white/30 text-lg">No movies found</p>
            {debouncedQuery && (
              <p className="text-white/20 text-sm mt-1">Try a different search term</p>
            )}
          </div>
        ) : (
          <>
            {!debouncedQuery && (
              <p className="text-white/30 text-xs mb-4">
                Showing {movies.length} latest movies
              </p>
            )}
            {debouncedQuery && (
              <p className="text-white/30 text-xs mb-4">
                {movies.length} result{movies.length !== 1 ? "s" : ""} for "{debouncedQuery}"
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {movies.map(movie => (
                <MovieCard key={movie.slug} movie={movie} />
              ))}
            </div>

            {!debouncedQuery && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-5 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-white/40 text-sm">Page {page}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-5 py-2 bg-red-600/80 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
