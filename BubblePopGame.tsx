import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  affirmation?: string;
  speed: number;
}

const affirmations = [
  "You're doing great",
  "This too shall pass",
  "You are enough",
  "You're not alone",
  "You are loved",
  "Take it one breath at a time",
  "You're stronger than you know",
  "It's okay to rest",
  "You matter",
  "Progress, not perfection"
];

export const BubblePopGame: React.FC = () => {
  const { setCurrentScreen, addGameSession } = useApp();
  const { classes } = useTheme();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [gameStartTime] = useState(Date.now());
  const [showAffirmation, setShowAffirmation] = useState<string | null>(null);

  const colors = [
    'from-pink-300 to-purple-300',
    'from-blue-300 to-cyan-300',
    'from-green-300 to-teal-300',
    'from-yellow-300 to-orange-300',
    'from-purple-300 to-indigo-300',
    'from-cyan-300 to-blue-300'
  ];

  useEffect(() => {
    const generateBubble = () => {
      const hasAffirmation = Math.random() < 0.3; // 30% chance
      return {
        id: Math.random(),
        x: Math.random() * 90,
        y: 100,
        size: Math.random() * 40 + 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        affirmation: hasAffirmation ? affirmations[Math.floor(Math.random() * affirmations.length)] : undefined,
        speed: Math.random() * 0.5 + 0.3
      };
    };

    const interval = setInterval(() => {
      setBubbles(prev => {
        const updated = prev
          .map(bubble => ({ ...bubble, y: bubble.y - bubble.speed }))
          .filter(bubble => bubble.y > -20);
        
        if (Math.random() < 0.7) {
          updated.push(generateBubble());
        }
        
        return updated.slice(-15); // Keep max 15 bubbles
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const popBubble = (bubbleId: number) => {
    setBubbles(prev => {
      const bubble = prev.find(b => b.id === bubbleId);
      if (bubble?.affirmation) {
        setShowAffirmation(bubble.affirmation);
        setTimeout(() => setShowAffirmation(null), 2000);
      }
      setScore(s => s + 1);
      return prev.filter(b => b.id !== bubbleId);
    });
  };

  const resetGame = () => {
    setBubbles([]);
    setScore(0);
    setShowAffirmation(null);
  };

  const handleExit = () => {
    const duration = Date.now() - gameStartTime;
    addGameSession({
      game: 'Bubble Pop',
      playedAt: new Date(),
      duration: Math.floor(duration / 1000)
    });
    setCurrentScreen('mini-games');
  };

  return (
    <div className={`min-h-screen ${classes.background} relative z-10 overflow-hidden`}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, #e879f9 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, #60a5fa 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, #34d399 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, #e879f9 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
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
            className={`p-3 ${classes.card} rounded-full shadow-lg`}
          >
            <ArrowLeft size={20} className={classes.text} />
          </motion.button>
          
          <div className="text-center">
            <h1 className={`text-2xl font-light ${classes.text}`}>Bubble Pop</h1>
            <p className={`${classes.text} opacity-70 text-sm`}>Score: {score}</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className={`p-3 ${classes.card} rounded-full shadow-lg`}
          >
            <RotateCcw size={20} className={classes.text} />
          </motion.button>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative w-full h-full">
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.button
              key={bubble.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => popBubble(bubble.id)}
              className={`absolute rounded-full bg-gradient-to-br ${bubble.color} shadow-lg border-2 border-white/20 backdrop-blur-sm`}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: bubble.size,
                height: bubble.size,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {bubble.affirmation && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-medium text-center px-2 drop-shadow-lg">
                    💜
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Affirmation Display */}
        <AnimatePresence>
          {showAffirmation && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
            >
              <div className={`${classes.card} px-8 py-4 rounded-2xl shadow-2xl border-2 border-white/20`}>
                <p className={`text-lg font-medium ${classes.text} text-center`}>
                  {showAffirmation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className={`${classes.card} px-6 py-3 rounded-full shadow-lg backdrop-blur-sm`}>
            <p className={`${classes.text} text-sm text-center`}>
              Tap bubbles to pop them • 💜 bubbles show affirmations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};