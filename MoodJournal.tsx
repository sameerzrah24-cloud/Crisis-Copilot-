import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Calendar, Heart, Smile, Frown, Meh, Plus, BookOpen } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

interface JournalEntry {
  id: string;
  date: Date;
  mood: 'great' | 'good' | 'okay' | 'sad' | 'anxious';
  entry: string;
  gratitude?: string;
}

const moodOptions = [
  { id: 'great', emoji: '😊', label: 'Great', color: 'from-green-400 to-emerald-400' },
  { id: 'good', emoji: '🙂', label: 'Good', color: 'from-blue-400 to-cyan-400' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: 'from-yellow-400 to-orange-400' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'from-purple-400 to-indigo-400' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'from-red-400 to-pink-400' },
];

export const MoodJournal: React.FC = () => {
  const { setCurrentScreen, addJournalEntry, state } = useApp();
  const { classes } = useTheme();
  const [currentView, setCurrentView] = useState<'list' | 'new' | 'view'>('list');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [journalText, setJournalText] = useState('');
  const [gratitudeText, setGratitudeText] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const handleSaveEntry = () => {
    if (!selectedMood || !journalText.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      mood: selectedMood as any,
      entry: journalText.trim(),
      gratitude: gratitudeText.trim() || undefined,
    };

    addJournalEntry(newEntry);
    
    // Reset form
    setSelectedMood('');
    setJournalText('');
    setGratitudeText('');
    setCurrentView('list');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (currentView === 'view' && selectedEntry) {
    const mood = moodOptions.find(m => m.id === selectedEntry.mood);
    
    return (
      <div className={`min-h-screen ${classes.background} relative z-10`}>
        <div className="p-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('list')}
            className={`mb-6 p-3 ${classes.card} rounded-full shadow-lg`}
          >
            <ArrowLeft size={20} className={classes.text} />
          </motion.button>

          <div className="max-w-2xl mx-auto">
            <motion.div
              className={`${classes.card} p-6 rounded-2xl shadow-lg mb-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 bg-gradient-to-r ${mood?.color} rounded-full`}>
                    <span className="text-2xl">{mood?.emoji}</span>
                  </div>
                  <div>
                    <h2 className={`text-xl font-medium ${classes.text}`}>
                      {mood?.label} Day
                    </h2>
                    <p className={`${classes.text} opacity-70 text-sm`}>
                      {formatDate(selectedEntry.date)}
                    </p>
                  </div>
                </div>
                <span className={`${classes.text} opacity-60 text-sm`}>
                  {formatTime(selectedEntry.date)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className={`text-lg font-medium ${classes.text} mb-2`}>
                    Journal Entry
                  </h3>
                  <p className={`${classes.text} opacity-80 leading-relaxed`}>
                    {selectedEntry.entry}
                  </p>
                </div>

                {selectedEntry.gratitude && (
                  <div>
                    <h3 className={`text-lg font-medium ${classes.text} mb-2`}>
                      Gratitude
                    </h3>
                    <p className={`${classes.text} opacity-80 leading-relaxed`}>
                      {selectedEntry.gratitude}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'new') {
    return (
      <div className={`min-h-screen ${classes.background} relative z-10`}>
        <div className="p-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('list')}
            className={`mb-6 p-3 ${classes.card} rounded-full shadow-lg`}
          >
            <ArrowLeft size={20} className={classes.text} />
          </motion.button>

          <div className="max-w-2xl mx-auto">
            <h1 className={`text-3xl font-light ${classes.text} mb-2`}>New Entry</h1>
            <p className={`${classes.text} opacity-70 mb-8`}>
              How are you feeling today?
            </p>

            {/* Mood Selection */}
            <motion.div
              className={`${classes.card} p-6 rounded-2xl shadow-lg mb-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className={`text-lg font-medium ${classes.text} mb-4`}>
                Select Your Mood
              </h2>
              <div className="grid grid-cols-5 gap-3">
                {moodOptions.map((mood) => (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-4 rounded-xl text-center transition-all ${
                      selectedMood === mood.id
                        ? `bg-gradient-to-r ${mood.color} text-white shadow-lg`
                        : `${classes.card} hover:shadow-md`
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className={`text-xs font-medium ${
                      selectedMood === mood.id ? 'text-white' : classes.text
                    }`}>
                      {mood.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Journal Entry */}
            <motion.div
              className={`${classes.card} p-6 rounded-2xl shadow-lg mb-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className={`text-lg font-medium ${classes.text} mb-4`}>
                What's on your mind?
              </h2>
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write about your day, feelings, thoughts..."
                className={`w-full h-32 p-4 rounded-xl border-0 resize-none focus:ring-2 focus:ring-purple-300 ${classes.card} ${classes.text} placeholder-gray-400`}
              />
            </motion.div>

            {/* Gratitude Section */}
            <motion.div
              className={`${classes.card} p-6 rounded-2xl shadow-lg mb-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className={`text-lg font-medium ${classes.text} mb-4`}>
                What are you grateful for? (Optional)
              </h2>
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                placeholder="Three things you're grateful for today..."
                className={`w-full h-24 p-4 rounded-xl border-0 resize-none focus:ring-2 focus:ring-purple-300 ${classes.card} ${classes.text} placeholder-gray-400`}
              />
            </motion.div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveEntry}
              disabled={!selectedMood || !journalText.trim()}
              className={`w-full py-4 rounded-xl font-medium shadow-lg transition-all ${
                selectedMood && journalText.trim()
                  ? `bg-gradient-to-r ${classes.gradient} text-white`
                  : `${classes.card} ${classes.text} opacity-50 cursor-not-allowed`
              }`}
            >
              <Save size={20} className="inline mr-2" />
              Save Entry
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
          onClick={() => setCurrentScreen('home')}
          className={`mb-6 p-3 ${classes.card} rounded-full shadow-lg`}
        >
          <ArrowLeft size={20} className={classes.text} />
        </motion.button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-light ${classes.text} mb-2`}>Mood & Journal</h1>
            <p className={`${classes.text} opacity-70`}>
              Track your feelings and reflect on your journey
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView('new')}
            className={`p-4 bg-gradient-to-r ${classes.gradient} text-white rounded-full shadow-lg`}
          >
            <Plus size={24} />
          </motion.button>
        </div>

        {/* Journal Entries */}
        <div className="max-w-2xl mx-auto">
          {state.journalEntries && state.journalEntries.length > 0 ? (
            <div className="space-y-4">
              {state.journalEntries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry, index) => {
                  const mood = moodOptions.find(m => m.id === entry.mood);
                  return (
                    <motion.button
                      key={entry.id}
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setSelectedEntry(entry);
                        setCurrentView('view');
                      }}
                      className={`w-full ${classes.card} p-6 rounded-xl shadow-lg text-left`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 bg-gradient-to-r ${mood?.color} rounded-full flex-shrink-0`}>
                            <span className="text-xl">{mood?.emoji}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-lg font-medium ${classes.text} mb-1`}>
                              {mood?.label} Day
                            </h3>
                            <p className={`${classes.text} opacity-70 text-sm mb-2`}>
                              {formatDate(new Date(entry.date))}
                            </p>
                            <p className={`${classes.text} opacity-80 text-sm line-clamp-2`}>
                              {entry.entry.length > 100 
                                ? entry.entry.substring(0, 100) + '...'
                                : entry.entry
                              }
                            </p>
                          </div>
                        </div>
                        <span className={`${classes.text} opacity-60 text-xs`}>
                          {formatTime(new Date(entry.date))}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
            </div>
          ) : (
            <motion.div
              className={`${classes.card} p-12 rounded-2xl shadow-lg text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BookOpen size={48} className={`${classes.text} opacity-40 mx-auto mb-4`} />
              <h3 className={`text-xl font-medium ${classes.text} mb-2`}>
                Start Your Journey
              </h3>
              <p className={`${classes.text} opacity-70 mb-6`}>
                Begin tracking your moods and thoughts to better understand your emotional patterns.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('new')}
                className={`px-8 py-3 bg-gradient-to-r ${classes.gradient} text-white rounded-xl font-medium shadow-lg`}
              >
                Write First Entry
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};