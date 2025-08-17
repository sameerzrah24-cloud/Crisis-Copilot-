import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './contexts/AppContext';
import { Fireflies } from './components/Fireflies';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/HomeScreen';
import { CrisisCenter } from './components/CrisisCenter';
import { EmergencyToolkit } from './components/EmergencyToolkit';
import { MoodJournal } from './components/MoodJournal';
import { MiniGames } from './components/MiniGames';
import { BreathingTimer } from './components/BreathingTimer';
import { BubblePopGame } from './components/BubblePopGame';
import { DrawToCalmGame } from './components/DrawToCalmGame';
import { StarlightTapGame } from './components/StarlightTapGame';
import { ZenGardenGame } from './components/ZenGardenGame';
import { GroundingExercise } from './components/GroundingExercise';
import { QuickSOS } from './components/QuickSOS';
import { TrustedContact } from './components/TrustedContact';
import { FakeCall } from './components/FakeCall';
import { FirstAidGuide } from './components/FirstAidGuide';
import { NearbyHelp } from './components/NearbyHelp';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';

const AppContent: React.FC = () => {
  const { state } = useApp();

  const renderScreen = () => {
    if (state.showSplash) {
      return <SplashScreen />;
    }

    switch (state.currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'crisis-center':
        return <CrisisCenter />;
      case 'emergency-toolkit':
        return <EmergencyToolkit />;
      case 'mood-journal':
        return <MoodJournal />;
      case 'mini-games':
        return <MiniGames />;
      case 'breathing-timer':
        return <BreathingTimer />;
      case 'bubble-pop-game':
        return <BubblePopGame />;
      case 'draw-to-calm-game':
        return <DrawToCalmGame />;
      case 'starlight-tap-game':
        return <StarlightTapGame />;
      case 'zen-garden-game':
        return <ZenGardenGame />;
      case 'grounding-exercise':
        return <GroundingExercise />;
      case 'quick-sos':
        return <QuickSOS />;
      case 'trusted-contact':
        return <TrustedContact />;
      case 'fake-call':
        return <FakeCall />;
      case 'first-aid':
        return <FirstAidGuide />;
      case 'nearby-help':
        return <NearbyHelp />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="relative">
      <Fireflies />
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;