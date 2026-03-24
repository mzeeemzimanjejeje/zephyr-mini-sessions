import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { casperSearch, casperToContentItem } from "../api/casper";
import { allContent, imdbByTitle, type ContentItem } from "../data/content";
import MovieCard from "../components/MovieCard";

let nextId = 200000;
function makeId() { return nextId++; }

function toItem(raw: Parameters<typeof casperToContentItem>[0]): ContentItem {
  const key = raw.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const imdbId = imdbByTitle.get(key);
  const item = casperToContentItem(raw, imdbId);
  item.id = makeId();
  return item;
}

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }

    const staticMatches = allContent.filter(item =>
      item.title.toLowerCase().includes(q.toLowerCase()) ||
      item.genres.some(g => g.toLowerCase().includes(q.toLowerCase())) ||
      item.country.toLowerCase().includes(q.toLowerCase())
    );

    setResults(staticMatches);
    setLoading(true);
    setSearched(true);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const raw = await casperSearch(q.trim());
        if (controller.signal.aborted) return;

        const staticIds = new Set(staticMatches.map(s => s.title.toLowerCase()));
        const apiItems = raw
          .filter(r => !staticIds.has(r.title.toLowerCase()))
          .map(toItem);

        setResults([...staticMatches, ...apiItems]);
      } catch {
        // keep static results
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  return (
    <div className="bg-[#141414] min-h-screen pt-20 px-4 md:px-8 pb-16">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Link to="/" className="text-white/50 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white text-xl font-bold">
          {q ? <>Results for "<span className="text-red-500">{q}</span>"</> : "Search"}
        </h1>
        {q && (
          <span className="text-white/40 text-sm flex items-center gap-2">
            {results.length} found
            {loading && <span className="w-3 h-3 border border-white/40 border-t-white/10 rounded-full animate-spin inline-block" />}
          </span>
        )}
      </div>

      {!q && (
        <p className="text-white/40 text-sm">Type something in the search bar to find movies and shows.</p>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-20 text-white/40">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg">No results for "<span className="text-white">{q}</span>"</p>
          <Link to="/" className="mt-4 inline-block text-red-500 hover:text-red-400">Back to Home</Link>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map(item => (
            <MovieCard key={`${item.id}-${item.subjectId ?? ""}`} item={item} />
          ))}
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={`sk-${i}`} className="aspect-[2/3] rounded-lg bg-white/8 animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}
