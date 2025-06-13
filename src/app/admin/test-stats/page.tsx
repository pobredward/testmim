"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { detectBrowserLanguage } from "@/i18n";
import { getTestStatistics } from "@/utils/adminAuth";
import { getTestByCode } from "@/data/tests";
import Link from "next/link";

interface TestStat {
  testCode: string;
  testName: string;
  participantCount: number;
  lastResult?: string;
}

export default function AdminTestStatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [testStats, setTestStats] = useState<TestStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // i18n 초기화
  useEffect(() => {
    const clientLanguage = detectBrowserLanguage();
    if (i18n.language !== clientLanguage) {
      i18n.changeLanguage(clientLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/signin");
      return;
    }

    if (session.user?.role !== "admin") {
      router.push("/admin");
      return;
    }

    loadTestStats();
  }, [session, status, router]);

  const loadTestStats = async () => {
    try {
      setLoading(true);
      const statsData = await getTestStatistics();
      
      // 테스트별 통계 정보 구성
      const statsArray: TestStat[] = [];
      let total = 0;
      
      for (const [testCode, count] of Object.entries(statsData)) {
        const testInfo = getTestByCode(testCode);
        statsArray.push({
          testCode,
          testName: testInfo?.title || testCode,
          participantCount: count,
        });
        total += count;
      }
      
      // 참여자 수 기준으로 정렬
      statsArray.sort((a, b) => b.participantCount - a.participantCount);
      
      setTestStats(statsArray);
      setTotalResults(total);
    } catch (error) {
      console.error("테스트 통계 로딩 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">{t('admin.testStats.loading')}</p>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/admin" className="text-blue-500 hover:text-blue-600">
            관리자 페이지
          </Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-800">{t('admin.testStats.title')}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('admin.testStats.title')}</h1>
        <p className="text-gray-600">각 테스트별 참여 통계를 확인할 수 있습니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('admin.testStats.totalTests')}</p>
              <p className="text-3xl font-bold text-blue-600">{testStats.length}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('admin.testStats.totalResults')}</p>
              <p className="text-3xl font-bold text-green-600">{totalResults}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">평균 참여자</p>
              <p className="text-3xl font-bold text-purple-600">
                {testStats.length > 0 ? Math.round(totalResults / testStats.length) : 0}
              </p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>
      </div>

      {/* 새로고침 버튼 */}
      <div className="mb-6">
        <button
          onClick={loadTestStats}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          새로고침
        </button>
      </div>

      {/* 테스트 통계 테이블 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {testStats.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500">{t('admin.testStats.empty')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    순위
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.testStats.table.testCode')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.testStats.table.testName')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.testStats.table.participantCount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    점유율
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.testStats.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testStats.map((stat, index) => (
                  <tr key={stat.testCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <span className={`text-2xl ${
                            index === 0 ? 'text-yellow-500' : 
                            index === 1 ? 'text-gray-400' : 
                            'text-orange-600'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="text-gray-500 font-medium">#{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {stat.testCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {stat.testName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-bold text-gray-900 mr-2">
                          {stat.participantCount}명
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${totalResults > 0 ? (stat.participantCount / Math.max(...testStats.map(s => s.participantCount))) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {totalResults > 0 ? ((stat.participantCount / totalResults) * 100).toFixed(1) : 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/t/${stat.testCode}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        테스트 보기
                      </Link>
                      <Link
                        href={`/t/${stat.testCode}/results`}
                        className="text-green-600 hover:text-green-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        결과 보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 추가 정보 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">인기 테스트 TOP 3</h3>
          {testStats.slice(0, 3).map((stat, index) => (
            <div key={stat.testCode} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className="text-lg mr-2">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </span>
                <span className="text-sm text-gray-700">{stat.testName}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {stat.participantCount}명
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">통계 요약</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">가장 인기있는 테스트:</span>
              <span className="font-medium">
                {testStats[0]?.testName || "없음"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">최고 참여자 수:</span>
              <span className="font-medium">
                {testStats[0]?.participantCount || 0}명
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">평균 참여자 수:</span>
              <span className="font-medium">
                {testStats.length > 0 ? Math.round(totalResults / testStats.length) : 0}명
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">참여가 적은 테스트:</span>
              <span className="font-medium">
                {testStats[testStats.length - 1]?.participantCount || 0}명 이하
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 