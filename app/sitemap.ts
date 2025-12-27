import { MetadataRoute } from 'next';
import { DataService } from '../src/lib/dataService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all products
  const products = await DataService.fetchFromGoogleSheets();

  // Base URLs
  const baseUrl = 'https://www.thesweettoothbysakina.in';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Dynamic product pages
  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
