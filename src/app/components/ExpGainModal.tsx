"use client";

import { useEffect, useState } from "react";
import { getExpToNextLevel, calculateExpProgress } from "@/utils/expLevel";

interface ExpGainModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  currentExp: number;
  expGained: number;
}

export default function ExpGainModal({
  isOpen,
  onClose,
  currentLevel,
  currentExp,
  expGained,
}: ExpGainModalProps) {
  const [showContent, setShowContent] = useState(false);
  const [showProgressAnimation, setShowProgressAnimation] = useState(false);

  // 이전 경험치와 현재 경험치 계산
  const previousExp = currentExp - expGained;
  const previousProgress = calculateExpProgress(previousExp, currentLevel);
  const currentProgress = calculateExpProgress(currentExp, currentLevel);
  
  const { currentLevelExp, expToNext, nextLevelRequirement } = getExpToNextLevel(currentExp, currentLevel);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 100);
      setTimeout(() => setShowProgressAnimation(true), 800);
      
      // 자동 닫기 (4초 후)
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(autoCloseTimer);
    } else {
      setShowContent(false);
      setShowProgressAnimation(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowContent(false);
    setShowProgressAnimation(false);
    setTimeout(() => onClose(), 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* 모달 콘텐츠 */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-500 ${
          showContent 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-75 opacity-0 translate-y-8'
        }`}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 메인 콘텐츠 */}
        <div className="p-8 text-center">
          {/* 경험치 아이콘 */}
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full text-white text-3xl font-bold shadow-lg transform transition-all duration-700 ${
              showContent ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
            }`}>
              💎
            </div>
          </div>

          {/* 경험치 획득 메시지 */}
          <div className={`mb-6 transform transition-all duration-500 delay-200 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              💫 경험치 획득!
            </h2>
            <p className="text-lg text-purple-600 font-semibold">
              +{expGained} EXP
            </p>
          </div>

          {/* 레벨 및 진행률 정보 */}
          <div className={`mb-6 transform transition-all duration-500 delay-300 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            {/* 현재 레벨 */}
            <div className="mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg px-4 py-2 inline-block text-white shadow-lg">
                <span className="text-xl font-bold">Lv.{currentLevel}</span>
              </div>
            </div>

            {/* 진행률 바 */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{currentLevelExp} EXP</span>
                <span>{nextLevelRequirement} EXP</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
                {/* 이전 진행률 (기본 배경) */}
                <div 
                  className="h-full bg-gray-300 rounded-full transition-all duration-300"
                  style={{ width: `${previousProgress}%` }}
                />
                {/* 새로 획득한 진행률 (애니메이션) */}
                <div 
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out ${
                    showProgressAnimation ? '' : 'w-0'
                  }`}
                  style={{ 
                    width: showProgressAnimation ? `${currentProgress}%` : `${previousProgress}%`
                  }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>진행도: {currentProgress.toFixed(1)}%</span>
                <span>다음까지: {expToNext} EXP</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className={`transform transition-all duration-500 delay-500 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              계속하기
            </button>
          </div>

          {/* 자동 닫기 안내 */}
          <div className={`mt-4 transform transition-all duration-500 delay-700 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <p className="text-xs text-gray-400">
              4초 후 자동으로 닫힙니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 