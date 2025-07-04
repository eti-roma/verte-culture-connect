
const CACHE_NAME = 'hydrofourrage-pro-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_CACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression du cache obsolète:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  // Stratégie "Network First" pour les données API
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Mettre en cache les réponses réussies
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Retourner depuis le cache si le réseau échoue
          return caches.match(event.request);
        })
    );
    return;
  }

  // Stratégie "Cache First" pour les ressources statiques
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloner la réponse
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Retourner la page offline pour les pages HTML
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Message handler pour les notifications push
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
