const BASE = "https://apis.davidcyril.name.ng/movies/fzmovies";

export interface FZMovie {
  title: string;
  url: string;
  slug: string;
  description: string;
  categories: string[];
  date: string;
}

export interface FZMovieDetail {
  title: string;
  url: string;
  slug: string;
  poster: string;
  description: string;
  categories: string[];
  date: string;
  download_links: string[];
}

export interface FZDownloadLink {
  label: string;
  url: string;
  quality?: string;
  size?: string;
}

export interface FZDownloadResult {
  success: boolean;
  title?: string;
  links?: FZDownloadLink[];
  error?: string;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`FZMovies API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export async function fetchFZLatest(page?: number): Promise<{ results: FZMovie[]; count: number }> {
  const qs = page && page > 1 ? `?page=${page}` : "";
  const data = await apiFetch<{ success: boolean; count: number; results: FZMovie[] }>(`/latest${qs}`);
  return { results: data.results ?? [], count: data.count ?? 0 };
}

export async function fetchFZSearch(query: string): Promise<FZMovie[]> {
  const qs = `?search=${encodeURIComponent(query)}`;
  const data = await apiFetch<{ success: boolean; count: number; results: FZMovie[] }>(`/latest${qs}`);
  return data.results ?? [];
}

export async function fetchFZInfo(slug: string): Promise<FZMovieDetail | null> {
  try {
    const data = await apiFetch<FZMovieDetail & { success: boolean }>(`/info?slug=${encodeURIComponent(slug)}`);
    if (!data.success) return null;
    return data;
  } catch {
    return null;
  }
}

export async function fetchFZDownload(url: string): Promise<FZDownloadResult> {
  try {
    const data = await apiFetch<FZDownloadResult & { success: boolean }>(
      `/download?url=${encodeURIComponent(url)}`
    );
    return data;
  } catch {
    return { success: false, error: "Failed to fetch download links" };
  }
}

export function formatFZDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function extractGenres(categories: string[]): string[] {
  const noise = ["Movie", "Download", "Movies", "movie", "download"];
  return categories
    .filter(c => !noise.some(n => c.toLowerCase().includes(n.toLowerCase()) && c.split(" ").length <= 3 && /\d/.test(c) === false))
    .filter(c => !c.match(/^\d{4}/))
    .slice(0, 3);
}
