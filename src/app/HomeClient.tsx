"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db, analytics } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAllTests } from "@/data/tests";
import { logEvent } from "firebase/analytics";
import { useSession } from "next-auth/react";

export default function HomeClient() {
  const TESTS: unknown[] = getAllTests();
  const { data: session } = useSession();

  const [stats, setStats] = useState<{ [code: string]: { views: number } }>({});

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

  useEffect(() => {
    async function fetchStats() {
      const updates: { [code: string]: { views: number } } = {};
      await Promise.all(
        TESTS.map(async (t) => {
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
  }, [TESTS]);

  // 카테고리별 배경색
  const CATEGORY_BG: Record<string, string> = {
    "자아": "bg-gradient-to-br from-pink-50 via-purple-50 to-white",
    "연애": "bg-gradient-to-br from-pink-100 via-orange-50 to-white",
    "게임": "bg-gradient-to-br from-blue-50 via-indigo-50 to-white",
    "동물": "bg-gradient-to-br from-yellow-50 via-green-50 to-white",
    "감성": "bg-gradient-to-br from-pink-50 via-yellow-50 to-white",
    "운명": "bg-gradient-to-br from-purple-50 via-blue-50 to-white",
  };

  const CATEGORY_LABELS = {
    "자아": "🧠 진짜 나를 찾기",
    "연애": "💘 연애 할래?",
    "게임": "🎮 게임 테스트",
    "동물": "🐶 동물 테스트",
    "감성": "🌈 감성 충전 코너",
    "운명": "🔮 운명과 인연을 테스트!",
  };

  const testsByCategory = (TESTS as any[]).reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, any[]>);

  // 인기 테스트들을 위한 구조화된 데이터
  const popularTests = (TESTS as any[])
    .sort((a, b) => (stats[b.code]?.views ?? b.views) - (stats[a.code]?.views ?? a.views))
    .slice(0, 10);

  const testListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "테스트밈 인기 심리테스트 모음",
    "description": "테스트밈에서 가장 인기 있는 심리테스트, 성향테스트 모음",
    "url": "https://www.testmim.com",
    "numberOfItems": popularTests.length,
    "itemListElement": popularTests.map((test, index) => ({
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
    }))
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "테스트밈은 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "테스트밈은 다양한 무료 심리테스트, 성향테스트, MBTI, 연애, 동물, 게임 등 재미있는 테스트를 한 곳에 모아둔 플랫폼입니다."
        }
      },
      {
        "@type": "Question",
        "name": "테스트는 무료인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "네, 테스트밈의 모든 테스트는 완전 무료로 이용하실 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "어떤 종류의 테스트가 있나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "심리테스트, 성향테스트, MBTI, 연애테스트, 동물테스트, 게임테스트, 운명테스트 등 다양한 카테고리의 재미있는 테스트들이 있습니다."
        }
      }
    ]
  };

  // 네온사인 느낌 배너
  const NeonBanner = () => (
    <div className="w-full mb-8">
      <div className="text-center text-2xl sm:text-3xl font-extrabold py-4 rounded-2xl bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300 text-white shadow-lg tracking-wider animate-pulse drop-shadow-[0_0_10px_rgba(255,0,128,0.3)]">
        ✨ 테스트밈 방문을 환영합니다 ✨
      </div>
    </div>
  );

  // 카드 뱃지
  const getBadge = (test: any) => {
    if (test.views > 50) return <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow animate-bounce">맛집 추천</span>;
    if (test.isNew) return <span className="absolute top-2 left-2 bg-blue-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">NEW</span>;
    return null;
  };

  // 카드 컴포넌트
  const TestCard = ({ test }: { test: any }) => (
    <Link
      key={test.code}
      href={`/detail/${test.code}`}
      onClick={() => {
        if (analytics) logEvent(analytics, "test_enter", { test_code: test.code });
      }}
      className="group relative block rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100 hover:-translate-y-1 hover:scale-105 duration-200"
      style={{ minHeight: 210 }}
    >
      {getBadge(test)}
      <div className="flex flex-col h-full">
        <div className="relative w-full h-24 overflow-hidden">
          <img
            src={test.thumbnailUrl || "/default-test-thumb.png"}
            alt={test.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
              🔥 {formatViews(stats[test.code]?.views ?? test.views)}이 진행
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
      <p className="text-gray-600 mb-6 text-center text-base">테스트들의 집합소! 다양한 심리테스트와 재미있는 테스트를 한 곳에서 즐겨보세요.</p>
      {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
        testsByCategory[cat]?.length > 0 && (
          <section key={cat} className={`mb-8 py-6 px-4 rounded-xl ${CATEGORY_BG[cat] || ''} shadow-sm`}>
            <h2 className="text-xl sm:text-2xl font-extrabold mb-1 flex items-center gap-2">{label}</h2>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-pink-200 -mx-2 px-2 py-4">
              <div className="flex gap-4 md:gap-6">
                {(testsByCategory[cat] as any[]).map((test) => (
                  <div
                    key={test.code}
                    className="flex-shrink-0 w-[48%] md:w-[32%] max-w-xs min-w-[160px]"
                  >
                    <TestCard test={test} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      ))}
    </>
  );
} 