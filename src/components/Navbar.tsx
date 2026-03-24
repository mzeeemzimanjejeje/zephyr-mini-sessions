import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/90 to-transparent">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-white font-bold text-xl tracking-wide">Courtney's ENT</span>
      </Link>

      <div className="flex items-center gap-4">
        {showSearch ? (
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search titles..."
              className="bg-black/80 border border-white/30 text-white text-sm px-3 py-1.5 rounded outline-none w-52 placeholder-white/50"
              onBlur={() => { if (!query) setShowSearch(false); }}
            />
          </form>
        ) : (
          <button onClick={() => setShowSearch(true)} className="text-white/80 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
}
