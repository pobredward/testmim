import React from "react";

const SOCIALS = [
  {
    name: "카카오",
    key: "kakao",
    label: "카카오로 로그인",
    href: "/api/auth/kakao",
    btn: true,
    bg: "bg-[#FEE500] hover:bg-[#ffe14f] border border-[#FEE500]",
    text: "text-[#392020]",
  },
  {
    name: "애플",
    key: "apple",
    label: "Apple로 로그인",
    href: "/api/auth/apple",
    btn: true,
    bg: "bg-black hover:bg-gray-900 border border-black",
    text: "text-white",
  },
  {
    name: "구글",
    key: "google",
    label: "구글",
    href: "/api/auth/google",
    btn: false,
  },
  {
    name: "페이스북",
    key: "facebook",
    label: "페이스북",
    href: "/api/auth/facebook",
    btn: false,
  },
  {
    name: "네이버",
    key: "naver",
    label: "네이버",
    href: "/api/auth/naver",
    btn: false,
  },
];

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-2">로그인</h1>
      <p className="text-gray-600 mb-6 text-center">소셜 계정으로 간편하게 로그인하세요.</p>
      <div className="w-full max-w-xs flex flex-col gap-3 mb-6">
        {SOCIALS.filter(s => s.btn).map(s => (
          <a
            key={s.key}
            href={s.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base justify-center transition ${s.bg} ${s.text}`}
            style={{ minHeight: 48 }}
            aria-label={s.label}
          >
            <img src={`/btn_${s.key}.svg`} alt={s.name + " 로고"} className="w-6 h-6 mr-2" />
            <span className="flex-1 text-center">{s.label}</span>
          </a>
        ))}
      </div>
      <div className="flex items-center w-full max-w-xs mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-3 text-xs text-gray-400">또는</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="flex gap-4 mb-2">
        {SOCIALS.filter(s => !s.btn).map(s => (
          <a
            key={s.key}
            href={s.href}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow hover:shadow-md transition"
            aria-label={s.label + "로 로그인"}
          >
            <img src={`/btn_${s.key}.svg`} alt={s.name + " 로고"} className="w-7 h-7" />
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-6 text-center">
        로그인 시 <b>개인정보는 저장되지 않으며</b>,<br />
        서비스 이용을 위한 최소한의 인증만 진행됩니다.
      </p>
    </div>
  );
} 