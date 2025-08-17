import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

export const BreathingTimer: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const { classes } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  const phases = {
    inhale: { duration: 4, next: 'hold' as const, text: 'Breathe In' },
    hold: { duration: 4, next: 'exhale' as const, text: 'Hold' },
    exhale: { duration: 6, next: 'inhale' as const, text: 'Breathe Out' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            const currentPhase = phases[phase];
            const nextPhase = currentPhase.next;
            setPhase(nextPhase);
            
            if (nextPhase === 'inhale') {
              setCycleCount(prev => prev + 1);
            }
            
            return phases[nextPhase].duration;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeLeft(4);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(4);
    setCycleCount(0);
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-400';
      case 'hold':
        return 'from-purple-400 to-indigo-400';
      case 'exhale':
        return 'from-green-400 to-teal-400';
    }
  };

  const getScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.4;
      case 'hold':
        return 1.4;
      case 'exhale':
        return 1;
    }
  };

  return (
    <div className={`min-h-screen ${classes.background} relative z-10 overflow-hidden`}>
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, #3b82f6 0%, transparent 50%)',
            'radial-gradient(circle at 70% 60%, #8b5cf6 0%, transparent 50%)',
            'radial-gradient(circle at 50% 30%, #10b981 0%, transparent 50%)',
            'radial-gradient(circle at 30% 40%, #3b82f6 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 p-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen('emergency-toolkit')}
          className={`mb-6 p-3 ${classes.card} rounded-full shadow-lg`}
        >
          <ArrowLeft size={20} className={classes.text} />
        </motion.button>

        <div className="max-w-md mx-auto text-center">
          <h1 className={`text-3xl font-light ${classes.text} mb-2`}>
            Breathing Timer
          </h1>
          <p className={`${classes.text} opacity-70 mb-8`}>
            Follow the rhythm and breathe peacefully
          </p>

          {/* Breathing Circle */}
          <div className="relative flex items-center justify-center mb-8" style={{ height: '300px' }}>
            {/* Outer ripple rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className={`absolute rounded-full border-2 bg-gradient-to-r ${getPhaseColor()} opacity-20`}
                animate={{
                  scale: isActive ? [1, 1.5, 1] : 1,
                  opacity: isActive ? [0.2, 0.05, 0.2] : 0.2,
                }}
                transition={{
                  duration: phases[phase].duration,
                  repeat: isActive ? Infinity : 0,
                  delay: ring * 0.3,
                  ease: 'easeInOut',
                }}
                style={{
                  width: `${120 + ring * 40}px`,
                  height: `${120 + ring * 40}px`,
                }}
              />
            ))}
            
            {/* Main breathing circle */}
            <motion.div
              className={`relative rounded-full bg-gradient-to-r ${getPhaseColor()} shadow-lg flex items-center justify-center`}
              animate={{
                scale: isActive ? getScale() : 1,
              }}
              transition={{
                duration: phases[phase].duration,
                ease: 'easeInOut',
              }}
              style={{
                width: '120px',
                height: '120px',
              }}
            >
              <div className={`text-2xl font-bold text-white drop-shadow-lg`}>
                {timeLeft}
              </div>
            </motion.div>
          </div>

          {/* Phase indicator */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <h2 className={`text-2xl font-medium ${classes.text} mb-2`}>
                {phases[phase].text}
              </h2>
              <p className={`${classes.text} opacity-70`}>
                Cycle {cycleCount} completed
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isActive ? handlePause : handleStart}
              className={`p-4 bg-gradient-to-r ${getPhaseColor()} text-white rounded-full shadow-lg`}
            >
              {isActive ? <Pause size={24} /> : <Play size={24} />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className={`px-6 py-4 ${classes.card} rounded-full shadow-lg`}
            >
              <span className={`${classes.text} font-medium`}>Reset</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-4 ${classes.card} rounded-full shadow-lg`}
            >
              {soundEnabled ? 
                <Volume2 size={24} className={classes.text} /> : 
                <VolumeX size={24} className={classes.text} />
              }
            </motion.button>
          </div>

          {/* Instructions */}
          <div className={`${classes.card} p-6 rounded-xl shadow-lg`}>
            <h3 className={`text-lg font-medium ${classes.text} mb-3`}>
              Instructions
            </h3>
            <div className={`${classes.text} opacity-70 text-sm space-y-2 text-left`}>
              <p>• Inhale for 4 seconds as the circle grows</p>
              <p>• Hold for 4 seconds while it stays large</p>
              <p>• Exhale for 6 seconds as it shrinks</p>
              <p>• Continue for as long as feels comfortable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};