"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function Header() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
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

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleSignOut = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  return (
    <header className="w-full border-b bg-white sticky top-0 z-30">
      <div className="w-full flex items-center h-14">
        {/* 왼쪽 영역: 메뉴(모바일) + 로고 */}
        <div className="max-w-2xl mx-auto flex items-center flex-1 px-4 md:px-4">
          {/* 모바일: 메뉴바를 왼쪽으로 */}
          <button
            onClick={toggleNav}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors mr-3"
            aria-label="메뉴 열기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-600">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* 로고와 제목 - 모바일에서는 가운데 정렬을 위해 flex-1 사용 */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link href="/" className="flex items-center space-x-2 font-bold text-lg tracking-tight text-gray-900" aria-label={t('header.homePageTitle')}>
              <Image 
                src="/favicon-32x32.png" 
                alt={t('header.logoAlt')} 
                width={28} 
                height={28}
                className="flex-shrink-0"
              />
              <span>{t('header.siteName')}</span>
            </Link>
          </div>
        </div>

        {/* 오른쪽 영역: 언어 선택기 + 프로필 - 데스크톱에서 화면 끝에 붙게 */}
        <div className="flex items-center gap-2 pr-4">
          {/* 언어 선택기 */}
          <LanguageSelector />
          
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
                <Image 
                  src={session.user.image} 
                  alt="프로필" 
                  width={32}
                  height={32}
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
                      {t('header.mypage')}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {t('header.logout')}
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
                      {t('header.login')}
                    </Link>
                    <Link
                      href="/signin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {t('header.signup')}
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 모바일 네비게이션 메뉴 */}
      {isNavOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/"
              className="block py-2 text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setIsNavOpen(false)}
            >
              🏠 {t('header.allTests')}
            </Link>
            <Link
              href="/create"
              className="block py-2 text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setIsNavOpen(false)}
            >
              ✨ {t('header.createTest')}
            </Link>
            {session && (
              <Link
                href="/mypage"
                className="block py-2 text-sm text-gray-600 hover:text-gray-900"
                onClick={() => setIsNavOpen(false)}
              >
                📊 {t('header.myTests')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 