import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaChartBar, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HabitStats = () => {
  const [showStats, setShowStats] = useState(false);
  const { habits = [] } = useSelector(state => state.habits || { habits: [] });
  const [statsData, setStatsData] = useState({
    completionRate: 0,
    categoryBreakdown: {},
    streakData: {},
    weeklyCompletion: Array(7).fill(0)
  });

  useEffect(() => {
    if (habits.length > 0) {
      calculateStats();
    }
  }, [habits]);

  const calculateStats = () => {
    // Calculate completion rate
    const totalCompletions = habits.reduce((total, habit) => {
      const completionCount = habit.completionHistory?.length || 0;
      return total + completionCount;
    }, 0);
    
    const totalPossibleCompletions = habits.reduce((total, habit) => {
      // Estimate possible completions based on creation date
      const creationDate = habit.createdAt ? new Date(habit.createdAt) : new Date();
      const daysSinceCreation = Math.max(1, Math.floor((new Date() - creationDate) / (1000 * 60 * 60 * 24)));
      return total + daysSinceCreation;
    }, 0);
    
    const completionRate = totalPossibleCompletions > 0 
      ? (totalCompletions / totalPossibleCompletions) * 100 
      : 0;
    
    // Calculate category breakdown
    const categoryBreakdown = habits.reduce((categories, habit) => {
      const category = habit.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category]++;
      return categories;
    }, {});
    
    // Calculate streak data
    const streakData = habits.reduce((streaks, habit) => {
      streaks[habit.name] = habit.streak || 0;
      return streaks;
    }, {});
    
    // Calculate weekly completion (last 7 days)
    const weeklyCompletion = Array(7).fill(0);
    const today = new Date();
    
    habits.forEach(habit => {
      (habit.completionHistory || []).forEach(completion => {
        const completionDate = new Date(completion.date);
        const dayDiff = Math.floor((today - completionDate) / (1000 * 60 * 60 * 24));
        
        if (dayDiff >= 0 && dayDiff < 7) {
          weeklyCompletion[dayDiff]++;
        }
      });
    });
    
    setStatsData({
      completionRate: Math.round(completionRate),
      categoryBreakdown,
      streakData,
      weeklyCompletion: weeklyCompletion.reverse() // Reverse to show oldest to newest
    });
  };

  const toggleStats = () => {
    setShowStats(!showStats);
    if (!showStats && habits.length > 0) {
      calculateStats();
    }
  };

  // Prepare chart data
  const categoryChartData = {
    labels: Object.keys(statsData.categoryBreakdown),
    datasets: [
      {
        data: Object.values(statsData.categoryBreakdown),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        borderWidth: 1
      }
    ]
  };

  const streakChartData = {
    labels: Object.keys(statsData.streakData).slice(0, 5), // Show top 5 habits
    datasets: [
      {
        label: 'Current Streak (days)',
        data: Object.values(statsData.streakData).slice(0, 5),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const weeklyChartData = {
    labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
    datasets: [
      {
        label: 'Habits Completed',
        data: statsData.weeklyCompletion,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <>
      <button
        onClick={toggleStats}
        className="flex items-center justify-center p-2 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors border border-white"
        title="Habit Statistics"
      >
        <FaChartBar className="text-xl" />
        <span className="ml-2 hidden md:inline text-black">Stats</span>
      </button>

      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Habit Statistics Dashboard
                  </h2>
                  <button
                    onClick={() => setShowStats(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                {habits.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No habits found. Start tracking habits to see statistics.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
                          Total Habits
                        </h3>
                        <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                          {habits.length}
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">
                          Completion Rate
                        </h3>
                        <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                          {statsData.completionRate}%
                        </p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-2">
                          Active Streaks
                        </h3>
                        <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                          {Object.values(statsData.streakData).filter(streak => streak > 0).length}
                        </p>
                      </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                          Habits by Category
                        </h3>
                        <div className="h-64">
                          <Pie data={categoryChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                          Top Habit Streaks
                        </h3>
                        <div className="h-64">
                          <Bar 
                            data={streakChartData} 
                            options={{ 
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  ticks: {
                                    precision: 0
                                  }
                                }
                              }
                            }} 
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg md:col-span-2">
                        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                          Weekly Completion
                        </h3>
                        <div className="h-64">
                          <Bar 
                            data={weeklyChartData} 
                            options={{ 
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  ticks: {
                                    precision: 0
                                  }
                                }
                              }
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HabitStats;
