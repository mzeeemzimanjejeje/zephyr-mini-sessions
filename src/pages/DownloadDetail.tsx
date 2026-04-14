import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchFZInfo, fetchFZDownload, formatFZDate, extractGenres, decodeHtml, FZDownloadResult } from "../lib/fzmovies";

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#141414] pt-20 px-4 pb-16 animate-pulse">
      <div className="max-w-3xl mx-auto">
        <div className="h-6 bg-white/10 rounded w-24 mb-8" />
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
          <div className="flex gap-6">
            <div className="w-40 h-56 bg-white/10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-7 bg-white/10 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/3" />
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-5/6" />
              <div className="h-4 bg-white/5 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DownloadLinkRowProps {
  label: string;
  url: string;
  icon?: "download" | "external";
  quality?: string;
}

function DownloadLinkRow({ label, url, icon = "download", quality }: DownloadLinkRowProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between w-full bg-[#111] hover:bg-red-600/10 border border-white/5 hover:border-red-600/30 rounded-xl px-4 py-3 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-600/10 rounded-lg flex items-center justify-center shrink-0">
          {icon === "download" ? (
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-white text-sm font-medium group-hover:text-red-400 transition-colors">{label}</p>
          {quality && <p className="text-white/30 text-xs">{quality}</p>}
        </div>
      </div>
      <svg className="w-4 h-4 text-white/20 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

export default function DownloadDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [fetchingLinks, setFetchingLinks] = useState(false);
  const [downloadResult, setDownloadResult] = useState<FZDownloadResult | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ["fzInfo", slug],
    queryFn: () => fetchFZInfo(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });

  const handleGetLinks = async () => {
    if (!movie?.download_links?.[0]) return;
    setFetchingLinks(true);
    setLinkError(null);
    setDownloadResult(null);
    try {
      const result = await fetchFZDownload(movie.download_links[0]);
      if (result.success) {
        setDownloadResult(result);
      } else {
        setLinkError(result.error ?? "No download links found. Try again later.");
      }
    } catch {
      setLinkError("Failed to fetch download links.");
    } finally {
      setFetchingLinks(false);
    }
  };

  if (isLoading) return <Skeleton />;

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#141414] pt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-white/40 text-lg">Movie not found</p>
        <Link to="/downloads" className="text-red-500 hover:text-red-400 text-sm">← Back to Downloads</Link>
      </div>
    );
  }

  const year = movie.title.match(/\((\d{4})\)/)?.[1] ?? "";
  const cleanTitle = movie.title.replace(/\s*\(\d{4}\)\s*(Movie|Series|Season \d+)?/i, "").trim();
  const genres = extractGenres(movie.categories);
  const description = decodeHtml(movie.description || "");

  return (
    <div className="min-h-screen bg-[#141414] pt-20 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/downloads"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Downloads
        </Link>

        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5">
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={cleanTitle}
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-44 h-64 sm:h-60 object-cover rounded-xl shrink-0 bg-[#111]"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="w-full sm:w-44 h-64 sm:h-60 bg-[#111] rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-10 h-10 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h1 className="text-white text-2xl font-bold leading-tight mb-2">{cleanTitle}</h1>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {year && (
                    <span className="text-xs bg-red-600/20 text-red-400 px-2.5 py-1 rounded-full font-mono">
                      {year}
                    </span>
                  )}
                  {genres.map(g => (
                    <span key={g} className="text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-full capitalize">
                      {g}
                    </span>
                  ))}
                </div>

                {description && (
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{description}</p>
                )}

                <p className="text-white/25 text-xs mb-5">Added {formatFZDate(movie.date)}</p>

                {!downloadResult && (
                  <button
                    onClick={handleGetLinks}
                    disabled={fetchingLinks || !movie.download_links?.length}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    {fetchingLinks ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Fetching links...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Get Download Links
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {linkError && (
            <div className="mx-6 mb-6 px-4 py-3 bg-red-900/20 border border-red-600/20 rounded-xl">
              <p className="text-red-400 text-sm">{linkError}</p>
              <button
                onClick={handleGetLinks}
                className="text-red-400 hover:text-red-300 text-xs mt-1 underline"
              >
                Try again
              </button>
            </div>
          )}

          {downloadResult?.success && (
            <div className="px-6 pb-8">
              <div className="border-t border-white/5 pt-6">
                <h2 className="text-white font-semibold text-base mb-1 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Links
                </h2>
                {downloadResult.filename && (
                  <p className="text-white/30 text-xs mb-4">
                    File: <span className="text-white/50">{downloadResult.filename}</span>
                  </p>
                )}
                <div className="space-y-2">
                  {downloadResult.download_url && (
                    <DownloadLinkRow
                      label="Direct Download"
                      url={downloadResult.download_url}
                      icon="download"
                      quality="Direct link · fastest"
                    />
                  )}
                  {downloadResult.meetdownload_url && (
                    <DownloadLinkRow
                      label="Mirror Download"
                      url={downloadResult.meetdownload_url}
                      icon="external"
                      quality="Via MeetDownload"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {movie.url && (
          <div className="mt-4 px-2">
            <p className="text-white/20 text-xs">
              Source:{" "}
              <a href={movie.url} target="_blank" rel="noopener noreferrer" className="hover:text-white/40 underline">
                FZMovies
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
