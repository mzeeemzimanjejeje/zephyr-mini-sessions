import { useMemo } from "react";
import { allContent, ContentItem } from "../data/content";
import { WatchEntry } from "./useWatchHistory";

export function useRecommendations(history: WatchEntry[], exclude?: number): ContentItem[] {
  return useMemo(() => {
    if (history.length === 0) {
      // Cold start: return highest-rated content
      return [...allContent]
        .filter(c => c.id !== exclude)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 12);
    }

    // Build genre frequency map from watch history
    const genreScore: Record<string, number> = {};
    history.forEach((entry, idx) => {
      const weight = 1 / (idx + 1); // More recent = higher weight
      entry.genres.forEach(g => {
        genreScore[g] = (genreScore[g] ?? 0) + weight;
      });
    });

    const watchedIds = new Set(history.map(e => e.id));

    return allContent
      .filter(c => c.id !== exclude && !watchedIds.has(c.id))
      .map(c => {
        const score =
          c.genres.reduce((sum, g) => sum + (genreScore[g] ?? 0), 0) +
          (c.rating ?? 0) * 0.1;
        return { item: c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(x => x.item);
  }, [history, exclude]);
}
