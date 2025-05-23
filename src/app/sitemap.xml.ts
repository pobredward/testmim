import { getAllTests } from "@/data/tests";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const baseUrl = "https://www.testmim.com";
  const staticUrls = [
    { loc: baseUrl + "/", priority: 1.0 },
    { loc: baseUrl + "/mypage", priority: 0.7 },
    { loc: baseUrl + "/login", priority: 0.7 },
    { loc: baseUrl + "/create", priority: 0.7 },
  ];
  const testUrls = getAllTests().map((test: any) => ({
    loc: `${baseUrl}/detail/${test.code}`,
    priority: 0.9,
  }));
  const urls = [...staticUrls, ...testUrls];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
} 