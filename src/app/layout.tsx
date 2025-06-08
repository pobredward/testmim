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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "테스트밈 | 무료 심리테스트, 성향테스트, MBTI 테스트 모음",
    template: "%s | 테스트밈"
  },
  description: "무료 심리테스트, 성향테스트, MBTI, 재미있는 테스트 모음. 나만의 우주, 심리테스트 플랫폼 테스트밈에서 다양한 테스트를 무료로 즐겨보세요!",
  keywords: ["심리테스트", "성향테스트", "MBTI", "무료테스트", "테스트밈", "testmim", "심리분석", "성격테스트", "재미있는테스트", "온라인테스트"],
  authors: [{ name: "테스트밈" }],
  creator: "테스트밈",
  publisher: "테스트밈",
  applicationName: "테스트밈",
  category: "Entertainment",
  classification: "심리테스트 플랫폼",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.testmim.com",
    siteName: "테스트밈",
    title: "테스트밈 | 무료 심리테스트, 성향테스트, MBTI 테스트 모음",
    description: "무료 심리테스트, 성향테스트, MBTI, 재미있는 테스트 모음. 나만의 우주, 심리테스트 플랫폼 테스트밈에서 다양한 테스트를 무료로 즐겨보세요!",
    images: [
      {
        url: "https://www.testmim.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "테스트밈 - 무료 심리테스트 플랫폼",
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    site: "@testmim",
    creator: "@testmim",
    title: "테스트밈 | 무료 심리테스트, 성향테스트, MBTI 테스트 모음",
    description: "무료 심리테스트, 성향테스트, MBTI, 재미있는 테스트 모음. 나만의 우주, 심리테스트 플랫폼 테스트밈에서 다양한 테스트를 무료로 즐겨보세요!",
    images: ["https://www.testmim.com/og-image.png"],
  },
  
  // 기타 메타데이터
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: "google5a5d6e72faa8036f",
    other: {
      "naver-site-verification": "naver05bbb92c9c59b181bb207a70715c5f0e",
    },
  },
  
  alternates: {
    canonical: "https://www.testmim.com",
  },
};

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
    "alternateName": "testmim",
    "url": "https://www.testmim.com",
    "logo": "https://www.testmim.com/android-chrome-512x512.png",
    "sameAs": [
      "https://www.testmim.com"
    ],
    "foundingDate": "2024",
    "description": "무료 심리테스트, 성향테스트, MBTI, 재미있는 테스트 모음을 제공하는 심리테스트 플랫폼",
    "knowsAbout": ["심리테스트", "성향테스트", "MBTI", "성격분석", "심리분석"]
  };
  
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "테스트밈",
    "url": "https://www.testmim.com",
    "description": "무료 심리테스트, 성향테스트, MBTI, 재미있는 테스트 모음. 나만의 우주, 심리테스트 플랫폼 테스트밈에서 다양한 테스트를 무료로 즐겨보세요!",
    "inLanguage": "ko-KR",
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
        
        {/* Google Adsense */}
        <meta name="google-adsense-account" content="ca-pub-5100840159526765" />
        
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
        <AuthProvider>
          <OnboardingRedirect />
          <Header />
          <MainLayout>{children}</MainLayout>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
