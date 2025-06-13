"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import { useTranslation } from 'react-i18next';
import { getTranslatedTestData } from '@/utils/testTranslations';
import type { TestMeta } from "./page";

interface TestDetailClientProps {
  testData: TestMeta;
}

export default function TestDetailClient({ testData }: TestDetailClientProps) {
  const { t, i18n } = useTranslation();
  const [views, setViews] = useState<number | null>(null); // null로 초기화하여 로딩 상태 표시
  const [isImgError, setIsImgError] = useState(false);
  const [translatedData, setTranslatedData] = useState(testData);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 마운트 확인 (hydration mismatch 방지)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 현재 언어에 맞는 번역된 데이터 업데이트
  useEffect(() => {
    const currentLang = i18n.language;
    const translated = getTranslatedTestData(testData.code, testData, currentLang);
    setTranslatedData(translated);
  }, [i18n.language, testData]);

  // 숫자 포맷팅 함수
  const formatViews = useCallback((views: number): string => {
    if (views >= 10000) {
      return `${(views / 10000).toFixed(1)}${t('common.tenThousand')}`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}${t('common.thousand')}`;
    } else {
      return `${views}${t('common.views')}`;
    }
  }, [t]);

  const hasIncreased = useRef(false);
  
  // 필요한 값들을 변수로 추출
  const docId = testData?.docId;
  
  // Firebase에서 데이터를 가져오고 조회수 증가를 순차적으로 처리
  useEffect(() => {
    if (!docId || !isMounted) return;
    
    async function fetchAndUpdateStats() {
      try {
        const ref = doc(db, "testStats", docId);
        const snap = await getDoc(ref);
        
        if (snap.exists()) {
          const data = snap.data();
          const currentViews = data.views ?? 0;
          setViews(currentViews);
          
          // 데이터를 가져온 후 조회수 증가 (중복 방지)
          if (!hasIncreased.current) {
            hasIncreased.current = true;
            await updateDoc(ref, { views: increment(1) });
            // UI에 증가된 조회수 즉시 반영
            setViews(currentViews + 1);
          }
        } else {
          // 문서가 없으면 1로 생성 (첫 방문자)
          await setDoc(ref, { views: 1, likes: 0, scraps: 0 });
          setViews(1);
          hasIncreased.current = true;
        }
      } catch (error) {
        console.error("Error fetching/updating stats:", error);
        // 에러가 발생해도 fallback 값 설정
        setViews(testData.views || 0);
      }
    }

    fetchAndUpdateStats();
  }, [docId, isMounted, testData.views]);

  // 클라이언트 마운트 전에는 서버 데이터 표시
  if (!isMounted) {
    return (
      <div className="max-w-md w-full sm:mx-auto mx-2 bg-white rounded-xl shadow p-4 sm:p-10 mt-4 mb-8 flex flex-col items-center">
        {/* 썸네일: 파일 내 경로만 사용, 없으면 아이콘, 로딩 실패 시에도 아이콘 */}
        <div className="w-full max-w-[220px] aspect-square bg-pink-100 rounded-xl flex items-center justify-center mb-6 overflow-hidden relative">
          {testData.thumbnailUrl && !isImgError ? (
            <Image src={testData.thumbnailUrl} alt={translatedData.title} fill className="object-contain" onError={() => setIsImgError(true)} />
          ) : (
            <span className="text-6xl">{testData.icon}</span>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center break-keep" style={{ color: testData.mainColor }}>
          {translatedData.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mb-2 justify-center w-full">
          <span className="flex items-center gap-1">
            🔥 {formatViews(testData.views || 0)}
          </span>
        </div>
        <p className="text-gray-700 mb-4 text-center whitespace-pre-line break-keep text-base sm:text-base text-sm w-full">
          {translatedData.description}
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
          {t('testDetail.startTest')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full sm:mx-auto mx-2 bg-white rounded-xl shadow p-4 sm:p-10 mt-4 mb-8 flex flex-col items-center">
      {/* 썸네일: 파일 내 경로만 사용, 없으면 아이콘, 로딩 실패 시에도 아이콘 */}
      <div className="w-full max-w-[220px] aspect-square bg-pink-100 rounded-xl flex items-center justify-center mb-6 overflow-hidden relative">
        {testData.thumbnailUrl && !isImgError ? (
          <Image src={testData.thumbnailUrl} alt={translatedData.title} fill className="object-contain" onError={() => setIsImgError(true)} />
        ) : (
          <span className="text-6xl">{testData.icon}</span>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-2 text-center break-keep" style={{ color: testData.mainColor }}>
        {translatedData.title}
      </h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mb-2 justify-center w-full">
        <span className="flex items-center gap-1">
          🔥 {views !== null ? formatViews(views) : formatViews(testData.views || 0)}{t('testDetail.views')}
        </span>
      </div>
      <p className="text-gray-700 mb-4 text-center whitespace-pre-line break-keep text-base sm:text-base text-sm w-full">
        {translatedData.description}
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
        {t('testDetail.startTest')}
      </Link>
    </div>
  );
} 