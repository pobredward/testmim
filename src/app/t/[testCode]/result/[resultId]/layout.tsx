import type { Metadata } from "next";
import { getTestByCode } from "@/data/tests";
import { getTranslatedTestData } from "@/utils/testTranslations";
import { generateTestPageMetadata } from "@/utils/metadata";

type Props = {
  params: Promise<{ testCode: string; resultId: string }>
  children: React.ReactNode
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testCode } = await params;
  
  // 일단 한국어로 기본 설정
  const language = 'ko';
  
  // 테스트 데이터 가져오기
  const originalData = getTestByCode(testCode);
  if (!originalData) {
    return generateTestPageMetadata(null, language);
  }
  
  // 번역된 테스트 데이터 가져오기
  const translatedData = getTranslatedTestData(testCode, originalData, language);
  
  // 결과 페이지임을 표시하는 제목과 설명
  const resultMetadata = {
    ...translatedData,
    title: `${translatedData.title} 결과`,
    description: `${translatedData.description} 테스트 결과를 확인해보세요!`,
  };
  
  return generateTestPageMetadata(resultMetadata, language);
}

export default function TestResultLayout({ children }: Props) {
  return <>{children}</>;
} 