import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const BrandingFooter = ({ companyLogo }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '92%',
        backgroundColor: '#2C3E50',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid',
        borderColor: 'grey.200',
        py: 1.5,
        px: { xs: 2, sm: 3 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        mb: 1
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'white',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            fontWeight: 500
          }}
        >
          By
        </Typography>
        {companyLogo ? (
          <Box
            component="a"
            href="https://stayirrelevant.com/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            <Box
              component="img"
              src="https://storage.googleapis.com/cluvi/nuevo_irre-removebg-preview.png"
              alt="Company Logo"
              sx={{
                height: { xs: 20, sm: 24 },
                width: 'auto',
                objectFit: 'contain',
                cursor: 'pointer'
              }}
            />
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Your Company
          </Typography>
        )}
      </Box>
      
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          backgroundColor: 'rgba(0, 172, 71, 0.1)',
          borderRadius: 3,
          px: 1.5,
          py: 0.5,
          cursor: 'default',
          transition: 'all 0.3s ease'
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'white',
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        >
          Powered by
        </Typography>
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <Sparkles 
            size={16} 
            style={{ 
              color: '#00AC47',
            }} 
          />
        </motion.div>
        <motion.div
          animate={{ 
            y: [-1, 1, -1],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#00AC47',
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            AI
          </Typography>
        </motion.div>
      </Box>
    </Paper>
  );
};

export default BrandingFooter;