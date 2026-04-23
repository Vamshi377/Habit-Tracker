// Notification service for handling browser notifications

import { showNotification, playNotificationSound } from './notificationHelper';

// Check if browser supports notifications
export const checkNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return false;
};

// Send browser notification
export const sendNotification = (title, body, options = {}) => {
  // Show a popup toast notification
  showNotification({
    title: title,
    message: body,
    type: options.type || 'reminder'
  });
  
  // Always play notification sound when sending notification
  playNotificationSound();
  
  // If browser notifications are supported and permission granted, show browser notification too
  if ("Notification" in window && Notification.permission === "granted") {
    const notification = new Notification(title, {
      body,
      icon: '/assets/logo.png', // Assuming you have a logo
      ...options
    });
    
    notification.onclick = function() {
      window.focus();
      this.close();
    };
  }
};

// Schedule notifications for habits
export const scheduleHabitReminders = (habits) => {
  // Clear any existing timers to avoid duplicates
  if (window.habitReminderTimers) {
    window.habitReminderTimers.forEach(timer => clearTimeout(timer));
  }
  
  // Initialize new array for timers
  window.habitReminderTimers = [];
  
  if (!habits || !habits.length) return;
  
  // Check if reminders are enabled at all
  const userSettings = JSON.parse(localStorage.getItem('user'))?.settings;
  if (userSettings && !userSettings.notificationsEnabled) {
    return;
  }
  
  // Schedule each habit's reminder
  habits.forEach(habit => {
    if (!habit.reminderEnabled || !habit.reminderTime) return;
    
    // Check if habit needs to be done today based on frequency
    const shouldRemindToday = checkIfHabitDueToday(habit);
    if (!shouldRemindToday) return;
    
    // Check if habit is already completed today
    const isCompletedToday = checkIfCompletedToday(habit);
    if (isCompletedToday) return;
    
    // Convert reminderTime to today's date at that time
    const [hours, minutes] = habit.reminderTime.split(':');
    const reminderDateTime = new Date();
    reminderDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    
    // MODIFIED: If the time has already passed today, log it and don't schedule
    if (reminderDateTime < new Date()) {
      console.log(`Reminder time ${habit.reminderTime} for "${habit.title}" has already passed today`);
      return;
    }
    
    // Log the scheduled notification
    const timeUntilReminder = reminderDateTime.getTime() - new Date().getTime();
    console.log(`Scheduling notification for "${habit.title}" in ${Math.round(timeUntilReminder/1000/60)} minutes`);
    
    // Schedule notification
    const timerId = setTimeout(() => {
      console.log(`Sending notification for habit: ${habit.title}`);
      sendNotification(`Time for your habit: ${habit.title}`, habit.description || 'Complete this habit now to stay on track!', {
        onClick: function() {
          window.focus();
          // Change this to always navigate to dashboard
          window.location.href = "/dashboard";
        }
      });
      
      // Add this: Create a notification in the database
      createDatabaseNotification({
        title: `Time for your habit: ${habit.title}`,
        message: habit.description || 'Complete this habit now to stay on track!',
        type: 'reminder',
        habitId: habit._id
      });
    }, timeUntilReminder);
    
    window.habitReminderTimers.push(timerId);
  });
};

// Helper function to check if habit is due today based on frequency
const checkIfHabitDueToday = (habit) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  
  if (habit.frequency === 'daily') {
    return true;
  }
  
  if (habit.frequency === 'custom' && habit.customDays) {
    return habit.customDays.includes(daysMap[dayOfWeek]);
  }
  
  return false;
};

// Helper function to check if habit is already completed today
const checkIfCompletedToday = (habit) => {
  if (!habit.completionHistory || !habit.completionHistory.length) {
    return false;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return habit.completionHistory.some(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime() && entry.completed;
  });
};

// Update the createDatabaseNotification function with proper actionUrl

const createDatabaseNotification = async (notificationData) => {
  try {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) return;

    const API_URL = import.meta.env.VITE_BACKEND_URL || '';
    
    // Create the notification in the database with proper actionUrl for dashboard navigation
    await fetch(`${API_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        ...notificationData,
        actionUrl: '/dashboard', // Set to navigate to dashboard
        actionText: 'View Habit' // Text for the action link
      })
    });
    
    console.log('Database notification created for habit reminder');
  } catch (error) {
    console.error('Error creating database notification:', error);
  }
};