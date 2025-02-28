import React from 'react';
import Chat from "./components/chat/Chat";
import MobileOnlyMessage from './components/MobileOnlyMessage';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme'; // Asegúrate de que la ruta sea correcta

function App() {
  // Detectamos si la pantalla es mayor que 'md' (960px por defecto en MUI)
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {isLargeScreen ? (
          // Mostramos mensaje para pantallas grandes
          <MobileOnlyMessage />
        ) : (
          // Mostramos la interfaz de chat solo en móviles
          <Chat />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;