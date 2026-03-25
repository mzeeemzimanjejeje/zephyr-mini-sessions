const BASE = "https://moviebox.davidcyril.name.ng/api";

const HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
  Referer: "https://cineverse.name.ng/",
  Origin: "https://cineverse.name.ng",
  Accept: "application/json",
};

export interface CineverseItem {
  subjectId: string;
  subjectType: 1 | 2 | 6;
  title: string;
  thumbnail: string;
  cover?: { url: string };
  imdbRatingValue: string;
  imdbRatingCount?: number;
  releaseDate: string;
  duration: number;
  genre: string;
  countryName: string;
  hasResource: boolean;
  detailPath: string;
  description?: string;
  subtitles?: string;
  trailer?: {
    videoAddress: { url: string; duration: number; width: number; height: number };
    cover: { url: string };
  };
  stills?: { url: string };
  staffList?: Array<{ id: string; name: string; role: string; avatar?: { url: string } }>;
}

export interface CinevSeason {
  se: number;
  maxEp: number;
  allEp: string;
  resolutions: Array<{ resolution: number; epNum: number }>;
}

export interface CineverseInfoData {
  subject: CineverseItem;
  resource: {
    seasons?: CinevSeason[];
    source?: string;
    uploadBy?: string;
  };
}

export interface CineverseDownload {
  id: string;
  url: string;
  resolution: number;
  size: string;
}

export interface CineverseCaption {
  id: string;
  lan: string;
  lanName: string;
  url: string;
  delay?: number;
}

export interface CineverseSourcesData {
  downloads: CineverseDownload[];
  captions: CineverseCaption[];
}

export interface CineverseHomeSection {
  type: string;
  position: number;
  title: string;
  subjects: CineverseItem[];
  banner?: { items: Array<{ subjectId: string; subject: CineverseItem; image: { url: string } }> };
}

export interface CineverseHomeData {
  bannerItems: Array<{ subjectId: string; subject: CineverseItem; image: { url: string } }>;
  sections: CineverseHomeSection[];
  platformList: Array<{ name: string; uploadBy: string }>;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Cineverse API ${res.status}: ${path}`);
  const json = await res.json();
  if (json.data?.code && json.data?.reason) {
    throw new Error(`API error: ${json.data.message}`);
  }
  return json.data as T;
}

export async function searchCineverse(
  query: string,
  type?: 1 | 2,
  page?: number
): Promise<{ items: CineverseItem[]; hasMore: boolean; nextPage: string }> {
  const params = new URLSearchParams();
  if (type) params.set("type", String(type));
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString() ? `?${params}` : "";
  const data = await apiFetch<{
    items: CineverseItem[];
    pager: { hasMore: boolean; nextPage: string };
  }>(`search/${encodeURIComponent(query)}${qs}`);
  return {
    items: data.items ?? [],
    hasMore: data.pager?.hasMore ?? false,
    nextPage: data.pager?.nextPage ?? "",
  };
}

export async function fetchCineverseInfo(subjectId: string): Promise<CineverseInfoData> {
  const data = await apiFetch<{ subject: CineverseItem; resource: CineverseInfoData["resource"] }>(
    `info/${subjectId}`
  );
  return { subject: data.subject, resource: data.resource ?? {} };
}

export async function fetchCineverseSources(
  subjectId: string,
  season?: number,
  episode?: number
): Promise<CineverseSourcesData> {
  const qs = season != null && episode != null ? `?season=${season}&episode=${episode}` : "";
  const data = await apiFetch<CineverseSourcesData>(`sources/${subjectId}${qs}`);
  return data;
}

export async function fetchCineverseTrending(type?: 1 | 2): Promise<CineverseItem[]> {
  const qs = type ? `?type=${type}` : "";
  const data = await apiFetch<{ subjectList: CineverseItem[] }>(`trending${qs}`);
  return data.subjectList ?? [];
}

export async function fetchCineverseHomepage(): Promise<CineverseHomeData> {
  const data = await apiFetch<{
    operatingList: CineverseHomeSection[];
    platformList: Array<{ name: string; uploadBy: string }>;
  }>("homepage");

  const operating = data.operatingList ?? [];

  const bannerSection = operating.find((s) => s.type === "BANNER");
  const bannerItems = bannerSection?.banner?.items?.filter(
    (b) => b.subject && b.subject.hasResource && b.subject.subjectType !== 6
  ) ?? [];

  const sections = operating
    .filter((s) => s.type === "SUBJECTS_MOVIE" && s.subjects?.length > 0)
    .map((s) => ({
      ...s,
      subjects: s.subjects.filter((sub) => sub.subjectType !== 6 && sub.hasResource),
    }))
    .filter((s) => s.subjects.length > 0);

  return {
    bannerItems,
    sections,
    platformList: data.platformList ?? [],
  };
}

export function streamProxyUrl(originalUrl: string): string {
  return `${BASE}/stream?url=${encodeURIComponent(originalUrl)}`;
}

export function cineverseItemToContentItem(item: CineverseItem) {
  const stableId = Number(item.subjectId.slice(-13)) || 0;
  return {
    id: stableId,
    subjectId: item.subjectId,
    title: item.title,
    type: (item.subjectType === 2 ? "Series" : "Movie") as "Movie" | "Series",
    image: item.cover?.url || item.thumbnail || "",
    rating: item.imdbRatingValue ? parseFloat(item.imdbRatingValue) || undefined : undefined,
    votes: item.imdbRatingCount ? formatVotes(item.imdbRatingCount) : undefined,
    year: item.releaseDate ? parseInt(item.releaseDate.split("-")[0]) : 0,
    country: item.countryName || "",
    genres: item.genre ? item.genre.split(",").map((g) => g.trim()).filter(Boolean) : [],
  };
}

function formatVotes(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export async function fetchImdbId(title: string, year?: number): Promise<string | null> {
  try {
    const query = title.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
    const firstChar = query[0] ?? "a";
    const encoded = encodeURIComponent(query);
    const res = await fetch(
      `https://v3.sg.media-imdb.com/suggestion/${firstChar}/${encoded}.json`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const results: Array<{ id: string; l: string; y?: number; qid?: string }> = data.d ?? [];
    const match = results.find(r => {
      if (!r.id?.startsWith("tt")) return false;
      if (year && r.y && Math.abs(r.y - year) > 1) return false;
      return true;
    });
    return match?.id ?? null;
  } catch {
    return null;
  }
}

export function resolutionLabel(r: number): string {
  if (r >= 1080) return "1080p";
  if (r >= 720) return "720p";
  if (r >= 480) return "480p";
  return "360p";
}

export function fileSizeMB(size: string): string {
  const bytes = parseInt(size, 10);
  if (!bytes) return "";
  const gb = bytes / 1_073_741_824;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  return `${(bytes / 1_048_576).toFixed(0)} MB`;
}
