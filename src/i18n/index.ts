import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import koTranslation from './locales/ko.json';
import enTranslation from './locales/en.json';
import zhTranslation from './locales/zh.json';
import jaTranslation from './locales/ja.json';

const resources = {
  ko: {
    translation: koTranslation,
  },
  en: {
    translation: enTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
};

// 브라우저 언어 감지 함수 (클라이언트에서만 실행)
export const detectBrowserLanguage = (): string => {
  if (typeof window === 'undefined') return 'ko';
  
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && ['ko', 'en', 'zh', 'ja'].includes(savedLanguage)) {
    return savedLanguage;
  }
  
  // 브라우저 언어 감지
  const browserLang = navigator.language || navigator.languages?.[0] || 'ko';
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // 지원하는 언어인지 확인
  const supportedLanguages = ['ko', 'en', 'zh', 'ja'];
  return supportedLanguages.includes(langCode) ? langCode : 'ko';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko', // 서버에서는 항상 기본 언어 사용
    fallbackLng: 'ko',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 