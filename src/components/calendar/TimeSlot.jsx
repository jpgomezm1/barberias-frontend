import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button
} from '@mui/material';
import { Block as BlockIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS, ESTABLISHMENT_SUBDOMAIN } from '../../config/api';

const TimeSlot = ({ timeSlot, onSelect, isToday, isFirst, isLast, dayData }) => {
  // Estados para manejar el bloqueo del último slot
  const [isLastSlotBlocked, setIsLastSlotBlocked] = useState(false);
  const [loadingLastSlotStatus, setLoadingLastSlotStatus] = useState(false);
  
  // Verificar si el horario está ocupado
  const isOccupied = timeSlot.occupied || timeSlot.status === 'occupied';
  
  const checkLastSlotStatus = useCallback(async () => {
    if (!dayData?.barber || !dayData?.date) return;
    
    setLoadingLastSlotStatus(true);
    try {
      const response = await axios.post(API_ENDPOINTS.lastSlotStatus, {
        barber: dayData.barber,
        date: dayData.date,
        subdomain: ESTABLISHMENT_SUBDOMAIN
      });
      
      const { blocked } = response.data;
      setIsLastSlotBlocked(blocked || false);
    } catch (error) {
      console.error('Error checking last slot status:', error);
      // En caso de error, no bloqueamos por defecto
      setIsLastSlotBlocked(false);
    } finally {
      setLoadingLastSlotStatus(false);
    }
  }, [dayData?.barber, dayData?.date]);
  
  // Consultar estado del último slot cuando es el último turno
  useEffect(() => {
    if (isLast && !isOccupied) {
      checkLastSlotStatus();
    }
  }, [isLast, isOccupied, checkLastSlotStatus]);
  
  // Ajustar el horario si es el último turno (45 minutos en lugar de 60)
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
    
    // Restar 15 minutos a la hora de inicio y fin para hacer slots de 45 min
    adjustedTimeSlot.start = subtract15Minutes(timeSlot.start);
    adjustedTimeSlot.end = subtract15Minutes(timeSlot.end);
  }
  
  // Determinar si el slot está efectivamente bloqueado
  const isSlotBlocked = isOccupied || (isLast && isLastSlotBlocked);
  
  // Modificar el handler de selección para el último turno
  const handleSelect = () => {
    if (isSlotBlocked) return; // No permitir selección si está bloqueado
    
    if (isLast) {
      onSelect({
        ...adjustedTimeSlot,
        onlyAllowedService: ["Corte", "Barba"], // Servicios permitidos para último slot
        isLastSlot: true,
        duration: 45 // Duración de 45 minutos
      });
    } else {
      onSelect({
        ...timeSlot,
        isLastSlot: false,
        duration: 60 // Duración normal de 60 minutos
      });
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
      whileHover={!isSlotBlocked ? { scale: 1.03 } : { scale: 1 }}
      whileTap={!isSlotBlocked ? { scale: 0.98 } : { scale: 1 }}
      onClick={!isSlotBlocked ? handleSelect : undefined}
      disabled={isSlotBlocked || loadingLastSlotStatus}
      sx={{
        display: 'block',
        p: 0,
        minWidth: 'auto',
        textAlign: 'center',
        borderRadius: 1,
        border: '1px solid',
        borderColor: isSlotBlocked ? 'rgba(211, 47, 47, 0.3)' : 'rgba(0,0,0,0.1)',
        backgroundColor: isSlotBlocked ? 'rgba(211, 47, 47, 0.1)' : isLast ? 'rgba(255, 193, 7, 0.1)' : 'white',
        boxShadow: isSlotBlocked ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        opacity: isSlotBlocked || loadingLastSlotStatus ? 0.8 : 1,
        cursor: isSlotBlocked ? 'not-allowed' : 'pointer',
        '&:hover': !isSlotBlocked ? {
          backgroundColor: isLast ? 'rgba(255, 193, 7, 0.2)' : 'rgba(0,172,71,0.08)',
          borderColor: isLast ? 'rgba(255, 193, 7, 0.4)' : 'rgba(0,172,71,0.2)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
        } : {
          backgroundColor: 'rgba(211, 47, 47, 0.15)',
          borderColor: 'rgba(211, 47, 47, 0.4)',
        },
        '&.Mui-disabled': {
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          color: isSlotBlocked ? '#D32F2F' : 'inherit',
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
        {(isSlotBlocked || loadingLastSlotStatus) && (
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
            color: isSlotBlocked ? '#D32F2F' : isLast ? '#FF8F00' : '#2C3E50',
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
            color: isSlotBlocked ? 'rgba(211, 47, 47, 0.7)' : isLast ? 'rgba(255, 152, 0, 0.8)' : 'text.secondary',
            mt: 0.25,
            position: 'relative',
            zIndex: 2
          }}
        >
          {formatTime(adjustedTimeSlot.end)}
        </Typography>
        
        {isLast && !isSlotBlocked && !loadingLastSlotStatus && (
          <Typography 
            variant="caption"
            sx={{ 
              fontSize: '0.65rem',
              color: '#FF8F00',
              mt: 0.5,
              fontWeight: 600
            }}
          >
            45 min - Corte/Barba
          </Typography>
        )}
        
        {loadingLastSlotStatus && (
          <Typography 
            variant="caption"
            sx={{ 
              fontSize: '0.65rem',
              color: '#9E9E9E',
              mt: 0.5,
              fontWeight: 600
            }}
          >
            Verificando...
          </Typography>
        )}
        
        {(isOccupied || isLastSlotBlocked) && (
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
            {isOccupied ? 'Ocupado' : 'Bloqueado'}
          </Typography>
        )}
      </Box>
    </Button>
  );
};

export default TimeSlot;