import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Avatar, 
  Fade, 
  useTheme, 
  useMediaQuery,
  Divider,
  Card,
  CardContent,
  styled
} from '@mui/material';
import { 
  Person as PersonIcon,
  AccessTime as TimeIcon,
  CheckCircleOutline as CheckIcon,
  CancelOutlined as CancelIcon,
  Place as PlaceIcon,
  CalendarMonth as CalendarIcon,
  Scissors as ScissorsIcon,
} from '@mui/icons-material';
import TypingAnimation from './TypingAnimation';

// Componente estilizado para los emojis en línea
const Emoji = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  marginLeft: theme.spacing(0.5),
  verticalAlign: 'middle',
  fontSize: '1.1rem',
}));

// Componente estilizado para las filas de información
const InfoRow = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${isUser ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
  '&:last-child': {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: 'none',
  }
}));

// Componente estilizado para las etiquetas (Cliente, Barbero, etc.)
const Label = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginRight: theme.spacing(0.5),
  fontSize: '0.9rem',
  minWidth: '80px',
  display: 'inline-block',
}));

// Componente estilizado para los valores
const Value = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '0.9rem',
  flex: 1,
  paddingTop: '1px',
}));

const MessageBubble = React.forwardRef(({ 
  message, 
  isLastMessage
}, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isUser = message.type === 'user';

  // Función para verificar si es un mensaje de confirmación de cita
  const isAppointmentConfirmation = (text) => {
    return text && (text.includes('Cita agendada con éxito') || 
           text.includes('¡Cita agendada con éxito!') || 
           (text.includes('Detalles de la cita') && text.includes('Cliente:')));
  };
  
  // Función para verificar si es un mensaje de cancelación de cita
  const isAppointmentCancellation = (text) => {
    return text && (text.includes('Cita cancelada con éxito') ||
           text.includes('cancelada con éxito') ||
           text.includes('cancelada para'));
  };

  // Función para extraer emojis del texto si existen
  const extractEmoji = (text) => {
    if (!text) return { text, emoji: null };
    
    const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;
    const emojis = text.match(emojiRegex);
    
    if (emojis && emojis.length > 0) {
      const cleanText = text.replace(emojiRegex, '').trim();
      return { text: cleanText, emoji: emojis[0] };
    }
    
    return { text, emoji: null };
  };

  // Función para formatear mensajes de cancelación de cita
  const formatAppointmentCancellation = (text) => {
    if (!text) return null;
    
    // Extraer información básica del texto
    const clientNameMatch = text.match(/para\s+(.*?)\s+en/i);
    const clientName = clientNameMatch ? clientNameMatch[1] : "";
    
    const dateMatch = text.match(/en\s+(.*?)\.?$/i);
    const date = dateMatch ? dateMatch[1] : "";
    
    return (
      <Card 
        elevation={0} 
        sx={{
          backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(245, 245, 245, 0.95)',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(180,180,180,0.2)',
        }}
      >
        {/* Header de la tarjeta */}
        <Box 
          sx={{ 
            p: 1.5, 
            backgroundColor: isUser 
              ? 'rgba(255,255,255,0.15)' 
              : 'rgba(120, 120, 120, 0.1)',
            borderBottom: '1px solid',
            borderBottomColor: isUser 
              ? 'rgba(255,255,255,0.15)' 
              : 'rgba(120,120,120,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CancelIcon 
            fontSize="small" 
            sx={{ 
              color: isUser ? 'white' : '#757575',
              backgroundColor: isUser ? 'transparent' : 'rgba(255,255,255,0.8)',
              borderRadius: '50%',
              padding: '2px',
              fontSize: '1.2rem'
            }} 
          />
          <Typography 
            variant="subtitle1"
            sx={{ 
              fontWeight: 600,
              color: isUser ? 'white' : '#424242',
              fontSize: '0.95rem',
            }}
          >
            Cita cancelada con éxito
          </Typography>
        </Box>
        
        {/* Contenido de la tarjeta */}
        <CardContent sx={{ p: 2, pt: 2, pb: '12px !important' }}>
          {/* Cliente */}
          {clientName && (
            <InfoRow isUser={isUser}>
              <Label color={isUser ? 'white' : 'text.primary'}>
                Cliente:
              </Label>
              <Value color={isUser ? 'white' : 'text.primary'}>
                {clientName}
              </Value>
            </InfoRow>
          )}
          
          {/* Fecha */}
          {date && (
            <InfoRow isUser={isUser}>
              <Label color={isUser ? 'white' : 'text.primary'}>
                Fecha:
              </Label>
              <Value color={isUser ? 'white' : 'text.primary'}>
                {date}
              </Value>
            </InfoRow>
          )}
          
          {/* Mensaje de confirmación */}
          <Box 
            sx={{
              mt: 1,
              textAlign: 'center',
              backgroundColor: isUser ? 'rgba(255,255,255,0.08)' : 'rgba(70,70,70,0.08)',
              p: 1.5,
              borderRadius: 1.5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Typography 
              variant="body2"
              sx={{ 
                fontWeight: 500,
                color: isUser ? 'white' : '#424242',
                fontSize: '0.9rem'
              }}
            >
              Su cita ha sido cancelada correctamente
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Función para formatear mensajes de confirmación de cita
  const formatAppointmentConfirmation = (text) => {
    if (!text) return null;
    
    // Construir un objeto con los datos de la cita
    const appointmentData = {
      title: '',
      cliente: '',
      barbero: '',
      servicio: '',
      duracion: '',
      fecha: '',
      precio: '',
      direccion: '',
      despedida: ''
    };
    
    // Extraer el título
    if (text.includes('¡Cita agendada con éxito!')) {
      appointmentData.title = '¡Cita agendada con éxito!';
    } else if (text.includes('Cita agendada con éxito')) {
      appointmentData.title = 'Cita agendada con éxito';
    }
    
    // Dividir el texto en líneas
    let lines = [];
    if (text.includes('\n')) {
      lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    } else if (text.includes('-')) {
      lines = text.split('-').map(line => line.trim()).filter(Boolean);
    }
    
    // Asignar datos desde las líneas
    lines.forEach(line => {
      line = line.trim();
      if (line.includes('Cliente:')) {
        appointmentData.cliente = line;
      } else if (line.includes('Barbero:')) {
        appointmentData.barbero = line;
      } else if (line.includes('Servicio:')) {
        appointmentData.servicio = line;
      } else if (line.includes('Duración:')) {
        appointmentData.duracion = line;
      } else if (line.includes('Fecha:')) {
        appointmentData.fecha = line;
      } else if (line.includes('Precio:')) {
        appointmentData.precio = line;
      } else if (line.includes('Dirección:')) {
        appointmentData.direccion = line;
      } else if (line.includes('esperamos')) {
        appointmentData.despedida = line;
      }
    });
    
    return (
      <Card 
        elevation={0} 
        sx={{
          backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(235, 255, 235, 0.9)',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,172,71,0.2)',
        }}
      >
        {/* Header de la tarjeta */}
        <Box 
          sx={{ 
            p: 1.5, 
            backgroundColor: isUser 
              ? 'rgba(255,255,255,0.15)' 
              : 'rgba(0, 172, 71, 0.15)',
            borderBottom: '1px solid',
            borderBottomColor: isUser 
              ? 'rgba(255,255,255,0.15)' 
              : 'rgba(0,172,71,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CheckIcon 
            fontSize="small" 
            sx={{ 
              color: isUser ? 'white' : '#00AC47',
              backgroundColor: isUser ? 'transparent' : 'rgba(255,255,255,0.8)',
              borderRadius: '50%',
              padding: '2px',
              fontSize: '1.2rem'
            }} 
          />
          <Typography 
            variant="subtitle1"
            sx={{ 
              fontWeight: 600,
              color: isUser ? 'white' : '#2C3E50',
              fontSize: '0.95rem',
            }}
          >
            {appointmentData.title}
          </Typography>
        </Box>
        
        {/* Contenido de la tarjeta */}
        <CardContent sx={{ p: 2, pt: 2, pb: '12px !important' }}>
          {/* Cliente */}
          {appointmentData.cliente && (
            <InfoRow isUser={isUser}>
              <Label color={isUser ? 'white' : 'text.primary'}>
                Cliente:
              </Label>
              <Value color={isUser ? 'white' : 'text.primary'}>
                {extractEmoji(appointmentData.cliente).text.replace('Cliente:', '').trim()}
                {appointmentData.cliente.includes('👤') && <Emoji>👤</Emoji>}
              </Value>
            </InfoRow>
          )}
          
          {/* Barbero */}
          {appointmentData.barbero && (
            <InfoRow isUser={isUser}>
              <Label color={isUser ? 'white' : 'text.primary'}>
                Barbero:
              </Label>
              <Value color={isUser ? 'white' : 'text.primary'}>
                {extractEmoji(appointmentData.barbero).text.replace('Barbero:', '').trim()}
                <Emoji>💈</Emoji>
              </Value>
            </InfoRow>
          )}
          
          {/* Servicio */}
          {appointmentData.servicio && (
            <InfoRow isUser={isUser}>
              <Label color={isUser ? 'white' : 'text.primary'}>
                Servicio:
              </Label>
              <Value color={isUser ? 'white' : 'text.primary'}>
                {extractEmoji(appointmentData.servicio).text.replace('Servicio:', '').trim()}
                <Emoji>✂️</Emoji>
              </Value>
            </InfoRow>
          )}
          
          {/* Fecha */}
          {appointmentData.fecha && (
            <InfoRow isUser={isUser}>
              <Label color={isUser ? 'white' : 'text.primary'}>
                Fecha:
              </Label>
              <Value color={isUser ? 'white' : 'text.primary'}>
                {extractEmoji(appointmentData.fecha).text.replace('Fecha:', '').trim()}
                <Emoji>📅</Emoji>
              </Value>
            </InfoRow>
          )}
          
          {/* Dirección - aplicamos estilos especiales */}
          {appointmentData.direccion && (
            <Box 
              sx={{
                mt: 1.5,
                pt: 1.5,
                borderTop: '1px solid',
                borderTopColor: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <PlaceIcon sx={{ color: isUser ? 'white' : '#E74C3C', fontSize: '1.2rem' }} />
              <Typography 
                variant="body2"
                sx={{ 
                  fontWeight: 500,
                  color: isUser ? 'white' : 'text.primary',
                  flex: 1,
                  fontSize: '0.85rem'
                }}
              >
                {extractEmoji(appointmentData.direccion).text.replace('Dirección:', '').trim()}
              </Typography>
            </Box>
          )}
          
          {/* Despedida - con diseño especial */}
          {appointmentData.despedida && (
            <Box 
              sx={{
                mt: 1.5,
                textAlign: 'center',
                backgroundColor: isUser ? 'rgba(255,255,255,0.08)' : 'rgba(0,172,71,0.08)',
                p: 1,
                borderRadius: 1.5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <Typography 
                variant="body2"
                sx={{ 
                  fontWeight: 500,
                  color: isUser ? 'white' : '#2C3E50',
                  fontSize: '0.9rem'
                }}
              >
                {extractEmoji(appointmentData.despedida).text.trim()}
              </Typography>
              <Emoji>😎</Emoji>
            </Box>
          )}
          
          {/* Si no hay dirección ni despedida, añadimos un mensaje genérico */}
          {!appointmentData.direccion && !appointmentData.despedida && (
            <Box 
              sx={{
                mt: 1.5,
                pt: 1,
                borderTop: '1px solid',
                borderTopColor: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                textAlign: 'center',
              }}
            >
              <Typography 
                variant="body2"
                sx={{ 
                  fontStyle: 'italic',
                  color: isUser ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                  fontSize: '0.85rem'
                }}
              >
                ¡Te esperamos! 😎
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  // Función para formatear instrucciones
  const formatInstructions = (text) => {
    if (!text) return text;
    
    // Verificar primero si es un mensaje de cancelación de cita
    if (isAppointmentCancellation(text)) {
      return formatAppointmentCancellation(text);
    }
    
    // Verificar si es un mensaje de confirmación de cita
    if (isAppointmentConfirmation(text)) {
      return formatAppointmentConfirmation(text);
    }
    
    // Identificar si este es un mensaje de instrucciones
    const isInstructionMessage = text.includes('Para') && text.includes('Ejemplo:');
    
    // Si no es un mensaje de instrucciones, mostrar normalmente
    if (!isInstructionMessage) {
      return <Typography variant="body2">{text}</Typography>;
    }
    
    // Extraer la instrucción principal y el ejemplo
    const parts = text.split('Ejemplo:');
    const instructionPart = parts[0].trim();
    const examplePart = parts.length > 1 ? parts[1].trim() : '';
    
    // Extraer los campos requeridos (supone un formato consistente)
    const fieldMatch = instructionPart.match(/Para ([^:]+):([\s\S]*)/);
    
    let actionType = '';
    let fields = [];
    
    if (fieldMatch && fieldMatch.length >= 3) {
      actionType = fieldMatch[1].trim();
      
      // Extraer campos de las viñetas
      const fieldText = fieldMatch[2];
      const fieldLines = fieldText.split('\n');
      
      fieldLines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('•')) {
          fields.push(trimmed.substring(1).trim());
        }
      });
    }
    
    return (
      <Box>
        {/* Card de instrucciones */}
        <Card
          elevation={0}
          sx={{
            backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(240, 245, 250, 0.9)',
            border: '1px solid',
            borderColor: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            borderRadius: 2
          }}
        >
          {/* Header con la acción principal */}
          <Box
            sx={{
              p: 1.5,
              backgroundColor: isUser ? 'rgba(255,255,255,0.15)' : '#2C3E50',
              borderBottom: '1px solid',
              borderBottomColor: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: isUser ? 'white' : 'white',
                fontSize: '0.9rem',
              }}
            >
              {`Para ${actionType}, incluye los siguientes datos:`}
            </Typography>
          </Box>

          {/* Campos requeridos */}
          <Box sx={{ p: 1.5, pt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mb: 2
              }}
            >
              {fields.map((field, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    color: isUser ? 'white' : '#2C3E50',
                    fontWeight: 400,
                    backgroundColor: isUser
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(240, 245, 250, 0.8)',
                    border: '1px solid',
                    borderColor: isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)',
                    borderRadius: 1.5,
                    px: 1.25,
                    py: 0.6,
                  }}
                >
                  {field}
                </Box>
              ))}
            </Box>

            {/* Sección de ejemplo */}
            {examplePart && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 1,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    color: isUser ? 'rgba(255,255,255,0.7)' : 'rgba(44, 62, 80, 0.7)',
                  }}
                >
                  EJEMPLO
                </Typography>

                <Box
                  sx={{
                    backgroundColor: isUser
                      ? 'rgba(255,255,255,0.07)'
                      : 'rgba(245, 250, 255, 0.5)',
                    border: '1px solid',
                    borderColor: isUser
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(0,0,0,0.08)',
                    borderRadius: 1.5,
                    p: 1.5
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: isUser ? 'white' : '#2C3E50',
                      fontStyle: 'italic',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {examplePart}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    );
  };

  // Formatear el mensaje normal
  const formatRegularMessage = (text) => {
    if (!text) return null;
    
    // Verificar si es mensaje corto o simple
    if (text.length < 100 && !text.includes('\n') && !isAppointmentConfirmation(text) && !isAppointmentCancellation(text)) {
      return <Typography variant="body2">{text}</Typography>;
    }
    
    return formatInstructions(text);
  };

  return (
    <Fade in={true} timeout={400}>
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: isMobile ? 1.5 : 1.5,
          maxWidth: '100%',
          opacity: message.loading ? 0.7 : 1,
          transform: message.loading ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.2s ease-in-out',
          px: isMobile ? 1.5 : 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isUser ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
            gap: 1,
            maxWidth: {
              xs: isMobile ? '95%' : '80%',
              md: '75%',
              lg: '70%',
            },
            width: isMobile ? '95%' : 'auto',
          }}
        >
          {/* Avatar */}
          {isUser ? (
            <Avatar
              sx={{
                bgcolor: 'background.dark',
                width: isMobile ? 32 : 34,
                height: isMobile ? 32 : 34,
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                '& svg': {
                  fontSize: isMobile ? 16 : 17,
                  color: 'white',
                },
              }}
            >
              <PersonIcon />
            </Avatar>
          ) : (
            <Avatar
              sx={{
                bgcolor: 'white',
                width: isMobile ? 32 : 34,
                height: isMobile ? 32 : 34,
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                p: 0.5,
              }}
            >
              <Box
                component="img"
                src="https://storage.googleapis.com/cluvi/newbarber-logo.png"
                alt="Misther Barber Logo"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Avatar>
          )}

          {/* Message Container */}
          <Paper
            elevation={0}
            sx={{
              p: 1.75,
              backgroundColor: isUser ? 'background.dark' : 'background.paper',
              color: isUser ? 'white' : 'text.primary',
              borderRadius: 1.5,
              position: 'relative',
              transition: 'all 0.2s ease-in-out',
              border: !isUser ? '1px solid' : 'none',
              borderColor: 'rgba(0,0,0,0.1)',
              boxShadow: isUser 
                ? '0 3px 8px rgba(0,0,0,0.08)'
                : '0 2px 6px rgba(0,0,0,0.04)',
              maxWidth: '100%',
              width: 'auto',
              flex: 1,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 12,
                [isUser ? 'right' : 'left']: -5,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '5px 5px 5px 0',
                borderColor: `transparent ${isUser ? theme.palette.background.dark : theme.palette.background.paper} transparent transparent`,
                transform: isUser ? 'rotate(180deg)' : 'none',
              },
            }}
          >
            {/* Message Content */}
            <Box sx={{ position: 'relative' }}>
              {message.loading ? (
                <TypingAnimation isUser={isUser} />
              ) : (
                formatRegularMessage(message.content)
              )}

              {/* Timestamp if exists */}
              {message.timestamp && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    mt: 1.5,
                    pt: 0.5,
                    borderTop: '1px solid',
                    borderColor: isUser ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.03)',
                    gap: 0.5,
                  }}
                >
                  <TimeIcon sx={{ 
                    fontSize: '0.7rem',
                    color: isUser ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
                  }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: isUser ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
                      fontSize: '0.65rem',
                    }}
                  >
                    {message.timestamp}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Action Buttons if exist */}
            {message.options && (
              <Box 
                sx={{ 
                  mt: 1.5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.8,
                }}
              >
                {message.options}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
});

export default MessageBubble;