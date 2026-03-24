import { Router } from "express";

const router = Router();

const IMDB_BASE = "https://api.imdbapi.dev";
const HEADERS: Record<string, string> = {
  "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0",
  Accept: "application/json",
};

router.get("/imdb/search", async (req, res) => {
  try {
    const { query, type, limit } = req.query as Record<string, string>;
    if (!query) { res.status(400).json({ error: "query required" }); return; }
    const params = new URLSearchParams({ query });
    if (type) params.set("type", type);
    params.set("limit", limit ?? "5");
    const upstream = await fetch(`${IMDB_BASE}/search/titles?${params}`, { headers: HEADERS });
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "IMDb search proxy error", detail: String(err) });
  }
});

router.get("/imdb/seasons/:imdbId", async (req, res) => {
  try {
    const { imdbId } = req.params;
    const upstream = await fetch(`${IMDB_BASE}/titles/${imdbId}/seasons`, { headers: HEADERS });
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "IMDb seasons proxy error", detail: String(err) });
  }
});

export default router;
