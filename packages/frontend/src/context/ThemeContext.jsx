import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../features/auth/authSlice';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Initialize theme from user settings or localStorage or system preference
  const initializeTheme = () => {
    // Check if user has saved preference
    if (user?.settings?.theme) {
      return user.settings.theme;
    }
    
    // Check localStorage
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      return storedDarkMode === 'true' ? 'dark' : 'light';
    }
    
    // Fall back to system preference
    return 'system';
  };
  
  const [theme, setTheme] = useState(initializeTheme);
  
  // Function to check if dark mode should be active
  const isDarkActive = () => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  
  // Apply theme to HTML element
  useEffect(() => {
    if (isDarkActive()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Listen for system preference changes if in system mode
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  
  // Sync theme when user changes
  useEffect(() => {
    if (user?.settings?.theme && user.settings.theme !== theme) {
      setTheme(user.settings.theme);
    }
  }, [user]);
  
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    
    // Save to localStorage based on theme
    if (newTheme === 'dark') {
      localStorage.setItem('darkMode', 'true');
    } else if (newTheme === 'light') {
      localStorage.setItem('darkMode', 'false');
    } else if (newTheme === 'system') {
      localStorage.removeItem('darkMode');
    }
    
    // Save to user settings if logged in
    if (user) {
      dispatch(updateSettings({
        ...user.settings,
        theme: newTheme
      }));
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme, changeTheme, isDarkMode: isDarkActive() }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);