import type { Metadata } from "next";
import { getTestByCode } from "@/data/tests";
import { getTranslatedTestData } from "@/utils/testTranslations";
import { generateTestPageMetadata } from "@/utils/metadata";

type Props = {
  params: { testCode: string }
  children: React.ReactNode
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testCode } = params;
  
  // 일단 한국어로 기본 설정 (클라이언트에서 언어 변경 시 동적으로 반영)
  const language = 'ko';
  
  // 테스트 데이터 가져오기
  const originalData = getTestByCode(testCode);
  if (!originalData) {
    return generateTestPageMetadata(null, language);
  }
  
  // 번역된 테스트 데이터 가져오기
  const translatedData = getTranslatedTestData(testCode, originalData, language);
  
  return generateTestPageMetadata(translatedData, language);
}

export default function TestLayout({ children }: Props) {
  return <>{children}</>;
} 