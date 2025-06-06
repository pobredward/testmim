"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (session?.user && session.user.onboardingCompleted === false) {
      // 온보딩이 완료되지 않은 사용자는 온보딩 페이지로 리디렉션
      router.push("/onboarding");
    }
  }, [session, status, router]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
} 