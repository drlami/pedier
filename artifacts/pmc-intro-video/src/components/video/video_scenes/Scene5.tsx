import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '../lib/video/animations';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden" {...sceneTransitions.zoomThrough}>
      
      {/* Background Image slowly drifting */}
      <motion.div 
        className="absolute inset-0 opacity-50"
        initial={{ x: "-5%", scale: 1.1 }}
        animate={{ x: "0%", scale: 1.05 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/pediatric-room.jpg`} 
          alt="Pediatric Room"
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Soft warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="relative z-10 w-full px-20">
        <motion.div 
          className="max-w-3xl"
          initial={{ opacity: 0, x: -50 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-[6vw] font-black text-white font-display leading-[1.1] mb-6"
          >
            Saving<br/>
            <span className="text-[#d97706]">young lives.</span>
          </motion.h2>
          
          <motion.p 
            className="text-[2vw] text-white/80 font-body font-light"
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
          >
            Because in pediatrics, <br/>there is no margin for error.
          </motion.p>
        </motion.div>
      </div>
      
    </motion.div>
  );
}