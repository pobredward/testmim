"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // 테마 초기화: localStorage → 시스템 → 기본값
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  // 토글 핸들러
  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  return (
    <header className="w-full border-b bg-white dark:bg-neutral-900 sticky top-0 z-30">
      <nav className="max-w-2xl mx-auto flex items-center h-14 px-4">
        <Link href="/" className="font-bold text-lg tracking-tight text-gray-900 dark:text-gray-100">테스트밈</Link>
        <div className="flex-1" />
        <button
          onClick={toggleTheme}
          aria-label="다크모드 토글"
          className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <Link href="/mypage" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white ml-4">마이페이지</Link>
        <Link href="/login" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white ml-4">로그인</Link>
      </nav>
    </header>
  );
} 