"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { detectBrowserLanguage } from "@/i18n";
import ProfileEditModal from "@/app/components/ProfileEditModal";
import TestResultCards from "@/app/components/TestResultCards";

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // i18n 초기화
  useEffect(() => {
    const clientLanguage = detectBrowserLanguage();
    if (i18n.language !== clientLanguage) {
      i18n.changeLanguage(clientLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    if (status === "loading") return; // 로딩 중이면 대기
    if (!session) {
      router.push("/signin"); // 로그인하지 않은 경우 로그인 페이지로 이동
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">{t('mypage.loading')}</p>
      </div>
    );
  }

  if (!session) {
    return null; // useEffect에서 리디렉션 처리됨
  }

  // 나이 계산 함수
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // 성별 번역
  const getGenderText = (gender: string) => {
    switch (gender) {
      case "male": return t('mypage.gender.male');
      case "female": return t('mypage.gender.female');
      case "other": return t('mypage.gender.other');
      default: return t('mypage.gender.notSet');
    }
  };

  const age = session.user?.birthDate ? calculateAge(session.user.birthDate) : null;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">{t('mypage.title')}</h1>
      
      {/* 기본 프로필 정보 섹션 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{t('mypage.profileInfo')}</h2>
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          {session.user?.image && (
            <div className="relative w-16 h-16">
              <Image 
                src={session.user.image} 
                alt={t('mypage.profileImage')} 
                fill
                className="rounded-full object-cover border border-gray-200"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-gray-900 text-lg">
                {session.user?.nickname || session.user?.name || t('mypage.values.noName')}
              </p>
              {session.user?.nickname && session.user?.name && (
                <span className="text-gray-500 text-sm">({session.user.name})</span>
              )}
            </div>
            <p className="text-gray-600 text-sm">{session.user?.email}</p>
            <p className="text-gray-500 text-xs mt-1">
              {session.user?.provider ? `${session.user.provider} ${t('mypage.loginWith')}` : t('mypage.socialLogin')}
            </p>
          </div>
        </div>
      </div>

      {/* 상세 정보 섹션 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{t('mypage.detailInfo')}</h2>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            {t('mypage.edit')}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 닉네임 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">{t('mypage.fields.nickname')}</p>
            <p className="font-medium text-gray-800">
              {session.user?.nickname || t('mypage.values.notSet')}
            </p>
          </div>

          {/* 나이/생년월일 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">{t('mypage.fields.age')}</p>
            <p className="font-medium text-gray-800">
              {age ? `${age}${t('mypage.values.years')}` : t('mypage.values.notSet')}
              {session.user?.birthDate && (
                <span className="text-gray-500 text-sm ml-1">
                  ({new Date(session.user.birthDate).toLocaleDateString()})
                </span>
              )}
            </p>
          </div>

          {/* 성별 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">{t('mypage.fields.gender')}</p>
            <p className="font-medium text-gray-800">
              {session.user?.gender ? getGenderText(session.user.gender) : t('mypage.values.notSet')}
            </p>
          </div>

          {/* 가입일 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">{t('mypage.fields.joinDate')}</p>
            <p className="font-medium text-gray-800">
              {session.user?.createdAt 
                ? new Date(session.user.createdAt.seconds * 1000).toLocaleDateString()
                : t('mypage.values.noInfo')
              }
            </p>
          </div>
        </div>

        {/* 한줄소개 */}
        {session.user?.bio && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">{t('mypage.fields.bio')}</p>
            <p className="text-gray-800">{session.user.bio}</p>
          </div>
        )}
      </div>

      {/* 테스트 결과 섹션 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">{t('mypage.testResults')}</h2>
        <TestResultCards />
      </div>

      {/* 안내 메시지 */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800 text-sm">
          ℹ️ <strong>{t('mypage.privacy.title')}</strong><br />
          {t('mypage.privacy.description')}
        </p>
      </div>

      {/* 프로필 수정 모달 */}
      <ProfileEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={() => {
          // 페이지 새로고침 없이 세션 정보가 자동으로 업데이트됨
          console.log("프로필이 수정되었습니다.");
        }}
      />


    </div>
  );
} 