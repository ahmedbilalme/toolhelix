import type { MetadataRoute } from "next";
import { TOOLS, CATEGORIES } from "@/lib/tools";

const BASE_URL = "https://toolhelix.com";

const BLOG_SLUGS = [
  "best-developer-tools-2024",
  "image-format-guide",
  "password-security-guide",
];

const STATIC_PAGES = ["", "/tools", "/blog", "/about", "/contact", "/changelog", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/tools/${cat.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolEntries: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.category}/${tool.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: tool.isFeatured ? 0.9 : 0.75,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...toolEntries, ...blogEntries];
}
