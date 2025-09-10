import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';

const AppointmentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    barber: '',
    service: '',
    dateTime: null,
  });

  const [errors, setErrors] = useState({
    phone: false,
    dateTime: false
  });

  const barbers = ['Diego', 'Juan', 'Tomás'];
  
  // Función para verificar si la hora seleccionada es el último slot (6:45 PM)
  const isLastSlot = (dateTime) => {
    if (!dateTime || !dateTime.isValid) return false;
    const hour = dateTime.hour;
    const minute = dateTime.minute;
    // Verificar si es 6:45 PM (18:45)
    return (hour === 18 && minute === 45);
  };

  // Servicios disponibles según el horario
  const getAvailableServices = () => {
    const allServices = ['Corte', 'Barba', 'Corte y Barba'];
    
    // Si es el último slot (6:45 PM), solo permitir Corte y Barba
    if (isLastSlot(formData.dateTime)) {
      return ['Corte', 'Barba'];
    }
    
    return allServices;
  };
  
  const services = getAvailableServices();

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar teléfono
    if (!validatePhone(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: true }));
      return;
    }

    // Validar fecha y hora
    if (!formData.dateTime || !formData.dateTime.isValid) {
      setErrors(prev => ({ ...prev, dateTime: true }));
      return;
    }

    onSubmit({
      ...formData,
      dateTime: formData.dateTime.toFormat('yyyy-MM-dd HH:mm')
    });
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    
    // Limpiar error del teléfono si existe
    if (field === 'phone') {
      setErrors(prev => ({ ...prev, phone: false }));
    }
  };

  const isWeekend = (date) => {
    const day = date.weekday;
    return day === 6 || day === 7; // 6 es sábado, 7 es domingo
  };

  const isWithinWorkingHours = (date) => {
    const hour = date.hour;
    return hour >= 7 && hour < 19; // Horario de trabajo: 7 AM a 7 PM
  };

  const handleDateChange = (newValue) => {
    const wasLastSlot = isLastSlot(formData.dateTime);
    const isNowLastSlot = isLastSlot(newValue);
    
    // Si cambió de/a último slot, resetear servicio seleccionado
    const shouldResetService = wasLastSlot !== isNowLastSlot && formData.service;
    
    setFormData({
      ...formData,
      dateTime: newValue,
      service: shouldResetService ? '' : formData.service
    });
    setErrors(prev => ({ ...prev, dateTime: false }));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: 'grey.100',
        p: 3,
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Stack spacing={3}>
        <TextField
          label="Nombre"
          value={formData.clientName}
          onChange={handleChange('clientName')}
          fullWidth
          required
          sx={{ bgcolor: 'white' }}
          placeholder="Ej: Juan Pérez"
        />

        <TextField
          label="Teléfono"
          value={formData.phone}
          onChange={handleChange('phone')}
          fullWidth
          required
          type="tel"
          error={errors.phone}
          helperText={errors.phone ? "Ingresa un número de teléfono válido de 10 dígitos" : ""}
          sx={{ bgcolor: 'white' }}
          placeholder="Ej: 3183351733"
        />

        <FormControl fullWidth required sx={{ bgcolor: 'white' }}>
          <InputLabel>Barbero</InputLabel>
          <Select
            value={formData.barber}
            label="Barbero"
            onChange={handleChange('barber')}
          >
            {barbers.map((barber) => (
              <MenuItem key={barber} value={barber}>
                {barber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required sx={{ bgcolor: 'white' }}>
          <InputLabel>Servicio</InputLabel>
          <Select
            value={formData.service}
            label="Servicio"
            onChange={handleChange('service')}
          >
            {services.map((service) => (
              <MenuItem key={service} value={service}>
                {service}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DateTimePicker
            label="Fecha y Hora"
            value={formData.dateTime}
            onChange={handleDateChange}
            shouldDisableDate={isWeekend}
            shouldDisableTime={(timeValue, clockType) => {
              if (clockType === 'hours') {
                const hour = timeValue;
                return hour < 7 || hour >= 19;
              }
              return false;
            }}
            minDateTime={DateTime.now()}
            views={['year', 'month', 'day', 'hours', 'minutes']}
            ampm={false}
            slotProps={{
              textField: {
                required: true,
                fullWidth: true,
                error: errors.dateTime,
                helperText: errors.dateTime ? "Selecciona una fecha y hora válida" : "",
                sx: { bgcolor: 'white' }
              }
            }}
          />
        </LocalizationProvider>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={!formData.dateTime || !formData.clientName || !formData.phone || !formData.barber || !formData.service}
          sx={{
            mt: 2,
            py: 1.5,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&:disabled': {
              bgcolor: 'grey.300',
            }
          }}
        >
          Agendar Cita
        </Button>
      </Stack>
    </Box>
  );
};

export default AppointmentForm;