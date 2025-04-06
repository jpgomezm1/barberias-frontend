import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
  Alert,
  Button,
  SvgIcon
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS, ESTABLISHMENT_SUBDOMAIN } from '../../config/api';

// Icono personalizado para el barbero - más elegante y minimalista
const BarberIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,7C13.66,7 15,8.34 15,10C15,11.66 13.66,13 12,13C10.34,13 9,11.66 9,10C9,8.34 10.34,7 12,7M12,20C9.5,20 7.29,18.92 5.9,17.18C6.55,15.44 8.13,14.2 10,14.2C10.09,14.2 10.17,14.21 10.26,14.22C10.83,14.38 11.4,14.5 12,14.5C12.6,14.5 13.17,14.38 13.75,14.22C13.83,14.21 13.91,14.2 14,14.2C15.87,14.2 17.45,15.44 18.1,17.18C16.71,18.92 14.5,20 12,20Z" />
  </SvgIcon>
);

const BarberSelector = ({ onSelect, onClose }) => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cargar la lista de barberos desde el backend
  useEffect(() => {
    const fetchBarbers = async () => {
      setLoading(true);
      try {
        const response = await axios.post(API_ENDPOINTS.barbers, {
          subdomain: ESTABLISHMENT_SUBDOMAIN
        });
        
        if (response.data && response.data.barbers) {
          setBarbers(response.data.barbers);
        } else {
          setError('No se encontraron barberos en este establecimiento');
        }
      } catch (error) {
        console.error('Error al obtener barberos:', error);
        setError('No pudimos cargar la lista de barberos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBarbers();
  }, []);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  const handleRetry = () => {
    setError(null);
    const fetchBarbers = async () => {
      setLoading(true);
      try {
        const response = await axios.post(API_ENDPOINTS.barbers, {
          subdomain: ESTABLISHMENT_SUBDOMAIN
        });
        
        if (response.data && response.data.barbers) {
          setBarbers(response.data.barbers);
        } else {
          setError('No se encontraron barberos en este establecimiento');
        }
      } catch (error) {
        console.error('Error al obtener barberos:', error);
        setError('No pudimos cargar la lista de barberos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBarbers();
  };
  
  const filteredBarbers = barbers.filter(barber => 
    barber.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Variantes de animación para la lista
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };
  
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#fff',
    }}>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          backgroundColor: '#2C3E50',
          color: 'white'
        }}
      >
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <ArrowBackIcon />
        </IconButton>
        
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          fontSize: '1rem',
          letterSpacing: '0.01em'
        }}>
          Selecciona un barbero
        </Typography>
        
        <Box sx={{ visibility: 'hidden' }}>
          <ArrowBackIcon />
        </Box>
      </Paper>
      
      {/* Search */}
      <Box sx={{ 
        px: 3, 
        py: 2.5,
        backgroundColor: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.04)'
      }}>
        <TextField
          fullWidth
          placeholder="Buscar barbero..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'rgba(0,0,0,0.4)' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              backgroundColor: 'rgba(0,0,0,0.02)',
              borderRadius: 2,
              '& fieldset': {
                borderColor: 'transparent'
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0,0,0,0.1)'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2C3E50',
                borderWidth: '1px'
              }
            }
          }}
        />
      </Box>
      
      {/* Barber List */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column'
          }}>
            <CircularProgress size={28} sx={{ color: '#2C3E50' }} />
            <Typography sx={{ mt: 2, fontSize: '0.85rem', color: 'text.secondary' }}>
              Cargando barberos...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%',
                mb: 2
              }}
            >
              {error}
            </Alert>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outlined" 
                onClick={handleRetry}
                sx={{
                  mt: 1,
                  borderColor: '#2C3E50',
                  color: '#2C3E50',
                  '&:hover': {
                    borderColor: '#1E293B',
                    backgroundColor: 'rgba(44, 62, 80, 0.04)'
                  }
                }}
              >
                Reintentar
              </Button>
            </motion.div>
          </Box>
        ) : filteredBarbers.length > 0 ? (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            <List disablePadding>
              {filteredBarbers.map((barber) => (
                <motion.div
                  key={barber.name}
                  variants={itemVariants}
                >
                  <ListItem 
                    button
                    onClick={() => onSelect(barber.name)}
                    sx={{ 
                      borderRadius: 1.5,
                      py: 1.5,
                      px: 2,
                      my: 0.75,
                      backgroundColor: 'white',
                      transition: 'all 0.18s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.02)',
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: 'rgba(44, 62, 80, 0.06)',
                        width: 40,
                        height: 40,
                        color: '#2C3E50'
                      }}>
                        <BarberIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography sx={{ 
                          fontWeight: 500, 
                          color: '#333',
                          fontSize: '0.95rem',
                          letterSpacing: '0.01em'
                        }}>
                          {barber.name}
                        </Typography>
                      }
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </motion.div>
        ) : (
          <Box sx={{ 
            p: 4, 
            textAlign: 'center', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%' 
          }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 500, 
              mb: 1,
              color: '#555'
            }}>
              No se encontraron barberos
            </Typography>
            <Typography color="textSecondary" variant="body2">
              Intenta con otro término de búsqueda
            </Typography>
            
            {searchTerm && (
              <Button 
                variant="text" 
                size="small"
                onClick={handleClearSearch}
                sx={{ 
                  mt: 2,
                  color: '#2C3E50'
                }}
              >
                Limpiar búsqueda
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BarberSelector;