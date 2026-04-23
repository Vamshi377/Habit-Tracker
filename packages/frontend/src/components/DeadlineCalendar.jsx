import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaPlus, FaTimes, FaTrash, FaEdit } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const DeadlineCalendar = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [deadlines, setDeadlines] = useState([]);
  const [newDeadline, setNewDeadline] = useState({ title: '', description: '', time: '12:00' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);

  // Load deadlines from localStorage on component mount
  useEffect(() => {
    try {
      const savedDeadlines = localStorage.getItem('habit-tracker-deadlines');
      if (savedDeadlines) {
        setDeadlines(JSON.parse(savedDeadlines));
        console.log('Loaded deadlines from localStorage:', JSON.parse(savedDeadlines));
      }
    } catch (error) {
      console.error('Error loading deadlines from localStorage:', error);
    }
  }, []);

  // Save deadlines to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('habit-tracker-deadlines', JSON.stringify(deadlines));
      console.log('Saved deadlines to localStorage:', deadlines);
    } catch (error) {
      console.error('Error saving deadlines to localStorage:', error);
    }
  }, [deadlines]);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    if (!showCalendar) {
      setSelectedDate(new Date());
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowAddForm(false);
    setEditingDeadline(null);
  };

  const handleAddDeadline = () => {
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }

    if (!newDeadline.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const deadlineDate = new Date(selectedDate);
    const [hours, minutes] = newDeadline.time.split(':').map(Number);
    deadlineDate.setHours(hours, minutes);

    const newDeadlineItem = {
      id: Date.now(),
      title: newDeadline.title,
      description: newDeadline.description,
      date: deadlineDate.toISOString(),
    };

    if (editingDeadline) {
      // Update existing deadline
      setDeadlines(
        deadlines.map((deadline) =>
          deadline.id === editingDeadline.id ? { ...newDeadlineItem, id: deadline.id } : deadline
        )
      );
      toast.success('Deadline updated successfully');
    } else {
      // Add new deadline
      setDeadlines([...deadlines, newDeadlineItem]);
      toast.success('Deadline added successfully');
    }

    setNewDeadline({ title: '', description: '', time: '12:00' });
    setShowAddForm(false);
    setEditingDeadline(null);
  };

  const handleDeleteDeadline = (id) => {
    setDeadlines(deadlines.filter((deadline) => deadline.id !== id));
    toast.success('Deadline deleted successfully');
  };

  const handleEditDeadline = (deadline) => {
    const deadlineDate = new Date(deadline.date);
    setSelectedDate(new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate()));
    setNewDeadline({
      title: deadline.title,
      description: deadline.description,
      time: `${String(deadlineDate.getHours()).padStart(2, '0')}:${String(deadlineDate.getMinutes()).padStart(2, '0')}`,
    });
    setEditingDeadline(deadline);
    setShowAddForm(true);
  };

  // Generate calendar days
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Total days in the month
    const daysInMonth = lastDay.getDate();
    
    // Calendar array with empty slots for days from previous month
    const calendar = Array(firstDayOfWeek).fill(null);
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(new Date(year, month, day));
    }
    
    return calendar;
  };

  // Check if a date has deadlines
  const hasDeadlines = (date) => {
    if (!date) return false;
    
    return deadlines.some((deadline) => {
      const deadlineDate = new Date(deadline.date);
      return (
        deadlineDate.getFullYear() === date.getFullYear() &&
        deadlineDate.getMonth() === date.getMonth() &&
        deadlineDate.getDate() === date.getDate()
      );
    });
  };

  // Get deadlines for a specific date
  const getDeadlinesForDate = (date) => {
    if (!date) return [];
    
    return deadlines.filter((deadline) => {
      const deadlineDate = new Date(deadline.date);
      return (
        deadlineDate.getFullYear() === date.getFullYear() &&
        deadlineDate.getMonth() === date.getMonth() &&
        deadlineDate.getDate() === date.getDate()
      );
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <>
      <button
        onClick={toggleCalendar}
        className="flex items-center justify-center p-2 rounded-full bg-primary hover:bg-primary-dark text-white transition-colors relative"
        title="Deadline Calendar"
      >
        <FaCalendarAlt className="text-xl" />
        {deadlines.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            {deadlines.length > 9 ? '9+' : deadlines.length}
          </span>
        )}
        <span className="ml-2 hidden md:inline text-black">Calendar</span>
      </button>

      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCalendar(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Calendar Section */}
                <div className="w-full md:w-7/12 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      Deadline Calendar
                    </h2>
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  {/* Month Navigation */}
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      &lt;
                    </button>
                    <h3 className="text-lg font-medium">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      &gt;
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Days of Week Headers */}
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="text-center font-medium text-gray-500 dark:text-gray-400 py-2"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Calendar Days */}
                    {generateCalendar().map((date, index) => (
                      <button
                        key={index}
                        onClick={() => date && handleDateClick(date)}
                        className={`aspect-square p-1 rounded-lg flex flex-col items-center justify-center relative
                          ${!date ? 'text-gray-300 dark:text-gray-600 cursor-default' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                          ${
                            selectedDate && date && 
                            selectedDate.getDate() === date.getDate() && 
                            selectedDate.getMonth() === date.getMonth() && 
                            selectedDate.getFullYear() === date.getFullYear()
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                              : ''
                          }
                        `}
                        disabled={!date}
                      >
                        {date && (
                          <>
                            <span className="text-sm">{date.getDate()}</span>
                            {hasDeadlines(date) && (
                              <span className="absolute bottom-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            )}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-5/12 p-4 overflow-y-auto max-h-96 md:max-h-[500px]">
                  {selectedDate && (
                    <>
                      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
                        {formatDate(selectedDate)}
                      </h3>

                      {/* Deadlines List */}
                      <div className="space-y-3 mb-4">
                        {getDeadlinesForDate(selectedDate).length > 0 ? (
                          getDeadlinesForDate(selectedDate).map((deadline) => (
                            <div
                              key={deadline.id}
                              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-800 dark:text-white">
                                  {deadline.title}
                                </h4>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditDeadline(deadline)}
                                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDeadline(deadline.id)}
                                    className="text-red-500 hover:text-red-600 dark:text-red-400"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {new Date(deadline.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {deadline.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  {deadline.description}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">
                            No deadlines for this date.
                          </p>
                        )}
                      </div>

                      {/* Add Deadline Button */}
                      {!showAddForm && (
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 dark:text-blue-400"
                        >
                          <FaPlus />
                          <span>Add Deadline</span>
                        </button>
                      )}

                      {/* Add/Edit Deadline Form */}
                      {showAddForm && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <h4 className="font-medium mb-3 text-gray-800 dark:text-white">
                            {editingDeadline ? 'Edit Deadline' : 'Add Deadline'}
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={newDeadline.title}
                                onChange={(e) => setNewDeadline({ ...newDeadline, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                placeholder="Enter deadline title"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Time
                              </label>
                              <input
                                type="time"
                                value={newDeadline.time}
                                onChange={(e) => setNewDeadline({ ...newDeadline, time: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description (Optional)
                              </label>
                              <textarea
                                value={newDeadline.description}
                                onChange={(e) => setNewDeadline({ ...newDeadline, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                                placeholder="Enter description"
                                rows="3"
                              ></textarea>
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                              <button
                                onClick={() => {
                                  setShowAddForm(false);
                                  setEditingDeadline(null);
                                  setNewDeadline({ title: '', description: '', time: '12:00' });
                                }}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAddDeadline}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                              >
                                {editingDeadline ? 'Update' : 'Add'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeadlineCalendar;
