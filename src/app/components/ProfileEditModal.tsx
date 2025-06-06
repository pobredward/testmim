"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { validateNickname, checkNicknameDuplicate } from "@/utils/nickname";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function ProfileEditModal({ isOpen, onClose, onSave }: ProfileEditModalProps) {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    nickname: "",
    birthDate: "",
    gender: "",
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'checking' | 'available' | 'duplicate' | 'invalid'>('idle');

  useEffect(() => {
    if (isOpen && session?.user) {
      setFormData({
        nickname: session.user.nickname || "",
        birthDate: session.user.birthDate || "",
        gender: session.user.gender || "",
        bio: session.user.bio || "",
      });
    }
  }, [isOpen, session]);

  // 닉네임 중복 체크
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (formData.nickname && formData.nickname !== session?.user?.nickname) {
        const validationError = validateNickname(formData.nickname);
        if (validationError) {
          setNicknameStatus('invalid');
          setErrors(prev => ({ ...prev, nickname: validationError }));
          return;
        }

        setNicknameStatus('checking');
        try {
          const isDuplicate = await checkNicknameDuplicate(formData.nickname, session?.user?.id);
          if (isDuplicate) {
            setNicknameStatus('duplicate');
            setErrors(prev => ({ ...prev, nickname: "이미 사용 중인 닉네임입니다." }));
          } else {
            setNicknameStatus('available');
            setErrors(prev => ({ ...prev, nickname: "" }));
          }
        } catch (error) {
          setNicknameStatus('idle');
        }
      } else if (formData.nickname === session?.user?.nickname) {
        setNicknameStatus('available');
        setErrors(prev => ({ ...prev, nickname: "" }));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.nickname, session?.user?.nickname, session?.user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id || nicknameStatus === 'duplicate' || nicknameStatus === 'invalid') return;
    
    setIsSubmitting(true);
    
    try {
      // Firestore 업데이트
      const userRef = doc(db, "users", session.user.id);
      await updateDoc(userRef, {
        nickname: formData.nickname.trim(),
        birthDate: formData.birthDate,
        gender: formData.gender,
        bio: formData.bio.trim() || "",
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
        }
      });
      
      onSave();
      onClose();
      
    } catch (error) {
      console.error("프로필 수정 오류:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* 블러 배경 */}
        <div 
          className="absolute inset-0 bg-white/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* 모달 컨테이너 */}
        <div className="relative z-10 flex items-center justify-center min-h-full p-4">
          <div 
            className={`relative w-full max-w-lg transform transition-all duration-300 ${
              isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            {/* 모달 콘텐츠 */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* 헤더 그라데이션 */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">프로필 수정</h2>
                    <p className="text-blue-100 text-sm mt-1">개인 정보를 업데이트하세요</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 폼 콘텐츠 */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 닉네임 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      닉네임 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.nickname}
                        onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                        className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                          nicknameStatus === 'available' 
                            ? 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/50' :
                          nicknameStatus === 'duplicate' || nicknameStatus === 'invalid' 
                            ? 'border-red-300 focus:border-red-500 bg-red-50/50' :
                            'border-gray-200 focus:border-blue-500 bg-gray-50/50'
                        }`}
                        placeholder="멋진 닉네임을 입력하세요"
                        maxLength={20}
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        {nicknameStatus === 'checking' && (
                          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {nicknameStatus === 'available' && (
                          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {(nicknameStatus === 'duplicate' || nicknameStatus === 'invalid') && (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.nickname && (
                      <p className="text-red-500 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.nickname}
                      </p>
                    )}
                    {nicknameStatus === 'available' && !errors.nickname && (
                      <p className="text-emerald-600 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        사용 가능한 닉네임입니다!
                      </p>
                    )}
                  </div>

                  {/* 생년월일 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      생년월일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-gray-50/50 transition-all duration-200"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* 성별 */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      성별 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "male", label: "남성", icon: "👨" },
                        { value: "female", label: "여성", icon: "👩" },
                        { value: "other", label: "기타", icon: "👤" },
                      ].map((option) => (
                        <label key={option.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value={option.value}
                            checked={formData.gender === option.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                            className="sr-only"
                          />
                          <div className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                            formData.gender === option.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}>
                            <div className="text-lg mb-1">{option.icon}</div>
                            <div className="text-sm font-medium">{option.label}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 한줄소개 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      한줄소개
                    </label>
                    <div className="relative">
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-gray-50/50 transition-all duration-200 resize-none"
                        placeholder="자신을 간단히 소개해주세요 ✨"
                        maxLength={100}
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
                        {formData.bio.length}/100
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* 푸터 버튼들 */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || nicknameStatus !== 'available' || !formData.nickname.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 font-medium shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        저장 중...
                      </div>
                    ) : (
                      "저장하기"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 