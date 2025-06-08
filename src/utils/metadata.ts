import type { Metadata } from "next";

export function generateLocalizedMetadata(testData: any, language: string = 'ko'): Metadata {
  if (!testData) {
    const notFoundTitles: Record<string, string> = {
      ko: "존재하지 않는 테스트",
      en: "Test Not Found",
      zh: "找不到测试",
      ja: "テストが見つかりません"
    };
    
    const notFoundDescriptions: Record<string, string> = {
      ko: "요청하신 테스트를 찾을 수 없습니다.",
      en: "The test you requested could not be found.",
      zh: "无法找到您请求的测试。",
      ja: "リクエストされたテストが見つかりませんでした。"
    };

    return {
      title: notFoundTitles[language] || notFoundTitles.ko,
      description: notFoundDescriptions[language] || notFoundDescriptions.ko,
    };
  }

  const siteNames: Record<string, string> = {
    ko: "테스트밈",
    en: "TestMeme", 
    zh: "测试梦",
    ja: "テストミーム"
  };

  const siteName = siteNames[language] || siteNames.ko;
  const seoTitle = `${testData.title} | ${testData.tags.join(", ")} 테스트`;
  const seoDescription = `${testData.description} 지금 바로 무료로 ${testData.tags.join(", ")} 테스트를 해보세요! ${siteName}에서 제공하는 인기 심리테스트입니다.`;
  const seoUrl = `https://www.testmim.com/detail/${testData.code}`;

  const localeMap: Record<string, string> = {
    ko: 'ko_KR',
    en: 'en_US', 
    zh: 'zh_CN',
    ja: 'ja_JP'
  };

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: testData.tags,
    
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: seoUrl,
      type: "article",
      images: [
        {
          url: testData.thumbnailUrl ? `https://www.testmim.com${testData.thumbnailUrl}` : "https://www.testmim.com/og-image.png",
          width: 1200,
          height: 630,
          alt: testData.title,
        },
      ],
      siteName,
      locale: localeMap[language] || 'ko_KR',
    },
    
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [testData.thumbnailUrl ? `https://www.testmim.com${testData.thumbnailUrl}` : "https://www.testmim.com/og-image.png"],
    },
    
    alternates: {
      canonical: seoUrl,
    },
    
    robots: {
      index: true,
      follow: true,
    },
  };
} 