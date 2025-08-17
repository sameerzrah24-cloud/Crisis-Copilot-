import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, AlertTriangle, Brain, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

interface Crisis {
  id: string;
  title: string;
  category: 'immediate' | 'struggling' | 'processing';
  emoji: string;
  flow: {
    step1: string;
    step3: string;
  };
}

const crises: Crisis[] = [
  {
    id: 'panic-attack',
    title: 'Panic Attack',
    category: 'immediate',
    emoji: '💨',
    flow: {
      step1: "This feels overwhelming, but you're safe.",
      step3: "Name 3 things you can touch"
    }
  },
  {
    id: 'unsafe-location',
    title: 'Unsafe Location', 
    category: 'immediate',
    emoji: '🚨',
    flow: {
      step1: "Focus on safety. You're taking steps to protect yourself.",
      step3: "Move to a more visible area if possible."
    }
  },
  {
    id: 'anxiety-spike',
    title: 'Anxiety Spike',
    category: 'immediate', 
    emoji: '⚡',
    flow: {
      step1: "Let's take this moment by moment.",
      step3: "Hold something cool like metal or a stone."
    }
  },
  {
    id: 'exam-stress',
    title: 'Exam Stress',
    category: 'struggling',
    emoji: '📚',
    flow: {
      step1: "It's okay to pause. You've been doing your best.",
      step3: "Write 3 things you've already completed."
    }
  },
  {
    id: 'harassment',
    title: 'Harassment',
    category: 'struggling',
    emoji: '🛡️',
    flow: {
      step1: "You didn't deserve that. You are not alone.",
      step3: "Write down what happened, even if just for you."
    }
  },
  {
    id: 'emotional-breakdown',
    title: 'Emotional Breakdown',
    category: 'struggling',
    emoji: '💧',
    flow: {
      step1: "You're allowed to feel. Let's pause and breathe.",
      step3: "Name one thing around you that feels safe."
    }
  },
  {
    id: 'overthinking',
    title: 'Overthinking',
    category: 'processing',
    emoji: '🌀',
    flow: {
      step1: "Your thoughts aren't facts. You're doing okay.",
      step3: "List 2 things in your control today."
    }
  },
  {
    id: 'burnout',
    title: 'Burnout',
    category: 'processing',
    emoji: '🔥',
    flow: {
      step1: "Rest isn't lazy. You deserve to slow down.",
      step3: "Stretch or drink water."
    }
  },
  {
    id: 'grief',
    title: 'Grief',
    category: 'processing',
    emoji: '💜',
    flow: {
      step1: "It's okay to miss them. Let's sit with it together.",
      step3: "Light a candle, hold a photo, or journal."
    }
  }
];

export const CrisisCenter: React.FC = () => {
  const { setCurrentScreen, addCrisisCompletion } = useApp();
  const { classes } = useTheme();
  const [selectedCrisis, setSelectedCrisis] = useState<Crisis | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const categories = {
    immediate: { title: 'Immediate Help', icon: AlertTriangle, color: 'from-red-400 to-pink-400' },
    struggling: { title: 'Struggling Right Now', icon: Clock, color: 'from-orange-400 to-yellow-400' },
    processing: { title: 'Processing Emotions', icon: Brain, color: 'from-blue-400 to-purple-400' }
  };

  const handleCrisisSelect = (crisis: Crisis) => {
    setSelectedCrisis(crisis);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the crisis flow
      addCrisisCompletion({
        id: selectedCrisis!.id,
        title: selectedCrisis!.title,
        icon: selectedCrisis!.emoji,
        category: selectedCrisis!.category,
      });
      setSelectedCrisis(null);
      setCurrentStep(1);
    }
  };

  const handleBreathingTimer = () => {
    setCurrentScreen('breathing-timer');
  };

  if (selectedCrisis) {
    return (
      <div className={`min-h-screen ${classes.background} relative z-10 p-6`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCrisis(null)}
          className={`mb-6 p-3 ${classes.card} rounded-full shadow-lg`}
        >
          <ArrowLeft size={20} className={classes.text} />
        </motion.button>

        <div className="max-w-md mx-auto">
          <div className={`${classes.card} rounded-2xl p-8 shadow-lg text-center`}>
            <div className="text-6xl mb-4">{selectedCrisis.emoji}</div>
            <h2 className={`text-2xl font-medium ${classes.text} mb-8`}>
              {selectedCrisis.title}
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {currentStep === 1 && (
                  <div>
                    <p className={`text-lg ${classes.text} mb-6 leading-relaxed`}>
                      {selectedCrisis.flow.step1}
                    </p>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <p className={`text-lg ${classes.text} mb-6`}>
                      Let's focus on your breathing.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBreathingTimer}
                      className={`w-full bg-gradient-to-r ${classes.gradient} text-white py-4 rounded-xl font-medium shadow-lg`}
                    >
                      Start Breathing Timer
                    </motion.button>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <p className={`text-lg ${classes.text} mb-6 leading-relaxed`}>
                      {selectedCrisis.flow.step3}
                    </p>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <p className={`text-lg ${classes.text} mb-6`}>
                      Reach out if you need support:
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const message = `I'm not okay. Please check on me. https://maps.google.com/?q=${encodeURIComponent('Current Location')}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className={`w-full bg-green-500 text-white py-3 rounded-xl font-medium shadow-lg mb-3`}
                    >
                      Text Friend & Share Location
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open('tel:988', '_self')}
                      className={`w-full bg-blue-500 text-white py-3 rounded-xl font-medium shadow-lg`}
                    >
                      Call Crisis Hotline
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextStep}
              className={`w-full mt-8 bg-gradient-to-r ${classes.gradient} text-white py-4 rounded-xl font-medium shadow-lg`}
            >
              {currentStep === 4 ? 'Complete' : 'Continue'}
            </motion.button>

            {/* Progress indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep 
                      ? 'bg-gradient-to-r ' + classes.gradient
                      : classes.text + ' opacity-20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        <h1 className={`text-3xl font-light ${classes.text} mb-2`}>Crisis Center</h1>
        <p className={`${classes.text} opacity-70 mb-8`}>
          Immediate support when you need it most
        </p>

        {Object.entries(categories).map(([key, category]) => (
          <div key={key} className="mb-8">
            <div className="flex items-center mb-4">
              <category.icon size={24} className={`${classes.text} mr-3`} />
              <h2 className={`text-xl font-medium ${classes.text}`}>
                {category.title}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crises
                .filter(crisis => crisis.category === key)
                .map((crisis, index) => (
                  <motion.button
                    key={crisis.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCrisisSelect(crisis)}
                    className={`${classes.card} p-6 rounded-xl shadow-lg text-left relative overflow-hidden`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${category.color} opacity-10 rounded-full -translate-y-10 translate-x-10`} />
                    
                    <div className="relative z-10">
                      <div className="text-3xl mb-3">{crisis.emoji}</div>
                      <h3 className={`text-lg font-medium ${classes.text} leading-tight`}>
                        {crisis.title}
                      </h3>
                    </div>
                  </motion.button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};