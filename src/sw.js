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
