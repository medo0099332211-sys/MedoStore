import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';
import { translations } from '@/constants/translations';

interface LanguageContextType {
  lang: Language;
  t: typeof translations.ar;
  toggleLang: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  t: translations.ar,
  toggleLang: () => {},
  isRTL: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('medo_lang') as Language) || 'ar';
  });

  const isRTL = lang === 'ar';
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.title = lang === 'ar' ? 'متجر ميدو - MEDO STORE' : 'MEDO STORE - متجر ميدو';
    localStorage.setItem('medo_lang', lang);
  }, [lang, isRTL]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
