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
  SwipeableDrawer,
} from '@mui/material';
import { 
  EventAvailable as CalendarIcon,
  Search as SearchIcon,
  Cancel as CancelIcon,
  CalendarViewWeek as CalendarWeekIcon,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../theme';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import ActionButton from './ActionButton';
import ChatInput from './ChatInput';
import ConfirmationPopup from './ConfirmationPopup';
import BrandingFooter from './BrandingFooter';
import { API_ENDPOINTS, ESTABLISHMENT_SUBDOMAIN, DEFAULT_ESTABLISHMENT_INFO } from '../../config/api';
import axios from 'axios';
import Loader from './Loader';
import WeeklySchedule from '../calendar/WeeklySchedule';
import AppointmentFormModal from '../calendar/AppointmentFormModal'; // Importa el nuevo componente en Chat.js
import logo from '../../assets/logo.png';

const INITIAL_MESSAGE = `👋 ¡Bienvenido!

Selecciona la acción que deseas realizar:`;

const ACTIONS = [
  {
    id: 'calendar',
    icon: CalendarWeekIcon,
    title: 'Agenda tu Cita',
    description: 'Visualiza la disponibilidad de la semana y agenda tu cita',
    instructions: `Ahora puedes ver el horario semanal completo de nuestros barberos y seleccionar una cita directamente desde el calendario.`,
  },
  {
    id: 'cancel',
    icon: CancelIcon,
    title: 'Cancelar Cita',
    description: 'Cancelar una cita',
    instructions: `Para cancelar una cita:
- Nombre completo
- Fecha y hora de la cita
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

const Chat = ({ onEstablishmentInfoChange }) => {
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
  const [establishmentInfo, setEstablishmentInfo] = useState(DEFAULT_ESTABLISHMENT_INFO);
  const [initialInfoLoaded, setInitialInfoLoaded] = useState(false);
  const [showWeeklySchedule, setShowWeeklySchedule] = useState(false);
  // Estados para el nuevo formulario de cita
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false);
  const [selectedTimeInfo, setSelectedTimeInfo] = useState(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Verificar si el subdominio ha cambiado desde la última visita
  useEffect(() => {
    const currentSubdomain = ESTABLISHMENT_SUBDOMAIN;
    const storedInfo = localStorage.getItem('establishmentInfo');
    
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        if (parsedInfo.subdomain !== currentSubdomain) {
          console.log("Subdominio ha cambiado, recargando...");
          localStorage.removeItem('establishmentInfo');
          window.location.reload(true);
        } else {
          // Si el subdominio es el mismo, usar la información almacenada
          console.log("Usando información almacenada del establecimiento");
          setEstablishmentInfo(parsedInfo);
          if (onEstablishmentInfoChange) {
            onEstablishmentInfoChange(parsedInfo);
          }
        }
      } catch (e) {
        console.error("Error al procesar información guardada:", e);
        localStorage.removeItem('establishmentInfo');
      }
    }
  }, [onEstablishmentInfoChange]);

  // Cargar información del establecimiento al inicio
  useEffect(() => {
    const loadEstablishmentInfo = async () => {
      try {
        console.log("Cargando información inicial para subdominio:", ESTABLISHMENT_SUBDOMAIN);
        
        // Hacer una solicitud inicial para obtener información
        const response = await fetch(`${API_ENDPOINTS.establishmentInfo}?subdomain=${ESTABLISHMENT_SUBDOMAIN}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Información del establecimiento recibida:", data);
          
          if (data.establishment_name) {
            const newInfo = {
              name: data.establishment_name,
              logo_url: data.logo_url || DEFAULT_ESTABLISHMENT_INFO.logo_url,
              subdomain: ESTABLISHMENT_SUBDOMAIN
            };
            
            setEstablishmentInfo(newInfo);
            localStorage.setItem('establishmentInfo', JSON.stringify(newInfo));
            localStorage.setItem('establishmentLogo', newInfo.logo_url);
            
            // Notificar al componente padre
            if (onEstablishmentInfoChange) {
              onEstablishmentInfoChange(newInfo);
            }
            
            // Emitir evento para notificar a otros componentes
            const event = new CustomEvent('establishmentInfoChanged', {
              detail: {
                establishmentInfo: newInfo
              }
            });
            window.dispatchEvent(event);
          }
        } else {
          console.error("Error al cargar información del establecimiento:", response.statusText);
        }
      } catch (error) {
        console.error("Error al consultar información del establecimiento:", error);
      } finally {
        setInitialInfoLoaded(true);
      }
    };
    
    // Si no hay información almacenada, intentar cargarla
    if (!localStorage.getItem('establishmentInfo')) {
      loadEstablishmentInfo();
    }
  }, [onEstablishmentInfoChange]);

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
    // Mensaje inicial con nombre del establecimiento
    setMessages([
      {
        type: 'system',
        content: `👋 ¡Bienvenido a ${establishmentInfo.name}!

Selecciona la acción que deseas realizar:`
      }
    ]);
    inputRef.current?.focus();
  }, [establishmentInfo.name]);

  // Modifica la función handleTimeSlotSelect para incorporar el nuevo formulario
  const handleTimeSlotSelect = (slotData) => {
    // Guardar información del horario seleccionado
    setSelectedTimeInfo({
      barber: slotData.barber,
      date: slotData.dateTime.split('T')[0],
      time: {
        start: slotData.dateTime.split('T')[1].substring(0, 5),
        end: slotData.endTime // Asegúrate que el objeto slotData incluya endTime
      },
      formattedDateTime: slotData.formattedDateTime
    });
    
    // Cerrar el modal del horario semanal
    setShowWeeklySchedule(false);
    
    // Abrir el formulario de cita
    setAppointmentFormOpen(true);
  };

  // Función para manejar el envío del formulario de cita
  const handleAppointmentFormSubmit = (formData) => {
    // Cerrar el formulario
    setAppointmentFormOpen(false);
    
    // Construir mensaje completo para el sistema
    const emailPart = formData.email ? `, mi correo es ${formData.email}` : '';
    const fullMessage = `Quiero agendar una cita con ${formData.barber} para el ${formData.formattedDateTime}. Mi nombre es ${formData.clientName}, mi teléfono es ${formData.phone}${emailPart} y quiero un servicio de ${formData.service}.`;
    
    // Simular entrada de usuario
    setMessages(prev => [
      ...prev,
      {
        type: 'user',
        content: fullMessage,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    
    // Cambiar la acción a appointment
    setSelectedAction('appointment');
    
    // Procesar la solicitud automáticamente, pasando 'appointment' como override y email
    handleSubmit({
      preventDefault: () => {},
      target: null
    }, fullMessage, 'appointment', {
      email: formData.email || null, // Pasar email al backend
      clientName: formData.clientName,
      phone: formData.phone,
      service: formData.service,
      barber: formData.barber,
      appointmentDate: formData.date,
      appointmentTime: formData.time?.start
    });
  };

  const handleActionSelect = (actionId) => {
    const action = ACTIONS.find(a => a.id === actionId);
    if (!action) return;

    if (actionId === 'calendar') {
      setShowWeeklySchedule(true);
      return;
    }

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
          : `👋 ¡Bienvenido a ${establishmentInfo.name}!

Selecciona la acción que deseas realizar:`,
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

  // Modificar handleSubmit para aceptar parámetros adicionales
  const handleSubmit = async (e, overrideValue = null, actionOverride = null, additionalData = {}) => {
    e.preventDefault();
    const submitValue = overrideValue || inputValue;
    
    if ((!submitValue.trim() || loading || !selectedAction) && !overrideValue) return;

    setLoading(true);
    setError(null);
    
    if (!overrideValue) {
      const userMessage = {
        type: 'user',
        content: submitValue.trim(),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      scrollToBottom('smooth');
    }
    
    setTypingIndicator(true);
    scrollToBottom('smooth');

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log("Enviando solicitud con subdominio:", ESTABLISHMENT_SUBDOMAIN);
      
      // Usar la acción sobrescrita o la seleccionada
      const endpointAction = actionOverride || selectedAction;
      console.log("Endpoint a usar:", API_ENDPOINTS[endpointAction]);

      const response = await axios.post(API_ENDPOINTS[endpointAction], {
        prompt: submitValue.trim(),
        subdomain: ESTABLISHMENT_SUBDOMAIN, // Añadir el subdominio a la solicitud
        ...additionalData // Incluir datos adicionales (como email)
      });
      
      // VALIDACIÓN CRÍTICA: Verificar que la respuesta sea exitosa
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }
      
      const { data } = response;
      
      console.log("Respuesta completa del backend:", data);
      
      // VALIDACIÓN ADICIONAL: Verificar que el backend indique éxito
      if (data.error || data.status === 'error') {
        throw new Error(data.error || data.message || 'El backend reportó un error');
      }

      // Actualizar información del establecimiento si está disponible
      if (data.establishment_name) {
        console.log("Actualizando información del establecimiento:", {
          name: data.establishment_name,
          logo_url: data.logo_url
        });
        
        const newInfo = {
          name: data.establishment_name,
          logo_url: data.logo_url || DEFAULT_ESTABLISHMENT_INFO.logo_url,
          subdomain: ESTABLISHMENT_SUBDOMAIN
        };
        
        setEstablishmentInfo(newInfo);
        localStorage.setItem('establishmentInfo', JSON.stringify(newInfo));
        localStorage.setItem('establishmentLogo', newInfo.logo_url);
        
        // Notificar al componente padre
        if (onEstablishmentInfoChange) {
          onEstablishmentInfoChange(newInfo);
        }
        
        // Emitir evento para notificar a otros componentes
        const event = new CustomEvent('establishmentInfoChanged', {
          detail: {
            establishmentInfo: newInfo
          }
        });
        window.dispatchEvent(event);
      } else {
        console.warn("La respuesta del backend no contiene establishment_name");
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      setTypingIndicator(false);

      const systemMessage = {
        type: 'system',
        content: data.response,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, systemMessage]);
      scrollToBottom('smooth');

      // SOLO mostrar éxito si llegamos hasta aquí sin errores
      if (endpointAction === 'appointment') {
        let confirmationMessage = 'Agendamiento Confirmado';
        
        // Mejorar mensaje según el estado del email
        if (additionalData.email) {
          if (data.emailSent === true) {
            confirmationMessage = 'Agendamiento Confirmado\n✅ Confirmación enviada por email';
          } else if (data.emailSent === false) {
            confirmationMessage = 'Agendamiento Confirmado\n⚠️ No se pudo enviar el email';
          }
        }
        
        setConfirmationPopupData({ type: 'appointment', message: confirmationMessage });
        setConfirmationPopupOpen(true);
      } else if (endpointAction === 'cancel') {
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
      console.error('Error completo:', error);
      
      let errorMessage = 'Hubo un error al procesar tu solicitud.';
      let userFriendlyMessage = 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.';
      
      // Si es un error de respuesta HTTP
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        console.error(`Error HTTP ${status}:`, data);
        
        // Mensajes específicos por código de estado
        switch (status) {
          case 404:
            errorMessage = 'Servicio no encontrado (Error 404)';
            userFriendlyMessage = '❌ No se pudo procesar tu solicitud. El servicio no está disponible en este momento.';
            break;
          case 400:
            errorMessage = 'Datos inválidos (Error 400)';
            userFriendlyMessage = '⚠️ Hubo un problema con la información enviada. Por favor, verifica los datos.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor (Error 500)';
            userFriendlyMessage = '🔧 Hay un problema temporal con nuestros servidores. Intenta nuevamente en unos minutos.';
            break;
          case 503:
            errorMessage = 'Servicio no disponible (Error 503)';
            userFriendlyMessage = '⏰ El servicio está temporalmente no disponible. Por favor, intenta más tarde.';
            break;
          default:
            errorMessage = `Error HTTP ${status}`;
            userFriendlyMessage = `💥 Ocurrió un error inesperado (${status}). Por favor, intenta nuevamente.`;
        }
        
        // Si el backend envió un mensaje específico, usarlo
        if (data?.error) {
          userFriendlyMessage = `❌ ${data.error}`;
        } else if (data?.message) {
          userFriendlyMessage = `⚠️ ${data.message}`;
        }
      } 
      // Si es un error de red (sin respuesta)
      else if (error.request) {
        errorMessage = 'Error de conexión';
        userFriendlyMessage = '🌐 No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      }
      // Si es otro tipo de error
      else {
        errorMessage = error.message || 'Error desconocido';
        userFriendlyMessage = `⚡ ${error.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.'}`;
      }
      
      setError(errorMessage);
      setMessages(prev => [
        ...prev,
        {
          type: 'system',
          content: userFriendlyMessage,
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
            {/* Logo dinámico del establecimiento */}
            <Box 
              component="img"
              // Añadimos un parámetro de caché para forzar recarga
              src={`${establishmentInfo.logo_url}?_cache=${new Date().getTime()}`}
              alt={`${establishmentInfo.name} Logo`}
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
              {establishmentInfo.name}
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
                        establishmentInfo={establishmentInfo}
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
                    establishmentInfo={establishmentInfo}
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
              <BrandingFooter companyLogo={establishmentInfo.logo_url} />
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
        
        {/* Modal de calendario semanal */}
        {showWeeklySchedule && (
          <SwipeableDrawer
            anchor="bottom"
            open={showWeeklySchedule}
            onClose={() => setShowWeeklySchedule(false)}
            onOpen={() => {}}
            disableSwipeToOpen
            PaperProps={{
              sx: {
                height: '100%',
                maxHeight: '100%',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }
            }}
          >
            <WeeklySchedule 
              onClose={() => setShowWeeklySchedule(false)} 
              onTimeSlotSelect={handleTimeSlotSelect}
            />
          </SwipeableDrawer>
        )}

        {/* Modal de cita después de seleccionar horario */}
        <AppointmentFormModal
          open={appointmentFormOpen}
          onClose={() => setAppointmentFormOpen(false)}
          onSubmit={handleAppointmentFormSubmit}
          selectedTimeInfo={selectedTimeInfo}
          loading={loading}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Chat;
