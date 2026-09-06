import type { MetadataRoute } from "next";
import { query } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/ecoles`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/concours`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/bourses`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/etranger`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.8 },
  ];

  let ecoleRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await query<{ id: number }>("SELECT id FROM ecoles");
    ecoleRoutes = res.rows.map((row) => ({
      url: `${SITE_URL}/ecoles/${row.id}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Erreur lors de la génération du sitemap (écoles) :", error);
  }

  return [...staticRoutes, ...ecoleRoutes];
}
