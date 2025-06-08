"use client";

import { ReactNode, useEffect, useState } from 'react';
import i18n, { detectBrowserLanguage } from '@/i18n';

interface I18nProviderProps {
  children: ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 클라이언트에서 hydration 완료 후 언어 설정
    const clientLanguage = detectBrowserLanguage();
    if (i18n.language !== clientLanguage) {
      i18n.changeLanguage(clientLanguage);
    }
    setIsHydrated(true);
  }, []);

  // 하이드레이션이 완료될 때까지 기본 언어로 렌더링
  return <>{children}</>;
} 