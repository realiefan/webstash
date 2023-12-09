const CACHE = "NostrNet-V0.2";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

// Define offline fallback page
const offlineFallbackPage = "/offline.html";

// Service worker message handling
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Cache offline fallback page and critical resources during installation
self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      // Add critical resources to cache for faster loading
      return cache.addAll([
        offlineFallbackPage,
        "/index.html",
        "/style.css",
        "/assests/js/lists.js",
        "/assests/js/search.js",
        "/assests/pages/wallet/wallet.html",
        "/assests/pages/wallet/wallet.js",
        "/assests/pages/wallet/wallet.css"
      ]);
    })
  );
});

// Enable navigation preload for faster loading
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Define caching strategies for different content types
workbox.routing.registerRoute(
  /\.(jpe?g|png|gif|svg)$/i,
  new workbox.strategies.CacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60, // One week
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /\.(js|css)$/i,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "assets",
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // One month
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200, 304], // Cache successful and error responses
      }),
    ],
  })
);

workbox.routing.registerRoute(
  // Match all other routes
  new RegExp("/*"),
  new workbox.strategies.NetworkFirst({
    cacheName: "pages",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50, // Define cache size limit
      }),
    ],
  })
);

// Handle navigation requests
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Use preloaded response if available
          const preloadResp = await event.preloadResponse;
          if (preloadResp) {
            return preloadResp;
          }

          // Fetch from network
          const networkResp = await fetch(event.request);

          // Update cache with network response
          if (networkResp.status === 200) {
            const cache = await caches.open("pages");
            await cache.put(event.request, networkResp.clone());
          }

          return networkResp;
        } catch (error) {
          // Log the error for debugging
          console.error(error);

          // Use cached fallback page if network fails
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })()
    );
  }
});
