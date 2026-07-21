import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    '/crc-submissions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
  
  const { data } = await supabase.from('committee_members').select('category_id');
  const uniqueCategories = Array.from(new Set(data?.map(m => m.category_id) || []));

  const committeeRoutes = uniqueCategories.map((category) => ({
    url: `${baseUrl}/committee/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...committeeRoutes];
}
