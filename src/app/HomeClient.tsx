"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db, analytics } from "@/firebase";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { getAllTests } from "@/data/tests";
import { logEvent } from "firebase/analytics";
import { useSession } from "next-auth/react";

export default function HomeClient() {
  const TESTS: unknown[] = getAllTests();
  const { data: session } = useSession();

  const [stats, setStats] = useState<{ [code: string]: { views: number; likes: number; scraps: number } }>({});
  const [likeClicked, setLikeClicked] = useState<{ [code: string]: boolean }>({});
  const [scrapClicked, setScrapClicked] = useState<{ [code: string]: boolean }>({});

  useEffect(() => {
    async function fetchStats() {
      const updates: { [code: string]: { views: number; likes: number; scraps: number } } = {};
      await Promise.all(
        TESTS.map(async (t) => {
          const test = t as any;
          const ref = doc(db, "testStats", test.docId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            updates[test.code] = {
              views: data.views ?? test.views,
              likes: data.likes ?? test.likes,
              scraps: data.scraps ?? test.scraps,
            };
          } else {
            updates[test.code] = {
              views: test.views,
              likes: test.likes,
              scraps: test.scraps,
            };
          }
        })
      );
      setStats(updates);
    }
    fetchStats();
  }, [TESTS]);

  const handleLike = async (e: React.MouseEvent, t: any) => {
    e.preventDefault();
    if (!session) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    if (likeClicked[t.code]) return;
    setLikeClicked((prev) => ({ ...prev, [t.code]: true }));
    const ref = doc(db, "testStats", t.docId);
    await updateDoc(ref, { likes: increment(1) });
    setStats((prev) => ({ ...prev, [t.code]: { ...prev[t.code], likes: prev[t.code].likes + 1 } }));
  };

  const handleScrap = async (e: React.MouseEvent, t: any) => {
    e.preventDefault();
    if (!session) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    if (scrapClicked[t.code]) return;
    setScrapClicked((prev) => ({ ...prev, [t.code]: true }));
    const ref = doc(db, "testStats", t.docId);
    await updateDoc(ref, { scraps: increment(1) });
    setStats((prev) => ({ ...prev, [t.code]: { ...prev[t.code], scraps: prev[t.code].scraps + 1 } }));
  };

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
        <div className="w-full h-24 flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-100 animate-float">
          <span className="text-4xl animate-bounce-slow">{typeof test.icon === "string" ? test.icon : "🧩"}</span>
        </div>
        <div className="flex-1 flex flex-col p-3">
          <div className="font-bold text-base mb-1 group-hover:text-pink-500 transition line-clamp-2 break-keep">{test.title}</div>
          <div className="flex flex-wrap gap-1 mb-2">
            {test.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 text-gray-500 text-[11px] px-2 py-0.5 rounded-full">#{tag}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-1">
            <span className="flex items-center gap-1">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
              {stats[test.code]?.views?.toLocaleString() ?? test.views}
            </span>
            <button className="flex items-center gap-1 hover:text-pink-500" onClick={(e) => handleLike(e, test)} disabled={likeClicked[test.code]}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              {stats[test.code]?.likes ?? test.likes}
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500" onClick={(e) => handleScrap(e, test)} disabled={scrapClicked[test.code]}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4a2 2 0 0 0-2 2v14l8-4 8 4V6a2 2 0 0 0-2-2H6Z"/></svg>
              {stats[test.code]?.scraps ?? test.scraps}
            </button>
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