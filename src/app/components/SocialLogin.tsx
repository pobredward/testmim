"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { getPrimaryProviders, getSecondaryProviders } from "@/data/socialAuth";

export default function SocialLogin() {
  const primaryProviders = getPrimaryProviders();
  const secondaryProviders = getSecondaryProviders();

  const handleSocialLogin = (providerId: string) => {
    console.log("🔐 소셜 로그인 시도:", providerId);
    signIn(providerId, { 
      callbackUrl: "/",
      redirect: true 
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-2">로그인</h1>
      <p className="text-gray-600 mb-6 text-center">소셜 계정으로 간편하게 로그인하세요.</p>
      
      {/* 주요 소셜 로그인 버튼들 */}
      <div className="w-full max-w-xs flex flex-col gap-3 mb-6">
        {primaryProviders.map(provider => (
          <button
            key={provider.key}
            onClick={() => handleSocialLogin(provider.key)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base justify-center transition ${provider.bg} ${provider.text}`}
            style={{ minHeight: 48 }}
            aria-label={provider.label}
          >
            <img 
              src={`/btn_${provider.key}.svg`} 
              alt={provider.name + " 로고"} 
              className="w-6 h-6 mr-2" 
            />
            <span className="flex-1 text-center">{provider.label}</span>
          </button>
        ))}
      </div>

      {/* 구분선 */}
      <div className="flex items-center w-full max-w-xs mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-3 text-xs text-gray-400">또는</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* 보조 소셜 로그인 아이콘들 */}
      <div className="flex gap-4 mb-2">
        {secondaryProviders.map(provider => (
          <button
            key={provider.key}
            onClick={() => handleSocialLogin(provider.key)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow hover:shadow-md transition"
            aria-label={provider.label}
          >
            <img 
              src={`/btn_${provider.key}.svg`} 
              alt={provider.name + " 로고"} 
              className="w-7 h-7" 
            />
          </button>
        ))}
      </div>

      {/* 개인정보 안내 */}
      <p className="text-xs text-gray-400 mt-6 text-center">
        로그인 시 <b>개인정보는 저장되지 않으며</b>,<br />
        서비스 이용을 위한 최소한의 인증만 진행됩니다.
      </p>
    </div>
  );
} 