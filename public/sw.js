const CACHE = "courtney-ent-v2";

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      c.addAll(["/", "/icon-192.png", "/icon-512.png"]).catch(() => {})
    )
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Cache images from CDN
  if (
    url.hostname === "pbcdnw.aoneroom.com" ||
    url.hostname === "images.metahub.space"
  ) {
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

  // Network-first for navigation — keeps app up to date
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
