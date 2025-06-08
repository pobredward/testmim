'use client'

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";

import { getTestByCode } from "@/data/tests";
import type { TestResult, TestAnswer } from "@/types/tests";
import type { Metadata } from "next";

// 공통 테스트 데이터 타입 정의
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
  results: TestResult[];
  calculateResult: (answers: TestAnswer[]) => TestResult;
  [key: string]: any;
};

// 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ testCode: string }> }): Promise<Metadata> {
  const { testCode } = await params;
  const TEST_DATA = getTestByCode(testCode) as TestMeta | null;
  
  if (!TEST_DATA) {
    return {
      title: "존재하지 않는 테스트",
      description: "요청하신 테스트를 찾을 수 없습니다.",
    };
  }
  
  const seoTitle = `${TEST_DATA.title} | ${TEST_DATA.tags.join(", ")} 테스트`;
  const seoDescription = `${TEST_DATA.description} 지금 바로 무료로 ${TEST_DATA.tags.join(", ")} 테스트를 해보세요! 테스트밈에서 제공하는 인기 심리테스트입니다.`;
  const seoKeywords = TEST_DATA.seoKeywords ? TEST_DATA.seoKeywords : `${TEST_DATA.tags.join(", ")}, 테스트, 무료테스트, 심리테스트, 성향테스트, testmim, 테스트밈`;
  const seoUrl = `https://www.testmim.com/detail/${TEST_DATA.code}`;
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords.split(", "),
    
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: seoUrl,
      type: "article",
      images: [
        {
          url: TEST_DATA.thumbnailUrl ? `https://www.testmim.com${TEST_DATA.thumbnailUrl}` : "https://www.testmim.com/og-image.png",
          width: 1200,
          height: 630,
          alt: TEST_DATA.title,
        },
      ],
      siteName: "테스트밈",
      locale: "ko_KR",
    },
    
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [TEST_DATA.thumbnailUrl ? `https://www.testmim.com${TEST_DATA.thumbnailUrl}` : "https://www.testmim.com/og-image.png"],
    },
    
    alternates: {
      canonical: seoUrl,
    },
    
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TestDetailPage({ params }: { params: Promise<{ testCode: string }> }) {
  const [views, setViews] = useState(0);
  const [isImgError, setIsImgError] = useState(false);
  const [testData, setTestData] = useState<TestMeta | null>(null);

  useEffect(() => {
    async function initializeTest() {
      const { testCode } = await params;
      const TEST_DATA = getTestByCode(testCode) as TestMeta | null;
      setTestData(TEST_DATA);
    }
    initializeTest();
  }, [params]);

  // 숫자 포맷팅 함수
  const formatViews = (views: number): string => {
    if (views >= 10000) {
      return `${(views / 10000).toFixed(1)}만명`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}천명`;
    } else {
      return `${views}명`;
    }
  };

  const hasIncreased = useRef(false);
  useEffect(() => {
    async function fetchStats() {
      if (!testData) return;
      const ref = doc(db, "testStats", testData.docId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setViews(data.views ?? 0);
      } else {
        // 문서가 없으면 0으로 생성
        await setDoc(ref, { views: 0, likes: 0, scraps: 0 });
        setViews(0);
      }
    }
    fetchStats();
  }, [testData]);

  // 페이지 진입 시 조회수 증가 (mount 시 1회만)
  useEffect(() => {
    if (!testData || hasIncreased.current) return;
    hasIncreased.current = true;
    const ref = doc(db, "testStats", testData.docId);
    updateDoc(ref, { views: increment(1) });
  }, [testData?.code]);

  if (!testData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">
        존재하지 않는 테스트입니다.
      </div>
    );
  }

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
    <div className="max-w-md w-full sm:mx-auto mx-2 bg-white rounded-xl shadow p-4 sm:p-10 mt-4 mb-8 flex flex-col items-center">
      {/* 썸네일: 파일 내 경로만 사용, 없으면 아이콘, 로딩 실패 시에도 아이콘 */}
      <div className="w-full max-w-[220px] aspect-square bg-pink-100 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
        {testData.thumbnailUrl && !isImgError ? (
          <img src={testData.thumbnailUrl} alt={testData.title} className="object-contain w-full h-full" onError={() => setIsImgError(true)} />
        ) : (
          <span className="text-6xl">{testData.icon}</span>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-2 text-center break-keep" style={{ color: testData.mainColor }}>{testData.title}</h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mb-2 justify-center w-full">
        <span className="flex items-center gap-1">
          🔥 {formatViews(views)}이 진행
        </span>
      </div>
      <p className="text-gray-700 mb-4 text-center whitespace-pre-line break-keep text-base sm:text-base text-sm w-full">
        {testData.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-6 justify-center w-full">
        {testData.tags.map((tag) => (
          <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">#{tag}</span>
        ))}
      </div>
      <Link
        href={`/t/${testData.code}`}
        className="w-full block text-center px-8 py-3 rounded-full text-lg font-semibold shadow bg-blue-500 text-white hover:bg-blue-600 transition border-2 border-blue-500"
        style={{ maxWidth: 320 }}
      >
        테스트 시작
      </Link>
    </div>
    </>
  );
} 