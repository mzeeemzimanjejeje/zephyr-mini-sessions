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

export interface FZDownloadResult {
  success: boolean;
  source_url?: string;
  meetdownload_url?: string;
  download_url?: string;
  filename?: string;
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

const KNOWN_GENRES = new Set([
  "action", "adventure", "animation", "biography", "comedy", "crime",
  "documentary", "drama", "family", "fantasy", "history", "horror",
  "music", "mystery", "romance", "sci-fi", "science fiction", "sport",
  "sports", "thriller", "war", "western", "nollywood", "bollywood",
  "kdrama", "k-drama", "korean",
]);

export function extractGenres(categories: string[]): string[] {
  return categories
    .filter(c => {
      const lower = c.toLowerCase().trim();
      if (/\d{4}/.test(c)) return false;
      if (lower.includes("download")) return false;
      if (lower.endsWith(" movie") && !KNOWN_GENRES.has(lower.replace(" movie", ""))) return false;
      if (lower.endsWith(" movies")) {
        const base = lower.replace(" movies", "");
        return KNOWN_GENRES.has(base);
      }
      return KNOWN_GENRES.has(lower);
    })
    .map(c => c.replace(/ movies$/i, "").replace(/ movie$/i, "").trim())
    .filter((c, i, arr) => arr.indexOf(c) === i)
    .slice(0, 3);
}

export function decodeHtml(html: string): string {
  return html
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8211;/g, "\u2013")
    .replace(/&#8212;/g, "\u2014")
    .replace(/&nbsp;/g, " ");
}
