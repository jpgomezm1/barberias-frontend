import React, { useEffect } from 'react';

const DynamicHead = ({ establishmentInfo = { name: "Misther Barber", logo_url: "https://storage.googleapis.com/cluvi/newbarber-logo.png" } }) => {
  useEffect(() => {
    // Actualizar el título de la página
    document.title = establishmentInfo.name;
    
    // Actualizar meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `${establishmentInfo.name} - App de Reservas`);
    }
    
    // Actualizar favicon
    const faviconLink = document.querySelector('link[rel="icon"]');
    if (faviconLink) {
      faviconLink.setAttribute('href', establishmentInfo.logo_url);
    }
    
    // Actualizar apple-touch-icon
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleTouchIcon) {
      appleTouchIcon.setAttribute('href', establishmentInfo.logo_url);
    }
    
    // Intentar actualizar el tema de color si existe un color principal en la info del establecimiento
    if (establishmentInfo.themeColor) {
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', establishmentInfo.themeColor);
      }
    }
    
    // Actualizar manifiesto de PWA (solo si estamos en producción)
    if (process.env.NODE_ENV === 'production') {
      try {
        // Crear un manifiesto dinámico
        const dynamicManifest = {
          short_name: establishmentInfo.name,
          name: `${establishmentInfo.name} - App de Reservas`,
          icons: [
            {
              src: establishmentInfo.logo_url,
              sizes: "64x64 32x32 24x24 16x16",
              type: "image/png"
            },
            {
              src: establishmentInfo.logo_url,
              type: "image/png",
              sizes: "192x192"
            },
            {
              src: establishmentInfo.logo_url,
              type: "image/png",
              sizes: "512x512"
            }
          ],
          start_url: ".",
          display: "standalone",
          theme_color: establishmentInfo.themeColor || "#000000",
          background_color: "#ffffff"
        };
        
        // Almacenar el manifiesto en localStorage para que sea persistente
        localStorage.setItem('pwaManifest', JSON.stringify(dynamicManifest));
        
        // Crear un blob con el contenido del manifiesto
        const manifestBlob = new Blob([JSON.stringify(dynamicManifest)], { type: 'application/json' });
        const manifestURL = URL.createObjectURL(manifestBlob);
        
        // Actualizar la URL del manifiesto en el documento
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink) {
          manifestLink.setAttribute('href', manifestURL);
        }
      } catch (e) {
        console.error("Error al actualizar el manifiesto:", e);
      }
    }
  }, [establishmentInfo]);

  // Este componente no renderiza nada visible
  return null;
};

export default DynamicHead;