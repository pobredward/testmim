"use client";

import { useTranslation } from 'react-i18next';
import { getTestTranslation } from '@/utils/testTranslations';

export function useTestTranslation(testCode: string) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  
  const getTranslation = (path: string) => {
    return getTestTranslation(testCode, path, currentLang);
  };

  return {
    getTranslation,
    currentLanguage: currentLang,
  };
} 