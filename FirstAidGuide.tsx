import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Zap, Wind, Flame, AlertTriangle, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

interface FirstAidTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  steps: string[];
  warnings?: string[];
}

const firstAidTopics: FirstAidTopic[] = [
  {
    id: 'cpr',
    title: 'CPR',
    icon: <Heart size={24} />,
    color: 'from-red-400 to-pink-400',
    steps: [
      'Check if the person is responsive by tapping their shoulders and shouting "Are you okay?"',
      'Call 911 immediately or have someone else do it',
      'Place the person on their back on a firm surface',
      'Tilt their head back slightly and lift their chin',
      'Place the heel of one hand on the center of their chest, between the nipples',
      'Place your other hand on top, interlacing your fingers',
      'Push hard and fast at least 2 inches deep at a rate of 100-120 compressions per minute',
      'Allow complete chest recoil between compressions',
      'Continue until emergency services arrive'
    ],
    warnings: [
      'Only perform CPR if the person is unresponsive and not breathing normally',
      'Do not stop compressions unless the person starts breathing normally'
    ]
  },
  {
    id: 'choking',
    title: 'Choking',
    icon: <Wind size={24} />,
    color: 'from-blue-400 to-cyan-400',
    steps: [
      'Ask "Are you choking?" If they can speak or cough, encourage them to keep coughing',
      'If they cannot speak, cough, or breathe, stand behind them',
      'Wrap your arms around their waist',
      'Make a fist with one hand and place it just above their navel',
      'Grasp your fist with your other hand',
      'Give quick, upward thrusts into their abdomen',
      'Continue until the object is expelled or they become unconscious',
      'If they become unconscious, begin CPR'
    ],
    warnings: [
      'For pregnant women or obese individuals, give chest thrusts instead of abdominal thrusts',
      'Seek medical attention even after successful removal of the object'
    ]
  },
  {
    id: 'seizure',
    title: 'Seizure',
    icon: <Zap size={24} />,
    color: 'from-purple-400 to-indigo-400',
    steps: [
      'Stay calm and stay with the person',
      'Keep them safe by moving dangerous objects away',
      'Place something soft under their head if possible',
      'Turn them on their side to help keep their airway clear',
      'Do NOT put anything in their mouth',
      'Do NOT try to restrain them',
      'Time the seizure - call 911 if it lasts more than 5 minutes',
      'Stay with them until they are fully conscious and oriented'
    ],
    warnings: [
      'Call 911 if the seizure lasts more than 5 minutes',
      'Call 911 if the person is injured, pregnant, or has diabetes',
      'Never put anything in their mouth during a seizure'
    ]
  },
  {
    id: 'burns',
    title: 'Burns',
    icon: <Flame size={24} />,
    color: 'from-orange-400 to-yellow-400',
    steps: [
      'Remove the person from the source of the burn if safe to do so',
      'Cool the burn with cool (not cold) running water for 10-20 minutes',
      'Remove any jewelry or tight clothing before swelling begins',
      'Cover the burn with a sterile, non-adhesive bandage or clean cloth',
      'Do NOT use ice, butter, or other home remedies',
      'For severe burns, seek immediate medical attention',
      'Give over-the-counter pain medication if needed'
    ],
    warnings: [
      'Seek immediate medical attention for burns larger than 3 inches',
      'Call 911 for burns on face, hands, feet, genitals, or major joints',
      'Never use ice, butter, or oil on burns'
    ]
  },
  {
    id: 'fainting',
    title: 'Fainting',
    icon: <AlertTriangle size={24} />,
    color: 'from-green-400 to-teal-400',
    steps: [
      'If someone feels faint, help them sit or lie down immediately',
      'Elevate their legs above heart level if possible',
      'Loosen any tight clothing around their neck',
      'Check for breathing and pulse',
      'If they have fainted, do not try to make them sit up immediately',
      'When they regain consciousness, have them remain lying down for a few minutes',
      'Help them sit up slowly, then stand gradually',
      'Seek medical attention if they don\'t regain consciousness within 1 minute'
    ],
    warnings: [
      'Call 911 if the person doesn\'t regain consciousness within 1 minute',
      'Seek medical attention if fainting was preceded by chest pain or irregular heartbeat'
    ]
  }
];

