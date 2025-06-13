"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { detectBrowserLanguage } from "@/i18n";
import { db } from "@/firebase";
import { validateNickname, checkNicknameDuplicate, suggestAlternativeNicknames } from "@/utils/nickname";
import { updateUserOnboarding } from "@/utils/userAuth";

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  
  // i18n 초기화
  useEffect(() => {
    const clientLanguage = detectBrowserLanguage();
    if (i18n.language !== clientLanguage) {
      i18n.changeLanguage(clientLanguage);
    }
  }, [i18n]);
  
  // 폼 상태
  const [formData, setFormData] = useState({
    nickname: "",
    birthDate: "",
    gender: "",
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // 닉네임 관련 상태
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'checking' | 'available' | 'duplicate' | 'invalid'>('idle');
  const [nicknameSuggestions, setNicknameSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    
    // 로그인하지 않은 경우 로그인 페이지로
    if (!session) {
      router.push("/signin");
      return;
    }
    
    console.log("🎯 온보딩 페이지 - 사용자 상태:", {
      uid: session.user?.id,
      email: session.user?.email,
      provider: session.user?.provider,
      onboardingCompleted: session.user?.onboardingCompleted
    });

    // 기존 정보가 있다면 폼에 미리 채우기
    if (session.user) {
      setFormData({
        nickname: session.user.nickname || "",
        birthDate: session.user.birthDate || "",
        gender: session.user.gender || "",
        bio: session.user.bio || "",
      });
    }
  }, [session, status, router]);

  // 닉네임 중복 체크 (디바운싱)
  const checkNickname = useCallback(async (nickname: string) => {
    if (!nickname.trim()) {
      setNicknameStatus('idle');
      setNicknameSuggestions([]);
      return;
    }

    // 기본 유효성 검사
    const validationError = validateNickname(nickname);
    if (validationError) {
      setNicknameStatus('invalid');
      setErrors(prev => ({ ...prev, nickname: validationError }));
      setNicknameSuggestions([]);
      return;
    }

    setIsCheckingNickname(true);
    setNicknameStatus('checking');

    try {
      const isDuplicate = await checkNicknameDuplicate(nickname, session?.user?.id);
      
      if (isDuplicate) {
        setNicknameStatus('duplicate');
        setErrors(prev => ({ ...prev, nickname: t('onboarding.errors.nicknameDuplicate') }));
        
        // 대안 제안
        const suggestions = suggestAlternativeNicknames(nickname);
        setNicknameSuggestions(suggestions);
      } else {
        setNicknameStatus('available');
        setErrors(prev => ({ ...prev, nickname: "" }));
        setNicknameSuggestions([]);
      }
    } catch (error) {
      console.error("닉네임 체크 오류:", error);
      setNicknameStatus('idle');
    } finally {
      setIsCheckingNickname(false);
    }
  }, [session?.user?.id, t]);

  // 닉네임 입력 시 디바운싱
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formData.nickname) {
        checkNickname(formData.nickname);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.nickname, checkNickname]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // 닉네임 검증
    if (nicknameStatus === 'duplicate' || nicknameStatus === 'invalid') {
      return false;
    }
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = t('onboarding.errors.nicknameRequired');
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = t('onboarding.errors.birthDateRequired');
    }
    
    if (!formData.gender) {
      newErrors.gender = t('onboarding.errors.genderRequired');
    }
    
    if (formData.bio.length > 100) {
      newErrors.bio = t('onboarding.errors.bioTooLong');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !session?.user?.id || nicknameStatus !== 'available') return;
    
    setIsSubmitting(true);
    
    try {
      // 새로운 유틸리티 함수 사용
      await updateUserOnboarding(session.user.id, {
        nickname: formData.nickname.trim(),
        birthDate: formData.birthDate,
        gender: formData.gender,
        bio: formData.bio.trim() || "",
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
      alert(t('onboarding.errors.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 닉네임이 아닌 필드의 에러 초기화
    if (field !== 'nickname' && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFormData(prev => ({ ...prev, nickname: suggestion }));
    setNicknameSuggestions([]);
  };

  const getNicknameInputStyle = () => {
    if (nicknameStatus === 'available') return "border-emerald-300 focus:border-emerald-500 bg-emerald-50/50";
    if (nicknameStatus === 'duplicate' || nicknameStatus === 'invalid') return "border-red-300 focus:border-red-500 bg-red-50/50";
    return "border-gray-200 focus:border-blue-500 bg-gray-50/50";
  };

  const getNicknameStatusIcon = () => {
    if (isCheckingNickname) return (
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    );
    if (nicknameStatus === 'available') return (
      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    );
    if (nicknameStatus === 'duplicate' || nicknameStatus === 'invalid') return (
      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    );
    return "";
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">{t('onboarding.loading')}</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center mb-8 shadow-xl">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-3">{t('onboarding.header.title')}</h1>
        <p className="text-blue-100 text-lg whitespace-pre-line">
          {t('onboarding.header.subtitle')}
        </p>
      </div>

      {/* 메인 폼 */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 닉네임 */}
            <div className="space-y-3">
              <label htmlFor="nickname" className="block text-sm font-bold text-gray-800">
                {t('onboarding.form.nickname.label')} <span className="text-red-500">{t('onboarding.form.nickname.required')}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange("nickname", e.target.value)}
                  className={`w-full px-4 py-4 pr-12 border-2 rounded-xl focus:outline-none transition-all duration-200 text-lg ${getNicknameInputStyle()}`}
                  placeholder={t('onboarding.form.nickname.placeholder')}
                  maxLength={20}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {getNicknameStatusIcon()}
                </div>
              </div>
              
              {errors.nickname && (
                <p className="text-red-500 text-xs mt-1">{errors.nickname}</p>
              )}
              
              {nicknameStatus === 'available' && !errors.nickname && (
                <p className="text-green-600 text-xs mt-1">{t('onboarding.form.nickname.available')}</p>
              )}
              
              {/* 대안 닉네임 제안 */}
              {nicknameSuggestions.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">{t('onboarding.form.nickname.suggestions')}</p>
                  <div className="flex flex-wrap gap-2">
                    {nicknameSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 생년월일 */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.form.birthDate.label')} <span className="text-red-500">{t('onboarding.form.birthDate.required')}</span>
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
                {t('onboarding.form.gender.label')} <span className="text-red-500">{t('onboarding.form.gender.required')}</span>
              </label>
              <div className="flex gap-4">
                {[
                  { value: "male", label: t('onboarding.form.gender.options.male') },
                  { value: "female", label: t('onboarding.form.gender.options.female') },
                  { value: "other", label: t('onboarding.form.gender.options.other') },
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
                {t('onboarding.form.bio.label')} <span className="text-gray-400">{t('onboarding.form.bio.optional')}</span>
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bio ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t('onboarding.form.bio.placeholder')}
                maxLength={100}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio && (
                  <p className="text-red-500 text-xs">{errors.bio}</p>
                )}
                <p className="text-gray-400 text-xs ml-auto">
                  {formData.bio.length}/{t('onboarding.form.bio.maxLength')}
                </p>
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting || nicknameStatus !== 'available' || !formData.nickname.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-lg text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('onboarding.button.submitting')}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  {t('onboarding.button.submit')}
                </div>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 text-xl">ℹ️</div>
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">{t('onboarding.privacy.title')}</h3>
            <p className="text-sm text-blue-700 leading-relaxed whitespace-pre-line">
              {t('onboarding.privacy.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 