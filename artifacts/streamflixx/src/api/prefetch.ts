import { bwmSources, imdbSearch, BwmSource, BwmSubtitle } from "./bwm";
import type { ContentItem } from "../data/content";

export interface BwmCacheEntry { sources: BwmSource[]; subtitles: BwmSubtitle[] }
export const bwmCache = new Map<string, BwmCacheEntry | null>();
export const imdbCache = new Map<string, string | null>();

function withTimeout<T>(p: Promise<T | null>, ms: number): Promise<T | null> {
  return Promise.race([p, new Promise<null>(r => setTimeout(() => r(null), ms))]);
}

export function prefetchItem(item: ContentItem, season = 1, episode = 1): void {
  const isTV = item.type === "Series";

  if (item.subjectId) {
    const bwmKey = `${item.subjectId}:${isTV ? `${season}:${episode}` : ""}`;
    if (!bwmCache.has(bwmKey)) {
      bwmCache.set(bwmKey, null);
      withTimeout(
        bwmSources(item.subjectId, isTV ? season : undefined, isTV ? episode : undefined)
          .then(r => r && r.results.length > 0 ? { sources: r.results, subtitles: r.subtitles } : null),
        5000,
      ).then(r => bwmCache.set(bwmKey, r));
    }
  }

  const imdbKey = `${item.title}:${item.type}`;
  if (!item.imdbId && !imdbCache.has(imdbKey)) {
    imdbCache.set(imdbKey, null);
    withTimeout(
      imdbSearch(item.title, isTV ? "tvSeries" : "movie"),
      4500,
    ).then(id => imdbCache.set(imdbKey, id));
  } else if (item.imdbId && !imdbCache.has(imdbKey)) {
    imdbCache.set(imdbKey, item.imdbId);
  }
}
