"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">마이페이지</h1>
      
      {/* 사용자 정보 섹션 */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">프로필 정보</h2>
        <div className="flex items-center gap-4 mb-6">
          {session.user?.image && (
            <img 
              src={session.user.image} 
              alt="프로필 이미지" 
              className="w-16 h-16 rounded-full object-cover border border-gray-200"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">{session.user?.name || "이름 없음"}</p>
            <p className="text-gray-600 text-sm">{session.user?.email}</p>
            <p className="text-gray-500 text-xs mt-1">
              {session.user?.provider ? `${session.user.provider} 로그인` : "소셜 로그인"}
            </p>
          </div>
        </div>
        
        {/* 가입일 정보 */}
        {session.user?.createdAt && (
          <div className="text-sm text-gray-500">
            가입일: {new Date(session.user.createdAt.seconds * 1000).toLocaleDateString("ko-KR")}
          </div>
        )}
      </div>

      {/* 기능 섹션 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">내 활동</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">💝 내가 좋아한 테스트</h3>
            <p className="text-gray-600 text-sm">좋아요를 누른 테스트들을 모아볼 수 있습니다.</p>
            <p className="text-gray-400 text-xs mt-1">(준비 중)</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">📚 스크랩한 테스트</h3>
            <p className="text-gray-600 text-sm">나중에 다시 보려고 저장한 테스트들입니다.</p>
            <p className="text-gray-400 text-xs mt-1">(준비 중)</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">📊 내 테스트 결과</h3>
            <p className="text-gray-600 text-sm">지금까지 진행한 테스트 결과들을 확인할 수 있습니다.</p>
            <p className="text-gray-400 text-xs mt-1">(준비 중)</p>
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm">
          ℹ️ <strong>개인정보 보호</strong><br />
          테스트밈은 사용자의 개인정보를 안전하게 보호합니다. 
          로그인 정보는 Firebase에 암호화되어 저장되며, 
          필요 이상의 개인정보는 수집하지 않습니다.
        </p>
      </div>
    </div>
  );
} 