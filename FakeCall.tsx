import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, PhoneOff, Clock, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

export const FakeCall: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const { classes } = useTheme();
  const [selectedDelay, setSelectedDelay] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [showCall, setShowCall] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const delays = [
    { seconds: 30, label: '30 seconds' },
    { seconds: 60, label: '1 minute' },
    { seconds: 120, label: '2 minutes' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setShowCall(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [countdown]);

  const startTimer = (seconds: number) => {
    setSelectedDelay(seconds);
    setCountdown(seconds);
  };

  const cancelTimer = () => {
    setSelectedDelay(null);
    setCountdown(0);
  };

  const answerCall = () => {
    setShowCall(false);
    setShowChat(true);
  };

  const declineCall = () => {
    setShowCall(false);
    setSelectedDelay(null);
  };

  const endChat = () => {
    setShowChat(false);
    setSelectedDelay(null);
  };

  if (showChat) {
    return (
      <div className={`min-h-screen bg-gray-900 text-white relative z-10`}>
        <div className="p-6">
          <div className="max-w-md mx-auto">
            {/* Chat Header */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-800 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium">Sarah (Friend)</h2>
                <p className="text-sm text-gray-400">Online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 mb-6">
              <motion.div
                className="bg-gray-700 p-4 rounded-xl max-w-xs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="text-sm">Hey! I was just thinking about you. How are you doing?</p>
                <span className="text-xs text-gray-400 mt-1 block">Just now</span>
              </motion.div>

              <motion.div
                className="bg-blue-600 p-4 rounded-xl max-w-xs ml-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm">I'm okay, thanks for checking in!</p>
                <span className="text-xs text-blue-200 mt-1 block">Just now</span>
              </motion.div>

              <motion.div
                className="bg-gray-700 p-4 rounded-xl max-w-xs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <p className="text-sm">That's great to hear! Remember I'm always here if you need to talk. 💜</p>
                <span className="text-xs text-gray-400 mt-1 block">Just now</span>
              </motion.div>
            </div>

            {/* End Chat Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={endChat}
              className="w-full bg-red-500 text-white p-4 rounded-xl font-medium shadow-lg flex items-center justify-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <PhoneOff size={20} />
              <span>End Conversation</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  if (showCall) {
    return (
      <div className={`min-h-screen bg-gray-900 text-white relative z-10`}>
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg text-gray-300 mb-2">Incoming call</p>
            <h1 className="text-3xl font-light mb-4">Sarah (Friend)</h1>
            <p className="text-gray-400">Mobile</p>
          </motion.div>

          {/* Caller Avatar */}
          <motion.div
            className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-12"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <User size={64} className="text-white" />
          </motion.div>

          {/* Call Actions */}
          <div className="flex space-x-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={declineCall}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <PhoneOff size={24} className="text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={answerCall}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Phone size={24} className="text-white" />
            </motion.button>
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

        <div className="max-w-md mx-auto">
          <h1 className={`text-3xl font-light ${classes.text} mb-2`}>Fake Call Timer</h1>
          <p className={`${classes.text} opacity-70 mb-8`}>
            Schedule a fake call to help you exit uncomfortable situations
          </p>

          {countdown > 0 ? (
            <motion.div
              className={`${classes.card} p-8 rounded-2xl shadow-lg text-center`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Clock size={48} className={`${classes.text} opacity-60 mx-auto mb-4`} />
              <h2 className={`text-2xl font-medium ${classes.text} mb-2`}>
                Call incoming in...
              </h2>
              <motion.div
                className={`text-4xl font-bold ${classes.text} mb-6`}
                key={countdown}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {countdown}s
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelTimer}
                className={`px-8 py-3 bg-red-500 text-white rounded-xl font-medium shadow-lg`}
              >
                Cancel
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <motion.div
                className={`${classes.card} p-6 rounded-xl shadow-lg mb-6`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className={`text-lg font-medium ${classes.text} mb-4`}>
                  Choose delay time:
                </h2>
                <div className="space-y-3">
                  {delays.map((delay, index) => (
                    <motion.button
                      key={delay.seconds}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startTimer(delay.seconds)}
                      className={`w-full p-4 ${classes.card} rounded-xl shadow-sm text-left hover:shadow-md transition-shadow`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${classes.text}`}>
                          {delay.label}
                        </span>
                        <Clock size={20} className={`${classes.text} opacity-60`} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className={`${classes.card} p-4 rounded-xl shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className={`${classes.text} opacity-70 text-sm text-center`}>
                  A fake incoming call will appear after the selected time. You can "answer" it to start a fake conversation.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};