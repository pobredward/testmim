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
  const [views, setViews] = useState(0);
  const [isImgError, setIsImgError] = useState(false);
  const [translatedData, setTranslatedData] = useState(testData);
  const [viewsLoading, setViewsLoading] = useState(true);

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
  
  useEffect(() => {
    async function fetchStats() {
      if (!docId) {
        setViewsLoading(false);
        return;
      }

      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          const ref = doc(db, "testStats", docId);
          const snap = await getDoc(ref);
          
          if (snap.exists()) {
            const data = snap.data();
            setViews(data.views ?? 0);
          } else {
            // 문서가 없으면 0으로 생성
            await setDoc(ref, { views: 0, likes: 0, scraps: 0 });
            setViews(0);
          }
          
          setViewsLoading(false);
          break; // 성공 시 루프 탈출
        } catch (error) {
          console.error(`Firestore 조회 실패 (시도 ${retryCount + 1}/${maxRetries}):`, error);
          retryCount++;
          
          if (retryCount >= maxRetries) {
            // 최대 재시도 후에도 실패하면 기본값 사용
            console.warn('Firestore 연결 실패, 기본값 사용');
            setViews(testData.views || 0); // 테스트 데이터의 기본 views 사용
            setViewsLoading(false);
          } else {
            // 재시도 전 잠시 대기
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
      }
    }
    
    fetchStats();
  }, [docId, testData.views]);

  // 페이지 진입 시 조회수 증가 (mount 시 1회만)
  useEffect(() => {
    if (!docId || hasIncreased.current || viewsLoading) return;
    
    const incrementViews = async () => {
      try {
        hasIncreased.current = true;
        const ref = doc(db, "testStats", docId);
        await updateDoc(ref, { views: increment(1) });
        // 증가 후 views 상태도 업데이트
        setViews(prev => prev + 1);
      } catch (error) {
        console.error('조회수 증가 실패:', error);
        // 실패해도 사용자 경험에는 영향 없음
      }
    };
    
    incrementViews();
  }, [docId, viewsLoading]);

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
          🔥 {viewsLoading ? (
            <span className="animate-pulse">-</span>
          ) : (
            `${formatViews(views)}${t('testDetail.views')}`
          )}
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