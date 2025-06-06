export interface SocialProvider {
  name: string;
  key: string;
  label: string;
  href: string;
  btn: boolean;
  bg?: string;
  text?: string;
}

export const SOCIAL_PROVIDERS: SocialProvider[] = [
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
    label: "구글로 로그인",
    href: "/api/auth/google",
    btn: false,
  },
  {
    name: "페이스북",
    key: "facebook",
    label: "페이스북으로 로그인",
    href: "/api/auth/facebook",
    btn: false,
  },
  {
    name: "네이버",
    key: "naver",
    label: "네이버로 로그인",
    href: "/api/auth/naver",
    btn: false,
  },
];

// 주요 소셜 로그인 버튼으로 표시할 제공자들
export const getPrimaryProviders = () => SOCIAL_PROVIDERS.filter(provider => provider.btn);

// 아이콘으로만 표시할 제공자들
export const getSecondaryProviders = () => SOCIAL_PROVIDERS.filter(provider => !provider.btn); 