export const FirstAidGuide: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const { classes } = useTheme();
  const [selectedTopic, setSelectedTopic] = useState<FirstAidTopic | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const speakText = (text: string) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleTopicSelect = (topic: FirstAidTopic) => {
    setSelectedTopic(topic);
    setCurrentStep(0);
    if (voiceEnabled) {
      speakText(`Starting ${topic.title} guide. Step 1: ${topic.steps[0]}`);
    }
  };

  const handleNextStep = () => {
    if (selectedTopic && currentStep < selectedTopic.steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (voiceEnabled) {
        speakText(`Step ${nextStep + 1}: ${selectedTopic.steps[nextStep]}`);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (voiceEnabled && selectedTopic) {
        speakText(`Step ${prevStep + 1}: ${selectedTopic.steps[prevStep]}`);
      }
    }
  };

  if (selectedTopic) {
    return (
      <div className={`min-h-screen ${classes.background} relative z-10`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTopic(null)}
              className={`p-3 ${classes.card} rounded-full shadow-lg`}
            >
              <ArrowLeft size={20} className={classes.text} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-3 ${classes.card} rounded-full shadow-lg`}
            >
              {voiceEnabled ? 
                <Volume2 size={20} className={classes.text} /> : 
                <VolumeX size={20} className={classes.text} />
              }
            </motion.button>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Topic Header */}
            <motion.div
              className={`${classes.card} p-6 rounded-2xl shadow-lg mb-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-4 bg-gradient-to-r ${selectedTopic.color} rounded-full text-white`}>
                  {selectedTopic.icon}
                </div>
                <div>
                  <h1 className={`text-2xl font-medium ${classes.text}`}>
                    {selectedTopic.title}
                  </h1>
                  <p className={`${classes.text} opacity-70`}>
                    Step {currentStep + 1} of {selectedTopic.steps.length}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={`w-full bg-gray-200 rounded-full h-2 mb-4`}>
                <motion.div
                  className={`h-2 bg-gradient-to-r ${selectedTopic.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / selectedTopic.steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Current Step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                className={`${classes.card} p-8 rounded-2xl shadow-lg mb-6`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`text-4xl font-bold ${classes.text} mb-4`}>
                  {currentStep + 1}
                </div>
                <p className={`text-lg ${classes.text} leading-relaxed`}>
                  {selectedTopic.steps[currentStep]}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-xl font-medium shadow-lg ${
                  currentStep === 0
                    ? `${classes.card} ${classes.text} opacity-50 cursor-not-allowed`
                    : `${classes.card} ${classes.text} hover:shadow-xl`
                }`}
              >
                Previous
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextStep}
                disabled={currentStep === selectedTopic.steps.length - 1}
                className={`px-6 py-3 rounded-xl font-medium shadow-lg ${
                  currentStep === selectedTopic.steps.length - 1
                    ? `${classes.card} ${classes.text} opacity-50 cursor-not-allowed`
                    : `bg-gradient-to-r ${selectedTopic.color} text-white`
                }`}
              >
                {currentStep === selectedTopic.steps.length - 1 ? 'Complete' : 'Next'}
              </motion.button>
            </div>

            {/* Warnings */}
            {selectedTopic.warnings && (
              <motion.div
                className={`${classes.card} p-6 rounded-xl shadow-lg border-l-4 border-red-400`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className={`text-lg font-medium ${classes.text} mb-3 text-red-600`}>
                  ⚠️ Important Warnings
                </h3>
                <ul className="space-y-2">
                  {selectedTopic.warnings.map((warning, index) => (
                    <li key={index} className={`${classes.text} opacity-80 text-sm`}>
                      • {warning}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
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
          onClick={() => setCurrentScreen('emergency-toolkit')}
          className={`mb-6 p-3 ${classes.card} rounded-full shadow-lg`}
        >
          <ArrowLeft size={20} className={classes.text} />
        </motion.button>

        <div className="max-w-2xl mx-auto">
          <h1 className={`text-3xl font-light ${classes.text} mb-2`}>First Aid Guide</h1>
          <p className={`${classes.text} opacity-70 mb-8`}>
            Emergency medical guidance for common situations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firstAidTopics.map((topic, index) => (
              <motion.button
                key={topic.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTopicSelect(topic)}
                className={`${classes.card} p-6 rounded-xl shadow-lg text-left relative overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${topic.color} opacity-10 rounded-full -translate-y-12 translate-x-12`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${topic.color} rounded-lg text-white`}>
                      {topic.icon}
                    </div>
                    <ChevronRight size={20} className={`${classes.text} opacity-60`} />
                  </div>
                  
                  <h3 className={`text-lg font-medium ${classes.text} mb-2`}>
                    {topic.title}
                  </h3>
                  <p className={`${classes.text} opacity-70 text-sm`}>
                    {topic.steps.length} steps
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Emergency Notice */}
          <motion.div
            className={`${classes.card} p-6 rounded-xl shadow-lg mt-8 border-l-4 border-red-400`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className={`text-lg font-medium ${classes.text} mb-2 text-red-600`}>
              🚨 Emergency Disclaimer
            </h3>
            <p className={`${classes.text} opacity-80 text-sm`}>
              This guide is for educational purposes only. In a real emergency, always call 911 first. 
              These instructions do not replace professional medical training or treatment.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};