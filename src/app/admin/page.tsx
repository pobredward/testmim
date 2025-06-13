"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { detectBrowserLanguage } from "@/i18n";
import Link from "next/link";

export default function AdminPage() {
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

    // 관리자 권한 확인
    if (session.user?.role !== "admin") {
      setLoading(false);
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

  if (!session) {
    return null;
  }

  // 관리자가 아닌 경우 접근 거부 메시지
  if (session.user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-6xl mb-6">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('admin.accessDenied')}</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          {t('admin.accessDeniedMessage')}
        </p>
        <Link
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          {t('admin.goHome')}
        </Link>
      </div>
    );
  }

  const adminSections = [
    {
      title: t('admin.dashboard.sections.users'),
      description: "사용자 계정 관리, 권한 설정",
      icon: "👥",
      href: "/admin/users",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: t('admin.dashboard.sections.tests'),
      description: "테스트 참여 통계, 결과 분석",
      icon: "📊",
      href: "/admin/test-stats",
      color: "from-green-500 to-green-600"
    },
    {
      title: t('admin.dashboard.sections.content'),
      description: "테스트 콘텐츠 관리",
      icon: "📝",
      href: "/admin/content",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: t('admin.dashboard.sections.system'),
      description: "시스템 설정 및 환경 관리",
      icon: "⚙️",
      href: "/admin/settings",
      color: "from-gray-500 to-gray-600"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center mb-8 shadow-xl">
        <div className="text-6xl mb-4">🛠️</div>
        <h1 className="text-3xl font-bold text-white mb-3">{t('admin.dashboard.title')}</h1>
        <p className="text-indigo-100 text-lg">
          {t('admin.dashboard.subtitle')}
        </p>
        <div className="mt-4 text-indigo-200 text-sm">
          {session.user?.nickname || session.user?.name}님으로 로그인됨
        </div>
      </div>

      {/* 관리 섹션 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {adminSections.map((section, index) => (
          <Link
            key={index}
            href={section.href}
            className="group block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`bg-gradient-to-r ${section.color} p-6`}>
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                  <p className="text-sm opacity-90">{section.description}</p>
                </div>
                <div className="text-4xl opacity-80">{section.icon}</div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">관리 페이지로 이동</span>
                <svg 
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 빠른 통계 */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">빠른 통계</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">-</div>
            <div className="text-sm text-blue-800">총 사용자</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">-</div>
            <div className="text-sm text-green-800">총 테스트 결과</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">-</div>
            <div className="text-sm text-purple-800">활성 테스트</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">-</div>
            <div className="text-sm text-orange-800">오늘 가입자</div>
          </div>
        </div>
      </div>
    </div>
  );
} 