import { MetadataRoute } from 'next';
import committeeData from '@/data/committee.json';
import { CommitteeData } from '@/types/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ic4.co.in';

  // Static routes
  const routes = [
    '',
    '/about',
    '/call-for-papers',
    '/committee',
    '/contact',
    '/important-dates',
    '/registration',
    '/schedule',
    '/speakers',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes for committee categories
  // Cast to unknown first if strict type checking complains about JSON import not matching interface exactly due to extra properties or slightly different structure inferring
  const data = committeeData as unknown as CommitteeData;
  
  const committeeRoutes = data.root.map((category) => ({
    url: `${baseUrl}/committee/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...committeeRoutes];
}
