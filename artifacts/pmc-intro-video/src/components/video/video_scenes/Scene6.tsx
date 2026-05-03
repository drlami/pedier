import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#fdf8f0] flex flex-col items-center justify-center overflow-hidden" {...sceneTransitions.crossDissolve}>
      
      <motion.div 
        className="absolute w-[100vw] h-[100vw] bg-[#1a3a5c]/5 rounded-full top-[10%] left-[-20%] blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center perspective-[1000px]">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 flex items-center justify-center w-24 h-24 rounded-2xl bg-[#1a3a5c] shadow-lg border border-[#1a3a5c]/20"
        >
           <div className="text-4xl font-bold text-white">+</div>
        </motion.div>

        <motion.h1 
          className="text-[5vw] font-black text-[#1a3a5c] font-display leading-none mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          PMC PediER Aid
        </motion.h1>

        <motion.p 
          className="text-[2vw] text-[#4b5563] font-body tracking-wide mb-12"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          Built for the bedside.
        </motion.p>

        <motion.div 
          className="h-[1px] w-32 bg-[#d97706] mb-8"
          initial={{ scaleX: 0 }}
          animate={phase >= 4 ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <motion.p 
          className="text-[1.2vw] text-[#9ca3af] font-body uppercase tracking-[0.2em]"
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          By Dr. Lami Qurt
        </motion.p>

      </div>

    </motion.div>
  );
}