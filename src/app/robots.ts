import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/room/',
    },
    sitemap: 'https://private-whisper-chat.vercel.app/sitemap.xml',
  };
}
