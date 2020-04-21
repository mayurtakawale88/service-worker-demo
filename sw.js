const VERSION = 'v1';
const CACHENAME = 'my-test-app';

self.addEventListener('install', event => event.waitUntil(installServiceWorker()));
self.addEventListener('activate', event => event.waitUntil(activateSW()));
self.addEventListener('fetch', event => event.respondWith(cacheThenNetwork(event)));

// importScripts('./assets/js/indexdb.js');


async function installServiceWorker() {
    const cache = await caches.open(CACHENAME);

    return cache.addAll([
        '/index.html',
        '/css/bootstrap.min.css',
        '/js/bootstrap.min.js',
        '/js/jquery.min.js',
        '/js/main.js'
    ]);
}

async function activateSW() {
    const cacheKeys = await caches.keys();
    cacheKeys.forEach(cacheKey => {
        if (cacheKey !== CACHENAME ) {
            caches.delete(cacheKey);
        }
    });
}

async function cacheThenNetwork(event) {
    const normalizedUrl = new URL(event.request.url);
    normalizedUrl.search = '';
    const cachedResponse = await getCache(normalizedUrl);
    if (cachedResponse) {
        fetchLiveResponse(event, normalizedUrl);
        return cachedResponse;
    }
    const networkResponse = await fetchLiveResponse(event, normalizedUrl);
    return networkResponse;
}

async function fetchLiveResponse(event, cacheKey) {
    try {
        const interceptUrl = await pixelInterCeptor(event.request.url);
        const networkResponse = await fetch(interceptUrl);
        if (interceptUrl.indexOf('pixel.gif') > -1) {
            await setCache(event, cacheKey, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
       // Offline event tracking 
      //  await savePixel(event.request.url);
        return {};
    }
}

async function pixelInterCeptor(url) {
    try {
        const pixelServerObj = {
            event: "interaction",
            customer: "client",
            operating_system_name: "os_name",
            utm_source: "x1",
            utm_medium: "x2",
            utm_campaign: "x3",
            campaign_url: "landing_url"
        };

        for (const key of Object.keys(pixelServerObj)) {
            url = url.replace(pixelServerObj[key], key);
        }

        return url;
    } catch (error) {
        return url;
    }
}

async function getCache(cacheName) {
    const cache = await caches.open(CACHENAME);
    const cachedResponse = await cache.match(cacheName);
    return cachedResponse;
}

async function setCache(event, cacheName, data) {
    event.waitUntil(async function() {
        const cache = await caches.open(CACHENAME);
        await cache.put(cacheName, data);
    }());
}

