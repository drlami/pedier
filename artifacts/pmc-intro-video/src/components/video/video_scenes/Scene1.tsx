import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { elementAnimations, sceneTransitions } from '@/lib/video/animations';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 4500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden" {...sceneTransitions.fadeBlur}>
      
      {/* Background Image with slow zoom */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/er-corridor.jpg`} 
          alt="ER Corridor"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Red emergency accent pulsing */}
      <motion.div 
        className="absolute inset-0 bg-red-600/10 mix-blend-overlay"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 text-center px-12" style={{ perspective: '1000px' }}>
        <motion.div 
          className="w-full max-w-4xl mx-auto h-[2px] bg-red-600 mb-8 origin-left"
          initial={{ scaleX: 0 }}
          animate={phase >= 1 ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.h1 
          className="text-[8vw] font-black tracking-tight text-white uppercase leading-none font-display"
        >
          {'EVERY'.split('').map((char, i) => (
            <motion.span key={`w1-${i}`} className="inline-block"
              initial={{ opacity: 0, y: 40, rotateX: -40 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: -40 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: phase >= 2 ? i * 0.05 : 0 }}>
              {char}
            </motion.span>
          ))}
          <span className="inline-block w-[3vw]" />
          {'SECOND'.split('').map((char, i) => (
            <motion.span key={`w2-${i}`} className="inline-block"
              initial={{ opacity: 0, y: 40, rotateX: -40 }}
              animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: -40 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: phase >= 2 ? 0.3 + (i * 0.05) : 0 }}>
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.h1 
          className="text-[8vw] font-black tracking-tight text-red-500 uppercase leading-none font-display mt-2"
        >
          {'COUNTS'.split('').map((char, i) => (
            <motion.span key={`w3-${i}`} className="inline-block"
              initial={{ opacity: 0, y: 40, rotateX: -40 }}
              animate={phase >= 3 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: -40 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: phase >= 3 ? i * 0.05 : 0 }}>
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div 
          className="w-full max-w-4xl mx-auto h-[2px] bg-red-600 mt-8 origin-right"
          initial={{ scaleX: 0 }}
          animate={phase >= 3 ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>

    </motion.div>
  );
}