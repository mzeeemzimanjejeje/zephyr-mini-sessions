import { useState } from "react";
import { ContentItem } from "../data/content";
import WatchModal from "./WatchModal";

interface Props { item: ContentItem; }

export default function MovieCard({ item }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        className="relative flex-shrink-0 w-36 md:w-44 cursor-pointer group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-[#1a1a1a]">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          <div className={`absolute inset-0 bg-black/60 flex flex-col justify-end p-2.5 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 rounded mb-2 flex items-center justify-center gap-1 transition-colors"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Watch
            </button>
            <div className="text-white/60 text-xs text-center">{item.year} · {item.country}</div>
          </div>

          <div className="absolute top-2 left-2">
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${item.type === "Series" ? "bg-blue-600" : "bg-red-600"} text-white`}>
              {item.type}
            </span>
          </div>

          {item.rating && (
            <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 rounded px-1.5 py-0.5">
              <svg className="w-2.5 h-2.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-yellow-400 text-xs font-bold">{item.rating}</span>
            </div>
          )}
        </div>

        <div className="mt-2 px-0.5">
          <h3 className="text-white text-xs font-semibold truncate">{item.title}</h3>
          <p className="text-white/50 text-xs mt-0.5">{item.year} · {item.genres[0]}</p>
        </div>
      </div>

      {showModal && <WatchModal item={item} onClose={() => setShowModal(false)} />}
    </>
  );
}
