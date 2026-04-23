import React, { useState, useEffect, useRef } from 'react';
import { FaClock, FaTimes, FaPlay, FaPause, FaRedo, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PomodoroTimer = () => {
  const [showTimer, setShowTimer] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    cyclesBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartWork: false
  });
  
  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoro-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading pomodoro settings:', error);
      }
    }
    
    // Load stats from localStorage
    const savedStats = localStorage.getItem('pomodoro-stats');
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        setCycles(stats.cycles || 0);
      } catch (error) {
        console.error('Error loading pomodoro stats:', error);
      }
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
  }, [settings]);
  
  // Save stats to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pomodoro-stats', JSON.stringify({ cycles }));
  }, [cycles]);
  
  // Timer logic
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            clearInterval(interval);
            handleTimerComplete();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);
  
  const handleTimerComplete = () => {
    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
    
    if (mode === 'work') {
      // Increment cycle count when work session is complete
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      // Determine if it should be a long break
      const isLongBreak = newCycles % settings.cyclesBeforeLongBreak === 0;
      const nextDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration;
      
      setMode('break');
      setTimeLeft(nextDuration * 60);
      
      // Auto-start break if enabled
      setIsActive(settings.autoStartBreaks);
    } else {
      // Break is complete, start new work session
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
      
      // Auto-start work if enabled
      setIsActive(settings.autoStartWork);
    }
  };
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setTimeLeft(settings.workDuration * 60);
    } else {
      const isLongBreak = cycles % settings.cyclesBeforeLongBreak === 0;
      const breakDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration;
      setTimeLeft(breakDuration * 60);
    }
  };
  
  const skipToNext = () => {
    setIsActive(false);
    if (mode === 'work') {
      // Skip to break
      const newCycles = cycles + 1;
      setCycles(newCycles);
      const isLongBreak = newCycles % settings.cyclesBeforeLongBreak === 0;
      const breakDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration;
      
      setMode('break');
      setTimeLeft(breakDuration * 60);
    } else {
      // Skip to work
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSeconds = mode === 'work' 
      ? settings.workDuration * 60 
      : (cycles % settings.cyclesBeforeLongBreak === 0 
        ? settings.longBreakDuration * 60 
        : settings.shortBreakDuration * 60);
    
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };
  
  const togglePomodoroTimer = () => {
    setShowTimer(!showTimer);
    if (!showTimer) {
      // Reset timer when opening
      if (!isActive) {
        if (mode === 'work') {
          setTimeLeft(settings.workDuration * 60);
        } else {
          const isLongBreak = cycles % settings.cyclesBeforeLongBreak === 0;
          const breakDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration;
          setTimeLeft(breakDuration * 60);
        }
      }
    }
  };
  
  // Update document title with timer
  useEffect(() => {
    if (isActive) {
      document.title = `(${formatTime(timeLeft)}) ${mode === 'work' ? 'Work' : 'Break'} - Habit Tracker`;
    } else {
      document.title = 'Habit Tracker';
    }
    
    return () => {
      document.title = 'Habit Tracker';
    };
  }, [timeLeft, isActive, mode]);
  
  return (
    <>
      <button
        onClick={togglePomodoroTimer}
        className="flex items-center justify-center p-2 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors border border-white relative"
        title="Pomodoro Timer"
      >
        <FaClock className="text-xl" />
        {isActive && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        )}
        <span className="ml-2 hidden md:inline text-black">Timer</span>
      </button>

      <AnimatePresence>
        {showTimer && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTimer(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Pomodoro Timer
                  </h2>
                  <button
                    onClick={() => setShowTimer(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="text-center">
                  {/* Mode indicator */}
                  <div className="mb-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                      mode === 'work' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {mode === 'work' ? 'Work Session' : cycles % settings.cyclesBeforeLongBreak === 0 ? 'Long Break' : 'Short Break'}
                    </span>
                  </div>
                  
                  {/* Timer display */}
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                      />
                      {/* Progress circle */}
                      <circle
                        className={`${mode === 'work' ? 'text-red-500' : 'text-green-500'}`}
                        strokeWidth="4"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - calculateProgress() / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-800 dark:text-white">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex justify-center space-x-4 mb-6">
                    <button
                      onClick={toggleTimer}
                      className={`p-3 rounded-full ${
                        isActive
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white transition-colors`}
                    >
                      {isActive ? <FaPause /> : <FaPlay />}
                    </button>
                    <button
                      onClick={resetTimer}
                      className="p-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                    >
                      <FaRedo />
                    </button>
                    <button
                      onClick={skipToNext}
                      className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    >
                      <FaCheck />
                    </button>
                  </div>
                  
                  {/* Stats */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Completed Cycles: {cycles}</p>
                    <p>Total Work Time: {Math.floor(cycles * settings.workDuration / 60)} hours {(cycles * settings.workDuration) % 60} minutes</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PomodoroTimer;
