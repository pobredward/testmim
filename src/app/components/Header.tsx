import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b bg-white sticky top-0 z-30">
      <nav className="max-w-2xl mx-auto flex items-center h-14 px-4">
        <Link href="/" className="font-bold text-lg tracking-tight text-gray-900">테스트밈</Link>
        <div className="flex-1" />
        <Link href="/mypage" className="text-gray-500 hover:text-gray-900 ml-4">마이페이지</Link>
        <Link href="/login" className="text-gray-500 hover:text-gray-900 ml-4">로그인</Link>
      </nav>
    </header>
  );
} 