"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import HomeClient from '@/app/HomeClient';

type Props = {
  params: Promise<{ locale: string }>
}

export default function LocalePage({ params }: Props) {
  const { i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    // params는 Promise이므로 직접 접근할 수 없음
    // URL에서 직접 locale을 추출
    const currentPath = window.location.pathname;
    const locale = currentPath.split('/')[1]; // /en, /zh, /ja에서 언어 추출
    
    // 지원되는 언어 목록
    const supportedLocales = ['en', 'zh', 'ja'];
    
    if (!supportedLocales.includes(locale)) {
      router.push('/');
      return;
    }
    
    // 언어 설정
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [i18n, router]);

  return <HomeClient />;
} 