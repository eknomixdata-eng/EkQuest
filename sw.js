// Quest Invoices — Service Worker
// Caches the app shell (this is what makes "Install" available and lets the
// app reopen offline). All actual invoice/quotation/receipt data lives in
// the browser's localStorage on the device — this worker never touches it.
//
// Bump CACHE_VERSION any time index.html/manifest.json/icons change, so
// returning users automatically pick up the new version instead of being
// stuck on a stale cached copy.
const CACHE_VERSION = 'quest-invoices-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((name) => name !== CACHE_VERSION).map((name) => caches.delete(name))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle our own same-origin app-shell files. Everything else
  // (the html2pdf CDN script, any future external calls) goes straight to
  // the network untouched — those need a live connection regardless.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin){
    return;
  }

  event.respondWith(
    // Network-first: a person who's online always gets the latest version;
    // only falls back to the cached copy when the network is unavailable.
    fetch(req)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});
