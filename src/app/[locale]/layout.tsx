import type { Metadata } from "next";
import { generateMainPageMetadata } from "@/utils/metadata";
import { redirect } from "next/navigation";

type Props = {
  params: { locale: string }
  children: React.ReactNode
}

// 지원되는 언어 목록
const supportedLocales = ['en', 'zh', 'ja'];

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  
  // 지원되지 않는 언어면 한국어로 기본 설정
  if (!supportedLocales.includes(locale)) {
    return generateMainPageMetadata('ko');
  }
  
  return generateMainPageMetadata(locale);
}

export default function LocaleLayout({ children, params }: Props) {
  const { locale } = params;
  
  // 지원되지 않는 언어면 메인 페이지로 리다이렉트
  if (!supportedLocales.includes(locale)) {
    redirect('/');
  }
  
  return <>{children}</>;
} 