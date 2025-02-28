import React, { useState, useEffect } from 'react';
import Chat from "./components/chat/Chat";
import MobileOnlyMessage from './components/MobileOnlyMessage';
import DynamicHead from './components/DynamicHead';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { DEFAULT_ESTABLISHMENT_INFO, ESTABLISHMENT_SUBDOMAIN } from './config/api';

function App() {
  // Detectamos si la pantalla es mayor que 'md' (960px por defecto en MUI)
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  
  // Estado para mantener la información del establecimiento
  const [establishmentInfo, setEstablishmentInfo] = useState(
    // Intentar obtener datos del localStorage primero
    JSON.parse(localStorage.getItem('establishmentInfo')) || DEFAULT_ESTABLISHMENT_INFO
  );

  // Escuchar eventos de cambio en el establishmentInfo
  useEffect(() => {
    const handleEstablishmentChange = (event) => {
      if (event.detail && event.detail.establishmentInfo) {
        setEstablishmentInfo(event.detail.establishmentInfo);
      }
    };

    window.addEventListener('establishmentInfoChanged', handleEstablishmentChange);
    return () => {
      window.removeEventListener('establishmentInfoChanged', handleEstablishmentChange);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <DynamicHead establishmentInfo={establishmentInfo} />
      <div className="App">
        {isLargeScreen ? (
          // Mostramos mensaje para pantallas grandes
          <MobileOnlyMessage establishmentInfo={establishmentInfo} />
        ) : (
          // Mostramos la interfaz de chat solo en móviles
          <Chat onEstablishmentInfoChange={setEstablishmentInfo} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;