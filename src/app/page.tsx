import { supabase } from '../lib/supabase';

// Memastikan halaman selalu mengambil data terbaru (tidak di-cache statis saat build)
export const dynamic = 'force-dynamic';

export default async function Page() {
  // Ganti 'products' dengan nama tabel Anda di Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopee Smart Catalog</h1>

      {error && (
        <p className="text-red-500">Gagal memuat produk: {error.message}</p>
      )}

      {!products || products.length === 0 ? (
        <p className="text-gray-500">Belum ada produk di katalog.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((item: any) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold text-lg">{item.name || item.title}</h2>
              {item.price && (
                <p className="text-orange-600 font-bold mt-2">
                  Rp {Number(item.price).toLocaleString('id-ID')}
                </p>
              )}
              {item.shopee_url && (
                <a
                  href={item.shopee_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600"
                >
                  Lihat di Shopee
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
