import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button
} from '@mui/material';
import { AccessTime as TimeIcon, Block as BlockIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const TimeSlot = ({ timeSlot, onSelect, isToday, isFirst, isLast }) => {
  // Verificar si el horario está ocupado
  const isOccupied = timeSlot.occupied || timeSlot.status === 'occupied';
  
  // Ajustar el horario si es el último turno
  let adjustedTimeSlot = {...timeSlot};
  
  if (isLast) {
    // Función para restar 15 minutos a una hora en formato "HH:MM"
    const subtract15Minutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes - 15;
      
      // Si los minutos son negativos, ajustar las horas
      if (totalMinutes < 0) totalMinutes += 24 * 60;
      
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      
      return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    };
    
    // Restar 15 minutos a la hora de inicio y fin
    adjustedTimeSlot.start = subtract15Minutes(timeSlot.start);
    adjustedTimeSlot.end = subtract15Minutes(timeSlot.end);
  }
  
  // Modificar el handler de selección para el último turno
  const handleSelect = () => {
    if (isLast) {
      onSelect({
        ...adjustedTimeSlot,
        onlyAllowedService: "Corte", // Esta propiedad es clave
        isLastSlot: true // Añadir esta propiedad también para mayor claridad
      });
    } else {
      onSelect(timeSlot);
    }
  };
  
  // Formatear hora para mostrar en 12h
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  return (
    <Button
      component={motion.div}
      whileHover={!isOccupied ? { scale: 1.03 } : { scale: 1 }}
      whileTap={!isOccupied ? { scale: 0.98 } : { scale: 1 }}
      onClick={!isOccupied ? handleSelect : undefined}
      disabled={isOccupied}
      sx={{
        display: 'block',
        p: 0,
        minWidth: 'auto',
        textAlign: 'center',
        borderRadius: 1,
        border: '1px solid',
        borderColor: isOccupied ? 'rgba(211, 47, 47, 0.3)' : 'rgba(0,0,0,0.1)',
        backgroundColor: isOccupied ? 'rgba(211, 47, 47, 0.1)' : isLast ? 'rgba(255, 193, 7, 0.1)' : 'white',
        boxShadow: isOccupied ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        opacity: isOccupied ? 0.8 : 1,
        cursor: isOccupied ? 'not-allowed' : 'pointer',
        '&:hover': !isOccupied ? {
          backgroundColor: isLast ? 'rgba(255, 193, 7, 0.2)' : 'rgba(0,172,71,0.08)',
          borderColor: isLast ? 'rgba(255, 193, 7, 0.4)' : 'rgba(0,172,71,0.2)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
        } : {
          backgroundColor: 'rgba(211, 47, 47, 0.15)',
          borderColor: 'rgba(211, 47, 47, 0.4)',
        },
        '&.Mui-disabled': {
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          color: isOccupied ? '#D32F2F' : 'inherit',
        }
      }}
    >
      <Box sx={{ 
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        {isOccupied && (
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            opacity: 0.3
          }}>
            <BlockIcon sx={{ fontSize: '1.2rem', color: '#D32F2F' }} />
          </Box>
        )}
        
        <Typography 
          variant="body2"
          sx={{ 
            fontSize: '0.9rem',
            fontWeight: 600,
            color: isOccupied ? '#D32F2F' : isLast ? '#FF8F00' : '#2C3E50',
            position: 'relative',
            zIndex: 2
          }}
        >
          {formatTime(adjustedTimeSlot.start)}
        </Typography>
        
        <Typography 
          variant="caption"
          sx={{ 
            fontSize: '0.7rem',
            color: isOccupied ? 'rgba(211, 47, 47, 0.7)' : isLast ? 'rgba(255, 152, 0, 0.8)' : 'text.secondary',
            mt: 0.25,
            position: 'relative',
            zIndex: 2
          }}
        >
          {formatTime(adjustedTimeSlot.end)}
        </Typography>
        
        {isLast && !isOccupied && (
          <Typography 
            variant="caption"
            sx={{ 
              fontSize: '0.65rem',
              color: '#FF8F00',
              mt: 0.5,
              fontWeight: 600
            }}
          >
            Solo Corte
          </Typography>
        )}
        
        {isOccupied && (
          <Typography 
            variant="caption"
            sx={{ 
              fontSize: '0.65rem',
              color: '#D32F2F',
              mt: 0.5,
              fontWeight: 600,
              fontStyle: 'italic'
            }}
          >
            Ocupado
          </Typography>
        )}
      </Box>
    </Button>
  );
};

export default TimeSlot;