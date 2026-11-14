import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Refresh otomatis setiap 1 jam

export default async function HomePage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('click_count', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Rekomendasi Barang Pilihan & Promo Harian
        </h1>
        <p className="text-gray-600 mt-2">
          Kumpulan produk terlaris dengan rating tertinggi dan penawaran terbaik hari ini.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products?.map((item) => (
          <article
            key={item.id}
            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between"
          >
            <div>
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  {item.category}
                </span>
                <h2 className="font-bold text-lg text-gray-800 mt-2 line-clamp-2">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {item.seo_description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <div className="text-lg font-bold text-gray-900 mb-3">
                {item.price_text}
              </div>
              <a
                href={`/go/${item.slug}`}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Cek Promo di Shopee →
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
