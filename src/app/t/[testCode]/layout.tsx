import type { Metadata } from "next";
import { getTestByCode } from "@/data/tests";
import { generateTestPageMetadata } from "@/utils/metadata";

type Props = {
  children: React.ReactNode;
  params: Promise<{ testCode: string }>;
};

// 서버 사이드에서 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ testCode: string }> }): Promise<Metadata> {
  const { testCode } = await params;
  
  try {
    const testData = getTestByCode(testCode);
    
    if (!testData) {
      return {
        title: "테스트를 찾을 수 없습니다 | 테스트밈",
        description: "요청하신 테스트를 찾을 수 없습니다. 다른 재미있는 테스트들을 테스트밈에서 만나보세요!",
        robots: { index: false, follow: false }
      };
    }

    // 기본 한국어 메타데이터 생성
    return generateTestPageMetadata(testData, 'ko');
  } catch (error) {
    console.error("메타데이터 생성 오류:", error);
    return {
      title: "테스트밈 - 무료 심리테스트",
      description: "다양한 심리테스트와 성향테스트를 무료로 즐겨보세요!"
    };
  }
}

export default async function TestLayout({ children, params }: Props) {
  const { testCode } = await params;
  const testData = getTestByCode(testCode);

  // 구조화된 데이터 생성
  const jsonLd = testData ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": testData.title,
    "description": testData.description,
    "url": `https://www.testmim.com/t/${testCode}`,
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "테스트밈"
    },
    "publisher": {
      "@type": "Organization",
      "name": "테스트밈",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.testmim.com/android-chrome-512x512.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.testmim.com/t/${testCode}`
    },
    "keywords": testData.tags?.join(", ") || "",
    "genre": testData.category || "심리테스트",
    "articleSection": "테스트",
    "inLanguage": "ko-KR",
    "isAccessibleForFree": true,
    "audience": {
      "@type": "Audience",
      "audienceType": "General Public"
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}
      {children}
    </>
  );
} 