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
      <head>
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
        {/* Google Adsense */}
        <meta name="google-adsense-account" content="ca-pub-5100840159526765" />
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
