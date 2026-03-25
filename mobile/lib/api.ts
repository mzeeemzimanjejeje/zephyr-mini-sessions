const BASE = "https://moviebox.davidcyril.name.ng/api";
const OMDB_KEY = "742b2d09";

const HEADERS: Record<string, string> = {
  "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
  Referer: "https://cineverse.name.ng/",
  Origin: "https://cineverse.name.ng",
  Accept: "application/json",
};

export interface ContentItem {
  subjectId: string;
  title: string;
  type: "Movie" | "Series";
  image: string;
  rating: string;
  year: string;
  genre: string;
  description?: string;
}

function mapItem(raw: any): ContentItem {
  return {
    subjectId: raw.subjectId ?? String(raw.id ?? ""),
    title: raw.title ?? raw.name ?? "",
    type: raw.subjectType === 1 || raw.domainType === 1 ? "Movie" : "Series",
    image: raw.thumbnail?.url ?? raw.coverVerticalUrl ?? raw.coverHorizontalUrl ?? "",
    rating: raw.imdbRatingValue ?? String(raw.score ?? ""),
    year: raw.releaseDate?.split("-")[0] ?? raw.releaseTime?.split("-")[0] ?? "",
    genre: raw.genre ?? raw.tagList?.map((t: any) => t.name).join(", ") ?? "",
    description: raw.description ?? "",
  };
}

export async function fetchHome(): Promise<{ banner: ContentItem[]; sections: Array<{ title: string; items: ContentItem[] }> }> {
  const res = await fetch(`${BASE}/homepage?page=1`, { headers: HEADERS });
  const data = await res.json();
  const raw = data?.data ?? data;

  const banner: ContentItem[] = (raw.bannerItems ?? []).map((b: any) =>
    mapItem(b.subject ?? b)
  );

  const sections: Array<{ title: string; items: ContentItem[] }> = [];
  for (const section of raw.sections ?? raw.rows ?? []) {
    const items = (section.subjects ?? section.items ?? []).map(mapItem);
    if (items.length > 0) {
      sections.push({ title: section.title ?? "Popular", items });
    }
  }

  if (sections.length === 0 && banner.length === 0) {
    const allItems = Object.values(raw)
      .filter(Array.isArray)
      .flat()
      .map((i: any) => i.subject ?? i)
      .filter((i: any) => i?.subjectId || i?.id)
      .map(mapItem);
    if (allItems.length > 0) {
      sections.push({ title: "Trending Now", items: allItems.slice(0, 20) });
    }
  }

  return { banner: banner.slice(0, 5), sections };
}

export async function searchContent(query: string): Promise<ContentItem[]> {
  const res = await fetch(`${BASE}/search?keyword=${encodeURIComponent(query)}&page=1`, { headers: HEADERS });
  const data = await res.json();
  const results = data?.data?.searchResults ?? data?.data?.items ?? [];
  return results.map(mapItem);
}

export async function fetchImdbId(title: string, year?: string): Promise<string> {
  try {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}${year ? `&y=${year}` : ""}&apikey=${OMDB_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.imdbID) return data.imdbID;
  } catch {}
  return "";
}

export const EMBED_SOURCES = [
  (id: string, type: "Movie" | "Series", s: number, e: number) =>
    type === "Movie"
      ? `https://vidsrc.xyz/embed/movie/${id}`
      : `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}`,
  (id: string, type: "Movie" | "Series", s: number, e: number) =>
    type === "Movie"
      ? `https://multiembed.mov/?video_id=${id}&tmdb=0`
      : `https://multiembed.mov/?video_id=${id}&tmdb=0&s=${s}&e=${e}`,
  (id: string, type: "Movie" | "Series", s: number, e: number) =>
    type === "Movie"
      ? `https://www.2embed.cc/embed/${id}`
      : `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  (id: string, type: "Movie" | "Series", s: number, e: number) =>
    type === "Movie"
      ? `https://vidsrc.to/embed/movie/${id}`
      : `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  (id: string, type: "Movie" | "Series", s: number, e: number) =>
    type === "Movie"
      ? `https://player.videasy.net/movie/${id}`
      : `https://player.videasy.net/tv/${id}/${s}/${e}`,
];
