import { bwmSources, bwmSearch, imdbSearch, BwmSource, BwmSubtitle } from "./bwm";
import type { ContentItem } from "../data/content";

export interface BwmCacheEntry { sources: BwmSource[]; subtitles: BwmSubtitle[] }
export const bwmCache = new Map<string, BwmCacheEntry | null>();
export const imdbCache = new Map<string, string | null>();
export const bwmSubjectCache = new Map<string, string | null>(); // "title:type" → subjectId

function withTimeout<T>(p: Promise<T | null>, ms: number): Promise<T | null> {
  return Promise.race([p, new Promise<null>(r => setTimeout(() => r(null), ms))]);
}

function titleMatches(bwmTitle: string, itemTitle: string): boolean {
  const bwm = bwmTitle.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  const item = itemTitle.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  return bwm === item || bwm.startsWith(item);
}

async function prefetchBwmByTitle(item: ContentItem): Promise<void> {
  const searchKey = `${item.title}:${item.type}`;
  if (bwmSubjectCache.has(searchKey)) return;
  bwmSubjectCache.set(searchKey, null);

  const isTV = item.type === "Series";
  const bwmType = isTV ? 2 : 1;

  const results = await withTimeout(bwmSearch(item.title), 5000);
  if (!results) return;

  const match = results.find(r => r.subjectType === bwmType && titleMatches(r.title, item.title));
  if (!match) return;

  bwmSubjectCache.set(searchKey, match.subjectId);

  const bwmKey = `${match.subjectId}:${isTV ? "1:1" : ""}`;
  if (!bwmCache.has(bwmKey)) {
    bwmCache.set(bwmKey, null);
    const result = await bwmSources(match.subjectId, isTV ? 1 : undefined, isTV ? 1 : undefined);
    bwmCache.set(bwmKey, result && result.results.length > 0 ? { sources: result.results, subtitles: result.subtitles } : null);
  }
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
  } else {
    prefetchBwmByTitle(item);
  }

  const imdbKey = `${item.title}:${item.type}`;
  if (!item.imdbId && !imdbCache.has(imdbKey)) {
    imdbCache.set(imdbKey, null);
    withTimeout(imdbSearch(item.title, isTV ? "tvSeries" : "movie"), 4500)
      .then(id => imdbCache.set(imdbKey, id));
  } else if (item.imdbId && !imdbCache.has(imdbKey)) {
    imdbCache.set(imdbKey, item.imdbId);
  }
}
