import { useState, useCallback, useEffect, useRef } from "react";
import { ContentItem } from "../data/content";
import { useWatchHistory } from "../hooks/useWatchHistory";
import {
  fetchCineverseSources,
  fetchCineverseInfo,
  CineverseDownload,
  CineverseCaption,
  CinevSeason,
  resolutionLabel,
  fileSizeMB,
  streamProxyUrl,
} from "../lib/cineverse";

interface Props {
  item: ContentItem;
  onClose: () => void;
  initialSeason?: number;
  initialEpisode?: number;
}

const EMBED_SOURCES = [
  (t: string, id: string, s: number, e: number) =>
    t === "tv" ? `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` : `https://vidsrc.xyz/embed/movie/${id}`,
  (t: string, id: string, s: number, e: number) =>
    t === "tv" ? `https://moviesapi.club/tv/${id}-${s}-${e}` : `https://moviesapi.club/movie/${id}`,
  (t: string, id: string, s: number, e: number) =>
    t === "tv" ? `https://vidsrc.to/embed/tv/${id}?season=${s}&episode=${e}` : `https://vidsrc.to/embed/movie/${id}`,
  (t: string, id: string, s: number, e: number) =>
    t === "tv" ? `https://vidsrc.mov/embed/tv/${id}/${s}/${e}` : `https://vidsrc.mov/embed/movie/${id}`,
];

