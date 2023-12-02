// Update the cache version whenever you make changes to cache logic
const CACHE_VERSION = "v1";
const CACHE = `NostrWeb-${CACHE_VERSION}`;

// Path to the offline fallback page
const offlineFallbackPage = "/offline.html";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      // Precache important assets here
      return cache.addAll([
        offlineFallbackPage,
        "/index.html",
        "/lists.html",
        "/app.css",
        "/lists.css",
        "/lists.js",
        "/assests/js/lists.js",
        "/assests/js/search.js",
        "/assests/js/layout.js",
        // Add other assets here
      ]);
    })
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  new RegExp("/*"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE,
  })
);

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })()
    );
  }
});
