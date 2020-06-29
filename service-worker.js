importScripts("precache-manifest.11b01d93b24f37a13484ee24f03840db.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

/* globals workbox */
/* eslint-disable */

workbox.core.setCacheNameDetails({
  prefix: 'admin-template',
  suffix: 'v2.0.0',
});
workbox.core.clientsClaim();
workbox.precaching.suppressWarnings();

// 缓存打包后的静态文件
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

/**
 * 缓存策略
 * networkFirst 网络优先的策略
 */
workbox.routing.registerRoute(/\/api\//, workbox.strategies.networkFirst());
workbox.routing.registerRoute(new RegExp('/color.less'), workbox.strategies.staleWhileRevalidate());

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('message', event => {
  const replyPort = event.ports[0];
  const message = event.data;
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self
        .skipWaiting()
        .then(() => replyPort.postMessage({ error: null }))
        .catch(error => replyPort.postMessage({ error })),
    );
  }
});

