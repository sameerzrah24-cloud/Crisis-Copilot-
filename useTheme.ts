import { useApp } from '../contexts/AppContext';

export const useTheme = () => {
  const { state } = useApp();
  
  const getThemeClasses = () => {
    switch (state.theme) {
      case 'dark':
        return {
          background: 'bg-gray-900',
          text: 'text-white',
          card: 'bg-gray-800',
          accent: 'bg-purple-600',
          secondary: 'bg-blue-600',
          gradient: 'from-gray-900 to-gray-800'
        };
      case 'sunset':
        return {
          background: 'bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200',
          text: 'text-gray-900',
          card: 'bg-white/80 backdrop-blur-sm',
          accent: 'bg-orange-500',
          secondary: 'bg-pink-500',
          gradient: 'from-orange-300 to-pink-300'
        };
      case 'calm-green':
        return {
          background: 'bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100',
          text: 'text-gray-900',
          card: 'bg-white/80 backdrop-blur-sm',
          accent: 'bg-green-500',
          secondary: 'bg-teal-500',
          gradient: 'from-green-200 to-teal-200'
        };
      default: // soft-pastel
        return {
          background: 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100',
          text: 'text-gray-900',
          card: 'bg-white/80 backdrop-blur-sm',
          accent: 'bg-purple-500',
          secondary: 'bg-pink-500',
          gradient: 'from-purple-200 to-pink-200'
        };
    }
  };

  return {
    theme: state.theme,
    classes: getThemeClasses(),
    isDark: state.theme === 'dark'
  };
};