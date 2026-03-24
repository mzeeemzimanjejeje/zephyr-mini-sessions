import { Router } from "express";

const router = Router();

const CASPER_BASE = "https://wolflix.xwolf.space/api/wolflix";
const UPSTREAM_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  "Referer": "https://wolflix.xwolf.space/",
  "Accept": "application/json",
};

router.get("/casper/:endpoint", async (req, res) => {
  try {
    const { endpoint } = req.params;
    const query = new URLSearchParams(req.query as Record<string, string>).toString();
    const url = `${CASPER_BASE}/${endpoint}${query ? `?${query}` : ""}`;

    const upstream = await fetch(url, { headers: UPSTREAM_HEADERS });

    if (!upstream.ok) {
      const text = await upstream.text();
      res.status(upstream.status).json({ success: false, error: text.slice(0, 200) });
      return;
    }

    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: "Proxy error" });
  }
});

export default router;
