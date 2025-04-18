// WeeklySchedule.js
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  IconButton,
  Chip,
  Button,
  SwipeableDrawer
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import BarberSelector from './BarberSelector';
import DayColumn from './DayColumn';
import { API_ENDPOINTS, ESTABLISHMENT_SUBDOMAIN } from '../../config/api';
import axios from 'axios';

const WeeklySchedule = ({ onClose, onTimeSlotSelect }) => {
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedBarber) {
      fetchScheduleData();
    }
  }, [selectedBarber, currentWeekStart]);

  const fetchScheduleData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(API_ENDPOINTS.barber_schedule, {
        barber: selectedBarber,
        week_start: currentWeekStart.toISOString().split('T')[0],
        subdomain: ESTABLISHMENT_SUBDOMAIN
      });
      
      setScheduleData(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setError('No pudimos cargar el horario. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    const prevWeek = new Date(currentWeekStart);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeekStart(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeekStart);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeekStart(nextWeek);
  };

  const handleTodayClick = () => {
    setCurrentWeekStart(
      new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1))
    );
  };

  // En WeeklySchedule.js, modifica la función handleTimeSlotSelect:
const handleTimeSlotSelect = (date, timeSlot) => {
    if (onTimeSlotSelect) {
      // Creamos un objeto DateTime con la fecha y hora seleccionadas
      const selectedDateTime = new Date(`${date}T${timeSlot.start}:00`);
      
      // Para la hora de fin, convertimos a Date y añadimos 30 minutos
      const endDateTime = new Date(selectedDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + 30); // Asumimos citas de 30 minutos
      
      onTimeSlotSelect({
        barber: selectedBarber,
        dateTime: selectedDateTime.toISOString(),
        endTime: timeSlot.end,
        formattedDateTime: `${selectedDateTime.toLocaleDateString()} ${timeSlot.start}`
      });
    }
  };

  // Si no hay barbero seleccionado, mostrar selector
  if (!selectedBarber) {
    return (
      <BarberSelector 
        onSelect={setSelectedBarber} 
        onClose={onClose} 
      />
    );
  }

  // Formatear fechas para mostrar rango semanal
  const weekEndDate = new Date(currentWeekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  
  const formatDateRange = () => {
    const options = { month: 'short', day: 'numeric' };
    return `${currentWeekStart.toLocaleDateString(undefined, options)} - ${weekEndDate.toLocaleDateString(undefined, options)}`;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header con navegación */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          backgroundColor: '#2C3E50',
          color: 'white'
        }}
      >
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <ArrowBackIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            Horario de {selectedBarber}
          </Typography>
          <Typography variant="caption">
            {formatDateRange()}
          </Typography>
        </Box>
        
        <Box sx={{ visibility: 'hidden' }}>
          <ArrowBackIcon />
        </Box>
      </Paper>
      
      {/* Navegación de semanas */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 1.5,
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        backgroundColor: 'rgba(0,0,0,0.02)'
      }}>
        <IconButton onClick={handlePreviousWeek} size="small">
          <PrevIcon />
        </IconButton>
        
        <Button 
          startIcon={<TodayIcon />} 
          onClick={handleTodayClick}
          size="small"
          sx={{ 
            textTransform: 'none',
            backgroundColor: 'rgba(0,0,0,0.05)',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.1)',
            }
          }}
        >
          Hoy
        </Button>
        
        <IconButton onClick={handleNextWeek} size="small">
          <NextIcon />
        </IconButton>
      </Box>
      
      {/* Content */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        p: 1
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={36} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button 
              variant="outlined" 
              sx={{ mt: 2 }}
              onClick={fetchScheduleData}
            >
              Reintentar
            </Button>
          </Box>
        ) : scheduleData ? (
          <Box sx={{ 
            display: 'flex', 
            width: '100%', 
            overflowX: 'auto',
            pb: 2
          }}>
            {Object.values(scheduleData.schedule).map((dayData) => (
              <DayColumn
                key={dayData.date}
                dayData={dayData}
                onTimeSlotSelect={(timeSlot) => handleTimeSlotSelect(dayData.date, timeSlot)}
              />
            ))}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default WeeklySchedule;