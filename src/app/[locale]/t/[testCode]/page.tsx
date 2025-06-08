"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type Props = {
  params: { locale: string; testCode: string }
}

export default function LocaleTestPage({ params }: Props) {
  const { locale, testCode } = params;
  const { i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    // 지원되는 언어 목록
    const supportedLocales = ['en', 'zh', 'ja'];
    
    if (!supportedLocales.includes(locale)) {
      router.push(`/t/${testCode}`);
      return;
    }
    
    // 언어 설정 후 메인 테스트 페이지로 리다이렉트
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
    
    // URL을 메인 테스트 페이지로 변경하되 언어는 유지
    router.replace(`/t/${testCode}`);
  }, [locale, testCode, i18n, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">
      Loading...
    </div>
  );
} 