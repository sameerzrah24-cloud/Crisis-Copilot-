import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Building2, Shield } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

export const NearbyHelp: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const { classes } = useTheme();
  const [isSearching, setIsSearching] = useState(false);

  const searchNearby = (type: 'hospital' | 'police') => {
    setIsSearching(true);
    
    const searchQuery = type === 'hospital' ? 'nearest+hospital' : 'nearest+police+station';
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps/search/${searchQuery}/@${latitude},${longitude},15z`;
          window.open(url, '_blank');
          setIsSearching(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback without location
          const url = `https://www.google.com/maps/search/${searchQuery}/`;
          window.open(url, '_blank');
          setIsSearching(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      // Fallback for browsers without geolocation
      const url = `https://www.google.com/maps/search/${searchQuery}/`;
      window.open(url, '_blank');
      setIsSearching(false);
    }
  };

  const options = [
    {
      id: 'hospital',
      title: 'Find Hospital',
      icon: Building2,
      emoji: '🏥',
      description: 'Locate nearest hospital or medical center',
      color: 'from-red-400 to-pink-400',
      action: () => searchNearby('hospital')
    },
    {
      id: 'police',
      title: 'Find Police Station',
      icon: Shield,
      emoji: '🚔',
      description: 'Locate nearest police station',
      color: 'from-blue-400 to-cyan-400',
      action: () => searchNearby('police')
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

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <MapPin size={32} className={`${classes.text} mr-3`} />
              <h1 className={`text-3xl font-light ${classes.text}`}>Nearby Help</h1>
            </div>
            <p className={`${classes.text} opacity-70`}>
              Find emergency services near your location
            </p>
          </div>

          <div className="space-y-6">
            {options.map((option, index) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={option.action}
                disabled={isSearching}
                className={`w-full ${classes.card} p-6 rounded-2xl shadow-lg text-left relative overflow-hidden ${
                  isSearching ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${option.color} opacity-10 rounded-full -translate-y-16 translate-x-16`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl mb-2">{option.emoji}</div>
                    <option.icon size={28} className={`${classes.text} opacity-60`} />
                  </div>
                  
                  <h2 className={`text-xl font-medium ${classes.text} mb-2`}>
                    {option.title}
                  </h2>
                  <p className={`${classes.text} opacity-70 text-sm leading-relaxed`}>
                    {option.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Loading State */}
          {isSearching && (
            <motion.div
              className={`${classes.card} p-4 rounded-xl shadow-lg mt-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
                <p className={`${classes.text} text-sm`}>
                  Getting your location and opening maps...
                </p>
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          <motion.div
            className={`${classes.card} p-4 rounded-xl shadow-lg mt-6`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className={`${classes.text} opacity-70 text-sm text-center`}>
              This will open Google Maps with nearby locations based on your current position.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};