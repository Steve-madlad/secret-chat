import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://private-whisper-chat.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ];
}
