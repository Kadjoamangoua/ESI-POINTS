/* Service worker — coque de l'application ESI'POINTS
   Ne met en cache que l'enveloppe : les ESI'Points sont toujours chargés en direct. */
const CACHE = 'esiroi-esipoints-v1.2';
const COQUE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icones/icone-192.png',
  './icones/icone-512.png',
  './icones/icone-maskable-512.png',
  './icones/apple-touch-icon.png',
  './icones/logo-demarrage.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(COQUE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(noms.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Tout ce qui n'appartient pas à la coque part directement sur le réseau
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) { return; }
  e.respondWith(
    caches.match(req).then((rep) => rep || fetch(req).catch(() => caches.match('./index.html')))
  );
});
