import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Wrench, BookOpen, MapPin, Settings, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

export const HomeScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const { classes } = useTheme();

  const mainCards = [
    {
      id: 'crisis-center',
      title: 'Crisis Center',
      icon: AlertTriangle,
      emoji: '🚨',
      description: 'Immediate support when you need it most',
      color: 'from-red-400 to-pink-400',
      action: () => setCurrentScreen('crisis-center')
    },
    {
      id: 'emergency-toolkit',
      title: 'Emergency Toolkit',
      icon: Wrench,
      emoji: '🪚',
      description: 'Quick access to calming tools and safety resources',
      color: 'from-blue-400 to-cyan-400',
      action: () => setCurrentScreen('emergency-toolkit')
    },
    {
      id: 'mood-journal',
      title: 'Mood & Journal',
      icon: BookOpen,
      emoji: '📔',
      description: 'Track your feelings and reflect on your journey',
      color: 'from-green-400 to-teal-400',
      action: () => setCurrentScreen('mood-journal')
    },
    {
      id: 'nearby-help',
      title: 'Nearby Help',
      icon: MapPin,
      emoji: '🗺️',
      description: 'Find nearest police stations and emergency services',
      color: 'from-purple-400 to-indigo-400',
      action: () => setCurrentScreen('nearby-help')
    },
  ];

  return (
    <div className={`min-h-screen ${classes.background} relative z-10`}>
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div>
          <h1 className={`text-3xl font-light ${classes.text} mb-2`}>
            Crisis Copilot
          </h1>
          <p className={`${classes.text} opacity-70`}>
            You're safe. We're here to help.
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentScreen('profile')}
            className={`p-3 ${classes.card} rounded-full shadow-lg`}
          >
            <User size={24} className={classes.text} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentScreen('settings')}
            className={`p-3 ${classes.card} rounded-full shadow-lg`}
          >
            <Settings size={24} className={classes.text} />
          </motion.button>
        </div>
      </div>

      {/* Main Cards */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mainCards.map((card, index) => (
            <motion.button
              key={card.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={card.action}
              className={`${classes.card} p-6 rounded-2xl shadow-lg text-left relative overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-full -translate-y-16 translate-x-16`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">{card.emoji}</div>
                  <card.icon size={28} className={`${classes.text} opacity-60`} />
                </div>
                
                <h2 className={`text-xl font-medium ${classes.text} mb-2`}>
                  {card.title}
                </h2>
                <p className={`${classes.text} opacity-70 text-sm leading-relaxed`}>
                  {card.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bolt.new Logo */}
      <div className="fixed bottom-6 left-6 z-20">
        <motion.a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${classes.card} p-3 rounded-full shadow-lg block`}
        >
          <img
            src="/black_circle_360x360.png"
            alt="Bolt.new"
            className="w-8 h-8 rounded"
          />
        </motion.a>
      </div>
    </div>
  );
};