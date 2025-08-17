import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'soft-pastel' | 'dark' | 'sunset' | 'calm-green';

export interface CrisisFlow {
  id: string;
  title: string;
  icon: string;
  category: 'immediate' | 'struggling' | 'processing';
  completedAt?: Date;
}

export interface GameSession {
  game: string;
  playedAt: Date;
  duration: number;
}

export interface JournalEntry {
  id: string;
  date: Date;
  mood: 'great' | 'good' | 'okay' | 'sad' | 'anxious';
  entry: string;
  gratitude?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  isDefault?: boolean;
}

export interface AppState {
  theme: Theme;
  showFireflies: boolean;
  stealthMode: boolean;
  disguiseNotifications: boolean;
  trustedContact: {
    name: string;
    phone: string;
  } | null;
  trustedContacts: TrustedContact[];
  crisisHistory: CrisisFlow[];
  gameHistory: GameSession[];
  journalEntries: JournalEntry[];
  currentScreen: string;
  showSplash: boolean;
}

interface AppContextType {
  state: AppState;
  setTheme: (theme: Theme) => void;
  toggleFireflies: () => void;
  toggleStealthMode: () => void;
  toggleDisguiseNotifications: () => void;
  setTrustedContact: (contact: { name: string; phone: string } | null) => void;
  setTrustedContacts: (contacts: TrustedContact[]) => void;
  addCrisisCompletion: (crisis: CrisisFlow) => void;
  addGameSession: (session: GameSession) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  setCurrentScreen: (screen: string) => void;
  setSplashComplete: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('crisis-copilot-state');
    const defaultState: AppState = {
      theme: 'soft-pastel',
      showFireflies: true,
      stealthMode: false,
      disguiseNotifications: false,
      trustedContact: null,
      trustedContacts: [],
      crisisHistory: [],
      gameHistory: [],
      journalEntries: [],
      currentScreen: 'splash',
      showSplash: true,
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        if (parsed.crisisHistory) {
          parsed.crisisHistory = parsed.crisisHistory.map((crisis: any) => ({
            ...crisis,
            completedAt: crisis.completedAt ? new Date(crisis.completedAt) : undefined
          }));
        }
        if (parsed.gameHistory) {
          parsed.gameHistory = parsed.gameHistory.map((session: any) => ({
            ...session,
            playedAt: new Date(session.playedAt)
          }));
        }
        if (parsed.journalEntries) {
          parsed.journalEntries = parsed.journalEntries.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date)
          }));
        }
        return { ...defaultState, ...parsed, showSplash: true };
      } catch {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    const { showSplash, ...persistentState } = state;
    localStorage.setItem('crisis-copilot-state', JSON.stringify(persistentState));
  }, [state]);

  // Handle stealth mode app title changes
  useEffect(() => {
    if (state.stealthMode) {
      document.title = 'Notes';
      // In a real app, you would also change the favicon here
    } else {
      document.title = 'Crisis Copilot - Mental Wellness Companion';
    }
  }, [state.stealthMode]);

  const setTheme = (theme: Theme) => {
    setState(prev => ({ ...prev, theme }));
  };

  const toggleFireflies = () => {
    setState(prev => ({ ...prev, showFireflies: !prev.showFireflies }));
  };

  const toggleStealthMode = () => {
    setState(prev => ({ ...prev, stealthMode: !prev.stealthMode }));
  };

  const toggleDisguiseNotifications = () => {
    setState(prev => ({ ...prev, disguiseNotifications: !prev.disguiseNotifications }));
  };

  const setTrustedContact = (contact: { name: string; phone: string } | null) => {
    setState(prev => ({ ...prev, trustedContact: contact }));
  };

  const setTrustedContacts = (contacts: TrustedContact[]) => {
    setState(prev => ({ ...prev, trustedContacts: contacts }));
  };

  const addCrisisCompletion = (crisis: CrisisFlow) => {
    setState(prev => ({
      ...prev,
      crisisHistory: [...prev.crisisHistory, { ...crisis, completedAt: new Date() }]
    }));
  };

  const addGameSession = (session: GameSession) => {
    setState(prev => ({
      ...prev,
      gameHistory: [...prev.gameHistory, session]
    }));
  };

  const addJournalEntry = (entry: JournalEntry) => {
    setState(prev => ({
      ...prev,
      journalEntries: [...prev.journalEntries, entry]
    }));
  };

  const setCurrentScreen = (screen: string) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  };

  const setSplashComplete = () => {
    setState(prev => ({ ...prev, showSplash: false, currentScreen: 'home' }));
  };

  return (
    <AppContext.Provider value={{
      state,
      setTheme,
      toggleFireflies,
      toggleStealthMode,
      toggleDisguiseNotifications,
      setTrustedContact,
      setTrustedContacts,
      addCrisisCompletion,
      addGameSession,
      addJournalEntry,
      setCurrentScreen,
      setSplashComplete,
    }}>
      {children}
    </AppContext.Provider>
  );
};