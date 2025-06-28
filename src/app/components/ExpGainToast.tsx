"use client";

import { useEffect, useState } from "react";

interface ExpGainToastProps {
  isVisible: boolean;
  onHide: () => void;
  expGained: number;
}

export default function ExpGainToast({
  isVisible,
  onHide,
  expGained,
}: ExpGainToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      
      // 3초 후 자동 숨김
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(() => onHide(), 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-40">
      <div 
        className={`bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg shadow-lg border border-green-400/20 backdrop-blur-sm transform transition-all duration-300 ${
          show 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* 경험치 아이콘 */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">
              ⭐
            </div>
          </div>
          
          {/* 메시지 */}
          <div className="flex-1">
            <div className="font-semibold text-sm">
              경험치 획득!
            </div>
            <div className="text-white/90 text-xs">
              +{expGained} EXP
            </div>
          </div>
          
          {/* 닫기 버튼 */}
          <button
            onClick={() => {
              setShow(false);
              setTimeout(() => onHide(), 300);
            }}
            className="flex-shrink-0 text-white/60 hover:text-white/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 진행률 바 */}
        <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/40 rounded-full transition-all duration-3000 ease-out"
            style={{ 
              width: show ? '0%' : '100%',
              transitionDelay: show ? '100ms' : '0ms'
            }}
          />
        </div>
      </div>
    </div>
  );
} 