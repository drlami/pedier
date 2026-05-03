import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { elementAnimations, sceneTransitions } from '@/lib/video/animations';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0f2338] flex items-center justify-center overflow-hidden" {...sceneTransitions.clipCircle}>
      
      {/* Ambient background tech layer */}
      <motion.div 
        className="absolute inset-0 opacity-20 mix-blend-screen"
        initial={{ scale: 1, rotate: 0 }}
        animate={{ scale: 1.05, rotate: 1 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/tech-bg.png`} 
          alt="Tech Background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Decorative circles */}
      <motion.div 
        className="absolute w-[80vw] h-[80vw] rounded-full border border-white/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "circOut" }}
      />
      <motion.div 
        className="absolute w-[60vw] h-[60vw] rounded-full border border-white/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "circOut", delay: 0.2 }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center" style={{ perspective: '1000px' }}>
        
        {/* App Logo / Icon abstraction */}
        <motion.div 
          className="relative w-32 h-32 mb-10"
          initial={{ scale: 0, rotate: -90 }}
          animate={phase >= 1 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1a3a5c] to-[#0f2338] shadow-2xl border border-white/20" />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.3 }}
          >
            +
          </motion.div>
          <motion.div className="absolute inset-0 rounded-2xl border-2 border-[#d97706]" 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.h2 
          className="text-[4vw] font-bold text-white font-display leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          PMC PediER Aid
        </motion.h2>

        <motion.p 
          className="text-[1.8vw] text-[#9ca3af] font-body mt-4 tracking-wide"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          Pediatric Emergency Clinical Decision Support
        </motion.p>

        <motion.div 
          className="mt-12 bg-white/5 px-8 py-3 rounded-full backdrop-blur-sm border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <p className="text-[1.2vw] text-white/80 font-body">
            Designed by <span className="text-[#d97706] font-semibold">Dr. Lami Qurt</span>
          </p>
        </motion.div>
      </div>

    </motion.div>
  );
}