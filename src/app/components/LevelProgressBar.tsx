"use client";

import { useEffect, useState } from 'react';
import { 
  getExpRequiredForLevel, 
  calculateLevelFromExp 
} from '@/utils/expLevel';

interface LevelProgressBarProps {
  currentExp: number;
  currentLevel: number;
}

export default function LevelProgressBar({ currentExp, currentLevel }: LevelProgressBarProps) {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [expForCurrentLevel, setExpForCurrentLevel] = useState(0);
  const [expForNextLevel, setExpForNextLevel] = useState(0);
  const [expNeededForNext, setExpNeededForNext] = useState(0);

  useEffect(() => {
    // 현재 레벨까지 필요한 총 경험치 계산
    let totalExpForCurrentLevel = 0;
    for (let i = 1; i < currentLevel; i++) {
      totalExpForCurrentLevel += getExpRequiredForLevel(i + 1);
    }
    
    // 현재 레벨에서 사용된 경험치
    const usedExpInCurrentLevel = currentExp - totalExpForCurrentLevel;
    
    // 다음 레벨까지 필요한 경험치
    const nextLevelExp = getExpRequiredForLevel(currentLevel + 1);
    
    // 다음 레벨까지 남은 경험치
    const remainingExp = Math.max(0, nextLevelExp - usedExpInCurrentLevel);
    
    setExpForCurrentLevel(usedExpInCurrentLevel);
    setExpForNextLevel(nextLevelExp);
    setExpNeededForNext(remainingExp);
    
    // 진행률 계산 (0-100%)
    if (nextLevelExp > 0) {
      const progress = (usedExpInCurrentLevel / nextLevelExp) * 100;
      setProgressPercentage(Math.min(100, Math.max(0, progress)));
    } else {
      setProgressPercentage(0);
    }
  }, [currentExp, currentLevel]);

  return (
    <div className="w-full max-w-full bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 overflow-hidden">
      {/* 레벨 헤더 */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white font-bold text-sm sm:text-lg">L</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">레벨 {currentLevel}</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">총 {currentExp.toLocaleString()} EXP</p>
          </div>
        </div>
        
        {/* 다음 레벨 아이콘 */}
        <div className="text-right flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
            <span className="text-gray-500 font-semibold text-xs sm:text-sm">{currentLevel + 1}</span>
          </div>
          <p className="text-xs text-gray-400 whitespace-nowrap">다음 레벨</p>
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
          <span className="truncate">{expForCurrentLevel} EXP</span>
          <span className="truncate">{expForNextLevel} EXP</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1 gap-2">
          <span className="truncate">진행도: {progressPercentage.toFixed(1)}%</span>
          <span className="truncate">다음까지: {expNeededForNext} EXP</span>
        </div>
      </div>

      {/* 레벨업 정보 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 sm:p-4 mb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-purple-600 text-base sm:text-lg flex-shrink-0">⭐</span>
            <span className="text-xs sm:text-sm font-medium text-purple-700 truncate">
              레벨업까지
            </span>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm sm:text-lg font-bold text-purple-700 whitespace-nowrap">
              {expNeededForNext} EXP
            </p>
            <p className="text-xs text-purple-500">
              {expNeededForNext <= 10 ? '거의 다 왔어요!' : '화이팅! 💪'}
            </p>
          </div>
        </div>
      </div>

      {/* 레벨 혜택 힌트 */}
      <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700 text-center leading-relaxed">
          💡 레벨이 올라갈수록 더 많은 테스트와 기능을 이용할 수 있어요!
        </p>
      </div>
    </div>
  );
} 