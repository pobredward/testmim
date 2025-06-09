"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import ProfileEditModal from "@/app/components/ProfileEditModal";
import TestResultCards from "@/app/components/TestResultCards";

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        <p className="text-gray-500">로딩 중...</p>
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

  // 성별 한국어 변환
  const getGenderText = (gender: string) => {
    switch (gender) {
      case "male": return "남성";
      case "female": return "여성";
      case "other": return "기타";
      default: return "미설정";
    }
  };

  const age = session.user?.birthDate ? calculateAge(session.user.birthDate) : null;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">마이페이지</h1>
      
      {/* 기본 프로필 정보 섹션 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">프로필 정보</h2>
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          {session.user?.image && (
            <div className="relative w-16 h-16">
              <Image 
                src={session.user.image} 
                alt="프로필 이미지" 
                fill
                className="rounded-full object-cover border border-gray-200"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-gray-900 text-lg">
                {session.user?.nickname || session.user?.name || "이름 없음"}
              </p>
              {session.user?.nickname && session.user?.name && (
                <span className="text-gray-500 text-sm">({session.user.name})</span>
              )}
            </div>
            <p className="text-gray-600 text-sm">{session.user?.email}</p>
            <p className="text-gray-500 text-xs mt-1">
              {session.user?.provider ? `${session.user.provider} 로그인` : "소셜 로그인"}
            </p>
          </div>
        </div>
      </div>

      {/* 상세 정보 섹션 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">상세 정보</h2>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            수정하기
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 닉네임 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">닉네임</p>
            <p className="font-medium text-gray-800">
              {session.user?.nickname || "미설정"}
            </p>
          </div>

          {/* 나이/생년월일 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">나이</p>
            <p className="font-medium text-gray-800">
              {age ? `${age}세` : "미설정"}
              {session.user?.birthDate && (
                <span className="text-gray-500 text-sm ml-1">
                  ({new Date(session.user.birthDate).toLocaleDateString("ko-KR")})
                </span>
              )}
            </p>
          </div>

          {/* 성별 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">성별</p>
            <p className="font-medium text-gray-800">
              {session.user?.gender ? getGenderText(session.user.gender) : "미설정"}
            </p>
          </div>

          {/* 가입일 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">가입일</p>
            <p className="font-medium text-gray-800">
              {session.user?.createdAt 
                ? new Date(session.user.createdAt.seconds * 1000).toLocaleDateString("ko-KR")
                : "정보 없음"
              }
            </p>
          </div>
        </div>

        {/* 한줄소개 */}
        {session.user?.bio && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">한줄소개</p>
            <p className="text-gray-800">{session.user.bio}</p>
          </div>
        )}
      </div>

      {/* 테스트 결과 섹션 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">내 테스트 결과</h2>
        <TestResultCards />
      </div>

      {/* 안내 메시지 */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800 text-sm">
          ℹ️ <strong>개인정보 보호</strong><br />
          테스트밈은 사용자의 개인정보를 안전하게 보호합니다. 
          로그인 정보는 Firebase에 암호화되어 저장되며, 
          필요 이상의 개인정보는 수집하지 않습니다.
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