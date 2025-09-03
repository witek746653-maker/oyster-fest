
// sw.js — GitHub Pages scope fix
const SCOPE = "/oyster-fest/";
const CACHE = "sabor-pwa-v3";
const ASSETS = [
  `${SCOPE}`,
  `${SCOPE}index.html`,
  `${SCOPE}manifest.json`,
  `${SCOPE}icons/icon-192.png`,
  `${SCOPE}icons/icon-512.png`
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (!url.pathname.startsWith(SCOPE)) return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(()=>{});
        return resp;
      }).catch(() => caches.match(`${SCOPE}index.html`));
    })
  );
});
