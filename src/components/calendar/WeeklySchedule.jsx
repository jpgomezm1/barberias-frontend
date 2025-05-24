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

  // Función para filtrar días que ya pasaron
  const filterFutureDays = (scheduleData) => {
    if (!scheduleData || !scheduleData.schedule) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    
    return Object.values(scheduleData.schedule).filter(dayData => {
      const dayDate = new Date(dayData.date + 'T00:00:00');
      return dayDate >= today; // Solo incluir hoy y días futuros
    });
  };

  // Modificación: enviamos dateTime como cadena local y evitamos conversión a UTC
  const handleTimeSlotSelect = (date, timeSlot) => {
    if (onTimeSlotSelect) {
      const dateTimeLocal = `${date}T${timeSlot.start}`;
      const formattedDate = new Date(dateTimeLocal).toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Bogota'
      });
      
      onTimeSlotSelect({
        barber: selectedBarber,
        dateTime: dateTimeLocal,
        endTime: timeSlot.end,
        formattedDateTime: `${formattedDate} ${timeSlot.start}`,
        time: timeSlot, // Asegúrate de pasar el timeSlot completo con todas sus propiedades
        date: date
      });
    }
  };

  // Si no hay barbero seleccionado, mostrar selector
  if (!selectedBarber) {
    return (
      <BarberSelector onSelect={setSelectedBarber} onClose={onClose} />
    );
  }

  // Formatear fechas para mostrar rango semanal
  const weekEndDate = new Date(currentWeekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  const formatDateRange = () => {
    const options = { month: 'short', day: 'numeric' };
    return `${currentWeekStart.toLocaleDateString(undefined, options)} - ${weekEndDate.toLocaleDateString(undefined, options)}`;
  };

  // Obtener días filtrados (solo actuales y futuros)
  const futureDays = scheduleData ? filterFutureDays(scheduleData) : [];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={0}
        sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
             borderBottom: '1px solid rgba(0,0,0,0.08)', backgroundColor: '#2C3E50', color: 'white' }}
      >
        <IconButton onClick={onClose} sx={{ color: 'white' }}><ArrowBackIcon /></IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            Horario de {selectedBarber}
          </Typography>
          <Typography variant="caption">{formatDateRange()}</Typography>
        </Box>
        <Box sx={{ visibility: 'hidden' }}><ArrowBackIcon /></Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5,
                  borderBottom: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <IconButton onClick={handlePreviousWeek} size="small"><PrevIcon /></IconButton>
        <Button startIcon={<TodayIcon />} onClick={handleTodayClick} size="small"
                sx={{ textTransform: 'none', backgroundColor: 'rgba(0,0,0,0.05)',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' } }}>
          Hoy
        </Button>
        <IconButton onClick={handleNextWeek} size="small"><NextIcon /></IconButton>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={36} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={fetchScheduleData}>Reintentar</Button>
          </Box>
        ) : futureDays.length > 0 ? (
          <Box sx={{ display: 'flex', width: '100%', overflowX: 'auto', pb: 2 }}>
            {futureDays.map(dayData => (
              <DayColumn key={dayData.date} dayData={dayData}
                         onTimeSlotSelect={ts => handleTimeSlotSelect(dayData.date, ts)} />
            ))}
          </Box>
        ) : scheduleData ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#64748B', mb: 1 }}>
              No hay días disponibles
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Todos los días de esta semana ya han pasado. Intenta con la siguiente semana.
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default WeeklySchedule;