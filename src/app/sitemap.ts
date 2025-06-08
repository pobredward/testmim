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
      changeFrequency: "weekly",
      priority: 1,
    });
  });

  // 모든 테스트 가져오기
  const allTests = getAllTests();
  
  // 테스트 페이지들
  const testPages: MetadataRoute.Sitemap = [];
  
  allTests.forEach(test => {
    languages.forEach(lang => {
      const url = lang === "ko" 
        ? `${baseUrl}/t/${test.code}`
        : `${baseUrl}/${lang}/t/${test.code}`;
      
      testPages.push({
        url,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.8,
      });
      
      // 테스트 상세 페이지도 추가 (legacy URL)
      const detailUrl = lang === "ko"
        ? `${baseUrl}/detail/${test.code}`
        : `${baseUrl}/${lang}/detail/${test.code}`;
      
      testPages.push({
        url: detailUrl,
        lastModified: currentDate,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  });
  
  return [...staticPages, ...testPages];
} 