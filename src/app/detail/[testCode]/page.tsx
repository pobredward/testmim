'use client'

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import { use } from "react";
import Head from "next/head";
import { getTestByCode } from "@/data/tests";
import type { TestResult, TestAnswer } from "@/types/tests";

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

export default function TestDetailPage({ params }: { params: Promise<{ testCode: string }> }) {
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [scraps, setScraps] = useState(0);
  const [likeClicked, setLikeClicked] = useState(false);
  const [scrapClicked, setScrapClicked] = useState(false);
  const [isImgError, setIsImgError] = useState(false);
  const isLoggedIn = false;

  const { testCode } = use(params);

  // 테스트 데이터 분기 (공통 함수로 대체)
  const TEST_DATA = getTestByCode(testCode) as TestMeta | null;

  const hasIncreased = useRef(false);
  useEffect(() => {
    async function fetchStats() {
      if (!TEST_DATA) return;
      const ref = doc(db, "testStats", TEST_DATA.docId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setViews(data.views ?? 0);
        setLikes(data.likes ?? 0);
        setScraps(data.scraps ?? 0);
      } else {
        // 문서가 없으면 0,0,0으로 생성
        await setDoc(ref, { views: 0, likes: 0, scraps: 0 });
        setViews(0);
        setLikes(0);
        setScraps(0);
      }
    }
    fetchStats();
  }, [TEST_DATA]);

  // 페이지 진입 시 조회수 증가 (mount 시 1회만)
  useEffect(() => {
    if (!TEST_DATA || hasIncreased.current) return;
    hasIncreased.current = true;
    const ref = doc(db, "testStats", TEST_DATA.docId);
    updateDoc(ref, { views: increment(1) });
  }, [TEST_DATA?.code]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    if (likeClicked || !TEST_DATA) return;
    setLikeClicked(true);
    const ref = doc(db, "testStats", TEST_DATA.docId);
    await updateDoc(ref, { likes: increment(1) });
    setLikes((l) => l + 1);
  };

  const handleScrap = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    if (scrapClicked || !TEST_DATA) return;
    setScrapClicked(true);
    const ref = doc(db, "testStats", TEST_DATA.docId);
    await updateDoc(ref, { scraps: increment(1) });
    setScraps((s) => s + 1);
  };

  if (!TEST_DATA) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-gray-400">
        존재하지 않는 테스트입니다.
      </div>
    );
  }

  // SEO 메타데이터 동적 생성
  const seoTitle = `${TEST_DATA.title} | ${TEST_DATA.tags.join(", ")} 테스트, 무료 심리테스트 | 테스트밈`;
  const seoDescription = TEST_DATA.description + ` 지금 바로 무료로 ${TEST_DATA.tags.join(", ")} 테스트를 해보세요!`;
  const seoKeywords = TEST_DATA.seoKeywords ? TEST_DATA.seoKeywords : `${TEST_DATA.tags.join(", ")}, 테스트, 무료테스트, 심리테스트, 성향테스트, testmim, 테스트밈`;
  const seoUrl = `https://www.testmim.com/detail/${TEST_DATA.code}`;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        {/* Open Graph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:type" content="website" />
        {/* 네이버/카카오 등 추가 태그 필요시 여기에 */}
        <link rel="canonical" href={seoUrl} />
      </Head>
    <div className="max-w-md w-full sm:mx-auto mx-2 bg-white rounded-xl shadow p-4 sm:p-10 mt-4 mb-8 flex flex-col items-center">
      {/* 썸네일: 파일 내 경로만 사용, 없으면 아이콘, 로딩 실패 시에도 아이콘 */}
      <div className="w-full max-w-[220px] aspect-square bg-pink-100 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
        {TEST_DATA.thumbnailUrl && !isImgError ? (
          <img src={TEST_DATA.thumbnailUrl} alt={TEST_DATA.title} className="object-contain w-full h-full" onError={() => setIsImgError(true)} />
        ) : (
          <span className="text-6xl">{TEST_DATA.icon}</span>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-2 text-center break-keep" style={{ color: TEST_DATA.mainColor }}>{TEST_DATA.title}</h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mb-2 justify-center w-full">
        <span className="flex items-center gap-1">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
          조회수 {views.toLocaleString()}
        </span>
        <button className="flex items-center gap-1 hover:text-pink-500" onClick={handleLike} disabled={likeClicked}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          좋아요 {likes}
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500" onClick={handleScrap} disabled={scrapClicked}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4a2 2 0 0 0-2 2v14l8-4 8 4V6a2 2 0 0 0-2-2H6Z"/></svg>
          저장 {scraps}
        </button>
        <span className="flex items-center gap-1">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline"><path fill="currentColor" d="M12 8V12l3 3"></path><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
          약 2분
        </span>
      </div>
      <p className="text-gray-700 mb-4 text-center whitespace-pre-line break-keep text-base sm:text-base text-sm w-full">
        {TEST_DATA.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-6 justify-center w-full">
        {TEST_DATA.tags.map((tag) => (
          <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">#{tag}</span>
        ))}
      </div>
      <Link
        href={`/t/${TEST_DATA.code}`}
        className="w-full block text-center px-8 py-3 rounded-full text-lg font-semibold shadow bg-blue-500 text-white hover:bg-blue-600 transition border-2 border-blue-500"
        style={{ maxWidth: 320 }}
      >
        테스트 시작
      </Link>
    </div>
    </>
  );
} 