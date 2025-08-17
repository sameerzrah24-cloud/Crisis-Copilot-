import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  isLit: boolean;
  brightness: number;
  pulseDelay: number;
}

export const StarlightTapGame: React.FC = () => {
  const { setCurrentScreen, addGameSession } = useApp();
  const { classes } = useTheme();
  const [stars, setStars] = useState<Star[]>([]);
  const [breathingMode, setBreathingMode] = useState(false);
  const [gameStartTime] = useState(Date.now());
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateStars();
  }, []);

  const generateStars = () => {
    const newStars: Star[] = [];
    for (let i = 0; i < 50; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        isLit: false,
        brightness: Math.random() * 0.5 + 0.3,
        pulseDelay: Math.random() * 3
      });
    }
    setStars(newStars);
  };

  const lightUpStar = (starId: number) => {
    setStars(prev => prev.map(star => 
      star.id === starId 
        ? { ...star, isLit: true, brightness: 1 }
        : star
    ));
    setScore(prev => prev + 1);

    // Create ripple effect to nearby stars
    setTimeout(() => {
      setStars(prev => prev.map(star => {
        if (star.id === starId) return star;
        
        const targetStar = prev.find(s => s.id === starId);
        if (!targetStar) return star;
        
        const distance = Math.sqrt(
          Math.pow(star.x - targetStar.x, 2) + Math.pow(star.y - targetStar.y, 2)
        );
        
        if (distance < 15 && Math.random() < 0.7) {
          return { ...star, isLit: true, brightness: 0.8 };
        }
        return star;
      }));
    }, 200);
  };

  const resetStars = () => {
    setStars(prev => prev.map(star => ({
      ...star,
      isLit: false,
      brightness: Math.random() * 0.5 + 0.3
    })));
    setScore(0);
  };

  const handleExit = () => {
    const duration = Date.now() - gameStartTime;
    addGameSession({
      game: 'Starlight Tap',
      playedAt: new Date(),
      duration: Math.floor(duration / 1000)
    });
    setCurrentScreen('mini-games');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black relative z-10 overflow-hidden">
      {/* Animated cosmic background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, #4c1d95 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, #581c87 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, #6b21a8 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, #4c1d95 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Header */}
      <div className="relative z-20 p-6">
        <div className="flex justify-between items-center mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExit}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg"
          >
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-2xl font-light text-white mb-1">Starlight Tap</h1>
            <p className="text-white/70 text-sm">Stars lit: {score}</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetStars}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg"
          >
            <RotateCcw size={20} className="text-white" />
          </motion.button>
        </div>

        {/* Breathing Mode Toggle */}
        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBreathingMode(!breathingMode)}
            className={`px-6 py-3 rounded-xl shadow-lg transition-all ${
              breathingMode 
                ? 'bg-gradient-to-r from-purple-400 to-indigo-400 text-white'
                : 'bg-white/10 backdrop-blur-sm text-white'
            }`}
          >
            <Sparkles size={18} className="inline mr-2" />
            {breathingMode ? 'Breathing Mode On' : 'Breathing Mode Off'}
          </motion.button>
        </div>
      </div>

      {/* Stars Field */}
      <div className="relative w-full h-full">
        {stars.map((star) => (
          <motion.button
            key={star.id}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => lightUpStar(star.id)}
            className="absolute rounded-full transition-all duration-300"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              opacity: star.isLit ? 1 : star.brightness,
              scale: breathingMode ? [1, 1.3, 1] : 1,
              boxShadow: star.isLit 
                ? `0 0 ${star.size * 3}px #ffffff, 0 0 ${star.size * 6}px #a855f7`
                : `0 0 ${star.size}px #ffffff`,
            }}
            transition={{
              duration: breathingMode ? 4 : 2,
              repeat: Infinity,
              delay: star.pulseDelay,
              ease: 'easeInOut',
            }}
          >
            <div 
              className={`w-full h-full rounded-full ${
                star.isLit 
                  ? 'bg-gradient-to-r from-white to-purple-200' 
                  : 'bg-gradient-to-r from-white to-blue-200'
              }`}
            />
          </motion.button>
        ))}

        {/* Constellation Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {stars.filter(star => star.isLit).map((star, index, litStars) => 
            litStars.slice(index + 1).map((otherStar, otherIndex) => {
              const distance = Math.sqrt(
                Math.pow(star.x - otherStar.x, 2) + Math.pow(star.y - otherStar.y, 2)
              );
              
              if (distance < 25) {
                return (
                  <motion.line
                    key={`${star.id}-${otherStar.id}`}
                    x1={`${star.x}%`}
                    y1={`${star.y}%`}
                    x2={`${otherStar.x}%`}
                    y2={`${otherStar.y}%`}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                  />
                );
              }
              return null;
            })
          )}
        </svg>

        {/* Instructions */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <p className="text-white text-sm text-center">
              {breathingMode 
                ? 'Breathe with the stars • Tap to light them up'
                : 'Tap stars to light them up • Toggle breathing mode above'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};