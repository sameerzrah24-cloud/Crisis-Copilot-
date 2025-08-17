import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

export const Fireflies: React.FC = () => {
  const { state } = useApp();
  const { isDark } = useTheme();
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  useEffect(() => {
    if (!state.showFireflies) return;

    const generateFireflies = () => {
      const flies: Firefly[] = [];
      for (let i = 0; i < 12; i++) {
        flies.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 2,
          duration: Math.random() * 20 + 15,
        });
      }
      setFireflies(flies);
    };

    generateFireflies();
  }, [state.showFireflies]);

  if (!state.showFireflies) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {fireflies.map((firefly) => (
        <motion.div
          key={firefly.id}
          className={`absolute rounded-full ${
            isDark ? 'bg-yellow-200' : 'bg-yellow-300'
          } opacity-60`}
          style={{
            width: firefly.size,
            height: firefly.size,
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            boxShadow: `0 0 ${firefly.size * 2}px ${
              isDark ? '#fef3c7' : '#fcd34d'
            }`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            opacity: [0.3, 0.8, 0.4, 0.3],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: firefly.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};