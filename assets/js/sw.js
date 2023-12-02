const CACHE_NAME = "NostrNet-V0.2";

// Import workbox modules
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-backgroundSync.js"
);
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-push.js"
);

// Define caching strategies
const staticCacheName = "static-v2";
const dataSyncQueue = new workbox.backgroundSync.Queue("dataSyncQueue");

// Precache static assets
workbox.precaching.precacheAndRoute([
  { url: "/", revision: "1" },
  { url: "/index.html", revision: "1" },
  { url: "/app.css", revision: "1" },
  { url: "/assets/js/lists.js", revision: "1" },
  // Additional assets...
]);

// Cache dynamic resources with stale-while-revalidate strategy
workbox.routing.registerRoute(
  new RegExp(".*(js|html|css|png|jpg|gif|woff2|json)"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: staticCacheName,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Background sync for data updates
workbox.routing.registerRoute(
  "/api/sync",
  new workbox.backgroundSync.Plugin({
    queue: dataSyncQueue,
  })
);

// Push notifications handling
workbox.push.register({
  onPush: (event) => {
    // Store notification data in IndexedDB
    // ...

    if (!navigator.onLine) {
      return;
    }

    // Display the notification
    // ...
  },
});

// Offline fallback
workbox.routing.setCatchHandler(async ({ event }) => {
  try {
    // Attempt to fetch from cache
    const response = await caches.match(event.request);
    if (response) {
      return response;
    }
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

// Activate service worker and clean up outdated caches
self.addEventListener("activate", (event) => {
  self.clients.claim();
  event.waitUntil(workbox.precaching.cleanupOutdatedCaches());
});
