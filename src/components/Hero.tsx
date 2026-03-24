import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { ContentItem } from "../data/content";
import WatchModal from "./WatchModal";

interface Props { item: ContentItem; }

const Hero = memo(function Hero({ item }: Props) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

        <div className="absolute bottom-16 left-8 md:left-16 max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold tracking-widest text-white/70 uppercase border border-white/30 px-2 py-0.5 rounded">
              {item.type}
            </span>
            <span className="text-white/60 text-sm">{item.country}</span>
          </div>

          {item.rating && (
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-yellow-400 font-bold">{item.rating}</span>
              {item.votes && <span className="text-white/50 text-sm">({item.votes})</span>}
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
            {item.title}
          </h1>

          <div className="flex items-center gap-2 mb-4 text-white/70 text-sm">
            <span>{item.year}</span>
            <span>•</span>
            <span>{item.genres.join(" · ")}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Watch Now
            </button>
            <button
              onClick={() => navigate(`/title/${item.id}`)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-2.5 rounded backdrop-blur-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>

      {showModal && <WatchModal item={item} onClose={() => setShowModal(false)} />}
    </>
  );
});

export default Hero;
