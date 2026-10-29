import type { MetadataRoute } from "next";
import { listNotifications, listProgrammes, listStories } from "@/lib/data/content";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stories, programmes, notifications] = await Promise.all([
    listStories(),
    listProgrammes(),
    listNotifications(),
  ]);

  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/programmes", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/get-involved", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/stories", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
    { path: "/donate", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/partner", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/volunteer", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/notifications", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...programmes.map((programme) => ({
      url: absoluteUrl(`/programmes/${programme.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...stories.map((story) => ({
      url: absoluteUrl(`/stories/${story.slug}`),
      lastModified: new Date(story.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...notifications.map((notification) => ({
      url: absoluteUrl(`/notifications/${notification.slug}`),
      lastModified: new Date(notification.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
