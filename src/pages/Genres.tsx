import { Link } from "react-router-dom";

const ALL_GENRES = [
  { name: "Action", icon: "⚔️", color: "from-red-900 to-red-700" },
  { name: "Comedy", icon: "😂", color: "from-yellow-700 to-yellow-500" },
  { name: "Sci-Fi", icon: "🚀", color: "from-blue-900 to-blue-700" },
  { name: "Horror", icon: "👻", color: "from-gray-900 to-gray-700" },
  { name: "Romance", icon: "❤️", color: "from-pink-900 to-pink-700" },
  { name: "Thriller", icon: "🔪", color: "from-purple-900 to-purple-700" },
  { name: "Drama", icon: "🎭", color: "from-indigo-900 to-indigo-700" },
  { name: "Adventure", icon: "🗺️", color: "from-green-900 to-green-700" },
  { name: "Crime", icon: "🕵️", color: "from-zinc-800 to-zinc-600" },
  { name: "Fantasy", icon: "🧙", color: "from-violet-900 to-violet-700" },
  { name: "Mystery", icon: "🔮", color: "from-teal-900 to-teal-700" },
  { name: "Anime", icon: "🌸", color: "from-rose-900 to-rose-700" },
  { name: "Animation", icon: "🎨", color: "from-orange-900 to-orange-700" },
  { name: "Documentary", icon: "🎬", color: "from-stone-800 to-stone-600" },
];

export default function Genres() {
  return (
    <div className="bg-[#141414] min-h-screen pt-20 px-4 md:px-8 pb-16">
      <h1 className="text-white text-3xl font-bold mb-2">Browse by Genre</h1>
      <p className="text-white/50 mb-8">Explore all categories</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {ALL_GENRES.map(genre => (
          <Link
            key={genre.name}
            to={`/genres/${genre.name.toLowerCase()}`}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${genre.color} h-28 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-200 shadow-lg`}
          >
            <span className="text-3xl">{genre.icon}</span>
            <span className="text-white font-bold text-sm">{genre.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
