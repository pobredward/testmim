export default function Footer() {
  return (
    <footer className="w-full border-t bg-white text-center text-xs text-gray-400 py-6 mt-8">
      <div className="mb-2 font-semibold text-gray-600">© 2025 테스트밈 (testmim.com)</div>
      <div className="flex flex-col items-center gap-1 text-[11px] sm:text-xs">
        <div>
          <span className="font-medium">상호</span>: 온마인드랩 | <span className="font-medium">대표자</span>: 신선용
        </div>
        <div>
          <span className="font-medium">사업자등록번호</span>: 166-22-02407 | <span className="font-medium">연락처</span>: 010-6711-7933
        </div>
        <div>
          <span className="font-medium">주소</span>: 경기도 성남시 분당구 야탑로139번길 5-1, 203호(야탑동)
        </div>
        <div>
          <span className="font-medium">업태</span>: 도매 및 소매업 | <span className="font-medium">종목</span>: 전자상거래 소매업
        </div>
      </div>
      <div className="mt-2 border-t border-gray-200 pt-2 text-[10px] text-gray-300">본 사이트의 모든 콘텐츠는 저작권의 보호를 받으며, 무단 복제 및 배포를 금지합니다.</div>
    </footer>
  );
} 