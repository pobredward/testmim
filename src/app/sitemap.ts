import { MetadataRoute } from "next";
import { getAllTests } from "@/data/tests";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.testmim.com";
  const currentDate = new Date();
  
  // 지원 언어 목록
  const languages = ["ko", "en", "zh", "ja"];
  
  // 기본 페이지들
  const staticPages: MetadataRoute.Sitemap = [];
  
  // 각 언어별로 메인 페이지 추가
  languages.forEach(lang => {
    const url = lang === "ko" ? baseUrl : `${baseUrl}/${lang}`;
    staticPages.push({
      url,
      lastModified: currentDate,
      changeFrequency: "daily", // 메인 페이지는 자주 업데이트
      priority: 1,
    });
    
    // 마이페이지
    staticPages.push({
      url: lang === "ko" ? `${baseUrl}/mypage` : `${baseUrl}/${lang}/mypage`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.3,
    });
  });

  // 모든 테스트 가져오기
  const allTests = getAllTests();
  
  // 인기 테스트와 일반 테스트 분류
  const popularTestCodes = [
    'animalpersonality', 'mbtisns', 'politics', 'dfclass', 'egenteto', 
    'personality', 'love', 'future', 'drunkhabit', 'rich'
  ];
  
  // 테스트 페이지들
  const testPages: MetadataRoute.Sitemap = [];
  
  allTests.forEach(test => {
    const isPopular = popularTestCodes.includes(test.code);
    const priority = isPopular ? 0.9 : 0.7;
    const changeFrequency = isPopular ? "weekly" : "monthly";
    
    languages.forEach(lang => {
      // 새로운 테스트 URL 형식 (/t/testcode)
      const url = lang === "ko" 
        ? `${baseUrl}/t/${test.code}`
        : `${baseUrl}/${lang}/t/${test.code}`;
      
      testPages.push({
        url,
        lastModified: currentDate,
        changeFrequency: changeFrequency as any,
        priority,
      });
      
      // 레거시 URL 지원 (/detail/testcode) - 낮은 우선순위
      const detailUrl = lang === "ko"
        ? `${baseUrl}/detail/${test.code}`
        : `${baseUrl}/${lang}/detail/${test.code}`;
      
      testPages.push({
        url: detailUrl,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: priority - 0.1, // 메인 URL보다 약간 낮은 우선순위
      });
    });
  });
  
  // 특별 페이지들
  const specialPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/create`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
  
  return [...staticPages, ...testPages, ...specialPages];
} 