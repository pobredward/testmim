import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Head from "next/head";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainLayout from "./components/MainLayout";
import AuthProvider from "./components/AuthProvider";
import OnboardingRedirect from "./components/OnboardingRedirect";
import I18nProvider from "./components/I18nProvider";
import { generateMainPageMetadata } from "@/utils/metadata";
import PerformanceOptimizer from "./components/PerformanceOptimizer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 기본 메타데이터 (한국어)
export const metadata: Metadata = generateMainPageMetadata('ko');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD 구조화된 데이터
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "테스트밈",
    "alternateName": ["testmim", "TestMeme", "测试梦", "テストミーム"],
    "url": "https://www.testmim.com",
    "logo": "https://www.testmim.com/android-chrome-512x512.png",
    "sameAs": [
      "https://www.testmim.com"
    ],
    "foundingDate": "2024",
    "description": "무료 심리테스트, 성향테스트, MBTI, 재미있는 테스트 모음을 제공하는 심리테스트 플랫폼",
    "knowsAbout": ["심리테스트", "성향테스트", "MBTI", "성격분석", "심리분석"],
    "availableLanguage": ["ko", "en", "zh", "ja"]
  };
  
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "테스트밈",
    "url": "https://www.testmim.com",
    "description": "무료 심리테스트, 성향테스트, MBTI, 재미있는 테스트 모음. 나만의 우주, 심리테스트 플랫폼 테스트밈에서 다양한 테스트를 무료로 즐겨보세요!",
    "inLanguage": ["ko-KR", "en-US", "zh-CN", "ja-JP"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.testmim.com/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="ko">
      <head>
        {/* favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        {/* apple touch icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        {/* manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* 언어별 대체 URL */}
        <link rel="alternate" hrefLang="ko" href="https://www.testmim.com" />
        <link rel="alternate" hrefLang="en" href="https://www.testmim.com/en" />
        <link rel="alternate" hrefLang="zh" href="https://www.testmim.com/zh" />
        <link rel="alternate" hrefLang="ja" href="https://www.testmim.com/ja" />
        <link rel="alternate" hrefLang="x-default" href="https://www.testmim.com" />
        
        {/* Google Adsense */}
        <meta name="google-adsense-account" content="ca-pub-5100840159526765" />
        
        {/* 성능 최적화를 위한 리소스 힌트 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Kakao SDK */}
        <script src="//developers.kakao.com/sdk/js/kakao.min.js" async></script>
        
        {/* JSON-LD 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}>
        <PerformanceOptimizer />
        <I18nProvider>
          <AuthProvider>
            <OnboardingRedirect />
            <Header />
            <MainLayout>{children}</MainLayout>
            <Footer />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
