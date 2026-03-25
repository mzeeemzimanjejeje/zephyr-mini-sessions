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
} from "../lib/cineverse";

interface Props {
  item: ContentItem;
  onClose: () => void;
  initialSeason?: number;
  initialEpisode?: number;
}

const IFRAME_SOURCES = [
  { name: "S1", build: (t: string, id: string, s: number, e: number) =>
      t === "tv" ? `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` : `https://vidsrc.xyz/embed/movie/${id}` },
  { name: "S2", build: (t: string, id: string, s: number, e: number) =>
      t === "tv" ? `https://moviesapi.club/tv/${id}-${s}-${e}` : `https://moviesapi.club/movie/${id}` },
  { name: "S3", build: (t: string, id: string, s: number, e: number) =>
      t === "tv" ? `https://vidsrc.to/embed/tv/${id}?season=${s}&episode=${e}` : `https://vidsrc.to/embed/movie/${id}` },
  { name: "S4", build: (t: string, id: string, s: number, e: number) =>
      t === "tv" ? `https://vidsrc.mov/embed/tv/${id}/${s}/${e}` : `https://vidsrc.mov/embed/movie/${id}` },
];

const AUTO_SWITCH_MS = 8000;

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

  const [srcIdx, setSrcIdx] = useState(0);
  const [phase, setPhase] = useState<"loading" | "playing" | "switching" | "failed">("loading");
  const [countdown, setCountdown] = useState(AUTO_SWITCH_MS / 1000);
  const playingRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { recordWatch, updateProgress } = useWatchHistory();
  const startTimeRef = useRef(Date.now());
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearAll() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }

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
      .catch(err => setSourcesError(`Failed to load video: ${err.message}`))
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
    playingRef.current = false;
    setPhase("loading");
    setCountdown(AUTO_SWITCH_MS / 1000);
    clearAll();

    const tick = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    timersRef.current.push(tick as unknown as ReturnType<typeof setTimeout>);

    const auto = setTimeout(() => {
      if (!playingRef.current) {
        const next = srcIdx + 1;
        if (next >= IFRAME_SOURCES.length) { setPhase("failed"); return; }
        setPhase("switching");
        const t = setTimeout(() => { setSrcIdx(next); setPhase("loading"); setCountdown(AUTO_SWITCH_MS / 1000); }, 700);
        timersRef.current.push(t);
      }
    }, AUTO_SWITCH_MS);
    timersRef.current.push(auto);

    return clearAll;
  }, [srcIdx, season, episode, hasSubjectId, useFallback]);

  useEffect(() => {
    if (hasSubjectId && !useFallback) return;
    const onBlur = () => {
      if (document.activeElement === iframeRef.current && !playingRef.current) {
        playingRef.current = true;
        clearAll();
        setPhase("playing");
      }
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [hasSubjectId, useFallback]);

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
    setSeason(s); setEpisode(e); setSrcIdx(0);
  }, []);

  const useDirectPlayer = hasSubjectId && !useFallback;
  const mediaType = isTV ? "tv" : "movie";
  const embedId = item.imdbId ?? "";
  const iframeUrl = IFRAME_SOURCES[srcIdx]?.build(mediaType, embedId, season, episode);

  const currentSeason = seasons.find(s => s.se === season);
  const maxEpisodes = currentSeason?.maxEp ?? 20;
  const enCaption = captions.find(c => c.lan === "en");

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-white font-bold text-sm md:text-base truncate">{item.title}</h2>
          {useDirectPlayer && (
            <span className="text-xs bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded font-medium flex-shrink-0">
              Direct Stream
            </span>
          )}
          {isTV && <span className="text-white/50 text-sm flex-shrink-0">S{season} E{episode}</span>}
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors flex-shrink-0 ml-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Video area */}
      <div className="flex-1 min-h-0 relative bg-black">
        {useDirectPlayer ? (
          <>
            {sourcesLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-white/60 text-sm">Loading video...</p>
              </div>
            )}
            {sourcesError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
                <p className="text-4xl">⚠️</p>
                <p className="text-white/70 text-center text-sm">{sourcesError}</p>
                {embedId && (
                  <button
                    onClick={() => setUseFallback(true)}
                    className="text-red-400 hover:text-red-300 text-sm underline"
                  >
                    Try embed player instead
                  </button>
                )}
              </div>
            )}
            {!sourcesLoading && selectedDl && (
              <video
                key={selectedDl.url}
                src={selectedDl.url}
                controls
                autoPlay
                playsInline
                className="w-full h-full"
                crossOrigin="anonymous"
              >
                {enCaption && (
                  <track kind="subtitles" src={enCaption.url} srcLang="en" label="English" default />
                )}
              </video>
            )}
          </>
        ) : (
          <>
            {phase === "loading" && !useFallback && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-white/50 text-xs">
                  {IFRAME_SOURCES[srcIdx]?.name} — switching in {countdown}s if no activity
                </p>
              </div>
            )}
            {phase === "switching" && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/70">
                <p className="text-white/70 text-sm animate-pulse">Switching source…</p>
              </div>
            )}
            {phase === "failed" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                <p className="text-5xl">😔</p>
                <p className="text-white/70">All streams unavailable.</p>
                <button
                  onClick={() => { setSrcIdx(0); setPhase("loading"); }}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white text-sm px-5 py-2 rounded-lg"
                >
                  Retry
                </button>
              </div>
            )}
            {embedId && phase !== "failed" && (
              <iframe
                ref={iframeRef}
                key={`${srcIdx}-${season}-${episode}`}
                src={iframeUrl}
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen"
                className="w-full h-full border-0"
                title={item.title}
              />
            )}
            {!embedId && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <p className="text-5xl">🔒</p>
                <p className="text-white/60 text-sm">No streaming source for this title.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls bar */}
      <div className="flex-shrink-0 border-t border-white/10 bg-[#0a0a0a]">
        <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto border-b border-white/10" style={{ scrollbarWidth: "none" }}>
          {useDirectPlayer && downloads.length > 0 && (
            <>
              <span className="text-white/40 text-xs font-medium flex-shrink-0">Quality:</span>
              {downloads.map(dl => (
                <button
                  key={dl.id}
                  onClick={() => setSelectedDl(dl)}
                  className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded transition-all ${
                    selectedDl?.id === dl.id ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {resolutionLabel(dl.resolution)}
                  {dl.size && <span className="ml-1 font-normal opacity-60">({fileSizeMB(dl.size)})</span>}
                </button>
              ))}
              {captions.length > 0 && (
                <>
                  <div className="w-px h-4 bg-white/10 flex-shrink-0 mx-1" />
                  <span className="text-white/40 text-xs flex-shrink-0">Subs:</span>
                  {captions.slice(0, 6).map(c => (
                    <a
                      key={c.id}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-xs px-2 py-1 rounded bg-white/10 text-white/60 hover:bg-white/20 transition-all"
                      title={c.lanName}
                    >
                      {c.lan.slice(0, 2).toUpperCase()}
                    </a>
                  ))}
                </>
              )}
              {embedId && (
                <>
                  <div className="w-px h-4 bg-white/10 flex-shrink-0 mx-1" />
                  <button
                    onClick={() => setUseFallback(true)}
                    className="flex-shrink-0 text-xs px-2 py-1 rounded bg-white/10 text-white/40 hover:bg-white/20 transition-all"
                  >
                    Use embeds
                  </button>
                </>
              )}
            </>
          )}

          {!useDirectPlayer && (
            <>
              <span className="text-white/40 text-xs font-medium flex-shrink-0">Source:</span>
              {IFRAME_SOURCES.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => { setSrcIdx(i); setPhase("loading"); setCountdown(AUTO_SWITCH_MS / 1000); }}
                  className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded transition-all ${srcIdx === i ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                >
                  {s.name}
                </button>
              ))}
              {hasSubjectId && (
                <>
                  <div className="w-px h-4 bg-white/10 flex-shrink-0 mx-1" />
                  <button
                    onClick={() => setUseFallback(false)}
                    className="flex-shrink-0 text-xs px-2 py-1 rounded bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30 transition-all"
                  >
                    Direct Stream
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {isTV && (
          <div className="px-4 py-2 flex items-center gap-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {seasons.length > 0 && (
              <>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-white/50 text-xs font-medium">Season</span>
                  <div className="flex gap-1">
                    {seasons.map(s => (
                      <button key={s.se} onClick={() => goEpisode(s.se, 1)}
                        className={`w-7 h-7 rounded text-xs font-bold transition-all ${season === s.se ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                      >{s.se}</button>
                    ))}
                  </div>
                </div>
                <div className="w-px h-6 bg-white/10 flex-shrink-0" />
              </>
            )}

            {seasons.length === 0 && (
              <>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-white/50 text-xs font-medium">Season</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map(s => (
                      <button key={s} onClick={() => goEpisode(s, 1)}
                        className={`w-7 h-7 rounded text-xs font-bold transition-all ${season === s ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div className="w-px h-6 bg-white/10 flex-shrink-0" />
              </>
            )}

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-white/50 text-xs font-medium">Ep</span>
              <div className="flex gap-1">
                {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map(e => (
                  <button key={e} onClick={() => goEpisode(season, e)}
                    className={`w-7 h-7 rounded text-xs font-bold transition-all flex-shrink-0 ${episode === e ? "bg-red-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                  >{e}</button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
              <button
                onClick={() => episode > 1 ? goEpisode(season, episode - 1) : season > 1 && goEpisode(season - 1, 1)}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded transition-colors"
              >← Prev</button>
              <button
                onClick={() => goEpisode(season, episode + 1)}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
              >Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
