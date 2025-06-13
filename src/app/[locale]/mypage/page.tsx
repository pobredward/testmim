"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Props = {
  params: Promise<{ locale: string }>
}

export default function LocaleMyPage({ params }: Props) {
  const { i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    // URL에서 직접 locale을 추출
    const currentPath = window.location.pathname;
    const locale = currentPath.split('/')[1]; // /en/mypage에서 en 추출
    
    // 지원되는 언어 목록
    const supportedLocales = ['en', 'zh', 'ja'];
    
    if (!supportedLocales.includes(locale)) {
      router.push('/mypage');
      return;
    }
    
    // 언어 설정 후 메인 mypage로 리다이렉트
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
    
    // URL을 메인 mypage로 변경하되 언어는 유지
    router.replace('/mypage');
  }, [i18n, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">
      Loading...
    </div>
  );
} 