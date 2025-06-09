"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { getUserTestResults, getUserTestStats, UserTestResult } from "@/utils/userResults";

interface UserTestResultsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserTestResults({ isOpen, onClose }: UserTestResultsProps) {
  const { data: session } = useSession();
  const [results, setResults] = useState<UserTestResult[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'stats'>('list');

  const loadUserResults = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const [userResults, userStats] = await Promise.all([
        getUserTestResults(session.user.id),
        getUserTestStats(session.user.id)
      ]);
      
      setResults(userResults);
      setStats(userStats);
    } catch (error) {
      console.error("테스트 결과 로딩 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (isOpen && session?.user?.id) {
      loadUserResults();
    }
  }, [isOpen, session?.user?.id, loadUserResults]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(window.location.origin + text);
      alert("링크가 복사되었습니다!");
    } catch (error) {
      console.error("복사 실패:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 z-50 transition-all duration-300">
        <div 
          className="absolute inset-0 bg-white/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* 모달 컨테이너 */}
        <div className="relative z-10 flex items-center justify-center min-h-full p-4">
          <div className="relative w-full max-w-4xl transform transition-all duration-300">
            {/* 모달 콘텐츠 */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh]">
              {/* 헤더 */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">내 테스트 결과</h2>
                    <p className="text-purple-100">
                      지금까지 완료한 {results.length}개의 테스트 결과를 확인하세요
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* 탭 네비게이션 */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => setView('list')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      view === 'list' 
                        ? 'bg-white text-purple-600' 
                        : 'text-purple-100 hover:bg-white/20'
                    }`}
                  >
                    📋 결과 목록
                  </button>
                  <button
                    onClick={() => setView('stats')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      view === 'stats' 
                        ? 'bg-white text-purple-600' 
                        : 'text-purple-100 hover:bg-white/20'
                    }`}
                  >
                    📊 통계
                  </button>
                </div>
              </div>

              {/* 콘텐츠 */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-500">테스트 결과를 불러오는 중...</p>
                    </div>
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">아직 완료한 테스트가 없어요</h3>
                    <p className="text-gray-500 mb-6">
                      다양한 테스트에 참여해보세요!
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all"
                    >
                      테스트 하러 가기
                    </button>
                  </div>
                ) : (
                  <>
                    {view === 'list' && (
                      <div className="space-y-4">
                        {results.map((result) => (
                          <div key={result.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                            <div className="flex items-start gap-4">
                              {/* 테스트 썸네일 */}
                              <div className="flex-shrink-0 relative w-16 h-16">
                                <Image
                                  src={result.testThumbnail}
                                  alt={result.testTitle}
                                  fill
                                  className="rounded-lg object-cover border border-gray-200"
                                />
                              </div>

                              {/* 결과 정보 */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-bold text-gray-800 text-lg mb-1">{result.testTitle}</h4>
                                    <p className="text-purple-600 font-semibold mb-2">{result.resultTitle}</p>
                                    <p className="text-gray-600 text-sm line-clamp-2">{result.resultDescription}</p>
                                    <p className="text-gray-400 text-xs mt-2">
                                      완료일: {formatDate(result.completedAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* 액션 버튼들 */}
                              <div className="flex flex-col gap-2">
                                <Link
                                  href={result.shareUrl}
                                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium text-center"
                                >
                                  결과 보기
                                </Link>
                                <button
                                  onClick={() => copyToClipboard(result.shareUrl)}
                                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                >
                                  공유하기
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {view === 'stats' && stats && (
                      <div className="space-y-6">
                        {/* 전체 통계 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalTests}</div>
                            <div className="text-blue-800 font-medium">완료한 테스트</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              {Object.keys(stats.categoryStats).length}
                            </div>
                            <div className="text-green-800 font-medium">참여 카테고리</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                              {Object.keys(stats.monthlyStats).length}
                            </div>
                            <div className="text-purple-800 font-medium">활동 월수</div>
                          </div>
                        </div>

                        {/* 카테고리별 통계 */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-4">카테고리별 참여 현황</h3>
                          <div className="space-y-3">
                            {Object.entries(stats.categoryStats).map(([category, count]) => (
                              <div key={category} className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">{category}</span>
                                <div className="flex items-center gap-3">
                                  <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                      style={{ width: `${(count as number / stats.totalTests) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-bold text-gray-600 w-8">{count as number}개</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 최근 테스트 */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-4">최근 완료한 테스트</h3>
                          <div className="space-y-3">
                            {stats.recentTests.map((result: UserTestResult) => (
                              <div key={result.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-10 h-10">
                                    <Image
                                      src={result.testThumbnail}
                                      alt={result.testTitle}
                                      fill
                                      className="rounded-lg object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">{result.testTitle}</p>
                                    <p className="text-sm text-gray-500">{formatDate(result.completedAt)}</p>
                                  </div>
                                </div>
                                <Link
                                  href={result.shareUrl}
                                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                >
                                  결과 보기 →
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 