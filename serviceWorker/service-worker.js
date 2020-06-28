/* globals workbox */
const { core, precaching, strategies, routing, expiration } = workbox;

const PREFIX = "admin-template";
const getCacheName = name => `${PREFIX}-${name}`;

core.setCacheNameDetails({ prefix: PREFIX });

core.clientsClaim();
precaching.cleanupOutdatedCaches();

precaching.precacheAndRoute(self.__precacheManifest);

/**
 * Set cache strategy
 */
const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = strategies;

const requestStrategy = new NetworkFirst({
  cacheName: getCacheName("request"),
  networkTimeoutSeconds: 3,
});

const cacheImageStrategy = new CacheFirst({
  cacheName: getCacheName("images"),
  plugins: [
    new expiration.CacheExpiration(
      getCacheName("images"),
      { maxEntries: 60, maxAgeSeconds: 14 * 24 * 3600 }
    )
  ]
});

const staticResourcesStrategy = new StaleWhileRevalidate({
  cacheName: getCacheName("static-resources")
});

const filterRequest = types => ({ request }) => types.includes(request.destination);
const registerRoute = routing.registerRoute;

registerRoute(/\/api\//, requestStrategy);
registerRoute(filterRequest(["image"]), cacheImageStrategy);
registerRoute(filterRequest(["script", "style"]), staticResourcesStrategy);

/**
 * Listen event
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("message", event => {
  const replyPort = event.ports[0];
  const type = event.data?.type;
  if (replyPort && type === "skip-waiting") {
    event.waitUntil(
      self
        .skipWaiting()
        .then(() => replyPort.postMessage({ error: undefined }))
        .catch(error => replyPort.postMessage({ error }))
    );
  }
});
