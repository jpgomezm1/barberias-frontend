import React, { useState, useRef, useEffect } from 'react';  
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Fade,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  EventAvailable as CalendarIcon,
  Search as SearchIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import ActionButton from './ActionButton';
import ChatInput from './ChatInput';
import ConfirmationPopup from './ConfirmationPopup';
import BrandingFooter from './BrandingFooter';
import { API_ENDPOINTS } from '../../config/api';
import axios from 'axios';
import Loader from './Loader';
import logo from '../../assets/logo.png';

const INITIAL_MESSAGE = `👋 ¡Bienvenido a Misther Barber!

Selecciona la acción que deseas realizar:`;

const ACTIONS = [
  {
    id: 'appointment',
    icon: CalendarIcon,
    title: 'Agendar Cita',
    description: 'Programa una nueva cita',
    instructions: `Para agendar una cita:
• Nombre completo
• Teléfono
• Barbero
• Servicio
• Fecha y hora
Ejemplo:
"Juan Pérez, corte con Diego, mañana 2pm, 3183351733"`,
  },
  {
    id: 'availability',
    icon: SearchIcon,
    title: 'Consultar Disponibilidad',
    description: 'Verifica horarios disponibles',
    instructions: `Para consultar disponibilidad:
• Barbero
• Fecha
Ejemplo:
"¿Qué horarios tiene Diego mañana?"`,
  },
  {
    id: 'cancel',
    icon: CancelIcon,
    title: 'Cancelar Cita',
    description: 'Cancelar una cita',
    instructions: `Para cancelar una cita:
• Nombre completo
• Fecha y hora de la cita
Ejemplo:
"Cancelar mi cita, Juan Pérez, mañana 2pm"`,
  },
];

const messageVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const Chat = () => {
  const customTheme = useTheme();
  const isMobile = useMediaQuery(customTheme.breakpoints.down('sm'));
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [confirmationPopupOpen, setConfirmationPopupOpen] = useState(false);
  const [confirmationPopupData, setConfirmationPopupData] = useState({ type: '', message: '' });
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current && chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      
      chatContainerRef.current.scrollTo({
        top: maxScrollTop,
        behavior: behavior
      });
    }
  };

  useEffect(() => {
    // Scroll inmediato al cargar inicialmente
    if (messages.length === 1) {
      scrollToBottom('auto');
      return;
    }

    // Para nuevos mensajes, scroll suave
    const lastMessage = messages[messages.length - 1];
    
    // Si es un mensaje del sistema escribiendo, no hacemos scroll
    if (lastMessage?.loading) return;
    
    // Si es un mensaje nuevo (usuario o sistema), scroll suave
    scrollToBottom('smooth');
  }, [messages]);

  useEffect(() => {
    if (typingIndicator) {
      scrollToBottom('smooth');
    }
  }, [typingIndicator]);

  useEffect(() => {
    setMessages([
      {
        type: 'system',
        content: INITIAL_MESSAGE
      }
    ]);
    inputRef.current?.focus();
  }, []);

  const handleActionSelect = (actionId) => {
    const action = ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    setSelectedAction(actionId);
    setMessages(prev => [
      ...prev,
      {
        type: 'user',
        content: ` ${action.title}`,
        timestamp: new Date().toLocaleTimeString()
      },
      {
        type: 'system',
        content: action.instructions,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    scrollToBottom('smooth');
  };

  const handleBackToMenu = () => {
    setSelectedAction(null);
  };

  const handleClearChat = () => {
    setMessages([
      {
        type: 'system',
        content: selectedAction 
          ? ACTIONS.find(a => a.id === selectedAction).instructions
          : INITIAL_MESSAGE,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    scrollToBottom('auto');
  };

  const simulateTyping = async () => {
    setTypingIndicator(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTypingIndicator(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading || !selectedAction) return;

    setLoading(true);
    setError(null);
    
    const userMessage = {
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    scrollToBottom('smooth');

    setTypingIndicator(true);
    scrollToBottom('smooth');

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data } = await axios.post(API_ENDPOINTS[selectedAction], {
        prompt: inputValue.trim()
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      setTypingIndicator(false);

      const systemMessage = {
        type: 'system',
        content: data.response,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, systemMessage]);
      scrollToBottom('smooth');

      if (selectedAction === 'appointment') {
        setConfirmationPopupData({ type: 'appointment', message: 'Agendamiento Confirmado' });
        setConfirmationPopupOpen(true);
      } else if (selectedAction === 'cancel') {
        setConfirmationPopupData({ type: 'cancel', message: 'Cancelación Confirmada' });
        setConfirmationPopupOpen(true);
      }

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            type: 'system',
            content: '¿Deseas realizar otra acción?',
            timestamp: new Date().toLocaleTimeString(),
            showActions: true
          }
        ]);
        setSelectedAction(null);
        scrollToBottom('smooth');
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.error || 'Hubo un error al procesar tu solicitud.';
      setError(errorMessage);
      setMessages(prev => [
        ...prev,
        {
          type: 'system',
          content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      scrollToBottom('smooth');
    } finally {
      setTypingIndicator(false);
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          // Aplicamos el fondo a toda la aplicación
          backgroundImage: 'url("https://storage.googleapis.com/cluvi/fondo_ui.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed', // Esto mantiene el fondo fijo mientras se hace scroll
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <AppBar 
          position="absolute" 
          elevation={0}
          sx={{
            backgroundColor: '#2C3E50', // Color sólido para el AppBar
            borderBottom: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            {/* Logo de la compañía */}
            <Box 
              component="img"
              src="https://storage.googleapis.com/cluvi/newbarber-logo.png"
              alt="Misther Barber Logo"
              sx={{ 
                height: 40,
                width: 'auto',
                display: 'block'
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                flex: 1,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Misther Barber
            </Typography>
            {loading && <Loader />}
          </Toolbar>
        </AppBar>

        <Box
          ref={chatContainerRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            mt: '64px',
            // Ajustamos el margen inferior para que no quede oculto detrás del input y footer
            mb: { xs: '170px', sm: '160px' }, 
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            },
            overscrollBehavior: 'none',
            willChange: 'scroll-position',
            minHeight: 0,
          }}
        >
          <Container maxWidth="md">
            <Stack spacing={2}>
              <AnimatePresence mode="wait">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout="position"
                  >
                    <React.Fragment>
                      <MessageBubble 
                        message={message} 
                        isLastMessage={index === messages.length - 1}
                        ref={index === messages.length - 1 ? messagesEndRef : null}
                      />
                      {message.showActions && (
                        <Fade in={true} timeout={500}>
                          <Box sx={{ mt: 2 }}>
                            {ACTIONS.map((action) => (
                              <ActionButton
                                key={action.id}
                                icon={action.icon}
                                title={action.title}
                                description={action.description}
                                onClick={() => handleActionSelect(action.id)}
                              />
                            ))}
                          </Box>
                        </Fade>
                      )}
                    </React.Fragment>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {typingIndicator && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageBubble 
                    message={{
                      type: 'system',
                      content: 'Escribiendo...',
                      loading: true
                    }}
                  />
                </motion.div>
              )}

              {!selectedAction && messages[messages.length - 1]?.type === 'system' && !messages[messages.length - 1]?.showActions && (
                <Fade in={true} timeout={500}>
                  <Box sx={{ mt: 2 }}>
                    {ACTIONS.map((action) => (
                      <ActionButton
                        key={action.id}
                        icon={action.icon}
                        title={action.title}
                        description={action.description}
                        onClick={() => handleActionSelect(action.id)}
                      />
                    ))}
                  </Box>
                </Fade>
              )}
            </Stack>
          </Container>
        </Box>

        {/* Área de chat input con fondo completamente transparente */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            // No aplicamos fondo para mantener visible la imagen de fondo
            backgroundColor: 'transparent',
          }}
        >
          <Container maxWidth="md">
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleSubmit}
              disabled={!selectedAction}
              loading={loading}
              placeholder={selectedAction ? "Escribe tu mensaje aquí..." : "👆 Selecciona una opción para comenzar"}
              inputRef={inputRef}
              onBackToMenu={handleBackToMenu}
              onClearChat={handleClearChat}
            />
            
            {/* Footer transparente para ver el fondo */}
            <Box sx={{ py: 2, backgroundColor: 'transparent' }}>
              <BrandingFooter companyLogo={logo} />
            </Box>
          </Container>
        </Box>

        <ConfirmationPopup
          open={confirmationPopupOpen}
          onClose={() => setConfirmationPopupOpen(false)}
          popupType={confirmationPopupData.type}
          message={confirmationPopupData.message}
        />

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: 8 }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setError(null)}
            sx={{ 
              width: '100%',
              bgcolor: 'error.main',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;