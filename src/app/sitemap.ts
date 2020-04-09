import { SITE } from "@/lib/constants";
import { getAllPagePaths } from "@/lib/pages";

export default function sitemap() {
  const baseUrl = SITE.url;

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/book`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
  ];

  const contentPages = getAllPagePaths().map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path.startsWith("transfers/luton-airport-to") ? 0.7 : 0.8,
  }));

  return [...staticPages, ...contentPages];
}
