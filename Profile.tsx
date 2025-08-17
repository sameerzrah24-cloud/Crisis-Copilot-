import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Heart, BarChart3 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

export const Profile: React.FC = () => {
  const { state, setCurrentScreen } = useApp();
  const { classes } = useTheme();

  const thisWeekCrises = state.crisisHistory.filter(crisis => {
    const week = 7 * 24 * 60 * 60 * 1000;
    return crisis.completedAt && (Date.now() - crisis.completedAt.getTime()) < week;
  }).length;

  const thisWeekGames = state.gameHistory.filter(session => {
    const week = 7 * 24 * 60 * 60 * 1000;
    return (Date.now() - session.playedAt.getTime()) < week;
  }).length;

  const stats = [
    {
      icon: Heart,
      label: 'Crisis Flows Completed',
      value: state.crisisHistory.length,
      color: 'from-red-400 to-pink-400'
    },
    {
      icon: BarChart3,
      label: 'This Week Activities',
      value: thisWeekCrises + thisWeekGames,
      color: 'from-purple-400 to-indigo-400'
    }
  ];

  const recentActivities = [
    ...state.crisisHistory.slice(-5).map(crisis => ({
      type: 'crisis',
      title: `Completed: ${crisis.title}`,
      time: crisis.completedAt,
      icon: '🚨'
    })),
    ...state.gameHistory.slice(-5).map(session => ({
      type: 'game',
      title: `Played: ${session.game}`,
      time: session.playedAt,
      icon: '🎮'
    }))
  ].sort((a, b) => (b.time?.getTime() || 0) - (a.time?.getTime() || 0)).slice(0, 10);

  const formatTimeAgo = (date: Date | undefined) => {
    if (!date) return 'Unknown time';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

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

        <div className="max-w-2xl mx-auto">
          <h1 className={`text-3xl font-light ${classes.text} mb-2`}>Profile</h1>
          <p className={`${classes.text} opacity-70 mb-8`}>
            Your wellness journey and achievements
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`${classes.card} p-6 rounded-xl shadow-lg relative overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-12 translate-x-12`} />
                
                <div className="relative z-10">
                  <stat.icon size={24} className={`${classes.text} opacity-60 mb-3`} />
                  <div className={`text-2xl font-bold ${classes.text} mb-1`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${classes.text} opacity-70`}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Motivation Section */}
          <motion.div
            className={`${classes.card} p-6 rounded-xl shadow-lg mb-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center mb-4">
              <Heart size={24} className={`${classes.text} mr-3`} />
              <h2 className={`text-xl font-medium ${classes.text}`}>
                This Week's Progress
              </h2>
            </div>
            <div className={`${classes.text} opacity-70 space-y-2`}>
              <p>🌟 {thisWeekCrises} crisis flows completed</p>
              <p>💪 You're building healthy coping habits!</p>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className={`${classes.card} p-6 rounded-xl shadow-lg`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <Calendar size={24} className={`${classes.text} mr-3`} />
              <h2 className={`text-xl font-medium ${classes.text}`}>
                Recent Activity
              </h2>
            </div>
            
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center justify-between py-3 border-b border-gray-200/20 last:border-b-0`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{activity.icon}</span>
                      <span className={`${classes.text} font-medium`}>
                        {activity.title}
                      </span>
                    </div>
                    <span className={`${classes.text} opacity-60 text-sm`}>
                      {formatTimeAgo(activity.time)}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={`${classes.text} opacity-70 text-center py-8`}>
                Start using Crisis Copilot to see your activity here
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};