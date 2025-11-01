import { MetadataRoute } from 'next';
import { client, Article } from '@/app/_libs/microcms';

export const dynamic = 'force-static';

const getOrigin = () => {
  const fallback = 'http://localhost:3000';
  const raw = process.env.BASE_URL ?? fallback;
  try {
    return new URL(raw).origin;
  } catch {
    return new URL(fallback).origin;
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getOrigin();

  // Static routes that always exist across this site.
  const staticRoutes: MetadataRoute.Sitemap = ['/', '/business', '/members', '/news', '/contact'].map(
    (pathname) => ({
      url: `${origin}${pathname}`,
      lastModified: new Date(),
    }),
  );

  let newsRoutes: MetadataRoute.Sitemap = [];

  try {
    const { contents } = await client.getList<Article>({
      endpoint: 'news',
      queries: { limit: 100, orders: '-publishedAt', fields: 'id,createdAt,publishedAt,updatedAt,revisedAt' },
    });

    newsRoutes = contents.map((article) => ({
      url: `${origin}/news/${article.id}`,
      lastModified: article.revisedAt
        ? new Date(article.revisedAt)
        : article.updatedAt
          ? new Date(article.updatedAt)
          : article.publishedAt
            ? new Date(article.publishedAt)
            : new Date(article.createdAt),
    }));
  } catch (error) {
    console.error('Failed to fetch news entries for sitemap:', error);
  }

  return [...staticRoutes, ...newsRoutes];
}
