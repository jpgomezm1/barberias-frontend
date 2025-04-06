import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Button
} from '@mui/material';
import { AccessTime as TimeIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const TimeSlot = ({ timeSlot, onSelect, isToday, isFirst, isLast }) => {
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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      sx={{
        display: 'block',
        p: 0,
        minWidth: 'auto',
        textAlign: 'center',
        borderRadius: 1,
        border: '1px solid rgba(0,0,0,0.1)',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(0,172,71,0.08)',
          borderColor: 'rgba(0,172,71,0.2)',
          boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
        }
      }}
    >
      <Box sx={{ 
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography 
          variant="body2"
          sx={{ 
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#2C3E50'
          }}
        >
          {formatTime(timeSlot.start)}
        </Typography>
        
        <Typography 
          variant="caption"
          sx={{ 
            fontSize: '0.7rem',
            color: 'text.secondary',
            mt: 0.25
          }}
        >
          {formatTime(timeSlot.end)}
        </Typography>
      </Box>
    </Button>
  );
};

export default TimeSlot;