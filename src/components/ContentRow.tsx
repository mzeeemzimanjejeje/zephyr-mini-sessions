import { useRef, memo } from "react";
import { ContentItem } from "../data/content";
import MovieCard from "./MovieCard";

interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
  items: ContentItem[];
}

const ContentRow = memo(function ContentRow({ title, subtitle, badge, items }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir === "right" ? 400 : -400, behavior: "smooth" });
    }
  };

  return (
    <section className="px-4 md:px-8 py-6">
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="text-white text-xl md:text-2xl font-bold">{title}</h2>
        {subtitle && <span className="text-white/40 text-sm">{subtitle}</span>}
        {badge && (
          <span className="text-xs bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded font-medium">
            {badge}
          </span>
        )}
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg -translate-x-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map(item => (
            <MovieCard key={item.id} item={item} />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg translate-x-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
});

export default ContentRow;
