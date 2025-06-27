"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db, analytics } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAllTests } from "@/data/tests";
import { logEvent } from "firebase/analytics";
import { useSession } from "next-auth/react";
import { useTranslation } from 'react-i18next';

export default function HomeClient() {
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();
  
  const [tests, setTests] = useState<unknown[]>([]);
  const [stats, setStats] = useState<{ [code: string]: { views: number } }>({});

  // 언어 변경 시 테스트 데이터 업데이트
  useEffect(() => {
    console.log('Language changed to:', i18n.language);
    const allTests = getAllTests(i18n.language);
    console.log('Loaded tests:', allTests.length, allTests.map((t: any) => ({ code: t.code, title: t.title, category: t.category })));
    setTests(allTests);
  }, [i18n.language]);

  // 숫자 포맷팅 함수
  const formatViews = (views: number): string => {
    if (views >= 10000) {
      return `${(views / 10000).toFixed(1)}${t('common.tenThousand')}`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}${t('common.thousand')}`;
    } else {
      return `${views}${t('common.views')}`;
    }
  };

  useEffect(() => {
    async function fetchStats() {
      const updates: { [code: string]: { views: number } } = {};
      await Promise.all(
        tests.map(async (t: any) => {
          const test = t as any;
          const ref = doc(db, "testStats", test.docId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            updates[test.code] = {
              views: data.views ?? test.views,
            };
          } else {
            updates[test.code] = {
              views: test.views,
            };
          }
        })
      );
      setStats(updates);
    }
    fetchStats();
  }, [tests]);

  // 카테고리별 배경색
  const CATEGORY_BG: Record<string, string> = {
    "자아": "bg-gradient-to-br from-pink-50 via-purple-50 to-white",
    "밈": "bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50",
    "연애": "bg-gradient-to-br from-pink-100 via-orange-50 to-white",
    "게임": "bg-gradient-to-br from-blue-50 via-indigo-50 to-white",
  };

  // 안전한 카테고리 레이블 가져오기
  const getCategoryLabel = (category: string) => {
    try {
      const translated = t(`categories.${category}`);
      // 번역이 키 그대로 반환되면 (번역이 없으면) 기본값 사용
      if (translated === `categories.${category}`) {
        const fallbackLabels: Record<string, string> = {
          "자아": "🧠 자아 탐구",
          "밈": "🤪 밈 테스트",
          "연애": "💘 연애 테스트",
          "게임": "🎮 게임 테스트",
        };
        return fallbackLabels[category] || category;
      }
      return translated;
    } catch (error) {
      console.warn(`Error getting category label for ${category}:`, error);
      return category;
    }
  };

  const testsByCategory = (tests as any[]).reduce((acc, test) => {
    if (!test.category) {
      console.warn('Test without category:', test);
      return acc;
    }
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, any[]>);

  // "자아" 카테고리에서 politics를 항상 맨 앞으로 정렬
  if (testsByCategory["자아"]) {
    testsByCategory["자아"].sort((a: any, b: any) => {
      if (a.code === "politics") return -1;
      if (b.code === "politics") return 1;
      return 0;
    });
  }

  console.log('Tests by category:', testsByCategory);

  // 카테고리 순서 정의 (밈을 제일 위에)
  const CATEGORY_ORDER = ["밈", "자아", "연애", "게임"];

  // 인기 테스트들을 위한 구조화된 데이터 (제거)
  // const popularTests = (tests as any[])
  //   .sort((a, b) => (stats[b.code]?.views ?? b.views) - (stats[a.code]?.views ?? a.views))
  //   .slice(0, 10);

  const testListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "테스트밈 인기 심리테스트 모음",
    "description": "테스트밈에서 가장 인기 있는 심리테스트, 성향테스트 모음",
    "url": "https://www.testmim.com",
    "numberOfItems": testsByCategory["밈"]?.length ?? 0,
    "itemListElement": testsByCategory["밈"]?.map((test: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Article",
        "@id": `https://www.testmim.com/detail/${test.code}`,
        "name": test.title,
        "description": test.description,
        "url": `https://www.testmim.com/detail/${test.code}`,
        "image": test.thumbnailUrl ? `https://www.testmim.com${test.thumbnailUrl}` : "https://www.testmim.com/og-image.png",
        "keywords": test.tags.join(", "),
        "genre": test.category,
        "author": {
          "@type": "Organization",
          "name": "테스트밈"
        },
        "interactionStatistic": {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/ViewAction",
          "userInteractionCount": stats[test.code]?.views ?? test.views
        }
      }
    })) ?? []
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t('faq.what_is_testmim.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.what_is_testmim.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.is_free.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.is_free.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('faq.what_types.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq.what_types.answer')
        }
      }
    ]
  };

  // 네온사인 느낌 배너
  const NeonBanner = () => (
    <div className="w-full mb-8">
      <div className="text-center text-2xl sm:text-3xl font-extrabold py-4 rounded-2xl bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300 text-white shadow-lg tracking-wider animate-pulse drop-shadow-[0_0_10px_rgba(255,0,128,0.3)]">
        ✨ {t('common.welcome')} ✨
      </div>
    </div>
  );

  // 카카오 애드핏 모바일 배너 컴포넌트 (React 방식)
  const AdFitBanner = () => {
    useEffect(() => {
      // 스크립트 동적 로드
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      document.head.appendChild(script);

      return () => {
        // 컴포넌트 언마운트 시 스크립트 제거
        const existingScript = document.querySelector('script[src*="ba.min.js"]');
        if (existingScript) {
          existingScript.remove();
        }
      };
    }, []);

    return (
      <div className="w-full mb-8 flex justify-center">
        <div className="max-w-[320px] w-full">
          <ins 
            className="kakao_ad_area" 
            style={{ display: 'none', width: '100%' }}
            data-ad-unit="DAN-UqH6IJflvZbmQ5QL"
            data-ad-width="320"
            data-ad-height="100"
          />
        </div>
      </div>
    );
  };

  // 카드 뱃지
  const getBadge = (test: any) => {
    if (test.views > 50) return <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow animate-bounce">{t('badges.popular')}</span>;
    if (test.isNew) return <span className="absolute top-2 left-2 bg-blue-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">{t('badges.new')}</span>;
    return null;
  };

  // 카드 컴포넌트
  const TestCard = ({ test }: { test: any }) => (
    <Link
      href={`/detail/${test.code}`}
      onClick={() => {
        if (analytics) logEvent(analytics, "test_enter", { test_code: test.code });
      }}
      className="group relative block rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100 hover:-translate-y-1 hover:scale-105 duration-200 h-full"
    >
      {getBadge(test)}
      <div className="flex flex-col h-full">
        <div className="relative w-full h-24 overflow-hidden">
          <Image
            src={test.thumbnailUrl || "/default-test-thumb.png"}
            alt={test.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // 이미지 로드 실패 시 아이콘으로 대체
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const iconDiv = target.nextElementSibling as HTMLElement;
              if (iconDiv) iconDiv.style.display = 'flex';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-white to-purple-100 flex items-center justify-center animate-float" style={{ display: 'none' }}>
            <span className="text-4xl animate-bounce-slow">{typeof test.icon === "string" ? test.icon : "🧩"}</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col p-3 bg-gray-50">
          <div className="font-bold text-base mb-1 group-hover:text-pink-500 transition line-clamp-2 break-keep">{test.title}</div>
          <div className="flex flex-wrap gap-1 mb-2">
            {test.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 text-gray-500 text-[11px] px-2 py-0.5 rounded-full">#{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-1">
            <span className="flex items-center gap-1">
              🔥 {formatViews(stats[test.code]?.views ?? test.views)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  // float 애니메이션 추가
  // tailwind.config.js에 아래 추가 필요:
  // theme: { extend: { keyframes: { float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } }, bounce-slow: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } } }, animation: { float: 'float 2.5s ease-in-out infinite', 'bounce-slow': 'bounce-slow 2.2s infinite' } } }

  return (
    <>
      {/* JSON-LD 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(testListJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      
      <NeonBanner />
      <p className="text-gray-600 mb-6 text-center text-base">{t('common.description')}</p>
      
      {/* 카카오 애드핏 모바일 배너 */}
      <AdFitBanner />
      
      {CATEGORY_ORDER.map(category => 
        testsByCategory[category]?.length > 0 && (
          <section key={category} className={`mb-8 py-6 px-4 rounded-xl ${CATEGORY_BG[category] || ''} shadow-sm`}>
            <h2 className="text-xl sm:text-2xl font-extrabold mb-4 flex items-center gap-2">
              {getCategoryLabel(category)}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {(testsByCategory[category] as any[]).map((test) => (
                <TestCard key={test.code} test={test} />
              ))}
            </div>
          </section>
        )
      )}
    </>
  );
} 