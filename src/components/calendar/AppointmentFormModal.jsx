import React, { useState, useEffect } from 'react';
import {
 Dialog,
 DialogTitle,
 DialogContent,
 DialogActions,
 Button,
 TextField,
 MenuItem,
 Box,
 Typography,
 CircularProgress,
 IconButton,
 Divider,
 InputAdornment
} from '@mui/material';
import { 
 CalendarMonth as CalendarIcon,
 AccessTime as TimeIcon,
 Person as PersonIcon,
 Phone as PhoneIcon,
 ContentCut as ServiceIcon,
 Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS, ESTABLISHMENT_SUBDOMAIN } from '../../config/api';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const AppointmentFormModal = ({ 
 open, 
 onClose, 
 onSubmit, 
 selectedTimeInfo, 
 loading 
}) => {
 const [formData, setFormData] = useState({
   clientName: '',
   phone: '',
   service: ''
 });
 
 const [errors, setErrors] = useState({
   clientName: false,
   phone: false,
   service: false
 });
 
 // Estado para los servicios obtenidos del endpoint
 const [services, setServices] = useState([]);
 const [loadingServices, setLoadingServices] = useState(false);
 
 // Función para formatear a moneda COP sin decimales
 const formatCOP = (value) => {
   return new Intl.NumberFormat('es-CO', {
     style: 'currency',
     currency: 'COP',
     maximumFractionDigits: 0,
     minimumFractionDigits: 0
   }).format(value);
 };

 // Función para detectar si es el último slot (horario 7:00 PM o 19:00)
 const isLastSlot = () => {
   const timeStart = selectedTimeInfo?.time?.start;
   if (!timeStart) return false;
   
   // Convertir la hora a formato 24h para comparar
   const [hours, minutes] = timeStart.split(':');
   const hour24 = parseInt(hours);
   
   // Si la hora es 19:00 (7:00 PM) o mayor, es el último slot
   return hour24 >= 19;
 };

 useEffect(() => {
   if (open) {
     // Reiniciar form data cuando se abre el modal
     setFormData({
       clientName: '',
       phone: '',
       service: ''
     });
     
     setErrors({
       clientName: false,
       phone: false,
       service: false
     });
     
     // Consulta el endpoint para obtener los servicios cada vez que el modal se abre
     setLoadingServices(true);
     axios.post(API_ENDPOINTS.services, { subdomain: ESTABLISHMENT_SUBDOMAIN })
       .then((res) => {
         if (res.data && res.data.services) {
           let availableServices = res.data.services;
           
           // Si es el último slot (7:00 PM o después), filtrar solo "Corte"
           if (isLastSlot()) {
             availableServices = res.data.services.filter(service => 
               service.name.toLowerCase() === "corte"
             );
           }
           
           setServices(availableServices);
         }
       })
       .catch((err) => {
         console.error("Error al obtener los servicios:", err);
       })
       .finally(() => {
         setLoadingServices(false);
       });
   }
 }, [open, selectedTimeInfo]);
 
 const handleChange = (field) => (event) => {
   let value = event.target.value;
   
   // Para el campo teléfono, solo permitir números
   if (field === 'phone') {
     value = value.replace(/[^0-9]/g, '');
   }
   
   setFormData(prev => ({
     ...prev,
     [field]: value
   }));
   
   // Limpiar error
   if (errors[field]) {
     setErrors(prev => ({ ...prev, [field]: false }));
   }
 };
 
 const validatePhone = (phone) => {
   const phoneRegex = /^[0-9]{10}$/;
   return phoneRegex.test(phone);
 };
 
 const handleSubmit = () => {
   // Validar campos
   const newErrors = {
     clientName: !formData.clientName.trim(),
     phone: !validatePhone(formData.phone),
     service: !formData.service
   };
   
   setErrors(newErrors);
   
   // Si hay errores, no continuar
   if (Object.values(newErrors).some(error => error)) {
     return;
   }
   
   // Enviar datos completos
   onSubmit({
     ...selectedTimeInfo,
     clientName: formData.clientName.trim(),
     phone: formData.phone.trim(),
     service: formData.service
   });
 };
 
 // Formatear fecha para mostrar
 const formatDate = (dateStr) => {
   if (!dateStr) return '';
   const date = new Date(dateStr);
   return date.toLocaleDateString('es-ES', {
     weekday: 'long',
     year: 'numeric',
     month: 'long',
     day: 'numeric',
     timeZone: 'UTC'
   });
 };
 
 // Formatear hora para mostrar
 const formatTime = (timeStr) => {
   if (!timeStr) return '';
   
   // Si es las 7:00 PM (19:00), mostrar 6:45 PM
   if (timeStr === '19:00') {
     return '6:45 PM';
   }
   
   const [hours, minutes] = timeStr.split(':');
   const hour = parseInt(hours);
   const ampm = hour >= 12 ? 'PM' : 'AM';
   const hour12 = hour % 12 || 12;
   return `${hour12}:${minutes} ${ampm}`;
 };
 
 // Animation variants
 const containerVariants = {
   hidden: { opacity: 0 },
   visible: {
     opacity: 1,
     transition: {
       staggerChildren: 0.07
     }
   }
 };
 
 const itemVariants = {
   hidden: { y: 20, opacity: 0 },
   visible: {
     y: 0,
     opacity: 1,
     transition: {
       type: "spring",
       stiffness: 260,
       damping: 20
     }
   }
 };
 
 const selectedTime = selectedTimeInfo?.time?.start ? formatTime(selectedTimeInfo.time.start) : '';
 const selectedDate = selectedTimeInfo?.date ? formatDate(selectedTimeInfo.date) : '';
 
 return (
   <Dialog 
     open={open} 
     onClose={loading ? null : onClose}
     maxWidth="sm"
     fullWidth
     PaperProps={{
       sx: {
         borderRadius: 2,
         overflow: 'hidden'
       }
     }}
   >
     <DialogTitle 
       component={Box} 
       sx={{ 
         backgroundColor: '#2C3E50', 
         color: 'white',
         p: 0,
         position: 'relative'
       }}
     >
       <Box sx={{ 
         display: 'flex',
         alignItems: 'center',
         px: 3,
         py: 2,
       }}>
         <CalendarIcon sx={{ mr: 1.5 }} />
         <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
           Completa tu cita
         </Typography>
         
         <IconButton 
           sx={{ 
             position: 'absolute', 
             right: 8, 
             top: 8, 
             color: 'rgba(255,255,255,0.7)',
             '&:hover': {
               color: 'white',
               backgroundColor: 'rgba(255,255,255,0.1)'
             }
           }}
           onClick={loading ? null : onClose}
           disabled={loading}
         >
           <CloseIcon />
         </IconButton>
       </Box>
     </DialogTitle>
     
     <DialogContent sx={{ p: 0 }}>
       <MotionBox 
         sx={{ p: 3, pt: 3 }}
         variants={containerVariants}
         initial="hidden"
         animate="visible"
       >
         {/* Información del horario seleccionado */}
         <MotionBox 
           variants={itemVariants}
           sx={{ 
             mb: 3, 
             p: 0,
             display: 'flex',
             flexDirection: 'column',
             gap: 2
           }}
         >
           <Typography 
             variant="subtitle1" 
             sx={{ 
               fontWeight: 600, 
               color: '#2C3E50',
               fontSize: '0.95rem',
               mb: 1
             }}
           >
             Detalles de la cita
           </Typography>
           
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Box sx={{ 
               display: 'flex',
               flexDirection: 'column',
               flex: 1,
               p: 2,
               backgroundColor: 'rgba(44, 62, 80, 0.03)',
               borderRadius: 1.5
             }}>
               <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                 <PersonIcon sx={{ fontSize: '1rem', color: '#2C3E50', mr: 1 }} />
                 <Typography sx={{ 
                   fontSize: '0.8rem', 
                   color: '#64748B',
                   fontWeight: 500
                 }}>
                   Barbero
                 </Typography>
               </Box>
               <Typography sx={{ fontWeight: 500, color: '#334155' }}>
                 {selectedTimeInfo?.barber || 'No seleccionado'}
               </Typography>
             </Box>
             
             <Box sx={{ 
               display: 'flex',
               flexDirection: 'column',
               flex: 1,
               p: 2,
               backgroundColor: 'rgba(44, 62, 80, 0.03)',
               borderRadius: 1.5
             }}>
               <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                 <TimeIcon sx={{ fontSize: '1rem', color: '#2C3E50', mr: 1 }} />
                 <Typography sx={{ 
                   fontSize: '0.8rem', 
                   color: '#64748B',
                   fontWeight: 500
                 }}>
                   Hora
                 </Typography>
               </Box>
               <Typography sx={{ fontWeight: 500, color: '#334155' }}>
                 {selectedTime}
               </Typography>
             </Box>
           </Box>
           
           <Box sx={{ 
             display: 'flex',
             flexDirection: 'column',
             p: 2,
             backgroundColor: 'rgba(44, 62, 80, 0.03)',
             borderRadius: 1.5
           }}>
             <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
               <CalendarIcon sx={{ fontSize: '1rem', color: '#2C3E50', mr: 1 }} />
               <Typography sx={{ 
                 fontSize: '0.8rem', 
                 color: '#64748B',
                 fontWeight: 500
               }}>
                 Fecha
               </Typography>
             </Box>
             <Typography sx={{ fontWeight: 500, color: '#334155' }}>
               {selectedDate}
             </Typography>
           </Box>
         </MotionBox>
         
         <Divider sx={{ my: 3 }} />
         
         {/* Formulario */}
         <MotionBox variants={itemVariants}>
           <Typography 
             variant="subtitle1" 
             sx={{ 
               fontWeight: 600, 
               color: '#2C3E50',
               fontSize: '0.95rem',
               mb: 2
             }}
           >
             Información personal
           </Typography>
           
           <TextField
             label="Nombre completo"
             value={formData.clientName}
             onChange={handleChange('clientName')}
             fullWidth
             required
             error={errors.clientName}
             helperText={errors.clientName ? "El nombre es obligatorio" : ""}
             margin="normal"
             disabled={loading}
             InputProps={{
               startAdornment: (
                 <InputAdornment position="start">
                   <PersonIcon sx={{ color: errors.clientName ? 'error.main' : 'action.active' }} />
                 </InputAdornment>
               ),
             }}
             sx={{
               mb: 2,
               '& .MuiOutlinedInput-root': {
                 borderRadius: 1.5
               }
             }}
           />
           
           <TextField
             label="Teléfono (10 dígitos)"
             value={formData.phone}
             onChange={handleChange('phone')}
             fullWidth
             required
             error={errors.phone}
             helperText={errors.phone ? "Ingresa un número de teléfono válido de 10 dígitos" : ""}
             margin="normal"
             disabled={loading}
             inputProps={{ 
               maxLength: 10
             }}
             InputProps={{
               startAdornment: (
                 <InputAdornment position="start">
                   <PhoneIcon sx={{ color: errors.phone ? 'error.main' : 'action.active' }} />
                 </InputAdornment>
               ),
             }}
             sx={{
               mb: 2,
               '& .MuiOutlinedInput-root': {
                 borderRadius: 1.5
               }
             }}
           />
         </MotionBox>
         
         <MotionBox variants={itemVariants} sx={{ mt: 2 }}>
           <Typography 
             variant="subtitle1" 
             sx={{ 
               fontWeight: 600, 
               color: '#2C3E50',
               fontSize: '0.95rem',
               mb: 2
             }}
           >
             Servicio deseado
           </Typography>
           
           <TextField
             select
             label="Selecciona un servicio"
             value={formData.service}
             onChange={handleChange('service')}
             fullWidth
             required
             error={errors.service}
             helperText={errors.service ? "Selecciona un servicio" : ""}
             margin="normal"
             disabled={loading || loadingServices}
             InputProps={{
               startAdornment: (
                 <InputAdornment position="start">
                   <ServiceIcon sx={{ color: errors.service ? 'error.main' : 'action.active' }} />
                 </InputAdornment>
               ),
             }}
             sx={{
               '& .MuiOutlinedInput-root': {
                 borderRadius: 1.5
               }
             }}
           >
             {loadingServices ? (
               <MenuItem disabled>
                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                   <CircularProgress size={16} sx={{ mr: 1 }} />
                   Cargando servicios...
                 </Box>
               </MenuItem>
             ) : services.length > 0 ? (
               services.map((service) => (
                 <MenuItem key={service.name} value={service.name}>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                     <Typography>{service.name}</Typography>
                     <Typography sx={{ 
                       fontWeight: 600, 
                       color: '#2C3E50',
                       ml: 2
                     }}>
                       {formatCOP(service.price)}
                     </Typography>
                   </Box>
                 </MenuItem>
               ))
             ) : (
               <MenuItem disabled>No hay servicios disponibles</MenuItem>
             )}
           </TextField>
         </MotionBox>
       </MotionBox>
     </DialogContent>
     
     <DialogActions sx={{ 
       px: 3, 
       py: 2.5,
       backgroundColor: 'rgba(0,0,0,0.02)',
       borderTop: '1px solid rgba(0,0,0,0.05)'
     }}>
       <Button 
         onClick={onClose} 
         color="inherit"
         disabled={loading}
         sx={{ 
           textTransform: 'none',
           fontWeight: 500
         }}
       >
         Cancelar
       </Button>
       <Button 
         onClick={handleSubmit}
         variant="contained"
         disabled={loading}
         sx={{ 
           bgcolor: '#2C3E50',
           '&:hover': {
             bgcolor: '#1a2530',
           },
           textTransform: 'none',
           borderRadius: 1.5,
           px: 3,
           fontWeight: 500,
           boxShadow: 'none'
         }}
         startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
       >
         {loading ? 'Procesando...' : 'Confirmar Cita'}
       </Button>
     </DialogActions>
   </Dialog>
 );
};

export default AppointmentFormModal;