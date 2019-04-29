importScripts("precache-manifest.0185fb5ab67f270b417864288009f532.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/* globals workbox */
/* eslint-disable no-restricted-globals */

workbox.core.setCacheNameDetails({
    prefix: 'ant-system',
    suffix: 'v1.1.0'
});
workbox.clientsClaim();
workbox.precaching.suppressWarnings();

// 缓存打包后的静态文件
workbox.precaching.precacheAndRoute(self.__precacheManifest || [], {});

/**
 * 缓存策略
 * networkFirst 网络优先的策略
 */
workbox.routing.registerRoute(/\/api\//, workbox.strategies.networkFirst());
workbox.routing.registerRoute(new RegExp('/color.less'), workbox.strategies.staleWhileRevalidate());

self.addEventListener('install', () => {
    self.skipWaiting();
    console.log('Resource updated');
});

self.addEventListener('message', event => {
    const replyPort = event.ports[0];
    const message = event.data;
    if (replyPort && message && message.type === 'skip-waiting') {
        event.waitUntil(
            self.skipWaiting()
                .then(() => replyPort.postMessage({ error: null }))
                .catch(error => replyPort.postMessage({ error }))
        );
    }
});

