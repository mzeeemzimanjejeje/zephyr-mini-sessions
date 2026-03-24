import { Router } from "express";

const router = Router();

const BWM_BASE = "https://aubiomhswbxrxgfnoles.supabase.co/functions/v1/bwm-xmd";
const BWM_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1YmlvbWhzd2J4cnhnZm5vbGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxOTA0MzUsImV4cCI6MjA4NTc2NjQzNX0.ZqnFKjaaH2lA0LOfJs_58LNRIgdoW6d-v3WhiHCDmOk";

const BWM_HEADERS: Record<string, string> = {
  Authorization: `Bearer ${BWM_JWT}`,
  apikey: BWM_JWT,
  "Content-Type": "application/json",
  Origin: "https://bwmxmd.co.ke",
  Referer: "https://bwmxmd.co.ke/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

router.get("/bwm", async (req, res) => {
  try {
    const endpoint = req.query.endpoint as string;
    if (!endpoint) {
      res.status(400).json({ error: "endpoint query param required" });
      return;
    }
    const url = `${BWM_BASE}?action=movie&endpoint=${encodeURIComponent(endpoint)}`;
    const upstream = await fetch(url, { headers: BWM_HEADERS });
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "BWM proxy error", detail: String(err) });
  }
});

export default router;
