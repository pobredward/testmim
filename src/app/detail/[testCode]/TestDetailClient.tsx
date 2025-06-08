"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import type { TestMeta } from "./page";

interface TestDetailClientProps {
  testData: TestMeta;
}

export default function TestDetailClient({ testData }: TestDetailClientProps) {
  const [views, setViews] = useState(0);
  const [isImgError, setIsImgError] = useState(false);

  // 숫자 포맷팅 함수
  const formatViews = useCallback((views: number): string => {
    if (views >= 10000) {
      return `${(views / 10000).toFixed(1)}만명`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}천명`;
    } else {
      return `${views}명`;
    }
  }, []);

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
  }, [testData.docId]);

  // 페이지 진입 시 조회수 증가 (mount 시 1회만)
  useEffect(() => {
    if (!testData || hasIncreased.current) return;
    hasIncreased.current = true;
    const ref = doc(db, "testStats", testData.docId);
    updateDoc(ref, { views: increment(1) });
  }, [testData.docId]);

  return (
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
  );
} 