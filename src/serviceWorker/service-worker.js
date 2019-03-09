/* globals workbox */
/* eslint-disable no-restricted-globals */

workbox.core.setCacheNameDetails({
    prefix: 'new-system',
    suffix: 'v0.0.1'
});
workbox.clientsClaim();
workbox.precaching.suppressWarnings();
// 缓存打包后的静态文件
workbox.precaching.precacheAndRoute(self.__precacheManifest || [], {});

/**
 * networkFirst 网络优先的策略
 */
workbox.routing.registerRoute(/\/api\//, workbox.strategies.networkFirst());

self.addEventListener('install', () => {
    self.skipWaiting();
    console.log('Resource updated');
});

self.addEventListener('message', event => {
    const replyPort = event.ports[0];
    const message = event.data;
    if (replyPort && message && message.type === 'skip-waiting') {
        event.waitUntil(
            self.skipWaiting().then(
                () => replyPort.postMessage({ error: null }),
                error => replyPort.postMessage({ error })
            )
        );
    }
});
