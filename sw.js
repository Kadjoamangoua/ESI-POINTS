/* Service worker — coque de l'application ESI'POINTS
   Ne met en cache que l'enveloppe : les ESI'Points sont toujours chargés en direct.

   La page elle-même est servie en « réseau d'abord » : si l'adresse de
   l'application Apps Script change un jour, la correction se propage au
   prochain chargement sans qu'il faille penser à incrémenter la version
   ci-dessous. Le cache ne sert alors que de secours hors ligne.
   Les icônes, elles, ne changent presque jamais : cache d'abord. */
const CACHE = 'esiroi-esipoints-v1.4';

/* Ressources figées : mises en cache à l'installation. */
const COQUE = [
  './manifest.webmanifest',
  './icones/icone-192.png',
  './icones/icone-512.png',
  './icones/icone-maskable-512.png',
  './icones/apple-touch-icon.png',
  './icones/logo-demarrage.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(COQUE.concat(['./', './index.html'])))
      .then(() => self.skipWaiting())
  );
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
  // Tout ce qui n'appartient pas à la coque part directement sur le réseau :
  // en particulier l'application Apps Script, jamais mise en cache.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) { return; }

  // La page : réseau d'abord, cache en secours.
  const estPage = (req.mode === 'navigate') || (req.destination === 'document');
  if (estPage) {
    e.respondWith(
      fetch(req)
        .then((rep) => {
          const copie = rep.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copie));
          return rep;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Le reste (icônes, manifeste) : cache d'abord.
  e.respondWith(
    caches.match(req).then((rep) => rep || fetch(req).catch(() => caches.match('./index.html')))
  );
});
