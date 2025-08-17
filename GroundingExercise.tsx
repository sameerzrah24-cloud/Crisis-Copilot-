import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, Ear, Hand, DoorClosed as Nose, Coffee, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

const exercises = [
  {
    id: 'sight',
    title: '5 Things You Can See',
    icon: Eye,
    instruction: 'Look around and name 5 things you can see. Take your time with each one.',
    color: 'from-blue-400 to-cyan-400',
    examples: ['A lamp', 'Your hands', 'A wall', 'A door', 'Something colorful']
  },
  {
    id: 'sound',
    title: '4 Things You Can Hear',
    icon: Ear,
    instruction: 'Listen carefully and identify 4 different sounds around you.',
    color: 'from-green-400 to-teal-400',
    examples: ['Your breathing', 'Traffic outside', 'Air conditioning', 'Your heartbeat']
  },
  {
    id: 'touch',
    title: '3 Things You Can Touch',
    icon: Hand,
    instruction: 'Feel 3 different textures or objects near you.',
    color: 'from-purple-400 to-indigo-400',
    examples: ['Your clothes', 'A smooth surface', 'Something soft']
  },
  {
    id: 'smell',
    title: '2 Things You Can Smell',
    icon: Nose,
    instruction: 'Take a deep breath and notice 2 different scents.',
    color: 'from-orange-400 to-yellow-400',
    examples: ['Fresh air', 'Your perfume/cologne', 'Food nearby']
  },
  {
    id: 'taste',
    title: '1 Thing You Can Taste',
    icon: Coffee,
    instruction: 'Notice what you can taste right now, or take a sip of water.',
    color: 'from-pink-400 to-rose-400',
    examples: ['Water', 'Mint', 'The taste in your mouth']
  }
];

export const GroundingExercise: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const { classes } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleNext = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className={`min-h-screen ${classes.background} relative z-10`}>
        <div className="p-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentScreen('emergency-toolkit')}
            className={`mb-6 p-3 ${classes.card} rounded-full shadow-lg`}
          >
            <ArrowLeft size={20} className={classes.text} />
          </motion.button>

          <div className="max-w-md mx-auto text-center">
            <motion.div
              className={`${classes.card} rounded-2xl p-8 shadow-lg`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-6"
              >
                <CheckCircle size={64} className="text-green-500 mx-auto" />
              </motion.div>

              <h2 className={`text-2xl font-medium ${classes.text} mb-4`}>
                Well Done!
              </h2>
              <p className={`${classes.text} opacity-80 mb-6 leading-relaxed`}>
                You've completed the 5-4-3-2-1 grounding exercise. You're more present and connected to your surroundings now.
              </p>
              <p className={`${classes.text} opacity-70 text-sm mb-8`}>
                Remember: You can use this technique anytime you feel overwhelmed or disconnected.
              </p>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRestart}
                  className={`w-full bg-gradient-to-r ${classes.gradient} text-white py-3 rounded-xl font-medium shadow-lg`}
                >
                  Practice Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentScreen('emergency-toolkit')}
                  className={`w-full ${classes.card} py-3 rounded-xl font-medium shadow-lg`}
                >
                  <span className={classes.text}>Back to Toolkit</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentStep];

  return (
    <div className={`min-h-screen ${classes.background} relative z-10`}>
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            `radial-gradient(circle at 30% 40%, ${currentExercise.color.split(' ')[1]} 0%, transparent 50%)`,
            `radial-gradient(circle at 70% 60%, ${currentExercise.color.split(' ')[3]} 0%, transparent 50%)`,
            `radial-gradient(circle at 50% 30%, ${currentExercise.color.split(' ')[1]} 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 8,
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

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-light ${classes.text} mb-2`}>
              Grounding Exercise
            </h1>
            <p className={`${classes.text} opacity-70`}>
              5-4-3-2-1 Technique
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className={`${classes.card} rounded-2xl p-8 shadow-lg text-center`}
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${currentExercise.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <currentExercise.icon size={32} className="text-white" />
              </div>

              <h2 className={`text-2xl font-medium ${classes.text} mb-4`}>
                {currentExercise.title}
              </h2>

              <p className={`${classes.text} opacity-80 mb-6 leading-relaxed`}>
                {currentExercise.instruction}
              </p>

              <div className={`${classes.card} p-4 rounded-xl mb-6`}>
                <p className={`${classes.text} opacity-70 text-sm mb-2`}>
                  Examples:
                </p>
                <div className="space-y-1">
                  {currentExercise.examples.map((example, index) => (
                    <p key={index} className={`${classes.text} opacity-60 text-sm`}>
                      • {example}
                    </p>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className={`w-full bg-gradient-to-r ${currentExercise.color} text-white py-4 rounded-xl font-medium shadow-lg`}
              >
                {currentStep === exercises.length - 1 ? 'Complete' : 'Next'}
              </motion.button>

              {/* Progress indicator */}
              <div className="flex justify-center mt-6 space-x-2">
                {exercises.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index <= currentStep 
                        ? `bg-gradient-to-r ${currentExercise.color}`
                        : classes.text + ' opacity-20'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};