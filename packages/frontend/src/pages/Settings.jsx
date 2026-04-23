import React from 'react';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { FaCog, FaMoon, FaSun, FaBell } from 'react-icons/fa';

const Settings = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  
  const [settings, setSettings] = useState({
    theme: user?.settings?.theme || 'light',
    notificationsEnabled: user?.settings?.notificationsEnabled !== false,
    emailNotifications: user?.settings?.emailNotifications !== false,
    pushNotifications: user?.settings?.pushNotifications !== false,
    reminderTime: user?.settings?.reminderTime || '20:00'
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };
  
  const handleSave = async () => {
    try {
      await dispatch(updateSettings(settings)).unwrap();
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error || 'Failed to update settings');
    }
  };
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Customize your experience
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Appearance Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
            <FaCog className="mr-2 text-gray-500 dark:text-gray-400" />
            Appearance
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  settings.theme === 'light'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <FaSun className="mr-2" /> Light
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  settings.theme === 'dark'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <FaMoon className="mr-2" /> Dark
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`flex items-center px-4 py-2 rounded-md ${
                  settings.theme === 'system'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                System Default
              </button>
            </div>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
            <FaBell className="mr-2 text-gray-500 dark:text-gray-400" />
            Notifications
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-white">Enable Notifications</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive all notifications about your habits and achievements</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="notificationsEnabled"
                    checked={settings.notificationsEnabled}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-10 h-5 rounded-full transition-colors ${
                    settings.notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.notificationsEnabled ? 'transform translate-x-5' : ''
                  }`}></div>
                </div>
              </label>
            </div>
            
            {settings.notificationsEnabled && (
              <>
                <div className="flex items-center justify-between pl-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">Email Notifications</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={settings.emailNotifications}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-10 h-5 rounded-full transition-colors ${
                        settings.emailNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}></div>
                      <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.emailNotifications ? 'transform translate-x-5' : ''
                      }`}></div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between pl-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">Push Notifications</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive browser push notifications</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={settings.pushNotifications}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-10 h-5 rounded-full transition-colors ${
                        settings.pushNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}></div>
                      <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        settings.pushNotifications ? 'transform translate-x-5' : ''
                      }`}></div>
                    </div>
                  </label>
                </div>
                
                <div className="pl-4">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-1">Default Reminder Time</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Set a default time for daily reminders</p>
                  <input
                    type="time"
                    name="reminderTime"
                    value={settings.reminderTime}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Save Button */}
        <div className="p-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Settings;