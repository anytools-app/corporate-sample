import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const getBaseUrl = () => {
  const fallback = 'http://localhost:3000';
  const raw = process.env.BASE_URL ?? fallback;
  try {
    return new URL(raw);
  } catch {
    return new URL(fallback);
  }
};

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: [`${baseUrl.origin}/sitemap.xml`],
    host: baseUrl.host,
  };
}
