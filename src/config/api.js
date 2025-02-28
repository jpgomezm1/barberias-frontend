// Obtener el subdominio actual
const getSubdomain = () => {
  const hostname = window.location.hostname;
  
  // Si estamos en localhost, usar un subdominio de prueba
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'prueba'; // Subdominio de prueba para desarrollo local
  }
  
  // Si es el dominio principal sin subdominio, usar un valor predeterminado
  if (hostname === 'irrelevantcalendar.com' || hostname === 'www.irrelevantcalendar.com') {
    return 'principal'; // Identificador para la página principal
  }
  
  // Extraer el subdominio
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0]; // Devuelve el subdominio (cliente1, cliente2, etc.)
  }
  
  return 'desconocido'; // Valor por defecto
};

export const API_BASE_URL = 'https://74cf0bf63280.ngrok.app'; // URL del backend con ngrok

export const API_ENDPOINTS = {
  appointment: `${API_BASE_URL}/appointment`,
  availability: `${API_BASE_URL}/availability`,
  cancel: `${API_BASE_URL}/cancel`,
};

// Exportar el subdominio para uso en otros componentes
export const ESTABLISHMENT_SUBDOMAIN = getSubdomain();