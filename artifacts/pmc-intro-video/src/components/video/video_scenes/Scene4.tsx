import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '../lib/video/animations';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#1a3a5c] flex flex-col items-center justify-center overflow-hidden" {...sceneTransitions.splitHorizontal}>
      
      <motion.div 
        className="absolute inset-0 opacity-10 mix-blend-screen"
        initial={{ y: "-10%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      >
         <img 
          src={`${import.meta.env.BASE_URL}images/tech-bg.png`} 
          alt="Tech Background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="text-center z-10 mb-16">
        <motion.h2 
          className="text-[4vw] font-bold text-white font-display"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Everything you need.<br/>Right when you need it.
        </motion.h2>
      </div>

      <div className="flex gap-12 w-full max-w-6xl px-12 z-10 perspective-[1000px]">
        
        {/* Card 1: Dosing */}
        <motion.div 
          className="flex-1 bg-gradient-to-b from-[#0f2338] to-[#1a3a5c] border border-[#d97706]/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 60, rotateX: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d97706]/10 rounded-bl-full blur-xl" />
          <div className="w-16 h-16 bg-[#d97706]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#d97706]/30">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h4l3-9 5 18 3-9h5"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 font-display">Weight-Based Dosing</h3>
          <p className="text-white/60 font-body">Instant, accurate calculations for critical care medications without the mental math.</p>
          
          <motion.div 
            className="mt-8 bg-black/30 rounded-lg p-4 font-mono text-sm text-[#d97706]"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            Epinephrine (1:10,000)
            <div className="text-white text-lg mt-1">0.1 mg/kg IV</div>
          </motion.div>
        </motion.div>

        {/* Card 2: IV Prep */}
        <motion.div 
          className="flex-1 bg-gradient-to-b from-[#0f2338] to-[#1a3a5c] border border-red-500/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 60, rotateX: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/10 rounded-br-full blur-xl" />
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 border border-red-500/30">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 font-display">IV Preparation</h3>
          <p className="text-white/60 font-body">Step-by-step dilution and preparation guides for high-risk drips.</p>
          
          <motion.div 
            className="mt-8 flex flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-red-500" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, delay: 0.8 }} />
            </div>
            <div className="h-2 w-3/4 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-red-500" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, delay: 1.2 }} />
            </div>
          </motion.div>
        </motion.div>

      </div>

    </motion.div>
  );
}