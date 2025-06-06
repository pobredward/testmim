"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function ProfileCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 로딩 중이거나 로그인되지 않은 경우는 체크하지 않음
    if (status === "loading" || !session) return;

    // 프로필 설정 페이지나 로그인 관련 페이지는 체크하지 않음
    const excludePaths = ["/complete-profile", "/signin", "/api/auth"];
    if (excludePaths.some(path => pathname.startsWith(path))) return;

    // 프로필이 완성되지 않은 경우 프로필 설정 페이지로 리다이렉트
    if (session.user && !session.user.isProfileComplete) {
      router.push("/complete-profile");
    }
  }, [session, status, router, pathname]);

  return <>{children}</>;
} 