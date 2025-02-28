import React from 'react';
import { Button, Box, Typography, Zoom, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

const ActionButton = ({ icon: Icon, title, description, onClick, selected }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery('(max-width:350px)');

  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Button
        component={motion.div}
        whileHover={{ scale: isMobile ? 1.01 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          p: 0,
          mb: isMobile ? 1 : 2, // Reducido de 1.5 a 1 en móvil
          backgroundColor: 'background.paper',
          color: 'text.primary',
          overflow: 'hidden',
          borderRadius: isMobile ? 2 : 4, // Reducido de 3 a 2 en móvil
          position: 'relative',
          boxShadow: selected 
            ? '0 8px 25px rgba(191, 160, 111, 0.15)'
            : '0 4px 15px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: selected ? '2px solid' : '1px solid',
          borderColor: selected ? 'secondary.main' : 'grey.100',
          maxWidth: {
            xs: '100%',
            sm: '450px',
            md: '500px'
          },
          mx: 'auto',
          minHeight: {
            xs: '65px', // Reducido de 80px a 65px
            sm: '100px'
          },
          '&:hover': {
            backgroundColor: 'background.paper',
            borderColor: 'secondary.light',
            boxShadow: '0 12px 30px rgba(191, 160, 111, 0.2)',
            '& .icon-container': {
              backgroundColor: 'secondary.main',
              '& svg': {
                transform: isMobile ? 'scale(1.05)' : 'scale(1.1) rotate(5deg)',
              },
            },
            '& .content-container': {
              '&::before': {
                transform: 'translateX(0)',
              },
            },
            '& .action-title': {
              color: 'secondary.dark',
            },
          },
        }}
      >
        <Box
          className="icon-container"
          sx={{
            width: {
              xs: 55, // Reducido de 70 a 55
              sm: 85,
              md: 100
            },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: selected ? 'secondary.main' : 'background.dark',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            flexShrink: 0,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: selected
                ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
            },
            '& svg': {
              fontSize: {
                xs: 20, // Reducido de 24 a 20
                sm: 28,
                md: 32
              },
              color: 'white',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            },
          }}
        >
          <Icon />
        </Box>

        <Box
          className="content-container"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: {
              xs: 1.25, // Reducido de 1.75 a 1.25
              sm: 2,
              md: 2.5
            },
            pl: {
              xs: 1.5, // Reducido de 2 a 1.5
              sm: 2.5,
              md: 3
            },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(191, 160, 111, 0.03) 0%, rgba(191, 160, 111, 0) 100%)',
              transform: 'translateX(-100%)',
              transition: 'transform 0.5s ease',
            },
          }}
        >
          <Typography 
            className="action-title"
            variant="h6" 
            sx={{ 
              fontSize: {
                xs: '0.9rem', // Reducido de 1rem a 0.9rem
                sm: '1.1rem',
                md: '1.2rem'
              },
              fontWeight: 600,
              mb: {
                xs: 0.2, // Reducido de 0.3 a 0.2
                sm: 0.5,
                md: 0.7
              },
              transition: 'color 0.3s ease',
              position: 'relative',
              lineHeight: 1.2, // Reducido de 1.3 a 1.2
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: {
                xs: '0.75rem', // Reducido de 0.85rem a 0.75rem
                sm: '0.9rem',
                md: '0.95rem'
              },
              lineHeight: {
                xs: 1.2, // Reducido de 1.3 a 1.2
                sm: 1.4,
                md: 1.5
              },
              opacity: 0.9,
              position: 'relative',
              display: isExtraSmall ? 'none' : 'block',
            }}
          >
            {description}
          </Typography>
        </Box>
      </Button>
    </Zoom>
  );
};

export default ActionButton;