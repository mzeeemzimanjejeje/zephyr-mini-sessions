const CACHE = "courtney-movies-v1";
const ASSET_CACHE = "courtney-movies-assets-v1";
const API_CACHE = "courtney-movies-api-v1";

// Static shell — always cache-first
const PRECACHE = ["/", "/icon-192.png", "/icon-512.png", "/manifest.json"];

// Image hostnames to cache
const IMAGE_HOSTS = new Set([
  "pbcdnw.aoneroom.com",
  "images.metahub.space",
  "fzmovies.ng",
  "www.fzmovies.ng",
  "img.fzmovies.net",
  "static.fzmovies.net",
]);

// API hostnames to cache with network-first + fallback
const API_HOSTS = new Set([
  "moviebox.davidcyril.name.ng",
  "apis.davidcyril.name.ng",
]);

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      c.addAll(PRECACHE).catch(() => {})
    )
  );
});

self.addEventListener("activate", (e) => {
  const keep = new Set([CACHE, ASSET_CACHE, API_CACHE]);
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // ─── Vite fingerprinted assets (JS/CSS/fonts) — cache-first forever ───
  if (
    url.hostname === self.location.hostname &&
    (url.pathname.startsWith("/assets/") || url.pathname.endsWith(".woff2"))
  ) {
    e.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const fresh = await fetch(request);
        if (fresh.ok) cache.put(request, fresh.clone());
        return fresh;
      })
    );
    return;
  }

  // ─── Images — cache-first, 7-day TTL ───
  if (IMAGE_HOSTS.has(url.hostname)) {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const fresh = await fetch(request).catch(() => null);
        if (fresh && fresh.ok) cache.put(request, fresh.clone());
        return fresh || new Response("", { status: 503 });
      })
    );
    return;
  }

  // ─── API — network-first, 5-min stale fallback ───
  if (API_HOSTS.has(url.hostname) && request.method === "GET") {
    e.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        try {
          const fresh = await fetch(request, { signal: AbortSignal.timeout(8000) });
          if (fresh.ok) {
            const stamped = new Response(fresh.body, {
              status: fresh.status,
              headers: new Headers({
                ...Object.fromEntries(fresh.headers.entries()),
                "x-sw-cached-at": String(Date.now()),
              }),
            });
            cache.put(request, stamped.clone());
            return stamped;
          }
          throw new Error("non-ok");
        } catch {
          const cached = await cache.match(request);
          if (cached) {
            const age = Date.now() - Number(cached.headers.get("x-sw-cached-at") ?? 0);
            if (age < 5 * 60 * 1000) return cached;
          }
          return cached || new Response(JSON.stringify({ error: "offline" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }
      })
    );
    return;
  }

  // ─── Navigation — network-first, shell fallback ───
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match("/");
        return cached || new Response("Offline", { status: 503 });
      })
    );
    return;
  }
});
