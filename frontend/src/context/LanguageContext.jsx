import React, { createContext, useState, useContext, useEffect } from 'react';
import mr from '../translations/mr.json';
import hi from '../translations/hi.json';
import en from '../translations/en.json';

const translations = { mr, hi, en };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Marathi (mr) is the default language requirement
  const [lang, setLang] = useState(() => localStorage.getItem('shetsathi_lang') || 'mr');

  useEffect(() => {
    localStorage.setItem('shetsathi_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['mr']?.[key] || key;
  };

  const changeLanguage = (newLang) => {
    if (['mr', 'hi', 'en'].includes(newLang)) {
      setLang(newLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
