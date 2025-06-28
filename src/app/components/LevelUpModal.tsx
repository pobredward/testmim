"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldLevel: number;
  newLevel: number;
  expGained: number;
  totalExp: number;
}

export default function LevelUpModal({
  isOpen,
  onClose,
  oldLevel,
  newLevel,
  expGained,
  totalExp,
}: LevelUpModalProps) {
  const { t } = useTranslation();
  const [showContent, setShowContent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 순서대로 애니메이션 효과 실행
      setTimeout(() => setShowContent(true), 100);
      setTimeout(() => setShowConfetti(true), 300);
      
      // 자동 닫기 (5초 후)
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(autoCloseTimer);
    } else {
      setShowContent(false);
      setShowConfetti(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowContent(false);
    setShowConfetti(false);
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
      
      {/* 축하 이펙트 (Confetti) */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute animate-bounce text-2xl ${
                i % 4 === 0 ? 'text-yellow-400' : 
                i % 4 === 1 ? 'text-purple-400' : 
                i % 4 === 2 ? 'text-pink-400' : 'text-blue-400'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['🎉', '⭐', '✨', '🎊'][i % 4]}
            </div>
          ))}
        </div>
      )}

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
          {/* 레벨업 아이콘 */}
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-white text-4xl font-bold shadow-lg transform transition-all duration-700 ${
              showContent ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
            }`}>
              🎯
            </div>
          </div>

          {/* 축하 메시지 */}
          <div className={`mb-6 transform transition-all duration-500 delay-200 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              🎉 레벨업!
            </h2>
            <p className="text-lg text-gray-600">
              축하합니다! 새로운 레벨에 도달했습니다!
            </p>
          </div>

          {/* 레벨 정보 */}
          <div className={`mb-6 transform transition-all duration-500 delay-300 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* 이전 레벨 */}
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg px-4 py-2 mb-2">
                  <span className="text-2xl font-bold text-gray-500">Lv.{oldLevel}</span>
                </div>
                <span className="text-sm text-gray-400">이전</span>
              </div>

              {/* 화살표 */}
              <div className="text-purple-500 text-2xl animate-pulse">
                →
              </div>

              {/* 새 레벨 */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg px-4 py-2 mb-2 text-white shadow-lg">
                  <span className="text-2xl font-bold">Lv.{newLevel}</span>
                </div>
                <span className="text-sm text-purple-600 font-medium">새 레벨!</span>
              </div>
            </div>

            {/* 경험치 정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">획득 경험치</span>
                <span className="font-bold text-green-600">+{expGained} EXP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">총 경험치</span>
                <span className="font-bold text-purple-600">{totalExp} EXP</span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className={`transform transition-all duration-500 delay-500 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              계속하기
            </button>
          </div>

          {/* 자동 닫기 안내 */}
          <div className={`mt-4 transform transition-all duration-500 delay-700 ${
            showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <p className="text-xs text-gray-400">
              5초 후 자동으로 닫힙니다
            </p>
          </div>
        </div>

        {/* 하단 장식 */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
} 