import { MetadataRoute } from "next";
import { getAllTests } from "@/data/tests";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.testmim.com";
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/mypage`,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/create`,
      priority: 0.7,
    },
  ];

  const testUrls: MetadataRoute.Sitemap = (await getAllTests()).map((test: any) => ({
    url: `${baseUrl}/detail/${test.code}`,
    priority: 0.9,
  }));

  return [...staticUrls, ...testUrls];
} 