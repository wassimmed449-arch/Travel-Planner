import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');
  const [direction, setDirection] = useState('rtl');

  useEffect(() => {
    const savedLang = localStorage.getItem('annaba_language') || 'ar';
    setLanguage(savedLang);
    setDirection(savedLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'fr' : 'ar';
    const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
    setLanguage(newLang);
    setDirection(newDir);
    localStorage.setItem('annaba_language', newLang);
    document.documentElement.setAttribute('dir', newDir);
    document.documentElement.setAttribute('lang', newLang);
  };

  const t = (text) => {
    if (typeof text === 'object' && text !== null) {
      return text[language] || text['ar'] || '';
    }
    return text || '';
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
