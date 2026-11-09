const CACHE = 'murcafe-v2';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
const CDN = ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if(e.request.method !== 'GET' || !(u.origin === self.location.origin || CDN.includes(u.hostname))) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    try { const r = await fetch(e.request); c.put(e.request, r.clone()); return r; }
    catch(err){ const hit = await c.match(e.request); if(hit) return hit; throw err; }
  }));
});
