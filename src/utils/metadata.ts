import type { Metadata } from "next";
import seoTranslations from '@/i18n/locales/seo.json';

// 언어별 SEO 데이터 가져오기
function getSeoData(language: string = 'ko') {
  const lang = language in seoTranslations ? language as keyof typeof seoTranslations : 'ko';
  return seoTranslations[lang];
}

// 템플릿 문자열 처리
function processTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] || match);
}

// 메인 페이지 메타데이터 생성
export function generateMainPageMetadata(language: string = 'ko'): Metadata {
  const seoData = getSeoData(language);
  const baseUrl = "https://www.testmim.com";
  
  const localeMap: Record<string, string> = {
    ko: 'ko_KR',
    en: 'en_US', 
    zh: 'zh_CN',
    ja: 'ja_JP'
  };

  const langPath = language === 'ko' ? '' : `/${language}`;
  const canonicalUrl = `${baseUrl}${langPath}`;

  return {
    title: {
      default: seoData.main.title,
      template: `%s | ${seoData.main.siteName}`
    },
    description: seoData.main.description,
    keywords: seoData.main.keywords,
    authors: [{ name: seoData.main.siteName }],
    creator: seoData.main.siteName,
    publisher: seoData.main.siteName,
    applicationName: seoData.main.siteName,
    category: "Entertainment",
    classification: language === 'ko' ? "심리테스트 플랫폼" : "Psychology Test Platform",
    
    openGraph: {
      type: "website",
      locale: localeMap[language] || 'ko_KR',
      url: canonicalUrl,
      siteName: seoData.main.siteName,
      title: seoData.main.ogTitle,
      description: seoData.main.ogDescription,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${seoData.main.siteName} - Free Psychology Test Platform`,
        },
      ],
    },
    
    twitter: {
      card: "summary_large_image",
      site: "@testmim",
      creator: "@testmim",
      title: seoData.main.twitterTitle,
      description: seoData.main.twitterDescription,
      images: [`${baseUrl}/og-image.png`],
    },
    
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ko': `${baseUrl}`,
        'en': `${baseUrl}/en`,
        'zh': `${baseUrl}/zh`,
        'ja': `${baseUrl}/ja`,
      },
    },
    
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
  };
}

// 테스트 페이지 메타데이터 생성
export function generateTestPageMetadata(testData: any, language: string = 'ko'): Metadata {
  const seoData = getSeoData(language);
  const baseUrl = "https://www.testmim.com";
  
  if (!testData) {
    return {
      title: seoData.test.notFoundTitle,
      description: seoData.test.notFoundDescription,
    };
  }

  const localeMap: Record<string, string> = {
    ko: 'ko_KR',
    en: 'en_US', 
    zh: 'zh_CN',
    ja: 'ja_JP'
  };

  const langPath = language === 'ko' ? '' : `/${language}`;
  const canonicalUrl = `${baseUrl}${langPath}/t/${testData.code}`;
  
  // 태그 문자열 생성
  const tagsString = testData.tags?.join(", ") || "";
  
  // 제목과 설명 생성
  const seoTitle = `${testData.title} | ${tagsString} ${seoData.test.titleSuffix}`;
  const seoDescription = processTemplate(seoData.test.descriptionTemplate, {
    description: testData.description,
    tags: tagsString,
    siteName: seoData.main.siteName
  });

  // SEO 키워드 생성 (seoKeywords 우선, 없으면 tags 사용)
  const seoKeywords = testData.seoKeywords 
    ? testData.seoKeywords.split(", ").concat(testData.tags || [])
    : testData.tags || [];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    authors: [{ name: seoData.main.siteName }],
    creator: seoData.main.siteName,
    publisher: seoData.main.siteName,
    
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: testData.thumbnailUrl ? `${baseUrl}${testData.thumbnailUrl}` : `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: testData.title,
        },
      ],
      siteName: seoData.main.siteName,
      locale: localeMap[language] || 'ko_KR',
    },
    
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [testData.thumbnailUrl ? `${baseUrl}${testData.thumbnailUrl}` : `${baseUrl}/og-image.png`],
    },
    
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ko': `${baseUrl}/t/${testData.code}`,
        'en': `${baseUrl}/en/t/${testData.code}`,
        'zh': `${baseUrl}/zh/t/${testData.code}`,
        'ja': `${baseUrl}/ja/t/${testData.code}`,
      },
    },
    
    robots: {
      index: true,
      follow: true,
    },
  };
}

// 기존 함수는 호환성을 위해 유지
export function generateLocalizedMetadata(testData: any, language: string = 'ko'): Metadata {
  return generateTestPageMetadata(testData, language);
} 