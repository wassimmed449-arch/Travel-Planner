import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// V3.0 - TRILINGUAL SUPPORT (Arabic, French, English)
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');
  const [direction, setDirection] = useState('rtl');

  useEffect(() => {
    const savedLang = localStorage.getItem('annaba_language_v3') || 'ar';
    setLanguage(savedLang);
    setDirection(savedLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', savedLang);
  }, []);

  const changeLanguage = (newLang) => {
    const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
    setLanguage(newLang);
    setDirection(newDir);
    localStorage.setItem('annaba_language_v3', newLang);
    document.documentElement.setAttribute('dir', newDir);
    document.documentElement.setAttribute('lang', newLang);
  };

  // Cycle through languages: ar -> fr -> en -> ar
  const toggleLanguage = () => {
    const langCycle = { ar: 'fr', fr: 'en', en: 'ar' };
    const newLang = langCycle[language];
    changeLanguage(newLang);
  };

  const t = (text) => {
    if (typeof text === 'object' && text !== null) {
      return text[language] || text['ar'] || text['en'] || '';
    }
    return text || '';
  };

  const getLanguageName = () => {
    const names = {
      ar: 'العربية',
      fr: 'Français',
      en: 'English'
    };
    return names[language];
  };

  const getLanguageFlag = () => {
    const flags = {
      ar: '🇩🇿',
      fr: '🇫🇷',
      en: '🇬🇧'
    };
    return flags[language];
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      direction, 
      toggleLanguage, 
      changeLanguage,
      t,
      getLanguageName,
      getLanguageFlag
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
