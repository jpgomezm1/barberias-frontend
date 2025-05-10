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
      onClick={!isOccupied ? onSelect : undefined}
      disabled={isOccupied}
      sx={{
        display: 'block',
        p: 0,
        minWidth: 'auto',
        textAlign: 'center',
        borderRadius: 1,
        border: '1px solid',
        borderColor: isOccupied ? 'rgba(211, 47, 47, 0.3)' : 'rgba(0,0,0,0.1)',
        backgroundColor: isOccupied ? 'rgba(211, 47, 47, 0.1)' : 'white',
        boxShadow: isOccupied ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        opacity: isOccupied ? 0.8 : 1,
        cursor: isOccupied ? 'not-allowed' : 'pointer',
        '&:hover': !isOccupied ? {
          backgroundColor: 'rgba(0,172,71,0.08)',
          borderColor: 'rgba(0,172,71,0.2)',
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
            color: isOccupied ? '#D32F2F' : '#2C3E50',
            position: 'relative',
            zIndex: 2
          }}
        >
          {formatTime(timeSlot.start)}
        </Typography>
        
        <Typography 
          variant="caption"
          sx={{ 
            fontSize: '0.7rem',
            color: isOccupied ? 'rgba(211, 47, 47, 0.7)' : 'text.secondary',
            mt: 0.25,
            position: 'relative',
            zIndex: 2
          }}
        >
          {formatTime(timeSlot.end)}
        </Typography>
        
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