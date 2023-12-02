
const CACHE = "NostrNet-V0.2";
// Import workbox
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

// Define caching strategies
const staticCacheName = "static-v1";
workbox.routing.registerRoute(
  new RegExp(".*(js|html|css)"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: staticCacheName,
    plugins: [
      // Clear old cache entries on update
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Precache static assets
workbox.precaching.precacheAndRoute([
  { url: "/", revision: "1" },
  { url: "/index.html", revision: "1" },
  { url: "/app.css", revision: "1" },
  { url: "/assets/js/lists.js", revision: "1" },
]);

// Fallback to network if cache fails
workbox.routing.setCatchHandler(async ({ event }) => {
  try {
    // Fetch from network
    const response = await fetch(event.request);
    return response;
  } catch (error) {
    // Offline page
    return new Response("Offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
});

// Update cache on new versions
self.addEventListener("message", (event) => {
  if (event.data === "cacheUpdated") {
    self.skipWaiting();
  }
});

// Activate service worker and update cache
self.addEventListener("activate", (event) => {
  self.clients.claim();
  event.waitUntil(workbox.precaching.cleanupOutdatedCaches());
});
