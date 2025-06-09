"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { getUserTestResults, UserTestResult, deleteTestResult } from "@/utils/userResults";
import { getTestByCode } from "@/data/tests";

export default function TestResultCards() {
  const { data: session } = useSession();
  const [results, setResults] = useState<UserTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUserResults = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const userResults = await getUserTestResults(session.user.id);
      setResults(userResults);
    } catch (error) {
      console.error("테스트 결과 로딩 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      loadUserResults();
    }
  }, [session?.user?.id, loadUserResults]);

  const handleDeleteResult = async (resultId: string) => {
    if (!session?.user?.id) return;
    
    const confirmed = window.confirm("정말 이 테스트 결과를 삭제하시겠습니까?");
    if (!confirmed) return;

    setDeletingId(resultId);
    try {
      await deleteTestResult(resultId, session.user.id);
      setResults(prev => prev.filter(result => result.id !== resultId));
      alert("테스트 결과가 삭제되었습니다.");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(window.location.origin + text);
      alert("링크가 복사되었습니다!");
    } catch (error) {
      console.error("복사 실패:", error);
    }
  };

  const displayResults = showAll ? results : results.slice(0, 8);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">테스트 결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">아직 완료한 테스트가 없어요</h3>
        <p className="text-gray-500 mb-6">
          다양한 테스트에 참여해보세요!
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all"
        >
          테스트 하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 테스트 결과 카드 그리드 */}
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayResults.map((result) => {
          const testData = getTestByCode(result.testCode);
          return (
            <div key={result.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
              {/* 테스트 썸네일 헤더 */}
              <div className="relative h-20 overflow-hidden">
                <Image
                  src={testData?.thumbnailUrl || "/default-test-thumb.png"}
                  alt={result.testTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    // 이미지 로드 실패 시 아이콘으로 대체
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const iconDiv = target.nextElementSibling as HTMLElement;
                    if (iconDiv) iconDiv.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center text-2xl" style={{ display: 'none' }}>
                  {testData?.icon || "🎯"}
                </div>
                <button
                  onClick={() => handleDeleteResult(result.id)}
                  disabled={deletingId === result.id}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center transition-colors disabled:opacity-50"
                  title="결과 삭제"
                >
                  {deletingId === result.id ? "..." : "×"}
                </button>
              </div>

              {/* 카드 내용 */}
              <div className="p-3">
                <h4 className="font-bold text-gray-800 text-xs mb-1 line-clamp-1">
                  {result.testTitle}
                </h4>
                <p className="text-purple-600 font-semibold text-xs mb-2 line-clamp-1">
                  {result.resultTitle}
                </p>
                
                {/* 액션 버튼들 */}
                <div className="flex gap-2">
                  <Link
                    href={result.shareUrl}
                    className="flex-1 px-2 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-xs font-medium text-center"
                  >
                    결과 보기
                  </Link>
                  <button
                    onClick={() => copyToClipboard(result.shareUrl)}
                    className="px-2 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-xs font-medium"
                    title="공유하기"
                  >
                    📤
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 더보기/접기 버튼 */}
      {results.length > 8 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            {showAll ? "접기" : `더보기 (${results.length - 8}개 더)`}
          </button>
        </div>
      )}
    </div>
  );
} 