import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isWinterMode, setIsWinterMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('annaba_winter_mode') === 'true';
    setIsWinterMode(savedTheme);
    if (savedTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleWinterMode = () => {
    const newMode = !isWinterMode;
    setIsWinterMode(newMode);
    localStorage.setItem('annaba_winter_mode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ isWinterMode, toggleWinterMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
