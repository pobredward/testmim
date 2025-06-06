"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserById, updateUserProfile } from "@/lib/firestore";
import type { UserProfileInput } from "@/types/user";

export default function CompleteProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserProfileInput>({
    nickname: '',
    gender: 'other',
  });

  // 로그인 상태 확인 및 프로필 완성 여부 체크
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/signin");
      return;
    }

    // 이미 프로필이 완성된 경우 홈으로 리다이렉트
    if (session.user?.isProfileComplete) {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      // 성공 후 홈으로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      setError("프로필 업데이트 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중이거나 세션이 없을 때
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">프로필 설정</h1>
          <p className="text-gray-600">
            테스트밈을 더 재밌게 이용하기 위해<br />
            추가 정보를 입력해주세요!
          </p>
        </div>

        {/* 사용자 정보 표시 */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-6">
          {session.user?.image && (
            <img 
              src={session.user.image} 
              alt="프로필" 
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-medium">{session.user?.name}</p>
            <p className="text-sm text-gray-500">{session.user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 닉네임 입력 */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              닉네임 *
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="2-10자 사이로 입력해주세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              maxLength={10}
              required
            />
          </div>

          {/* 성별 선택 */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
              성별
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                설정 중...
              </div>
            ) : (
              "프로필 설정 완료"
            )}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6 text-center">
          나중에 마이페이지에서 언제든 수정할 수 있어요.
        </p>
      </div>
    </div>
  );
} 