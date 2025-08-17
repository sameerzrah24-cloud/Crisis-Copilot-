import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Phone, MessageSquare, Shield, Clock, BookOpen } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

export const EmergencyToolkit: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const { classes } = useTheme();

  const tools = [
    {
      id: 'breathing-timer',
      title: 'Breathing Timer',
      icon: Heart,
      emoji: '🌀',
      description: 'Guided breathing with visual cues',
      color: 'from-blue-400 to-cyan-400',
      screen: 'breathing-timer'
    },
    {
      id: 'grounding',
      title: 'Grounding Exercise',
      icon: Shield,
      emoji: '🪨',
      description: '5-4-3-2-1 sensory grounding technique',
      color: 'from-green-400 to-teal-400',
      screen: 'grounding-exercise'
    },
    {
      id: 'quick-sos',
      title: 'Quick SOS Text',
      icon: MessageSquare,
      emoji: '📲',
      description: 'Send emergency text with location',
      color: 'from-red-400 to-pink-400',
      screen: 'quick-sos'
    },
    {
      id: 'trusted-contact',
      title: 'Call Trusted Contact',
      icon: Phone,
      emoji: '📞',
      description: 'Quick call to your emergency contact',
      color: 'from-purple-400 to-indigo-400',
      screen: 'trusted-contact'
    },
    {
      id: 'fake-call',
      title: 'Fake Call Timer',
      icon: Clock,
      emoji: '🧳',
      description: 'Simulated incoming call for safety',
      color: 'from-orange-400 to-yellow-400',
      screen: 'fake-call'
    },
    {
      id: 'first-aid',
      title: 'First Aid Guide',
      icon: BookOpen,
      emoji: '🚥',
      description: 'Emergency medical guidance',
      color: 'from-indigo-400 to-purple-400',
      screen: 'first-aid'
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

        <h1 className={`text-3xl font-light ${classes.text} mb-2`}>Emergency Toolkit</h1>
        <p className={`${classes.text} opacity-70 mb-8`}>
          Quick access to calming tools and safety resources
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentScreen(tool.screen)}
              className={`${classes.card} p-6 rounded-2xl shadow-lg text-left relative overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-10 rounded-full -translate-y-16 translate-x-16`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-2">{tool.emoji}</div>
                  <tool.icon size={28} className={`${classes.text} opacity-60`} />
                </div>
                
                <h2 className={`text-xl font-medium ${classes.text} mb-2`}>
                  {tool.title}
                </h2>
                <p className={`${classes.text} opacity-70 text-sm leading-relaxed`}>
                  {tool.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};