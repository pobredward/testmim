"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { detectBrowserLanguage } from "@/i18n";
import Link from "next/link";

export default function AdminSettingsPage() {
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
          <span className="text-gray-800">시스템 설정</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">시스템 설정</h1>
        <p className="text-gray-600">시스템 환경과 보안 설정을 관리합니다.</p>
      </div>

      {/* 설정 섹션들 */}
      <div className="space-y-8">
        {/* 일반 설정 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">일반 설정</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사이트 제목
              </label>
              <input
                type="text"
                defaultValue="테스트밈"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                기본 언어
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사이트 설명
              </label>
              <textarea
                rows={3}
                defaultValue="재미있는 심리 테스트와 성격 분석을 제공하는 플랫폼"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                타임존
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Asia/Seoul">Asia/Seoul (KST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 보안 설정 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">보안 설정</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-800">2단계 인증</h4>
                <p className="text-sm text-gray-600">관리자 계정에 대한 추가 보안 층을 제공합니다.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-800">자동 로그아웃</h4>
                <p className="text-sm text-gray-600">비활성 상태에서 자동으로 로그아웃됩니다.</p>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="30">30분</option>
                <option value="60">1시간</option>
                <option value="120">2시간</option>
                <option value="0">사용 안함</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-800">IP 제한</h4>
                <p className="text-sm text-gray-600">특정 IP 주소에서만 관리자 접근을 허용합니다.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 데이터베이스 관리 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">데이터베이스 관리</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              백업 생성
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              백업 복원
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 15a1 1 0 01-1-1v-6a1 1 0 112 0v6a1 1 0 01-1 1z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M6 5v6a1 1 0 001 1h6a1 1 0 001-1V5a1 1 0 00-1-1H7a1 1 0 00-1 1z" clipRule="evenodd" />
              </svg>
              데이터 정리
            </button>
          </div>
        </div>

        {/* 시스템 정보 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">시스템 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Node.js 버전:</span>
                <span className="font-medium">v20.x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next.js 버전:</span>
                <span className="font-medium">15.3.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Firebase SDK:</span>
                <span className="font-medium">v11.7.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">마지막 업데이트:</span>
                <span className="font-medium">2024-01-15</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">서버 상태:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  정상
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">데이터베이스:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  연결됨
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">캐시 상태:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  활성
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">업타임:</span>
                <span className="font-medium">7일 14시간</span>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors">
            설정 저장
          </button>
        </div>
      </div>
    </div>
  );
} 