// Obtener el subdominio actual
const getSubdomain = () => {
  const hostname = window.location.hostname;
  console.log("Hostname detectado:", hostname);
  
  // Si estamos en localhost, usar un subdominio de prueba
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log("Usando subdominio de prueba para localhost");
    return 'prueba'; // Subdominio de prueba para desarrollo local
  }
  
  // Si es el dominio principal sin subdominio, usar un valor predeterminado
  if (hostname === 'irrelevantcalendar.com' || hostname === 'www.irrelevantcalendar.com') {
    console.log("Usando subdominio principal para dominio principal");
    return 'principal'; // Identificador para la página principal
  }
  
  // Extraer el subdominio
  const parts = hostname.split('.');
  if (parts.length > 2) {
    const subdomain = parts[0];
    console.log("Subdominio extraído:", subdomain);
    return subdomain; // Devuelve el subdominio (cliente1, cliente2, etc.)
  }
  
  console.log("No se pudo determinar subdominio, usando 'desconocido'");
  return 'desconocido'; // Valor por defecto
};

export const API_BASE_URL = 'https://barberias-backend-735207921266.us-central1.run.app'; // URL del backend con ngrok

export const API_ENDPOINTS = {
  appointment: `${API_BASE_URL}/appointment`,
  availability: `${API_BASE_URL}/availability`,
  cancel: `${API_BASE_URL}/cancel`,
  establishmentInfo: `${API_BASE_URL}/establishment-info`
};

// Exportar el subdominio para uso en otros componentes
export const ESTABLISHMENT_SUBDOMAIN = getSubdomain();
console.log("ESTABLISHMENT_SUBDOMAIN configurado como:", ESTABLISHMENT_SUBDOMAIN);

// Exportar información predeterminada del establecimiento
export const DEFAULT_ESTABLISHMENT_INFO = {
  name: "Misther Barber",
  logo_url: "https://storage.googleapis.com/cluvi/newbarber-logo.png"
};