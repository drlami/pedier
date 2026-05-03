import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '../lib/video/animations';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 2500),
      setTimeout(() => setPhase(5), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const diagnoses = [
    { name: "Sepsis", conf: "94%", color: "bg-red-500" },
    { name: "Metabolic Crisis", conf: "78%", color: "bg-orange-500" },
    { name: "Meningitis", conf: "65%", color: "bg-yellow-500" },
  ];

  return (
    <motion.div className="absolute inset-0 bg-[#fdf8f0] flex items-center overflow-hidden" {...sceneTransitions.slideLeft}>
      
      <div className="w-1/2 h-full flex flex-col justify-center px-16 z-10">
        <motion.div 
          className="w-16 h-2 bg-[#d97706] mb-8"
          initial={{ scaleX: 0 }}
          animate={phase >= 1 ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ originX: 0 }}
        />
        <motion.h2 
          className="text-[4.5vw] font-black text-[#1a3a5c] font-display leading-[1.1]"
          initial={{ opacity: 0, y: 40 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          Clinical Power.
          <br/>
          <span className="text-[#d97706]">Instant Clarity.</span>
        </motion.h2>
        <motion.p 
          className="text-[1.8vw] text-[#4b5563] mt-6 max-w-lg font-body"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          Real-time differential diagnosis ranking helps you identify critical conditions instantly.
        </motion.p>
      </div>

      <div className="w-1/2 h-full flex items-center justify-center relative perspective-[1200px]">
        {/* Stylized UI Mockup */}
        <motion.div 
          className="w-[85%] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          initial={{ opacity: 0, x: 100, rotateY: 20 }}
          animate={phase >= 2 ? { opacity: 1, x: 0, rotateY: -5 } : { opacity: 0, x: 100, rotateY: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="bg-[#1a3a5c] p-6">
            <div className="w-32 h-3 bg-white/20 rounded-full mb-4" />
            <h3 className="text-2xl font-bold text-white font-display">Differential Diagnosis</h3>
          </div>
          
          <div className="p-8 flex flex-col gap-6">
            {diagnoses.map((diag, i) => (
              <motion.div 
                key={diag.name}
                className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-center justify-between"
                initial={{ opacity: 0, x: 30 }}
                animate={phase >= 3 + i ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div>
                  <h4 className="text-xl font-bold text-[#111827]">{diag.name}</h4>
                  <div className="w-24 h-2 bg-gray-200 mt-3 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${diag.color}`}
                      initial={{ width: "0%" }}
                      animate={phase >= 3 + i ? { width: diag.conf } : { width: "0%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
                <div className="text-2xl font-black text-[#1a3a5c]">{diag.conf}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Ambient floating shape */}
      <motion.div 
        className="absolute -right-20 -bottom-20 w-[40vw] h-[40vw] bg-[#e2e8f0] rounded-full mix-blend-multiply opacity-50 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], x: [0, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}