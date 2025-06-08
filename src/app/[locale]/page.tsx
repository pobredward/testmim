"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import HomeClient from '@/app/HomeClient';

type Props = {
  params: { locale: string }
}

export default function LocalePage({ params }: Props) {
  const { locale } = params;
  const { i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
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
  }, [locale, i18n, router]);

  return <HomeClient />;
} 