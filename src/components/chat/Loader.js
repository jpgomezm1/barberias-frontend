import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  const dotVariants = {
    initial: { y: 0 },
    animate: { 
      y: [-3, 3, -3],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-8">
      <motion.div
        className="flex items-center gap-1"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-blue-500 rounded-full"
            variants={dotVariants}
            style={{
              backgroundColor: index === 0 ? '#4338ca' : 
                             index === 1 ? '#3b82f6' : 
                             '#60a5fa'
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loader;