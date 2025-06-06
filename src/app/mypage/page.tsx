"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserById, updateUserProfile } from "@/lib/firestore";
import type { UserProfileInput } from "@/types/user";

export default function MyPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserProfileInput>({
    nickname: '',
    gender: 'other',
  });

  // 로그인 상태 확인
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/signin");
      return;
    }

    // 사용자 정보로 폼 데이터 초기화
    if (session.user) {
      setFormData({
        nickname: session.user.nickname || '',
        gender: session.user.gender || 'other',
      });
    }
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      setError("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    if (!formData.nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    if (formData.nickname.length < 2 || formData.nickname.length > 10) {
      setError("닉네임은 2-10자 사이로 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateUserProfile(session.user.id, formData);
      
      // 세션 업데이트
      await update();
      
      setIsEditing(false);
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      setError("프로필 업데이트 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // 원래 값으로 되돌리기
    if (session?.user) {
      setFormData({
        nickname: session.user.nickname || '',
        gender: session.user.gender || 'other',
      });
    }
    setIsEditing(false);
    setError(null);
  };

  // 로딩 중
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const genderLabels = {
    male: '남성',
    female: '여성',
    other: '선택하지 않음'
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
      
      {/* 프로필 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">프로필 정보</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              수정
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          {session.user?.image && (
            <img 
              src={session.user.image} 
              alt="프로필" 
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium text-lg">{session.user?.name}</p>
            <p className="text-sm text-gray-500">{session.user?.email}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            {/* 닉네임 수정 */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="2-10자 사이로 입력해주세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                maxLength={10}
              />
            </div>

            {/* 성별 수정 */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                성별
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="other">선택하지 않음</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 버튼들 */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
              >
                {loading ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">닉네임:</span>
              <span className="font-medium">{session.user?.nickname || '설정되지 않음'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">성별:</span>
              <span className="font-medium">{genderLabels[session.user?.gender || 'other']}</span>
            </div>
          </div>
        )}
      </div>

      {/* 추가 기능들 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">기능</h2>
        <div className="space-y-3 text-gray-600">
          <p>• 내가 본 테스트 결과 (준비 중)</p>
          <p>• 즐겨찾기한 테스트 (준비 중)</p>
          <p>• 테스트 기록 (준비 중)</p>
        </div>
      </div>
    </div>
  );
} 