"use client";

import { useState, useEffect } from 'react';

interface ExpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GuideItem {
  icon: string;
  title: string;
  description: string;
  exp: number | string;
  frequency?: string;
}

export default function ExpGuideModal({ isOpen, onClose }: ExpGuideModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // 애니메이션 완료 후 닫기
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const guideItems: GuideItem[] = [
    {
      icon: "🎯",
      title: "테스트 완료",
      description: "심리테스트, MBTI 테스트 등을 완료하면 경험치를 획득할 수 있어요!",
      exp: 15,
      frequency: "테스트당"
    },
    {
      icon: "🎮",
      title: "미니게임",
      description: "반응속도 게임 등의 미니게임을 플레이하면 기본 경험치를 획득하고, 좋은 성과를 거둘수록 추가 보너스를 받을 수 있어요!",
      exp: "5-15",
      frequency: "게임당"
    },
    {
      icon: "🎁",
      title: "보너스 이벤트 (준비중)",
      description: "특별한 이벤트와 도전과제를 통해 추가 경험치를 획득하세요!",
      exp: 25,
      frequency: "이벤트당"
    },
    {
      icon: "📅",
      title: "일일 로그인 (준비중)",
      description: "매일 접속하여 연속 로그인 보너스를 받아보세요!",
      exp: 5,
      frequency: "일일"
    }
  ];

  const levelInfo = [
    { level: 1, totalExp: 0, required: 10 },
    { level: 2, totalExp: 10, required: 20 },
    { level: 3, totalExp: 30, required: 30 },
    { level: 4, totalExp: 60, required: 40 },
    { level: 5, totalExp: 100, required: 50 },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`
          bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden
          transform transition-all duration-300 ease-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <h2 className="text-xl font-bold">경험치 가이드</h2>
            </div>
            <button 
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <span className="text-white text-lg">×</span>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* 경험치 획득 방법 */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-purple-500">💎</span>
              경험치 획득 방법
            </h3>
            
            <div className="space-y-4">
              {guideItems.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                          <span className="text-purple-600 font-bold">+{item.exp}</span>
                          <span className="text-purple-500 text-sm">EXP</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                      {item.frequency && (
                        <span className="inline-block mt-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          {item.frequency}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 레벨 시스템 설명 */}
          <div className="px-6 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-yellow-500">🏆</span>
              레벨 시스템
            </h3>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
              <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                레벨이 올라갈수록 더 많은 경험치가 필요해요. 각 레벨별 필요 경험치는 다음과 같습니다:
              </p>
              <div className="space-y-2">
                {levelInfo.map((level, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      레벨 {level.level} → {level.level + 1}
                    </span>
                    <span className="text-orange-600 font-semibold">
                      {level.required} EXP 필요
                    </span>
                  </div>
                ))}
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-yellow-200">
                  ※ 패턴: 레벨 n+1 달성에 (n+1) × 10 경험치 필요
                </div>
              </div>
            </div>
          </div>

          {/* 팁 섹션 */}
          <div className="px-6 pb-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <span>💡</span>
                꿀팁!
              </h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• 다양한 테스트에 참여해서 경험치를 모아보세요</li>
                <li>• 레벨이 올라갈수록 더 많은 기능을 이용할 수 있어요</li>
                <li>• 미니게임에서 좋은 성과를 거둘수록 더 많은 경험치를 획득해요! 🎮</li>
                <li>• 개인 최고 기록을 갱신하면 추가 보너스 경험치를 받을 수 있어요 🏆</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 