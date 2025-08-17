import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Circle, Palette, Sparkles, Flower } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

export const MiniGames: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const { classes } = useTheme();

  const games = [
    {
      id: 'bubble-pop',
      title: 'Bubble Pop',
      icon: Circle,
      emoji: '🧫',
      description: 'Pop bubbles with calming affirmations',
      color: 'from-blue-400 to-cyan-400',
      screen: 'bubble-pop-game'
    },
    {
      id: 'draw-calm',
      title: 'Draw to Calm',
      icon: Palette,
      emoji: '🎨',
      description: 'Express yourself through digital art',
      color: 'from-purple-400 to-pink-400',
      screen: 'draw-to-calm-game'
    },
    {
      id: 'starlight-tap',
      title: 'Starlight Tap',
      icon: Sparkles,
      emoji: '🌌',
      description: 'Light up the night sky with touches',
      color: 'from-indigo-400 to-purple-400',
      screen: 'starlight-tap-game'
    },
    {
      id: 'zen-garden',
      title: 'Zen Garden Grow',
      icon: Flower,
      emoji: '🌿',
      description: 'Grow a peaceful digital garden',
      color: 'from-green-400 to-teal-400',
      screen: 'zen-garden-game'
    }
  ];

  return (
    <div className={`min-h-screen ${classes.background} relative z-10`}>
      <div className="p-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen('home')}
          className={`mb-6 p-3 ${classes.card} rounded-full shadow-lg`}
        >
          <ArrowLeft size={20} className={classes.text} />
        </motion.button>

        <h1 className={`text-3xl font-light ${classes.text} mb-2`}>Mini Relief Games</h1>
        <p className={`${classes.text} opacity-70 mb-8`}>
          Interactive games to help you feel better
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game, index) => (
            <motion.button
              key={game.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(game.screen)}
              className={`${classes.card} p-8 rounded-2xl shadow-lg text-left relative overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${game.color} opacity-10 rounded-full -translate-y-20 translate-x-20`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl mb-2">{game.emoji}</div>
                  <game.icon size={32} className={`${classes.text} opacity-60`} />
                </div>
                
                <h2 className={`text-2xl font-medium ${classes.text} mb-3`}>
                  {game.title}
                </h2>
                <p className={`${classes.text} opacity-70 leading-relaxed`}>
                  {game.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};