import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatrixRain from './MatrixRain';

interface LogoIntroProps {
  onComplete: () => void;
}

const LogoIntro: React.FC<LogoIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),   // Logo appears
      setTimeout(() => setPhase(2), 2000),  // First magic circle
      setTimeout(() => setPhase(3), 2800),  // Second magic circle
      setTimeout(() => setPhase(4), 3500),  // Text appears
      setTimeout(() => setPhase(5), 4500),  // Tagline appears
      setTimeout(() => setPhase(6), 5800),  // Data streams
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => onComplete(), 800);
      }, 15000)
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleSkip = () => {
    setIsComplete(true);
    setTimeout(() => onComplete(), 300);
  };

  // Floating data elements
  const dataElements = [
    'HEALTH_LEADS', 'LIFE_INSURANCE', 'MEDICARE_DATA', 'DEMOGRAPHICS', 
    'B2B_PROSPECTS', 'CONVERSION_RATES', 'TCPA_COMPLIANT', 'VERIFIED_LEADS',
    'REAL_TIME_API', 'PREMIUM_DATA', 'AGENT_PORTAL', 'LEAD_SCORING'
  ];

  return (
    <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden transition-opacity duration-800 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
      <MatrixRain />
      
      {/* Floating Data Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {dataElements.map((data, index) => (
          <motion.div
            key={data}
            className="absolute text-green-400 font-mono text-xs opacity-60"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0 
            }}
            animate={phase >= 6 ? {
              y: -100,
              opacity: [0, 0.8, 0],
              scale: [0.8, 1, 0.8]
            } : {}}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: index * 0.3,
              repeat: Infinity,
              repeatDelay: 2
            }}
            style={{
              left: `${10 + (index * 7) % 80}%`,
            }}
          >
            {data}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ 
                scale: 1, 
                rotate: 0, 
                opacity: 1,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative mb-8"
            >
              {/* Main Logo */}
              <motion.div
                className="relative w-40 h-40 mx-auto"
                animate={phase >= 2 ? {
                  filter: [
                    'drop-shadow(0 0 20px #00ff41) drop-shadow(0 0 40px #00ff41)',
                    'drop-shadow(0 0 60px #00ff41) drop-shadow(0 0 80px #00ff41)',
                    'drop-shadow(0 0 20px #00ff41) drop-shadow(0 0 40px #00ff41)'
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.img
                  src="/E97CB547-02C1-460A-88F1-B2999CB9B271.png"
                  alt="Data Sorcerer"
                  className="w-full h-full object-contain relative z-10 rounded-2xl p-4"
                  style={{
                    filter: 'drop-shadow(0 0 30px #00ff41) drop-shadow(0 0 60px #00ff41)',
                    background: 'radial-gradient(circle, rgba(0,255,65,0.1) 0%, rgba(0,0,0,0.8) 70%)',
                    border: '2px solid rgba(0,255,65,0.3)',
                    backdropFilter: 'blur(10px)'
                  }}
                  animate={phase >= 4 ? {
                    rotate: [0, 5, -5, 0],
                  } : {}}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Magical Aura */}
                <motion.div
                  className="absolute inset-0 bg-gradient-radial from-green-400/30 via-green-400/10 to-transparent rounded-full"
                  animate={phase >= 2 ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  } : { opacity: 0 }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              {/* First Magic Circle */}
              <AnimatePresence>
                {phase >= 2 && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div
                      className="w-60 h-60 border-2 border-green-400 rounded-full relative"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      {/* Runes around circle */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-3 bg-green-400 rounded-full"
                          style={{
                            top: '50%',
                            left: '50%',
                            transformOrigin: '0 0',
                            transform: `rotate(${i * 45}deg) translateX(120px) translateY(-6px)`
                          }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Second Magic Circle */}
              <AnimatePresence>
                {phase >= 3 && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div
                      className="w-80 h-80 border border-green-300 rounded-full opacity-60"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    >
                      {/* Data symbols */}
                      {['📊', '🔮', '⚡', '🎯', '💎', '🌟'].map((symbol, i) => (
                        <motion.div
                          key={i}
                          className="absolute text-2xl"
                          style={{
                            top: '50%',
                            left: '50%',
                            transformOrigin: '0 0',
                            transform: `rotate(${i * 60}deg) translateX(160px) translateY(-12px)`
                          }}
                          animate={{
                            scale: [0.8, 1.2, 0.8],
                            rotate: [0, 360, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5
                          }}
                        >
                          {symbol}
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Title */}
          {phase >= 4 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="mb-6"
            >
              <motion.h1
                className="text-7xl font-bold mb-2"
                animate={{
                  textShadow: [
                    '0 0 20px #00ff41',
                    '0 0 40px #00ff41, 0 0 60px #00ff41',
                    '0 0 20px #00ff41'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 bg-clip-text text-transparent">
                  DataCSV
                </span>
              </motion.h1>
              
              {/* Subtitle with typing effect */}
              <motion.div
                className="text-green-300 font-mono text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  _
                </motion.span>
                Conjuring Premium Data Intelligence
              </motion.div>
            </motion.div>
          )}

          {/* Tagline */}
          {phase >= 5 && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-2"
            >
              <motion.p
                className="text-xl text-green-300 font-mono"
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Transforming Raw Data Into Business Intelligence
              </motion.p>
              
              <motion.div
                className="flex justify-center space-x-8 text-sm text-green-400 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                >
                  PREMIUM • VERIFIED • INTELLIGENCE
                </motion.span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          transition={{ delay: 2 }}
          onClick={handleSkip}
          className="fixed bottom-8 right-8 z-50 text-green-400 hover:text-green-300 transition-all font-mono text-sm border border-green-400/30 px-4 py-2 rounded-lg backdrop-blur-sm hover:border-green-400/60 bg-black/50"
        >
          Skip Intro →
        </motion.button>

        {/* Loading progress */}
        <motion.div
          className="fixed bottom-8 left-8 z-50 text-green-400 font-mono text-xs bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            INITIALIZING DATA MATRIX...
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LogoIntro;