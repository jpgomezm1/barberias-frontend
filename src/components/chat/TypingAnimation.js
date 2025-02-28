import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material';

const TypingAnimation = ({ isUser = false }) => {
  const theme = useTheme();

  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i) => ({
      scale: 1,
      opacity: 0.7,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: i * 0.15,
      }
    }),
    exit: (i) => ({
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        delay: i * 0.1,
      }
    })
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  const defaultColor = isUser ? 'rgba(255,255,255,0.9)' : theme.palette.secondary.main;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerVariants}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '12px',
        background: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={bubbleVariants}
          style={{
            width: i === 1 ? '8px' : '6px',
            height: i === 1 ? '8px' : '6px',
            borderRadius: '50%',
            background: defaultColor,
            display: 'inline-block'
          }}
          animate={{
            y: [0, -4, 0],
            transition: {
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }
          }}
        />
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        style={{
          fontSize: '0.85rem',
          marginLeft: '4px',
          color: defaultColor,
          fontWeight: 500
        }}
      >
        escribiendo
      </motion.span>
    </motion.div>
  );
};

export default TypingAnimation;