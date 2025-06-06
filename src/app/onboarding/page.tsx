"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  // 폼 상태
  const [formData, setFormData] = useState({
    nickname: "",
    birthDate: "",
    gender: "",
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (status === "loading") return;
    
    // 로그인하지 않은 경우 로그인 페이지로
    if (!session) {
      router.push("/signin");
      return;
    }
    
    // 이미 온보딩을 완료한 경우 홈으로
    if (session.user?.onboardingCompleted) {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해주세요.";
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = "닉네임은 2글자 이상이어야 합니다.";
    } else if (formData.nickname.length > 20) {
      newErrors.nickname = "닉네임은 20글자 이하여야 합니다.";
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = "생년월일을 선택해주세요.";
    }
    
    if (!formData.gender) {
      newErrors.gender = "성별을 선택해주세요.";
    }
    
    if (formData.bio.length > 100) {
      newErrors.bio = "한줄소개는 100글자 이하여야 합니다.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !session?.user?.id) return;
    
    setIsSubmitting(true);
    
    try {
      // Firestore 업데이트
      const userRef = doc(db, "users", session.user.id);
      await updateDoc(userRef, {
        nickname: formData.nickname.trim(),
        birthDate: formData.birthDate,
        gender: formData.gender,
        bio: formData.bio.trim() || "",
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
      });
      
      // 세션 업데이트
      await update({
        ...session,
        user: {
          ...session.user,
          nickname: formData.nickname.trim(),
          birthDate: formData.birthDate,
          gender: formData.gender,
          bio: formData.bio.trim(),
          onboardingCompleted: true,
        }
      });
      
      // 홈으로 리디렉션
      router.push("/");
      
    } catch (error) {
      console.error("온보딩 저장 오류:", error);
      alert("정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">환영합니다! 🎉</h1>
        <p className="text-gray-600">
          테스트밈에서 더 나은 경험을 위해<br />
          간단한 정보를 입력해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 닉네임 */}
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
            닉네임 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nickname"
            value={formData.nickname}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nickname ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="다른 사용자들에게 보여질 이름"
            maxLength={20}
          />
          {errors.nickname && (
            <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>
          )}
        </div>

        {/* 생년월일 */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
            생년월일 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="birthDate"
            value={formData.birthDate}
            onChange={(e) => handleInputChange("birthDate", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.birthDate ? "border-red-500" : "border-gray-300"
            }`}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.birthDate && (
            <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>
          )}
        </div>

        {/* 성별 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            성별 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {[
              { value: "male", label: "남성" },
              { value: "female", label: "여성" },
              { value: "other", label: "기타" },
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={formData.gender === option.value}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="mr-2 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        {/* 한줄소개 */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            한줄소개 <span className="text-gray-400">(선택)</span>
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.bio ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="자신을 간단히 소개해주세요"
            maxLength={100}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.bio && (
              <p className="text-red-500 text-xs">{errors.bio}</p>
            )}
            <p className="text-gray-400 text-xs ml-auto">
              {formData.bio.length}/100
            </p>
          </div>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {isSubmitting ? "저장 중..." : "시작하기"}
        </button>
      </form>

      {/* 안내 메시지 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 text-center">
          입력하신 정보는 더 나은 테스트 추천과 개인화된 경험을 위해 사용됩니다.<br />
          언제든지 마이페이지에서 수정할 수 있습니다.
        </p>
      </div>
    </div>
  );
} 