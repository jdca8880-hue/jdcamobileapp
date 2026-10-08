self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      
      const baseUrl = self.location.origin;
      const options = {
        body: data.body,
        icon: data.icon ? (data.icon.startsWith('http') ? data.icon : baseUrl + data.icon) : baseUrl + '/jdca-logo.png',
        badge: baseUrl + '/jdca-logo.png', // Small monochrome icon for Android status bar
        image: data.image ? (data.image.startsWith('http') ? data.image : baseUrl + data.image) : baseUrl + '/match_bg.jpg', // Colorful large image
        vibrate: [200, 100, 200, 100, 200, 100, 200], // Heavy haptic feedback for important events
        tag: data.tag || 'jdca-notification',
        renotify: data.renotify !== undefined ? data.renotify : true,
        data: {
          url: data.url || '/'
        },
        actions: [
          { action: 'open', title: 'View Match' }
        ]
      };

      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (err) {
      console.error('Error parsing push data', err);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i];
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});

const CACHE_NAME = 'jdca-app-shell-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Cache-first for static assets, network-first for navigations with offline fallback
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);

  // Skip API, Supabase, and real-time sockets (handled by Dexie offline queue and SyncService)
  if (
    url.origin.includes('supabase.co') ||
    url.pathname.startsWith('/rest/') ||
    url.pathname.startsWith('/auth/')
  ) {
    return;
  }

  // HTML navigation requests: Network-first, fallback to cached index / root
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match('/') || await cache.match('/index.html') || await cache.match(event.request);
          return cached || new Response('<html><body><h2>Offline</h2><p>JDCA scorecenter is ready offline.</p></body></html>', {
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // Static assets (JS, CSS, fonts, images)
  if (
    url.origin === self.location.origin ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
