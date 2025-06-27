"use client";

import { ReactNode, useEffect, useState } from 'react';
import i18n, { detectBrowserLanguage } from '@/i18n';

interface I18nProviderProps {
  children: ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    // i18n 초기화 완료 후 언어 설정
    const initializeI18n = async () => {
      try {
        // i18n이 이미 초기화되어 있는지 확인
        if (!i18n.isInitialized) {
          await i18n.init();
        }
        
        // 클라이언트에서 언어 설정
        const clientLanguage = detectBrowserLanguage();
        if (i18n.language !== clientLanguage) {
          await i18n.changeLanguage(clientLanguage);
        }
        
        setIsI18nReady(true);
      } catch (error) {
        console.error('i18n initialization failed:', error);
        // 에러가 발생해도 렌더링은 계속
        setIsI18nReady(true);
      }
    };

    initializeI18n();
  }, []);

  // i18n이 준비될 때까지 로딩 상태 또는 기본 렌더링
  if (!isI18nReady) {
    return <>{children}</>;
  }

  return <>{children}</>;
} 