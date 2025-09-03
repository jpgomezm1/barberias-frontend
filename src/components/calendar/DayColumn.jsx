import React from 'react';
import { Box, Typography, Paper, Chip, Divider, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import TimeSlot from './TimeSlot';

const DayColumn = ({ dayData, onTimeSlotSelect }) => {
  const theme = useTheme();

  // Función para parsear la fecha agregando la hora para usar hora local
  const parseDate = (dateStr) => new Date(dateStr + 'T00:00:00');

  // Obtener el día real de la semana basado en la fecha
  const getDayOfWeek = (dateStr) => {
    const date = parseDate(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Traducir días de la semana usando la fecha real
  const translateDay = (dateStr) => {
    const dayName = getDayOfWeek(dateStr);
    const translations = {
      'Monday': 'Lun',
      'Tuesday': 'Mar',
      'Wednesday': 'Mié',
      'Thursday': 'Jue',
      'Friday': 'Vie',
      'Saturday': 'Sáb',
      'Sunday': 'Dom'
    };
    return translations[dayName] || dayName;
  };

  // Formatear fecha para mostrar solo el día
  const formatDate = (dateStr) => {
    const date = parseDate(dateStr);
    return date.getDate();
  };

  // Obtener mes para mostrar en formato corto
  const getMonthShort = (dateStr) => {
    const date = parseDate(dateStr);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months[date.getMonth()];
  };

  // Verificar si es hoy
  const isToday = () => {
    const today = new Date();
    const dayDate = parseDate(dayData.date);
    return (
      today.getDate() === dayDate.getDate() &&
      today.getMonth() === dayDate.getMonth() &&
      today.getFullYear() === dayDate.getFullYear()
    );
  };

  // Verificar si es fin de semana basado en la fecha real
  const isWeekend = () => {
    const dayDate = parseDate(dayData.date);
    const day = dayDate.getDay();
    return day === 0 || day === 6; // 0 = domingo, 6 = sábado
  };

  // Verificar si hay horarios disponibles
  const hasAvailability = dayData.free_intervals && dayData.free_intervals.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1],
        delay: Math.random() * 0.2
      }}
    >
      <Paper
        elevation={0}
        sx={{
          minWidth: '120px', // Aumentamos el ancho mínimo
          width: 'auto', // Permitir que se ajuste automáticamente
          flex: 1, // Usar flex para distribuir equitativamente
          maxWidth: '180px', // Aumentamos el ancho máximo
          mx: 0.5,
          mb: 1,
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: 'white',
          boxShadow: isToday() 
            ? '0 10px 25px rgba(44, 62, 80, 0.2)' 
            : '0 4px 15px rgba(0, 0, 0, 0.04)',
          border: '1px solid',
          borderColor: isToday() 
            ? '#2C3E50' 
            : 'rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          position: 'relative',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-3px)'
          },
          '&::before': isToday() ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '5px',
            background: 'linear-gradient(90deg, #2C3E50 0%, #4E6D8D 100%)',
            zIndex: 2
          } : {},
        }}
      >
        {/* Header del día */}
        <Box 
          sx={{ 
            background: isToday()
              ? 'linear-gradient(135deg, #2C3E50 0%, #4E6D8D 100%)'
              : isWeekend()
                ? 'linear-gradient(135deg, #F5F7FA 0%, #E6EAF0 100%)'
                : '#fff',
            color: isToday() ? 'white' : isWeekend() ? '#2C3E50' : '#2C3E50',
            pt: 2,
            pb: 2.5,
            px: 1.5,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circle */}
          {isToday() && (
            <Box 
              sx={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
              }}
            />
          )}
          
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 700,
              fontSize: '0.7rem',
              mb: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'block',
              opacity: 0.9,
              position: 'relative',
              zIndex: 1
            }}
          >
            {translateDay(dayData.date)}
          </Typography>
          
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.5rem',
              lineHeight: 1,
              mb: 0.5,
              position: 'relative',
              zIndex: 1
            }}
          >
            {formatDate(dayData.date)}
          </Typography>
          
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 500,
              fontSize: '0.7rem',
              opacity: 0.8,
              position: 'relative',
              zIndex: 1
            }}
          >
            {getMonthShort(dayData.date)}
          </Typography>
          
          {isToday() && (
            <Chip
              label="HOY"
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                height: 20,
                fontSize: '0.6rem',
                fontWeight: 700,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                zIndex: 1
              }}
            />
          )}
        </Box>
        
        <Divider />
        
        {/* Status indicator */}
        <Box sx={{ 
          py: 1.5, 
          px: 2, 
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}>
          {!hasAvailability ? (
            <Box sx={{ 
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: '#D32F2F',
              py: 0.5,
              px: 1,
              borderRadius: 1.5,
              fontSize: '0.7rem',
              fontWeight: 600,
              textAlign: 'center',
              width: '100%'
            }}>
              No disponible
            </Box>
          ) : (
            <Box sx={{ 
              backgroundColor: 'rgba(0, 150, 136, 0.1)',
              color: '#009688',
              py: 0.5,
              px: 1,
              borderRadius: 1.5,
              fontSize: '0.7rem',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              {dayData.free_intervals.length} horarios
            </Box>
          )}
        </Box>
        
        {/* Lista de horarios */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 1.5,
          maxHeight: '320px',
          overflowY: 'auto',
          p: 2,
          pt: 1.5,
          '&::-webkit-scrollbar': {
            width: '3px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '10px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '10px'
          }
        }}>
          {hasAvailability ? (
            <>
              {dayData.free_intervals.map((timeSlot, index) => (
                <TimeSlot
                  key={`${timeSlot.start}-${index}`}
                  timeSlot={timeSlot}
                  onSelect={() => onTimeSlotSelect({
                    ...timeSlot,
                    barber: dayData.barber || 'Barbero',
                    date: dayData.date,
                    dateTime: `${dayData.date}T${timeSlot.start}:00`,
                    formattedDateTime: `${dayData.date} ${timeSlot.start}`,
                    isLast: index === dayData.free_intervals.length - 1
                  })}
                  isToday={isToday()}
                  isFirst={index === 0}
                  isLast={index === dayData.free_intervals.length - 1}
                  dayData={dayData}
                />
              ))}
            </>
          ) : (
            <Box sx={{ 
              py: 3,
              textAlign: 'center',
              color: 'text.disabled',
              fontSize: '0.75rem',
              fontWeight: 500,
              opacity: 0.7,
              fontStyle: 'italic'
            }}>
              Sin horarios disponibles
            </Box>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};

export default DayColumn;