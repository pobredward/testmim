import type { Metadata } from "next";
import { getTestByCode } from "@/data/tests";
import { getTranslatedTestData } from "@/utils/testTranslations";
import { generateTestPageMetadata } from "@/utils/metadata";

type Props = {
  params: { locale: string; testCode: string }
  children: React.ReactNode
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, testCode } = params;
  
  // 지원되는 언어 목록
  const supportedLocales = ['en', 'zh', 'ja'];
  const language = supportedLocales.includes(locale) ? locale : 'ko';
  
  // 테스트 데이터 가져오기
  const originalData = getTestByCode(testCode);
  if (!originalData) {
    return generateTestPageMetadata(null, language);
  }
  
  // 번역된 테스트 데이터 가져오기
  const translatedData = getTranslatedTestData(testCode, originalData, language);
  
  return generateTestPageMetadata(translatedData, language);
}

export default function TestLocaleLayout({ children }: Props) {
  return <>{children}</>;
} 