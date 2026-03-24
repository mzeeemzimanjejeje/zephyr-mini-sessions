import { useState, useEffect, useRef } from "react";
import { casperBrowse, casperTrending, casperToContentItem, type CasperItem } from "../api/casper";
import { imdbByTitle, type ContentItem } from "../data/content";

const cache = new Map<string, ContentItem[]>();
let nextCasperId = 50000;

function toCItem(raw: CasperItem): ContentItem {
  const key = raw.title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const imdbId = imdbByTitle.get(key);
  const item = casperToContentItem(raw, imdbId);
  item.id = nextCasperId++;
  return item;
}

export function useCasperBrowse(opts: {
  type?: "movie" | "tv";
  genre?: string;
  sort?: string;
  cacheKey: string;
}) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (cache.has(opts.cacheKey)) {
      setItems(cache.get(opts.cacheKey)!);
      setLoading(false);
      return;
    }
    setLoading(true);
    casperBrowse({ type: opts.type, genre: opts.genre, sort: opts.sort })
      .then(res => {
        if (!mounted.current) return;
        const converted = res.items.map(toCItem);
        cache.set(opts.cacheKey, converted);
        setItems(converted);
        setLoading(false);
      })
      .catch(() => { if (mounted.current) setLoading(false); });
    return () => { mounted.current = false; };
  }, [opts.cacheKey]);

  return { items, loading };
}

export function useCasperTrending(type: "movie" | "tv") {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const key = `trending-${type}`;
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (cache.has(key)) {
      setItems(cache.get(key)!);
      setLoading(false);
      return;
    }
    casperTrending(type).then(rawList => {
      if (!mounted.current) return;
      const converted = rawList.map(toCItem);
      cache.set(key, converted);
      setItems(converted);
      setLoading(false);
    }).catch(() => { if (mounted.current) setLoading(false); });
    return () => { mounted.current = false; };
  }, [key]);

  return { items, loading };
}
