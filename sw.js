const CACHE = "moonlink-v2";
const ASSETS = [
  ".",
  "index.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png"
];

// Precache the app shell. allSettled so one missing asset won't break install.
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(ASSETS.map(a => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

// Drop old caches on activate.
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// problems.json is never cached here — the app persists the library in
// IndexedDB, so offline still has it and online always sees a fresh dataset.
// Navigations are network-first (so app updates propagate), everything else
// cache-first.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (new URL(e.request.url).pathname.endsWith("/problems.json")) return;
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return r;
      }).catch(() =>
        caches.match(e.request).then(hit => hit || caches.match("index.html"))
      )
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
