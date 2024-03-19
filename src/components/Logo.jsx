import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

function Logo({ children, onAnimationComplete }) {
  const controls = useAnimation();

  useEffect(() => {
    const animateLogo = async () => {
      await controls.start({
        opacity: 1,
        x: '10%', // Mover al centro de la pantalla
        transition: { duration: 1, delay: 1 },
      });
      handleAnimationComplete();
    };

    animateLogo();

    
    // Cleanup function
    return () => {
      controls.stop();
    };
  }, []);

  const handleAnimationComplete = async () => {
    await controls.start({ y: -400, transition: { duration: 1 } });
    onAnimationComplete && onAnimationComplete();
  };

  return (
    <motion.div
      className="logo"
      style={{ opacity: 0, x: '-100%' }} // Empieza fuera de la pantalla a la izquierda
      animate={controls}
    >
      {children}
    </motion.div>
  );
}

export default Logo;