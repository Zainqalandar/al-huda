const CACHE_VERSION = 'alhuda-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;

const CORE_ASSETS = ['/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, API_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function isApiRequest(requestUrl) {
  return (
    requestUrl.includes('quranapi.pages.dev') ||
    requestUrl.includes('api.alquran.cloud')
  );
}

function isNextAsset(requestUrl) {
  return requestUrl.pathname.startsWith('/_next/');
}

function cacheResponse(cacheName, request, response) {
  if (!response || !response.ok) {
    return;
  }

  const copy = response.clone();
  caches.open(cacheName).then((cache) => cache.put(request, copy));
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);

  if (isApiRequest(requestUrl.href)) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        try {
          const response = await fetch(request);
          cache.put(request, response.clone());
          return response;
        } catch (error) {
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          throw error;
        }
      })
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          cacheResponse(STATIC_CACHE, request, response);
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }

          const fallback = await caches.match('/');
          if (fallback) {
            return fallback;
          }

          return new Response('Offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          });
        })
    );
    return;
  }

  if (requestUrl.origin === self.location.origin && isNextAsset(requestUrl)) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then((response) => {
          cacheResponse(STATIC_CACHE, request, response);
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          cacheResponse(STATIC_CACHE, request, response);
          return response;
        })
        .catch(() => cached);

      if (cached) {
        void fetchPromise;
        return cached;
      }

      return fetchPromise;
    })
  );
});
