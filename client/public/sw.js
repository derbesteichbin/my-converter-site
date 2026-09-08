// ── Service worker ───────────────────────────────────────────────────
//
// Network-first with a cache fallback. The app is a single-page React build
// served by Vite with hashed asset filenames, so a stale-but-present cache is
// only ever used when the network fails.
//
// Bump CACHE_NAME on every meaningful change: the activate handler deletes
// every cache that is not the current one, which is what forces returning
// users onto the new shell.
const CACHE_NAME = 'convertanyformat-v7';

// The SPA shell plus the icons the manifest and the install prompt reference,
// so an installed app still renders its own chrome offline.
const SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  // Navbar logo variants, all four so the header renders correctly offline
  // whatever the theme and pixel density (35 kB for the set).
  '/images/logo-light-64.png',
  '/images/logo-light-128.png',
  '/images/logo-dark-64.png',
  '/images/logo-dark-128.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // One missing file must not abort the whole install, which is what
      // cache.addAll() would do — precache each entry independently.
      Promise.all(SHELL_URLS.map((url) => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Only put responses in the cache that are actually reusable. The previous
// version cached whatever came back, which meant 404s, redirects and opaque
// cross-origin responses could be served from cache later.
function isCacheable(response) {
  return response && response.status === 200 && response.type === 'basic';
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API traffic is never cached — conversions and auth must always hit
  // the network, and the credit balance must never come from a cache.
  if (url.pathname.startsWith('/api/')) return;

  // Navigations get the SPA shell as their offline fallback. Deep links like
  // /tools/pdf-to-word are client-side routes with no cache entry of their
  // own, so without this an offline visit to any route but "/" fails outright.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (isCacheable(response)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((hit) => hit || caches.match('/index.html'))
            .then((hit) => hit || caches.match('/'))
            .then(
              (hit) =>
                hit ||
                new Response('<h1>Offline</h1><p>Reconnect to continue converting.</p>', {
                  status: 503,
                  headers: { 'Content-Type': 'text/html; charset=utf-8' },
                })
            )
        )
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (isCacheable(response)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Lets the page tell a waiting worker to take over immediately.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