export default function WatchModal({ item, onClose, initialSeason, initialEpisode }: Props) {
  const isTV = item.type === "Series";
  const hasSubjectId = Boolean(item.subjectId);

  const [season, setSeason] = useState(initialSeason ?? 1);
  const [episode, setEpisode] = useState(initialEpisode ?? 1);

  const [downloads, setDownloads] = useState<CineverseDownload[]>([]);
  const [captions, setCaptions] = useState<CineverseCaption[]>([]);
  const [seasons, setSeasons] = useState<CinevSeason[]>([]);
  const [selectedDl, setSelectedDl] = useState<CineverseDownload | null>(null);
  const [sourcesLoading, setSourcesLoading] = useState(false);
  const [sourcesError, setSourcesError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [showQuality, setShowQuality] = useState(false);

  const [embedIdx, setEmbedIdx] = useState(0);
  const [embedLoading, setEmbedLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { recordWatch, updateProgress } = useWatchHistory();
  const startTimeRef = useRef(Date.now());
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    recordWatch(item, isTV ? season : undefined, isTV ? episode : undefined);
    startTimeRef.current = Date.now();
    const AVG_DURATION = item.type === "Movie" ? 5400 : 2700;
    progressIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const pct = Math.min(99, (elapsed / AVG_DURATION) * 100);
      updateProgress(item.id, pct, isTV ? season : undefined, isTV ? episode : undefined);
    }, 10000);
    return () => { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); };
  }, [item.id, season, episode]);

  useEffect(() => {
    if (!hasSubjectId || useFallback) return;
    setSourcesLoading(true);
    setSourcesError(null);
    setDownloads([]);
    setSelectedDl(null);

    const s = isTV ? season : undefined;
    const e = isTV ? episode : undefined;

    fetchCineverseSources(item.subjectId!, s, e)
      .then(data => {
        const sorted = [...(data.downloads ?? [])].sort((a, b) => b.resolution - a.resolution);
        setDownloads(sorted);
        setCaptions(data.captions ?? []);
        if (sorted.length > 0) {
          const hd = sorted.find(d => d.resolution >= 720) ?? sorted[0];
          setSelectedDl(hd);
        } else {
          setSourcesError("No video files available for this title.");
        }
      })
      .catch(err => setSourcesError(`Unable to load video: ${err.message}`))
      .finally(() => setSourcesLoading(false));
  }, [item.subjectId, season, episode, isTV, hasSubjectId, useFallback]);

  useEffect(() => {
    if (!hasSubjectId || useFallback) return;
    fetchCineverseInfo(item.subjectId!)
      .then(data => { if (data.resource?.seasons?.length) setSeasons(data.resource.seasons); })
      .catch(() => {});
  }, [item.subjectId, hasSubjectId, useFallback]);

  useEffect(() => {
    if (hasSubjectId && !useFallback) return;
    setEmbedLoading(true);
    setEmbedIdx(0);
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);

    const onFocus = () => {
      if (document.activeElement === iframeRef.current) {
        setEmbedLoading(false);
        if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
      }
    };
    window.addEventListener("blur", onFocus);
    return () => {
      window.removeEventListener("blur", onFocus);
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    };
  }, [season, episode, hasSubjectId, useFallback]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const goEpisode = useCallback((s: number, e: number) => {
    setSeason(s); setEpisode(e); setEmbedIdx(0);
  }, []);

  const tryNextEmbed = useCallback(() => {
    const next = embedIdx + 1;
    if (next < EMBED_SOURCES.length) {
      setEmbedLoading(true);
      setEmbedIdx(next);
    }
  }, [embedIdx]);

  const useDirectPlayer = hasSubjectId && !useFallback;
  const mediaType = isTV ? "tv" : "movie";
  const embedId = item.imdbId ?? "";
  const iframeUrl = EMBED_SOURCES[embedIdx]?.(mediaType, embedId, season, episode);

  const currentSeason = seasons.find(s => s.se === season);
  const maxEpisodes = currentSeason?.maxEp ?? 20;
  const enCaption = captions.find(c => c.lan === "en");
  const videoSrc = selectedDl ? streamProxyUrl(selectedDl.url) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0 bg-[#0d0d0d] border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-white font-semibold text-sm truncate">{item.title}</h2>
          {isTV && <span className="text-white/40 text-xs flex-shrink-0">· S{season} E{episode}</span>}
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors flex-shrink-0 ml-4 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Player */}
      <div className="flex-1 min-h-0 relative bg-black">

        {/* Direct stream player */}
        {useDirectPlayer && (
          <>
            {sourcesLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-white/50 text-sm">Loading video...</p>
              </div>
            )}
            {sourcesError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 z-10">
                <p className="text-4xl">⚠️</p>
                <p className="text-white/60 text-center text-sm">{sourcesError}</p>
                {embedId && (
                  <button onClick={() => setUseFallback(true)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-lg transition-colors">
                    Try another player
                  </button>
                )}
              </div>
            )}
            {!sourcesLoading && videoSrc && (
              <video
                key={videoSrc}
                src={videoSrc}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="w-full h-full"
                crossOrigin="anonymous"
                onLoadStart={() => {}}
              >
                {enCaption && (
                  <track kind="subtitles" src={enCaption.url} srcLang="en" label="English" default />
                )}
              </video>
            )}
          </>
        )}

        {/* Embed player */}
        {!useDirectPlayer && (
          <>
            {embedLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
                <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-white/50 text-sm">Starting player...</p>
              </div>
            )}
            {embedId ? (
              <iframe
                ref={iframeRef}
                key={`${embedIdx}-${season}-${episode}`}
                src={iframeUrl}
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                className="w-full h-full border-0"
                title={item.title}
                onLoad={() => setEmbedLoading(false)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                <p className="text-5xl">🔒</p>
                <p className="text-white/50 text-sm">No player available for this title.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-[#0d0d0d] border-t border-white/10">

        {/* Controls row */}
        <div className="px-4 py-2 flex items-center gap-3 min-h-[42px]">

          {/* Direct stream controls */}
          {useDirectPlayer && (
            <>
              {downloads.length > 1 && (
                <div className="relative">
                  <button
                    onClick={() => setShowQuality(p => !p)}
                    className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedDl ? resolutionLabel(selectedDl.resolution) : "Quality"}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showQuality && (
                    <div className="absolute bottom-full mb-1 left-0 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden shadow-xl min-w-[140px]">
                      {downloads.map(dl => (
                        <button
                          key={dl.id}
                          onClick={() => { setSelectedDl(dl); setShowQuality(false); }}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between gap-3 ${
                            selectedDl?.id === dl.id ? "bg-red-600/20 text-red-400" : "text-white/70 hover:bg-white/10"
                          }`}
                        >
                          <span className="font-bold">{resolutionLabel(dl.resolution)}</span>
                          {dl.size && <span className="opacity-50">{fileSizeMB(dl.size)}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {embedId && (
                <button
                  onClick={() => setUseFallback(true)}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors ml-auto"
                >
                  Try another player
                </button>
              )}
            </>
          )}

          {/* Embed player controls */}
          {!useDirectPlayer && (
            <>
              {embedId && (
                <>
                  {embedLoading && (
                    <span className="text-white/30 text-xs">Connecting to player...</span>
                  )}
                  <button
                    onClick={tryNextEmbed}
                    className="text-xs text-white/30 hover:text-white/70 transition-colors flex items-center gap-1"
                    title="Switch to a different player"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Not loading? Try another
                  </button>
                  {hasSubjectId && (
                    <button
                      onClick={() => setUseFallback(false)}
                      className="ml-auto text-xs text-green-400/70 hover:text-green-400 transition-colors"
                    >
                      ↑ Use direct stream
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Episode/season navigation */}
        {isTV && (
          <div className="px-4 pb-2 flex items-center gap-3 overflow-x-auto border-t border-white/5 pt-2" style={{ scrollbarWidth: "none" }}>

            {(seasons.length > 0 ? seasons.map(s => s.se) : [1, 2, 3, 4, 5]).map(s => (
              <button key={s} onClick={() => goEpisode(s, 1)}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded transition-all ${season === s ? "bg-red-600 text-white" : "bg-white/10 text-white/50 hover:bg-white/20"}`}
              >S{s}</button>
            ))}

            <div className="w-px h-5 bg-white/10 flex-shrink-0" />

            <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map(e => (
                <button key={e} onClick={() => goEpisode(season, e)}
                  className={`flex-shrink-0 w-7 h-7 rounded text-xs font-semibold transition-all ${episode === e ? "bg-red-600 text-white" : "bg-white/10 text-white/50 hover:bg-white/20"}`}
                >{e}</button>
              ))}
            </div>

            <div className="flex gap-2 ml-auto flex-shrink-0">
              <button
                onClick={() => episode > 1 ? goEpisode(season, episode - 1) : season > 1 && goEpisode(season - 1, 1)}
                className="bg-white/8 hover:bg-white/15 text-white/70 text-xs px-3 py-1.5 rounded transition-colors"
              >← Prev</button>
              <button
                onClick={() => goEpisode(season, episode + 1)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
              >Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
