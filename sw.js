/* Symptom-Based Internal Medicine V5.7 — offline service worker.
   Bump CACHE whenever index.html, the figures or the fonts change so devices
   pick up the new copy.

   SHELL is small and must all succeed, so installation never fails.
   MEDIA (figures + fonts, ~15 MB) is filled in afterwards, in small batches,
   so a slow or flaky connection cannot abort the install. */
const CACHE = 'sbim-v5-7-3';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

const MEDIA = [
  "./assets/fig-01.webp",
  "./assets/fig-02.webp",
  "./assets/fig-03.webp",
  "./assets/fig-04.webp",
  "./assets/fig-05.webp",
  "./assets/fig-06.webp",
  "./assets/fig-07.webp",
  "./assets/fig-08.webp",
  "./assets/fig-09.webp",
  "./assets/fig-10.webp",
  "./assets/fig-11.webp",
  "./assets/fig-12.webp",
  "./assets/fig-13.webp",
  "./assets/fig-14.webp",
  "./assets/fig-15.webp",
  "./assets/fig-16.webp",
  "./assets/fig-17.webp",
  "./assets/fig-18.webp",
  "./assets/fig-19.webp",
  "./assets/fig-20.webp",
  "./assets/fig-21.webp",
  "./assets/fig-22.webp",
  "./assets/fig-23.webp",
  "./assets/fig-24.webp",
  "./assets/fig-25.webp",
  "./assets/fig-26.webp",
  "./assets/fig-27.webp",
  "./assets/fig-28.webp",
  "./assets/fig-29.webp",
  "./assets/fig-30.webp",
  "./assets/fig-31.webp",
  "./assets/fig-32.webp",
  "./assets/fig-33.webp",
  "./assets/fig-34.webp",
  "./assets/fig-35.webp",
  "./assets/fig-36.webp",
  "./assets/fig-37.webp",
  "./assets/fig-38.webp",
  "./assets/fig-39.webp",
  "./assets/fig-40.webp",
  "./assets/fig-41.webp",
  "./assets/fig-42.webp",
  "./fonts/font-1.woff2",
  "./fonts/font-2.woff2",
  "./fonts/font-3.woff2",
  "./fonts/font-4.woff2",
  "./fonts/font-5.woff2",
  "./fonts/font-6.woff2",
  "./fonts/font-7.woff2",
  "./fonts/font-8.woff2"
];

const ALL = SHELL.concat(MEDIA);

async function fillMedia() {
  const cache = await caches.open(CACHE);
  // Small batches keep memory low on phones and let a single failure be retried
  // without losing the rest of the download.
  for (let i = 0; i < MEDIA.length; i += 4) {
    const batch = MEDIA.slice(i, i + 4);
    await Promise.all(batch.map(async url => {
      if (await cache.match(url)) return;
      try {
        const res = await fetch(url, { cache: 'reload' });
        if (res.ok) await cache.put(url, res);
      } catch (e) { /* retried by REPAIR_OFFLINE */ }
    }));
    // Let open pages show progress while the figures download.
    await report();
  }
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('sbim-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
    .then(() => fillMedia())
    .then(() => report()));
});

async function isReady() {
  const c = await caches.open(CACHE);
  const hits = await Promise.all(ALL.map(f => c.match(f)));
  return hits.every(Boolean);
}
async function missingCount() {
  const c = await caches.open(CACHE);
  const hits = await Promise.all(ALL.map(f => c.match(f)));
  return hits.filter(h => !h).length;
}
async function report(client) {
  const msg = { type: 'OFFLINE_STATUS', ready: await isReady(), missing: await missingCount(), total: ALL.length };
  if (client) { client.postMessage(msg); return; }
  const all = await self.clients.matchAll();
  for (const c of all) c.postMessage(msg);
}

self.addEventListener('message', e => {
  const type = e.data && e.data.type;
  if (type === 'SKIP_WAITING') self.skipWaiting();
  if (type === 'CHECK_OFFLINE') e.waitUntil(report(e.source));
  if (type === 'REPAIR_OFFLINE') e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .catch(() => {})
      .then(() => fillMedia())
      .then(() => report(e.source))
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
  );
});
