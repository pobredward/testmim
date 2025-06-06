"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  return (
    <header className="w-full border-b bg-white sticky top-0 z-30">
      <nav className="max-w-2xl mx-auto flex items-center h-14 px-4">
        <Link href="/" className="font-bold text-lg tracking-tight text-gray-900">테스트밈</Link>
        <div className="flex-1" />
        
        {/* 프로필 드롭다운 */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="프로필 메뉴"
          >
            {status === "loading" ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt="프로필" 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-600"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {session ? (
                // 로그인된 상태
                <>
                  {(session.user?.nickname || session.user?.name) && (
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                      {session.user?.nickname || session.user?.name}님
                    </div>
                  )}
                  <Link
                    href="/mypage"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                // 로그인되지 않은 상태
                <>
                  <Link
                    href="/signin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
} 