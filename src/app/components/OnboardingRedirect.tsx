"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    
    // 온보딩 페이지나 로그인 페이지에서는 리디렉션하지 않음
    if (pathname === "/onboarding" || pathname === "/signin") return;
    
    if (session?.user) {
      console.log("🔍 온보딩 상태 확인:", {
        uid: session.user.id,
        email: session.user.email,
        provider: session.user.provider,
        onboardingCompleted: session.user.onboardingCompleted,
        pathname: pathname
      });
      
      // 온보딩이 완료되지 않은 사용자는 온보딩 페이지로 리디렉션
      if (session.user.onboardingCompleted === false) {
        console.log("🚀 온보딩 페이지로 리디렉션");
        router.push("/onboarding");
      }
    }
  }, [session, status, router, pathname]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
} 