export interface CasperItem {
  subjectId: string;
  subjectType: 1 | 2;
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  genre: string;
  cover: { url: string; thumbnail?: string };
  countryName: string;
  imdbRatingValue: string;
  imdbRatingCount?: number;
  hasResource: boolean;
  trailer: { videoAddress: { url: string; duration: number } } | null;
  staffList: Array<{ name: string; character: string; avatarUrl: string; staffType: number }>;
  totalSeasons?: number;
  totalEpisodes?: number;
  episodesPerSeason?: number[];
}

export interface CasperBrowseResult {
  items: CasperItem[];
  hasMore: boolean;
  page: string;
  nextPage?: string;
}

const API_BASE = "/api/casper";

async function get<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    const r = await fetch(`${API_BASE}/${endpoint}${qs}`);
    if (!r.ok) return null;
    return r.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function casperTrending(type: "movie" | "tv"): Promise<CasperItem[]> {
  const data = await get<{ data: { subjectList: CasperItem[] } }>("trending", { type });
  return data?.data?.subjectList ?? [];
}

export async function casperBrowse(opts: {
  type?: "movie" | "tv";
  genre?: string;
  page?: number;
  sort?: string;
}): Promise<CasperBrowseResult> {
  const params: Record<string, string> = { sort: opts.sort ?? "trending", page: String(opts.page ?? 1) };
  if (opts.type) params.type = opts.type;
  if (opts.genre) params.genre = opts.genre;
  const data = await get<{ data: { items: CasperItem[]; pager: { hasMore: boolean; nextPage: string; page: string } } }>("browse", params);
  return {
    items: data?.data?.items ?? [],
    hasMore: data?.data?.pager?.hasMore ?? false,
    page: data?.data?.pager?.page ?? "1",
    nextPage: data?.data?.pager?.nextPage,
  };
}

export async function casperSearch(keyword: string, type?: "movie" | "tv"): Promise<CasperItem[]> {
  const params: Record<string, string> = { keyword };
  if (type) params.type = type;
  const data = await get<{ data: { items: CasperItem[] } }>("search", params);
  return data?.data?.items ?? [];
}

export async function casperDetail(subjectId: string): Promise<CasperItem | null> {
  const data = await get<{ data: { subject: CasperItem } }>("detail", { subjectId });
  return data?.data?.subject ?? null;
}

export function casperToContentItem(
  item: CasperItem,
  imdbId?: string,
): { id: number; title: string; type: "Movie" | "Series"; image: string; rating?: number; year: number; country: string; genres: string[]; imdbId?: string; subjectId?: string; description?: string; trailerUrl?: string; totalSeasons?: number; cast?: Array<{ name: string; character: string; photo: string }> } {
  const year = item.releaseDate ? parseInt(item.releaseDate.split("-")[0]) : 0;
  const type = item.subjectType === 1 ? "Movie" as const : "Series" as const;
  const rating = item.imdbRatingValue ? parseFloat(item.imdbRatingValue) : undefined;
  const genres = item.genre ? item.genre.split(",").map(g => g.trim()).filter(Boolean) : ["Drama"];

  return {
    id: 0,
    title: item.title,
    type,
    image: item.cover?.url ?? "",
    rating: rating && !isNaN(rating) ? rating : undefined,
    year,
    country: item.countryName ?? "Unknown",
    genres,
    imdbId,
    subjectId: item.subjectId,
    description: item.description || undefined,
    trailerUrl: item.trailer?.videoAddress?.url ?? undefined,
    totalSeasons: item.totalSeasons,
    cast: item.staffList?.map(s => ({
      name: s.name,
      character: s.character,
      photo: s.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=1a1a1a&color=fff&size=200`,
    })) ?? [],
  };
}
