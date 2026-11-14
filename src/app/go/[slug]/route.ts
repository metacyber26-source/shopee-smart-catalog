import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { data: product } = await supabase
    .from('products')
    .select('id, affiliate_url')
    .eq('slug', params.slug)
    .single();

  if (!product) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Tambah jumlah klik di latar belakang
  await supabase.rpc('increment_click', { product_id: product.id });

  // Arahkan langsung ke Shopee
  return NextResponse.redirect(product.affiliate_url, 302);
}
