import { Link } from "react-router-dom";

const GENRES = ["Action", "Comedy", "Sci-Fi", "Horror", "Romance", "Thriller"];

export default function GenreBar() {
  return (
    <section className="px-4 md:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl md:text-2xl font-bold">Browse Genres</h2>
        <Link to="/genres" className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-1">
          All genres
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {GENRES.map(genre => (
          <Link
            key={genre}
            to={`/genres/${genre.toLowerCase()}`}
            className="px-4 py-2 bg-white/10 hover:bg-red-600 text-white text-sm font-medium rounded-full border border-white/10 hover:border-red-600 transition-all duration-200"
          >
            {genre}
          </Link>
        ))}
      </div>
    </section>
  );
}
