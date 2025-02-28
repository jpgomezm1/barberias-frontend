import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Button,
  useTheme,
} from '@mui/material';
import { 
  PhoneIphone as PhoneIcon,
  QrCode as QrCodeIcon 
} from '@mui/icons-material';

const MobileOnlyMessage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundImage: 'url("https://storage.googleapis.com/cluvi/fondo_ui.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Fondo decorativo */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: '#2C3E50',
            }}
          />

          {/* Logo */}
          <Box
            component="img"
            src="https://storage.googleapis.com/cluvi/newbarber-logo.png"
            alt="Misther Barber Logo"
            sx={{
              height: 80,
              width: 'auto',
              display: 'block',
              margin: '0 auto 24px auto',
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#2C3E50',
              marginBottom: 2,
            }}
          >
            ¡Experiencia Móvil Exclusiva!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              color: 'text.secondary',
              marginBottom: 4,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            La aplicación de Misther Barber está diseñada exclusivamente para dispositivos móviles para brindarte la mejor experiencia al agendar tus citas. Por favor, accede desde tu smartphone para disfrutar de todas las funcionalidades.
          </Typography>

          {/* Información visual */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 4,
              justifyContent: 'center',
              alignItems: 'center',
              marginY: 4,
            }}
          >
            {/* Opción de escaneo */}
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                width: { xs: '100%', sm: '45%' },
                backgroundColor: 'rgba(245, 247, 250, 0.8)',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <QrCodeIcon
                sx={{
                  fontSize: 60,
                  color: '#2C3E50',
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Escanea el código QR
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Utiliza la cámara de tu móvil para escanear el código y acceder directamente a nuestra aplicación.
              </Typography>
            </Paper>

            {/* Opción manual */}
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                width: { xs: '100%', sm: '45%' },
                backgroundColor: 'rgba(245, 247, 250, 0.8)',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <PhoneIcon
                sx={{
                  fontSize: 60,
                  color: '#2C3E50',
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Accede desde tu móvil
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Abre esta misma URL en el navegador de tu smartphone para acceder a todas las funcionalidades.
              </Typography>
            </Paper>
          </Box>

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              marginTop: 4,
              color: 'text.secondary',
            }}
          >
            © {new Date().getFullYear()} Misther Barber. Todos los derechos reservados.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default MobileOnlyMessage;