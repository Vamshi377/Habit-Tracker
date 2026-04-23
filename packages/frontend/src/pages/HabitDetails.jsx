import React from 'react';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getHabitById, deleteHabit, completeHabit } from '../features/habits/habitSlice';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, 
  FaPencilAlt, 
  FaTrash, 
  FaCheck, 
  FaCalendarAlt,
  FaFire
} from 'react-icons/fa';

const HabitDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { habit, isLoading, isError } = useSelector((state) => state.habits);
  
  const [isCompleting, setIsCompleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  useEffect(() => {
    dispatch(getHabitById(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if (isError) {
      toast.error('Could not load habit details');
      navigate('/dashboard');
    }
  }, [isError, navigate]);
  
  // Check if habit is completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const isCompletedToday = habit?.completionHistory?.some(entry => {
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
    } catch (error) {
      toast.error(error || 'Failed to complete habit');
    } finally {
      setIsCompleting(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      await dispatch(deleteHabit(habit._id)).unwrap();
      toast.success('Habit deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error || 'Failed to delete habit');
    }
  };
  
  // Format completion data for last 30 days
  const formatCompletionData = () => {
    if (!habit) return [];
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const dateArray = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const day = new Date(currentDate);
      day.setHours(0, 0, 0, 0);
      
      const entry = habit.completionHistory?.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === day.getTime();
      });
      
      dateArray.push({
        date: new Date(currentDate),
        completed: entry ? entry.completed : false
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dateArray;
  };
  
  const completionData = formatCompletionData();
  
  if (isLoading || !habit) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link 
            to="/dashboard"
            className="mr-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{habit.title}</h1>
        </div>
        
        <div className="flex space-x-2">
          <Link 
            to={`/habits/${habit._id}/edit`}
            className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50"
            title="Edit Habit"
          >
            <FaPencilAlt />
          </Link>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50"
            title="Delete Habit"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Habit details card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            {/* Habit description */}
            {habit.description && (
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Description</h2>
                <p className="text-gray-600 dark:text-gray-300">{habit.description}</p>
              </div>
            )}
            
            {/* Habit details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Details</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-300 w-24">Category:</span>
                    <span className="text-gray-800 dark:text-white font-medium">{habit.category || 'General'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-300 w-24">Frequency:</span>
                    <span className="text-gray-800 dark:text-white font-medium">{habit.frequency || 'Daily'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-300 w-24">Created:</span>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {new Date(habit.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Progress</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-300 w-24">Current streak:</span>
                    <span className="flex items-center text-gray-800 dark:text-white font-medium">
                      {habit.currentStreak || 0}
                      <FaFire className="ml-1 text-orange-500" />
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-300 w-24">Best streak:</span>
                    <span className="flex items-center text-gray-800 dark:text-white font-medium">
                      {habit.longestStreak || 0}
                      <FaFire className="ml-1 text-orange-500" />
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-300 w-24">Completions:</span>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {habit.completionHistory?.filter(entry => entry.completed).length || 0} times
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Complete habit button */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleComplete}
                disabled={isCompletedToday || isCompleting}
                className={`w-full py-3 px-4 rounded-md flex items-center justify-center font-medium transition
                  ${isCompletedToday ? 
                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 cursor-not-allowed' : 
                    'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                {isCompleting ? (
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : isCompletedToday ? (
                  <>
                    <FaCheck className="mr-2" />
                    Completed Today
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Mark as Complete
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Calendar view */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-600 dark:text-blue-400" />
                Completion History
              </h2>
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {completionData.map((day, index) => {
                const date = day.date;
                const isToday = date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-md flex items-center justify-center text-xs
                      ${day.completed ? 
                        'bg-green-500 text-white' : 
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'} 
                      ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 flex items-center text-sm">
              <span className="flex items-center mr-4">
                <span className="h-3 w-3 bg-green-500 rounded-sm mr-1"></span>
                <span className="text-gray-600 dark:text-gray-300">Completed</span>
              </span>
              <span className="flex items-center">
                <span className="h-3 w-3 bg-gray-100 dark:bg-gray-700 rounded-sm mr-1"></span>
                <span className="text-gray-600 dark:text-gray-300">Missed</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Stats card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Stats</h2>
            
            <div className="space-y-4">
              {/* Completion rate */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {habit.completionHistory?.length > 0 
                      ? Math.round((habit.completionHistory.filter(entry => entry.completed).length / habit.completionHistory.length) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${habit.completionHistory?.length > 0 
                      ? Math.round((habit.completionHistory.filter(entry => entry.completed).length / habit.completionHistory.length) * 100)
                      : 0}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Weekly consistency */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300">This Week</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {completionData.slice(-7).filter(day => day.completed).length}/7
                  </span>
                </div>
                <div className="flex space-x-1">
                  {completionData.slice(-7).map((day, idx) => (
                    <div
                      key={idx}
                      className={`h-2 flex-1 rounded-full ${day.completed ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Reminders */}
          {habit.reminders?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Reminders</h2>
              <div className="space-y-2">
                {habit.reminders.map((reminder, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                    <span className="text-gray-800 dark:text-white">{reminder.time}</span>
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{reminder.days.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Delete Habit</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this habit? This action cannot be undone and all progress data will be lost.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitDetails;