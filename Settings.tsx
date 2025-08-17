import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Palette, Eye, Bell, Shield, Sun, Moon, Sunset as SunsetIcon, Leaf } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../contexts/AppContext';

export const Settings: React.FC = () => {
  const { 
    state, 
    setCurrentScreen, 
    setTheme, 
    toggleFireflies, 
    toggleStealthMode, 
    toggleDisguiseNotifications 
  } = useApp();
  const { classes } = useTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const themes: { id: Theme; name: string; icon: React.ReactNode; gradient: string }[] = [
    {
      id: 'soft-pastel',
      name: 'Soft Pastel',
      icon: <Sun size={20} />,
      gradient: 'from-purple-200 to-pink-200'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: <Moon size={20} />,
      gradient: 'from-gray-800 to-gray-900'
    },
    {
      id: 'sunset',
      name: 'Sunset Glow',
      icon: <SunsetIcon size={20} />,
      gradient: 'from-orange-300 to-pink-300'
    },
    {
      id: 'calm-green',
      name: 'Calm Green',
      icon: <Leaf size={20} />,
      gradient: 'from-green-200 to-teal-200'
    }
  ];

  const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-300'
      }`}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        animate={{
          x: enabled ? 26 : 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      />
    </motion.button>
  );

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          label: 'Theme',
          icon: <Palette size={20} />,
          value: themes.find(t => t.id === state.theme)?.name,
          action: () => setShowThemeSelector(true),
          isToggle: false
        },
        {
          id: 'fireflies',
          label: 'Background Animation',
          icon: <Eye size={20} />,
          value: state.showFireflies ? 'On' : 'Off',
          action: toggleFireflies,
          isToggle: true,
          toggleValue: state.showFireflies
        }
      ]
    },
    {
      title: 'Privacy & Safety',
      items: [
        {
          id: 'stealth',
          label: 'Stealth Mode',
          icon: <Shield size={20} />,
          value: state.stealthMode ? 'Enabled' : 'Disabled',
          action: toggleStealthMode,
          isToggle: true,
          toggleValue: state.stealthMode
        },
        {
          id: 'notifications',
          label: 'Disguise Notifications',
          icon: <Bell size={20} />,
          value: state.disguiseNotifications ? 'On' : 'Off',
          action: toggleDisguiseNotifications,
          isToggle: true,
          toggleValue: state.disguiseNotifications
        }
      ]
    }
  ];

  if (showThemeSelector) {
    return (
      <div className={`min-h-screen ${classes.background} relative z-10`}>
        <div className="p-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowThemeSelector(false)}
            className={`mb-6 p-3 ${classes.card} rounded-full shadow-lg`}
          >
            <ArrowLeft size={20} className={classes.text} />
          </motion.button>

          <h1 className={`text-3xl font-light ${classes.text} mb-2`}>Choose Theme</h1>
          <p className={`${classes.text} opacity-70 mb-8`}>
            Select your preferred visual style
          </p>

          <div className="space-y-4">
            {themes.map((theme, index) => (
              <motion.button
                key={theme.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setTheme(theme.id);
                  setShowThemeSelector(false);
                }}
                className={`w-full ${classes.card} p-6 rounded-xl shadow-lg text-left relative overflow-hidden ${
                  state.theme === theme.id ? 'ring-2 ring-blue-500' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.gradient} opacity-20 rounded-full -translate-y-16 translate-x-16`} />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-gradient-to-r ${theme.gradient} text-white rounded-lg`}>
                      {theme.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg font-medium ${classes.text}`}>
                        {theme.name}
                      </h3>
                      {state.theme === theme.id && (
                        <p className={`${classes.text} opacity-70 text-sm`}>
                          Currently selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
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

        <h1 className={`text-3xl font-light ${classes.text} mb-2`}>Settings</h1>
        <p className={`${classes.text} opacity-70 mb-8`}>
          Customize your Crisis Copilot experience
        </p>

        {settingsSections.map((section, sectionIndex) => (
          <div key={section.title} className="mb-8">
            <h2 className={`text-lg font-medium ${classes.text} mb-4 px-2`}>
              {section.title}
            </h2>
            
            <div className="space-y-3">
              {section.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={`w-full ${classes.card} p-4 rounded-xl shadow-lg`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (sectionIndex * section.items.length + index) * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`${classes.text} opacity-60`}>
                        {item.icon}
                      </div>
                      <span className={`font-medium ${classes.text}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {!item.isToggle && (
                        <span className={`${classes.text} opacity-70 text-sm`}>
                          {item.value}
                        </span>
                      )}
                      {item.isToggle ? (
                        <ToggleSwitch 
                          enabled={item.toggleValue || false} 
                          onToggle={item.action} 
                        />
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={item.action}
                          className={`px-4 py-2 ${classes.card} rounded-lg shadow-sm`}
                        >
                          <span className={`${classes.text} text-sm`}>Change</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className={`${classes.card} p-6 rounded-xl shadow-lg mt-8`}>
          <h3 className={`text-lg font-medium ${classes.text} mb-3`}>
            About Crisis Copilot
          </h3>
          <div className={`${classes.text} opacity-70 text-sm space-y-2`}>
            <p>Version 1.0.0</p>
            <p>Your mental wellness companion</p>
            <p>Built with care for your wellbeing</p>
          </div>
        </div>
      </div>
    </div>
  );
};