import Link from "next/link";
import { getTestByCode } from "@/data/tests";
import { getTranslatedTestData } from "@/utils/testTranslations";
import { generateTestPageMetadata } from "@/utils/metadata";
import type { TestResult, TestAnswer } from "@/types/tests";
import type { Metadata } from "next";
import TestDetailClient from "./TestDetailClient";

// 클라이언트용 결과 타입 (condition 함수 제외)
export type ClientTestResult = Omit<TestResult, 'condition'>;

// 클라이언트로 전달할 테스트 메타데이터 타입 (함수 제외)
export type TestMeta = {
  code: string;
  docId: string;
  title: string;
  description: string;
  bgGradient: string;
  mainColor: string;
  icon: string;
  thumbnailUrl: string;
  tags: string[];
  seoKeywords?: string;
  views: number;
  likes: number;
  scraps: number;
  category: string;
  results: ClientTestResult[];
  [key: string]: any;
};

// 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ testCode: string }> }): Promise<Metadata> {
  const { testCode } = await params;
  const originalData = getTestByCode(testCode);
  
  if (!originalData) {
    return generateTestPageMetadata(null, 'ko');
  }
  
  // 번역된 테스트 데이터 가져오기 (한국어)
  const translatedData = getTranslatedTestData(testCode, originalData, 'ko');
  
  return generateTestPageMetadata(translatedData, 'ko');
}

export default async function TestDetailPage({ params }: { params: Promise<{ testCode: string }> }) {
  const { testCode } = await params;
  const fullTestData = getTestByCode(testCode);

  if (!fullTestData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">
        테스트를 찾을 수 없습니다.
      </div>
    );
  }

  // 클라이언트로 전달할 데이터에서 모든 함수 제거
  const testData: TestMeta = {
    code: fullTestData.code,
    docId: fullTestData.docId,
    title: fullTestData.title,
    description: fullTestData.description,
    bgGradient: fullTestData.bgGradient,
    mainColor: fullTestData.mainColor,
    icon: fullTestData.icon,
    thumbnailUrl: fullTestData.thumbnailUrl,
    tags: fullTestData.tags,
    seoKeywords: fullTestData.seoKeywords,
    views: fullTestData.views,
    likes: fullTestData.likes,
    scraps: fullTestData.scraps,
    category: fullTestData.category,
    // results에서 condition 함수 제거
    results: fullTestData.results.map((result: TestResult) => {
      const { condition, ...resultWithoutCondition } = result;
      return resultWithoutCondition;
    }),
  };

  // JSON-LD 구조화된 데이터
  const testJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": testData.title,
    "description": testData.description,
    "image": testData.thumbnailUrl ? `https://www.testmim.com${testData.thumbnailUrl}` : "https://www.testmim.com/og-image.png",
    "url": `https://www.testmim.com/detail/${testData.code}`,
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
      "@id": `https://www.testmim.com/detail/${testData.code}`
    },
    "keywords": testData.tags.join(", "),
    "genre": testData.category,
    "about": testData.tags.map(tag => ({
      "@type": "Thing",
      "name": tag
    }))
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://www.testmim.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": testData.title,
        "item": `https://www.testmim.com/detail/${testData.code}`
      }
    ]
  };

  return (
    <>
      {/* JSON-LD 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(testJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      
      <TestDetailClient testData={testData} />
    </>
  );
} 