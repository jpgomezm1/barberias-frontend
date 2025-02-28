import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  Button, 
  Box,
  IconButton,
  Typography,
  useTheme,
  Paper,
  Divider
} from '@mui/material';
import { 
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  EventAvailable as CalendarIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Componente de Confeti más sutil
const ConfettiPiece = ({ delay }) => {
  const colors = ['#00AC47', '#34A853', '#4285F4', '#FBBC05'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.floor(Math.random() * 8) + 5; // Tamaños entre 5-12px
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: size > 8 ? '50%' : '2px', // Círculos o cuadrados
        background: randomColor,
        opacity: 0.9,
      }}
      initial={{ 
        opacity: 0,
        y: -20,
        x: -20
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, Math.random() * -150, Math.random() * 50],
        x: [Math.random() * -50, Math.random() * 50, Math.random() * -30],
        rotate: [Math.random() * -90, Math.random() * 90, Math.random() * -90],
        transition: {
          duration: 2.5,
          delay: delay,
          ease: "easeOut",
          times: [0, 0.2, 0.8, 1]
        }
      }}
    />
  );
};

// Componente de Cancelación - Animación más fluida
const CancelAnimation = () => {
  return (
    <Box sx={{ position: 'relative', height: 80, width: 80, margin: '0 auto' }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.2, 1],
          opacity: [0, 1],
          rotate: [0, -10, 10, 0],
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
          times: [0, 0.6, 0.8, 1]
        }}
      >
        <CancelIcon 
          sx={{ 
            fontSize: 80,
            color: '#d32f2f',
            opacity: 0.85
          }}
        />
      </motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.5, 1],
          opacity: [0, 0.2, 0],
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
          times: [0, 0.5, 1]
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          background: '#ff5252',
          zIndex: -1
        }}
      />
    </Box>
  );
};

// Componente de Confirmación - Animación mejorada
const ConfirmAnimation = () => {
  return (
    <Box sx={{ position: 'relative', height: 80, width: 80, margin: '0 auto' }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.2, 1],
          opacity: [0, 1],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
          times: [0, 0.6, 1]
        }}
      >
        <CalendarIcon 
          sx={{ 
            fontSize: 80,
            color: '#00AC47',
            opacity: 0.9
          }}
        />
      </motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.5, 1],
          opacity: [0, 0.2, 0],
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
          times: [0, 0.5, 1]
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '50%',
          background: '#4caf50',
          zIndex: -1
        }}
      />
    </Box>
  );
};

const ConfirmationPopup = ({ open, onClose, popupType, message }) => {
  const theme = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open && popupType === 'appointment') {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [open, popupType]);

  // Extraer detalles de la cita para mostrar claramente (cuando aplique)
  const renderAppointmentDetails = () => {
    // Si el mensaje es el de confirmación de agenda estándar, no lo procesamos
    if (!message || message === 'Agendamiento Confirmado' || message === 'Cancelación Confirmada') {
      return null;
    }

    // Verificar si el mensaje contiene los detalles de una cita (formato común en tu app)
    if (message.includes('Detalles de la cita') || message.includes('Cliente:')) {
      const lines = message.split('-').map(line => line.trim());
      
      return (
        <Paper 
          elevation={0}
          sx={{
            backgroundColor: 'rgba(0, 172, 71, 0.08)',
            p: 2,
            borderRadius: 2,
            mb: 3,
            mt: 2,
            width: '100%',
            maxWidth: 320,
          }}
        >
          {lines.map((line, index) => (
            <Typography
              key={index}
              variant="body2"
              component={motion.p}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (index * 0.05) }}
              sx={{
                fontSize: '0.9rem',
                py: 0.5,
                borderBottom: index < lines.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                color: 'text.primary',
              }}
            >
              {line}
            </Typography>
          ))}
        </Paper>
      );
    }
    
    return (
      <Typography
        variant="body1"
        component={motion.p}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        sx={{
          color: 'text.secondary',
          mb: 3,
          mt: 1,
        }}
      >
        {message}
      </Typography>
    );
  };

  // Variantes para la animación del diálogo
  const dialogVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.25
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          PaperComponent={motion.div}
          PaperProps={{
            variants: dialogVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            style: {
              borderRadius: 12,
              overflow: 'hidden',
              minWidth: 320,
              maxWidth: 360,
            }
          }}
        >
          {/* Confetti Container - Ahora más espaciado */}
          {showConfetti && (
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                left: -20,
                right: -20,
                bottom: -20,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 1100,
              }}
            >
              {[...Array(25)].map((_, i) => (
                <ConfettiPiece key={i} delay={i * 0.08} />
              ))}
            </Box>
          )}

          {/* Header section with colored background */}
          <Box
            sx={{
              p: 2.5,
              pb: 3,
              backgroundColor: popupType === 'appointment' ? 'rgba(0, 172, 71, 0.08)' : 'rgba(211, 47, 47, 0.08)',
              position: 'relative',
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'grey.500',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Icon Animation */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 2,
                position: 'relative',
              }}
            >
              {popupType === 'appointment' ? (
                <ConfirmAnimation />
              ) : (
                <CancelAnimation />
              )}
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              component={motion.h2}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              align="center"
              sx={{
                fontWeight: 600,
                color: popupType === 'appointment' ? '#00AC47' : '#d32f2f',
                mt: 1,
              }}
            >
              {popupType === 'appointment' ? '¡Cita agendada con éxito!' : 'Cita cancelada'}
            </Typography>
          </Box>

          <Divider />

          {/* Content section */}
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Message details section with animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ width: '100%' }}
            >
              {renderAppointmentDetails()}
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="contained"
                onClick={onClose}
                fullWidth
                sx={{
                  bgcolor: popupType === 'appointment' ? '#00AC47' : '#d32f2f',
                  color: 'white',
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: popupType === 'appointment' ? '#009940' : '#c62828',
                  },
                }}
              >
                Entendido
              </Button>
            </motion.div>
          </Box>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationPopup;