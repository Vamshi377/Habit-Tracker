import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaCheck, FaEllipsisH, FaPencilAlt, FaTrash, FaChartBar } from 'react-icons/fa';
import { completeHabit, deleteHabit } from '../features/habits/habitSlice';
import { getCurrentUser } from '../features/auth/authSlice';

const HabitCard = ({ habit }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const isCompletedToday = habit.completionHistory?.some(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime() && entry.completed;
  });
  
  const handleComplete = async () => {
    if (isCompletedToday) {
      toast.info('You have already completed this habit today!');
      return;
    }
    
    setIsCompleting(true);
    try {
      const result = await dispatch(completeHabit(habit._id)).unwrap();
      toast.success(`+${result.xpGained} XP! Habit completed 🎉`);
      
      dispatch(getCurrentUser());
    } catch (error) {
      toast.error(error || 'Failed to complete habit');
    } finally {
      setIsCompleting(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await dispatch(deleteHabit(habit._id)).unwrap();
        toast.success('Habit deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete habit');
      }
    }
    setShowMenu(false);
  };
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative">
      {/* Habit header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800 dark:text-white text-lg">{habit.title}</h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full"
          >
            <FaEllipsisH />
          </button>
          
          {/* Action menu */}
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 z-10">
              <Link
                to={`/habits/${habit._id}`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => setShowMenu(false)}
              >
                <FaChartBar className="mr-2" />
                View Details
              </Link>
              <Link
                to={`/habits/${habit._id}/edit`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => setShowMenu(false)}
              >
                <FaPencilAlt className="mr-2" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Habit description */}
      {habit.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {habit.description}
        </p>
      )}
      
      {/* Habit details */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(habit.difficulty)}`}>
            {habit.difficulty.charAt(0).toUpperCase() + habit.difficulty.slice(1)} • {habit.xpReward} XP
          </span>
          
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            {habit.frequency === 'custom' 
              ? habit.customDays?.map(day => day.substr(0, 3)).join(', ')
              : habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
          </span>
          
          {habit.streak > 0 && (
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
              {habit.streak} day streak 🔥
            </span>
          )}
        </div>
      </div>
      
      {/* Complete button */}
      <button
        onClick={handleComplete}
        disabled={isCompleting || isCompletedToday}
        className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-colors ${
          isCompletedToday
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 cursor-default'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isCompletedToday ? (
          <>
            <FaCheck className="mr-2" /> Completed Today
          </>
        ) : isCompleting ? (
          <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
        ) : (
          <>
            <FaCheck className="mr-2" /> Complete
          </>
        )}
      </button>
    </div>
  );
};

export default HabitCard;