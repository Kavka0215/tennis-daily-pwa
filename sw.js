/* Tennis Daily service worker.
   NETWORK-FIRST for same-origin GETs, so every Vercel deploy is picked up
   immediately instead of serving a stale app. The cache is only an offline
   fallback — which matters here because the club has patchy signal and the
   whole point is being able to log a session courtside. */
const CACHE = "tennis-daily-v1";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./logo.svg",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon-180.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match("./index.html")))
  );
});
