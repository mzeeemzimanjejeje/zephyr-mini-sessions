const API_BASE = "/api";

export interface BwmSource {
  id: string;
  quality: string;
  stream_url: string;
  download_url: string;
  size: string;
  format: string;
  subtitles?: BwmSubtitle[];
}

export interface BwmSubtitle {
  id: string;
  lan: string;
  lanName: string;
  url: string;
}

export interface BwmSourcesResult {
  success: boolean;
  results: BwmSource[];
  subtitles: BwmSubtitle[];
}

export interface BwmSearchItem {
  subjectId: string;
  subjectType: 1 | 2;
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  genre: string;
  cover: { url: string };
  imdbRatingValue?: string;
}

async function bwmGet<T>(endpoint: string): Promise<T | null> {
  try {
    const r = await fetch(`${API_BASE}/bwm?endpoint=${encodeURIComponent(endpoint)}`);
    if (!r.ok) return null;
    return r.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function bwmSources(
  subjectId: string,
  season?: number,
  episode?: number,
): Promise<BwmSourcesResult | null> {
  let endpoint = `/sources/${subjectId}`;
  if (season !== undefined && episode !== undefined) {
    endpoint += `?season=${season}&episode=${episode}`;
  }
  const data = await bwmGet<{ status: number; success: boolean; results: BwmSource[]; subtitles: BwmSubtitle[] }>(
    endpoint,
  );
  if (!data || !data.success) return null;
  const subtitles = data.subtitles ?? [];
  const results = data.results.map((r) => ({ ...r, subtitles }));
  return { success: true, results, subtitles };
}

export async function bwmSearch(query: string): Promise<BwmSearchItem[]> {
  const data = await bwmGet<{
    status: number;
    success: boolean;
    results: { items: BwmSearchItem[] };
  }>(`/search/${encodeURIComponent(query)}`);
  return data?.results?.items ?? [];
}

export async function bwmInfo(subjectId: string): Promise<BwmSearchItem | null> {
  const data = await bwmGet<{
    status: number;
    success: boolean;
    results: { subject: BwmSearchItem };
  }>(`/info/${subjectId}`);
  return data?.results?.subject ?? null;
}

export async function imdbSearch(title: string, type?: "movie" | "tvSeries"): Promise<string | null> {
  try {
    const params = new URLSearchParams({ query: title, limit: "8" });
    const r = await fetch(`${API_BASE}/imdb/search?${params}`);
    if (!r.ok) return null;
    const data = await r.json();
    let titles: Array<{ id: string; primaryTitle: string; type: string }> = data.titles ?? [];
    if (!titles.length) return null;
    const titleLower = title.toLowerCase().replace(/[^a-z0-9 ]/g, "");
    if (type) {
      const filtered = titles.filter((t) => t.type === type);
      if (filtered.length) titles = filtered;
    }
    const exact = titles.find((t) => t.primaryTitle.toLowerCase().replace(/[^a-z0-9 ]/g, "") === titleLower);
    return exact?.id ?? titles[0]?.id ?? null;
  } catch {
    return null;
  }
}
