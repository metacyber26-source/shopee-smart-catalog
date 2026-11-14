import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://domain-anda.vercel.app';
  const { data: products } = await supabase.from('products').select('slug, created_at');

  const productUrls = (products || []).map((item) => ({
    url: `${baseUrl}/go/${item.slug}`,
    lastModified: new Date(item.created_at),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    ...productUrls,
  ];
}
