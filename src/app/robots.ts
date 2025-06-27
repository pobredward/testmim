import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.testmim.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/debug/',
          '/*?from=share', // 공유 링크는 검색엔진에서 제외
          '/*?utm_*', // UTM 파라미터가 있는 URL 제외
          '/signin*', // 로그인 페이지 제외
          '/onboarding*', // 온보딩 페이지 제외
        ],
        crawlDelay: 1, // 크롤링 지연 시간 (초)
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/', 
          '/private/',
          '/debug/',
          '/signin*',
          '/onboarding*',
        ],
        crawlDelay: 0.5,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/', 
          '/private/',
          '/debug/',
          '/signin*',
          '/onboarding*',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'facebookexternalhit',
        allow: [
          '/',
          '/t/*',
          '/detail/*',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ],
      },
      {
        userAgent: 'Twitterbot',
        allow: [
          '/',
          '/t/*',
          '/detail/*',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
    host: baseUrl,
  }
} 