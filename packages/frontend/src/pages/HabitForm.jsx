import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createHabit, getHabitById, updateHabit, reset } from '../features/habits/habitSlice';

const HabitForm = ({ isEditMode = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { habit, isLoading, isError, isSuccess, message } = useSelector((state) => state.habits);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    frequency: 'daily',
    customDays: [],
    timeOfDay: 'anytime',
    specificTime: '',
    reminderEnabled: false,
    reminderTime: '',
    difficulty: 'medium'
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const weekDays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];
  
  const difficultyOptions = [
    { value: 'easy', label: 'Easy (5 XP)', description: 'Simple habits that take minimal effort' },
    { value: 'medium', label: 'Medium (10 XP)', description: 'Moderately challenging habits' },
    { value: 'hard', label: 'Hard (15 XP)', description: 'Difficult habits requiring significant effort' }
  ];
  
  // Fetch habit data if in edit mode
  useEffect(() => {
    // Reset the form state at component mount
    dispatch(reset());
    
    if (isEditMode && id) {
      dispatch(getHabitById(id));
    }
    
    // Cleanup function to reset state when component unmounts
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id, isEditMode]);
  
  // Populate form when habit data is available in edit mode
  useEffect(() => {
    if (isEditMode && habit) {
      setFormData({
        title: habit.title || '',
        description: habit.description || '',
        category: habit.category || 'general',
        frequency: habit.frequency || 'daily',
        customDays: habit.customDays || [],
        timeOfDay: habit.timeOfDay || 'anytime',
        specificTime: habit.specificTime || '',
        reminderEnabled: habit.reminderEnabled || false,
        reminderTime: habit.reminderTime || '',
        difficulty: habit.difficulty || 'medium'
      });
    }
  }, [habit, isEditMode]);
  
  // Handle form success/error
  useEffect(() => {
    if (formSubmitted) {
      if (isSuccess) {
        toast.success(`Habit ${isEditMode ? 'updated' : 'created'} successfully`);
        navigate('/dashboard');
        setFormSubmitted(false);
      }
      
      if (isError) {
        toast.error(message || 'Something went wrong. Please try again.');
        setFormSubmitted(false);
      }
    }
  }, [isSuccess, isError, message, navigate, isEditMode, formSubmitted]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleCustomDayToggle = (day) => {
    setFormData(prev => {
      const newCustomDays = prev.customDays.includes(day)
        ? prev.customDays.filter(d => d !== day)
        : [...prev.customDays, day];
      
      return {
        ...prev,
        customDays: newCustomDays
      };
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      toast.error('Please enter a title for your habit');
      return;
    }
    
    if (formData.frequency === 'custom' && formData.customDays.length === 0) {
      toast.error('Please select at least one day for your custom frequency');
      return;
    }
    
    setFormSubmitted(true);
    
    if (isEditMode && id) {
      dispatch(updateHabit({ id, habitData: formData }));
    } else {
      dispatch(createHabit(formData));
    }
  };
  
  if (isLoading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {isEditMode ? 'Edit Habit' : 'Create New Habit'}
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Habit Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="E.g., Morning Run, Read 30 Minutes"
            required
          />
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add some details about your habit..."
          />
        </div>
        
        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">General</option>
            <option value="health">Health & Fitness</option>
            <option value="productivity">Productivity</option>
            <option value="learning">Learning</option>
            <option value="mindfulness">Mindfulness</option>
            <option value="social">Social</option>
            <option value="finance">Finance</option>
          </select>
        </div>
        
        {/* Frequency */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Frequency
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors
                  ${formData.frequency === 'daily' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
              <input
                type="radio"
                name="frequency"
                value="daily"
                checked={formData.frequency === 'daily'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-800 dark:text-white">Daily</span>
            </label>
            
            <label className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors
                  ${formData.frequency === 'weekly' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
              <input
                type="radio"
                name="frequency"
                value="weekly"
                checked={formData.frequency === 'weekly'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-800 dark:text-white">Weekly</span>
            </label>
            
            <label className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors
                  ${formData.frequency === 'custom' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
              <input
                type="radio"
                name="frequency"
                value="custom"
                checked={formData.frequency === 'custom'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-800 dark:text-white">Custom</span>
            </label>
          </div>
        </div>
        
        {/* Custom Days (if frequency is custom) */}
        {formData.frequency === 'custom' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Days
            </label>
            <div className="grid grid-cols-4 gap-2">
              {weekDays.map((day) => (
                <label 
                  key={day.value}
                  className={`flex items-center justify-center p-2 border rounded-md cursor-pointer text-sm ${
                    formData.customDays.includes(day.value) 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={day.value}
                    checked={formData.customDays.includes(day.value)}
                    onChange={() => handleCustomDayToggle(day.value)}
                    className="sr-only"
                  />
                  {day.label.slice(0, 3)}
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* Time of Day */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time of Day
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['morning', 'afternoon', 'evening', 'anytime'].map((time) => (
              <label 
                key={time}
                className={`flex items-center justify-center p-3 border rounded-md cursor-pointer ${
                  formData.timeOfDay === time 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="timeOfDay"
                  value={time}
                  checked={formData.timeOfDay === time}
                  onChange={handleChange}
                  className="sr-only"
                />
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </label>
            ))}
          </div>
        </div>
        
        {/* Reminder */}
        <div className="mb-4">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              name="reminderEnabled"
              checked={formData.reminderEnabled}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Reminders
            </span>
          </label>
          
          {formData.reminderEnabled && (
            <div className="mt-2">
              <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reminder Time
              </label>
              <input
                type="time"
                id="reminderTime"
                name="reminderTime"
                value={formData.reminderTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
        
        {/* Difficulty */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty (XP Reward)
          </label>
          <div className="space-y-2">
            {difficultyOptions.map((option) => (
              <label 
                key={option.value}
                className={`flex items-center p-3 border rounded-md cursor-pointer ${
                  formData.difficulty === option.value 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={option.value}
                  checked={formData.difficulty === option.value}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-800 dark:text-white">
                    {option.label}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {option.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                Saving...
              </span>
            ) : isEditMode ? 'Update Habit' : 'Create Habit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;