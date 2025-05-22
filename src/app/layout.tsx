import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "테스트밈",
  description: "무료 심리테스트, 성향테스트, MBTI, 재미있는 테스트 모음",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <Head>
        {/* favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        {/* apple touch icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        {/* manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* og:image, twitter */}
        <meta property="og:image" content="https://www.testmim.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.testmim.com/og-image.png" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}>
        <header className="w-full border-b bg-white sticky top-0 z-30">
          <nav className="max-w-2xl mx-auto flex items-center h-14 px-4">
            <Link href="/" className="font-bold text-lg tracking-tight text-gray-900">테스트밈</Link>
            <div className="flex-1" />
            <Link href="/mypage" className="text-gray-500 hover:text-gray-900 ml-4">마이페이지</Link>
            <Link href="/login" className="text-gray-500 hover:text-gray-900 ml-4">로그인</Link>
          </nav>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-8 min-h-[80vh]">{children}</main>
        <footer className="w-full border-t bg-white text-center text-xs text-gray-400 py-4 mt-8">
          © 2024 테스트밈 (testmim.com)
        </footer>
      </body>
    </html>
  );
}
