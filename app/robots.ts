import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/cart'], // Disallow API routes and cart (optional)
    },
    sitemap: 'https://www.thesweettoothbysakina.in/sitemap.xml',
  };
}
