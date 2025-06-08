import { MetadataRoute } from "next";
import { getAllTests } from "@/data/tests";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.testmim.com";
  const currentDate = new Date().toISOString();
  
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      priority: 1.0,
      lastModified: currentDate,
      changeFrequency: "daily",
    },
    {
      url: `${baseUrl}/mypage`,
      priority: 0.7,
      lastModified: currentDate,
      changeFrequency: "weekly",
    },
    {
      url: `${baseUrl}/signin`,
      priority: 0.7,
      lastModified: currentDate,
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/create`,
      priority: 0.7,
      lastModified: currentDate,
      changeFrequency: "weekly",
    },
  ];

  const testUrls: MetadataRoute.Sitemap = (await getAllTests()).map((test: any) => ({
    url: `${baseUrl}/detail/${test.code}`,
    priority: 0.9,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
  }));

  // 테스트 실행 페이지도 추가
  const testExecuteUrls: MetadataRoute.Sitemap = (await getAllTests()).map((test: any) => ({
    url: `${baseUrl}/t/${test.code}`,
    priority: 0.8,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
  }));

  return [...staticUrls, ...testUrls, ...testExecuteUrls];
} 