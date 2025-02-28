// Este archivo interceptará solicitudes al manifest.json y favicon
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('manifest.json')) {
      event.respondWith(
        caches.match('manifest-cached').then((response) => {
          return response || fetch(event.request);
        })
      );
    } else if (event.request.url.includes('favicon.ico') || 
               event.request.url.includes('newbarber-logo.png') ||
               event.request.url.includes('logo192.png') ||
               event.request.url.includes('logo512.png')) {
      // Intentar obtener el logo personalizado del localStorage
      const logoUrl = localStorage.getItem('establishmentLogo');
      if (logoUrl) {
        event.respondWith(fetch(logoUrl));
      }
    }
  });