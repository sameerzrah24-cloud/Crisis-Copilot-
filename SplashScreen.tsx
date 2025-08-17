import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

export const SplashScreen: React.FC = () => {
  const { setSplashComplete } = useApp();
  const { classes } = useTheme();
  const [showText, setShowText] = useState(false);
  const [text, setText] = useState('');
  const fullText = "You are safe.";

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showText) return;

    let index = 0;
    const typewriter = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(typewriter);
        setTimeout(() => setSplashComplete(), 1000);
      }
    }, 150);

    return () => clearInterval(typewriter);
  }, [showText, setSplashComplete]);

  return (
    <motion.div
      className={`fixed inset-0 ${classes.background} flex flex-col items-center justify-center z-50`}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, #f472b6 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, #a78bfa 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Pulsing heart */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative mb-8"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-pink-300 opacity-40"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <Heart 
          size={64} 
          className={`${classes.text} fill-current drop-shadow-lg`}
        />
      </motion.div>

      {/* Typewriter text */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: showText ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className={`text-2xl font-light ${classes.text} tracking-wide`}>
          {text}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="ml-1"
          >
            |
          </motion.span>
        </p>
      </motion.div>
    </motion.div>
  );
};