import React, { useState, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  InputAdornment,
  useTheme,
  useMediaQuery,
  Fade,
  Tooltip,
  Paper,
  Typography
} from '@mui/material';
import { 
  Send as SendIcon,
  InfoOutlined as InfoIcon,
  Apps as AppsIcon
} from '@mui/icons-material';

const ChatInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  disabled, 
  loading, 
  placeholder,
  inputRef,
  onBackToMenu,
  onClearChat
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !loading && !disabled) {
      onSubmit(e);
    }
  };

  const getInputHeight = useCallback(() => {
    if (isMobile) return value.split('\n').length > 2 ? '70px' : '45px'; // Reducido para móviles
    return value.split('\n').length > 3 ? '100px' : '60px';
  }, [value, isMobile]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        // Completamente transparente para que se vea el fondo de la imagen
        backgroundColor: 'transparent',
        pt: 2,
        pb: 2,
      }}
    >
      {/* Mensaje de instrucción cuando está deshabilitado */}
      {disabled && (
        <Box
          sx={{
            position: 'relative',
            mb: isMobile ? 1 : 1.5, // Reducido en móviles
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: isMobile ? 1.5 : 2, // Reducido en móviles
            backgroundColor: 'rgba(44, 62, 80, 0.1)', // Color del tema con transparencia
            color: 'text.primary',
            transition: 'all 0.3s ease',
            boxShadow: '0px -2px 10px rgba(0,0,0,0.05)',
            borderRadius: 2,
          }}
        >
          <InfoIcon 
            sx={{ 
              mr: 1, 
              fontSize: isMobile ? 18 : 24, // Reducido en móviles
              animation: 'pulse 1s infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              },
            }} 
          />
          <Typography 
            variant="body2" // Cambiado a body2 para móviles
            sx={{ 
              fontWeight: 500,
              fontSize: isMobile ? '0.85rem' : '1rem', // Reducido en móviles
            }}
          >
            Selecciona una opción para comenzar
          </Typography>
        </Box>
      )}

      <Paper
        elevation={isFocused ? 4 : 1}
        sx={{
          maxWidth: {
            xs: '100%',
            sm: '600px',
            md: '800px',
            lg: '1000px'
          },
          mx: 'auto',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // Fondo con ligera transparencia para que se vea la imagen de fondo
          backgroundColor: disabled ? 'rgba(247, 247, 247, 0.5)' : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(5px)', // Efecto de desenfoque leve
          position: 'relative',
          transform: isFocused && isMobile ? 'translateY(-4px)' : 'none', // Reducido en móviles
          borderRadius: isMobile ? 4 : 6, // Reducido en móviles
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: {
              xs: 0.75, // Reducido en móviles
              sm: 1.5
            },
            p: {
              xs: 1, // Reducido en móviles
              sm: 2,
              md: 2.5
            },
          }}
        >
          {/* Botón minimalista para volver al menú */}
          <Tooltip title="Volver al menú de opciones" arrow>
            <IconButton
              onClick={onBackToMenu}
              sx={{
                width: { xs: 36, sm: 45 }, // Reducido en móviles
                height: { xs: 36, sm: 45 }, // Reducido en móviles
                backgroundColor: '#2C3E50', // Color principal del tema
                color: 'white',
                display: disabled ? 'none' : 'flex',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#1A252F',
                  transform: 'scale(1.05)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                '& svg': {
                  fontSize: { xs: 18, sm: 24 }, // Reducido en móviles
                  transition: 'transform 0.2s ease',
                },
                '&:hover svg': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <AppsIcon />
            </IconButton>
          </Tooltip>

          {/* Text input */}
          <TextField
            fullWidth
            value={value}
            onChange={onChange}
            placeholder={disabled ? "👆 Selecciona una opción para comenzar" : placeholder}
            variant="outlined"
            inputRef={inputRef}
            multiline
            maxRows={isMobile ? 3 : 6} // Reducido en móviles
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            InputProps={{
              sx: {
                minHeight: getInputHeight(),
                alignItems: 'center',
                py: {
                  xs: 0.25, // Reducido en móviles
                  sm: 1
                },
                px: {
                  xs: 1, // Reducido en móviles
                  sm: 2
                },
                // Campo de texto con transparencia
                backgroundColor: disabled ? 'rgba(247, 247, 247, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.2s ease',
                '& ::placeholder': {
                  color: disabled ? '#2C3E50' : 'text.secondary',
                  fontWeight: disabled ? 500 : 400,
                  opacity: disabled ? 0.8 : 0.7,
                  fontSize: isMobile ? '0.85rem' : '1rem', // Reducido en móviles
                },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <Fade in={!!(value.trim() && !loading && !disabled)}>
                    <IconButton 
                      type="submit" 
                      disabled={!value.trim() || loading || disabled}
                      sx={{ 
                        backgroundColor: '#2C3E50',
                        color: 'white',
                        width: {
                          xs: 32, // Reducido en móviles
                          sm: 42,
                          md: 45
                        },
                        height: {
                          xs: 32, // Reducido en móviles
                          sm: 42,
                          md: 45
                        },
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          backgroundColor: '#1A252F',
                          transform: 'scale(1.05)',
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                        '&:disabled': {
                          backgroundColor: 'grey.300',
                        },
                      }}
                    >
                      <SendIcon sx={{ fontSize: { xs: 16, sm: 24 } }} /> {/* Reducido en móviles */}
                    </IconButton>
                  </Fade>
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: {
                  xs: 1.5, // Reducido en móviles
                  sm: 2.5
                },
                '& fieldset': {
                  borderWidth: isMobile ? 1 : 1.5, // Reducido en móviles
                  borderColor: isFocused ? '#2C3E50' : 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.2s ease',
                },
                '&:hover fieldset': {
                  borderColor: isFocused ? '#2C3E50' : 'rgba(255, 255, 255, 0.8)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2C3E50',
                  borderWidth: isMobile ? 1.5 : 2, // Reducido en móviles
                },
              },
              '& .MuiInputBase-input': {
                fontSize: {
                  xs: '0.85rem', // Reducido en móviles
                  sm: '1rem'
                },
                lineHeight: {
                  xs: 1.3, // Reducido en móviles
                  sm: 1.6
                },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatInput;