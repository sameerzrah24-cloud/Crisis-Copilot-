import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, MapPin, Send, Edit3 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

export const QuickSOS: React.FC = () => {
  const { setCurrentScreen, state } = useApp();
  const { classes } = useTheme();
  const [location, setLocation] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showCustomMessage, setShowCustomMessage] = useState(false);

  const defaultMessage = "I'm not okay. Please check on me.";
  const defaultContact = state.trustedContacts?.find(c => c.isDefault) || state.trustedContacts?.[0];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          setLocation(locationUrl);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation('Location unavailable');
          setIsGettingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocation('Location not supported');
      setIsGettingLocation(false);
    }
  };

  const sendWhatsAppMessage = () => {
    const message = showCustomMessage && customMessage.trim() 
      ? customMessage.trim() 
      : defaultMessage;
    
    const fullMessage = location && location !== 'Location unavailable' && location !== 'Location not supported'
      ? `${message} ${location}`
      : message;
    
    if (defaultContact) {
      const whatsappUrl = `https://wa.me/${defaultContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(fullMessage)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const sendSMSMessage = () => {
    const message = showCustomMessage && customMessage.trim() 
      ? customMessage.trim() 
      : defaultMessage;
    
    const fullMessage = location && location !== 'Location unavailable' && location !== 'Location not supported'
      ? `${message} ${location}`
      : message;
    
    if (defaultContact) {
      const smsUrl = `sms:${defaultContact.phone}?body=${encodeURIComponent(fullMessage)}`;
      window.open(smsUrl, '_self');
    } else {
      const smsUrl = `sms:?body=${encodeURIComponent(fullMessage)}`;
      window.open(smsUrl, '_self');
    }
  };

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
          <h1 className={`text-3xl font-light ${classes.text} mb-2`}>Quick SOS</h1>
          <p className={`${classes.text} opacity-70 mb-8`}>
            Send an emergency message with your location
          </p>

          {/* Default Contact Info */}
          {defaultContact && (
            <motion.div
              className={`${classes.card} p-4 rounded-xl shadow-lg mb-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-gradient-to-r ${classes.gradient} rounded-lg`}>
                  <MessageSquare size={16} className="text-white" />
                </div>
                <div>
                  <p className={`${classes.text} font-medium text-sm`}>
                    Will send to: {defaultContact.name}
                  </p>
                  <p className={`${classes.text} opacity-70 text-xs`}>
                    {defaultContact.phone}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Location Status */}
          <motion.div
            className={`${classes.card} p-6 rounded-xl shadow-lg mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <MapPin size={24} className={classes.text} />
              <h2 className={`text-lg font-medium ${classes.text}`}>Location</h2>
            </div>
            
            {isGettingLocation ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                <span className={`${classes.text} opacity-70 text-sm`}>
                  Getting your location...
                </span>
              </div>
            ) : (
              <div>
                <p className={`${classes.text} opacity-70 text-sm mb-3`}>
                  {location === 'Location unavailable' || location === 'Location not supported'
                    ? location
                    : 'Location ready to share'
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={getCurrentLocation}
                  className={`px-4 py-2 ${classes.card} rounded-lg text-sm font-medium shadow-sm`}
                >
                  <span className={classes.text}>Refresh Location</span>
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Message Preview */}
          <motion.div
            className={`${classes.card} p-6 rounded-xl shadow-lg mb-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-medium ${classes.text}`}>Message</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCustomMessage(!showCustomMessage)}
                className={`p-2 ${classes.card} rounded-lg shadow-sm`}
              >
                <Edit3 size={16} className={classes.text} />
              </motion.button>
            </div>

            {showCustomMessage ? (
              <div className="space-y-3">
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Write your custom message..."
                  className={`w-full h-24 p-3 rounded-lg border-0 resize-none focus:ring-2 focus:ring-purple-300 ${classes.card} ${classes.text} placeholder-gray-400`}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCustomMessage(false)}
                  className={`px-4 py-2 ${classes.card} rounded-lg text-sm font-medium shadow-sm`}
                >
                  <span className={classes.text}>Use Default</span>
                </motion.button>
              </div>
            ) : (
              <div className={`p-4 ${classes.card} rounded-lg`}>
                <p className={`${classes.text} opacity-80 text-sm`}>
                  "{defaultMessage}"
                </p>
                {location && location !== 'Location unavailable' && location !== 'Location not supported' && (
                  <p className={`${classes.text} opacity-60 text-xs mt-2`}>
                    + Your location will be included
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Send Options */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={sendWhatsAppMessage}
              className="w-full bg-green-500 text-white p-4 rounded-xl font-medium shadow-lg flex items-center justify-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MessageSquare size={20} />
              <span>Send via WhatsApp</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={sendSMSMessage}
              className={`w-full bg-gradient-to-r ${classes.gradient} text-white p-4 rounded-xl font-medium shadow-lg flex items-center justify-center space-x-3`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Send size={20} />
              <span>Send via SMS</span>
            </motion.button>
          </div>

          {/* Instructions */}
          <motion.div
            className={`${classes.card} p-4 rounded-xl shadow-lg mt-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className={`${classes.text} opacity-70 text-sm text-center`}>
              {defaultContact 
                ? `This will send a message to ${defaultContact.name} with your location.`
                : 'This will open your messaging app. Add trusted contacts in the Emergency Toolkit for direct messaging.'
              }
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};