import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ic4.co.in';

  // Static routes with enhanced metadata
  const routes = [
    { path: '', priority: 1, changefreq: 'daily' },
    { path: '/about', priority: 0.9, changefreq: 'weekly' },
    { path: '/call-for-papers', priority: 0.9, changefreq: 'weekly' },
    { path: '/committee', priority: 0.8, changefreq: 'weekly' },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' },
    { path: '/important-dates', priority: 0.9, changefreq: 'weekly' },
    { path: '/registration', priority: 0.9, changefreq: 'weekly' },
    { path: '/schedule', priority: 0.9, changefreq: 'daily' },
    { path: '/speakers', priority: 0.8, changefreq: 'weekly' },
    { path: '/crc-submissions', priority: 0.8, changefreq: 'weekly' },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changefreq as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: route.priority,
  }));

  // LLM information file
  const llmsRoute = {
    url: `${baseUrl}/llms.txt`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  };

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

  return [llmsRoute, ...routes, ...committeeRoutes];
}
