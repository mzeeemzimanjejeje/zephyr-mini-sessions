import { useState, useCallback } from "react";
import { ContentItem } from "../data/content";

export interface WatchEntry {
  id: number;
  title: string;
  image: string;
  type: "Movie" | "Series";
  genres: string[];
  imdbId?: string;
  watchedAt: number;
  season?: number;
  episode?: number;
  progress: number; // 0–100
}

const KEY = "courtneys-ent-history";
const MAX = 20;

function load(): WatchEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(entries: WatchEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)));
  } catch {}
}

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchEntry[]>(load);

  const recordWatch = useCallback((item: ContentItem, season?: number, episode?: number) => {
    setHistory(prev => {
      const filtered = prev.filter(e => !(e.id === item.id && e.season === season && e.episode === episode));
      const entry: WatchEntry = {
        id: item.id,
        title: item.title,
        image: item.image,
        type: item.type,
        genres: item.genres,
        imdbId: item.imdbId,
        watchedAt: Date.now(),
        season,
        episode,
        progress: prev.find(e => e.id === item.id && e.season === season && e.episode === episode)?.progress ?? 0,
      };
      const next = [entry, ...filtered].slice(0, MAX);
      save(next);
      return next;
    });
  }, []);

  const updateProgress = useCallback((id: number, progress: number, season?: number, episode?: number) => {
    setHistory(prev => {
      const next = prev.map(e =>
        e.id === id && e.season === season && e.episode === episode
          ? { ...e, progress: Math.min(100, Math.round(progress)) }
          : e
      );
      save(next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((id: number) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== id);
      save(next);
      return next;
    });
  }, []);

  const getProgress = useCallback((id: number, season?: number, episode?: number) => {
    return load().find(e => e.id === id && e.season === season && e.episode === episode)?.progress ?? 0;
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(KEY);
    setHistory([]);
  }, []);

  return { history, recordWatch, updateProgress, removeEntry, getProgress, clearHistory };
}
