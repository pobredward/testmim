"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { detectBrowserLanguage } from "@/i18n";
import Link from "next/link";

export default function AdminContentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

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

    setLoading(false);
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">{t('admin.loading')}</p>
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
          <span className="text-gray-800">콘텐츠 관리</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">콘텐츠 관리</h1>
        <p className="text-gray-600">테스트 콘텐츠와 관련 자료를 관리할 수 있습니다.</p>
      </div>

      {/* 콘텐츠 관리 섹션들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">테스트 목록</h3>
            <div className="text-3xl">📝</div>
          </div>
          <p className="text-gray-600 mb-4">등록된 모든 테스트를 확인하고 관리합니다.</p>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">• 테스트 수정 및 삭제</div>
            <div className="text-sm text-gray-500">• 테스트 활성화/비활성화</div>
            <div className="text-sm text-gray-500">• 새 테스트 추가</div>
          </div>
          <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
            테스트 관리
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">미디어 파일</h3>
            <div className="text-3xl">🖼️</div>
          </div>
          <p className="text-gray-600 mb-4">테스트에 사용되는 이미지와 미디어 파일을 관리합니다.</p>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">• 이미지 업로드</div>
            <div className="text-sm text-gray-500">• 파일 최적화</div>
            <div className="text-sm text-gray-500">• 썸네일 관리</div>
          </div>
          <button className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors">
            미디어 관리
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">카테고리</h3>
            <div className="text-3xl">🏷️</div>
          </div>
          <p className="text-gray-600 mb-4">테스트 카테고리와 태그를 관리합니다.</p>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">• 카테고리 추가/삭제</div>
            <div className="text-sm text-gray-500">• 태그 관리</div>
            <div className="text-sm text-gray-500">• 분류 체계 정리</div>
          </div>
          <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors">
            카테고리 관리
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">다국어 지원</h3>
            <div className="text-3xl">🌐</div>
          </div>
          <p className="text-gray-600 mb-4">다국어 번역과 로컬라이제이션을 관리합니다.</p>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">• 번역 파일 관리</div>
            <div className="text-sm text-gray-500">• 언어별 콘텐츠</div>
            <div className="text-sm text-gray-500">• 번역 완성도 확인</div>
          </div>
          <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
            번역 관리
          </button>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">최근 콘텐츠 활동</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">새 테스트 추가됨</div>
                <div className="text-xs text-gray-500">성격 유형 테스트 v2.0</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">2시간 전</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">번역 업데이트</div>
                <div className="text-xs text-gray-500">일본어 번역 파일 갱신</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">1일 전</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">이미지 최적화</div>
                <div className="text-xs text-gray-500">썸네일 파일 크기 50% 감소</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">3일 전</div>
          </div>
        </div>
      </div>
    </div>
  );
} 