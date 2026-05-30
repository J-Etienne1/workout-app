// Simple, build-agnostic service worker for the Workout PWA.
// Bump VERSION to force old caches to be cleared on the next visit.
const VERSION = "v1";
const CACHE = `workout-${VERSION}`;

self.addEventListener("install", () => {
  // Activate this worker as soon as it finishes installing.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Page loads: network-first, so a new deploy is picked up whenever online,
  // falling back to the cached page (or app start URL) when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(request);
          return cached || (await caches.match(self.registration.scope));
        }
      })()
    );
    return;
  }

  // Static assets (hashed JS/CSS, images): cache-first for instant, offline-
  // capable loads. New deploys use new hashed filenames, so this never goes stale.
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE);
        cache.put(request, fresh.clone());
        return fresh;
      } catch {
        return cached;
      }
    })()
  );
});
