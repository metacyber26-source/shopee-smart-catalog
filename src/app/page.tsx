import { supabase } from '@/lib/supabase';

export const revalidate = 60; // Refresh otomatis setiap 60 detik

interface Product {
  id: string;
  slug: string;
  title: string;
  seo_description: string;
  category: string;
  price_text: string;
  image_url: string;
  is_xtra_commission: boolean;
  click_count: number;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; cat?: string };
}) {
  const query = searchParams?.q || '';
  const selectedCategory = searchParams?.cat || 'Semua';

  let dbQuery = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`);
  }
  if (selectedCategory && selectedCategory !== 'Semua') {
    dbQuery = dbQuery.eq('category', selectedCategory);
  }

  const { data: products } = await dbQuery;
  const items: Product[] = products || [];

  // Ambil daftar kategori unik
  const { data: allCats } = await supabase.from('products').select('category');
  const categories = [
    'Semua',
    ...Array.from(new Set((allCats || []).map((c) => c.category))),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              S
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                Smart<span className="text-orange-600">Katalog</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">
                Pilihan Terkurasi
              </span>
            </div>
          </a>

          {/* Form Pencarian */}
          <form action="/" method="GET" className="w-48 sm:w-72">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Cari produk impian..."
              className="w-full px-3.5 py-1.5 text-sm bg-slate-100 border border-transparent focus:border-orange-500 focus:bg-white rounded-full outline-none transition"
            />
          </form>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold tracking-wide uppercase mb-3">
              Rekomendasi Terpercaya • Update Harian
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
              Temukan Produk Pilihan Terbaik dengan Harga Promo
            </h1>
            <p className="text-orange-50 text-sm sm:text-base leading-relaxed">
              Kumpulan barang berkualitas tinggi, ulasan terbaik, dan penawaran resmi langsung dari toko terpercaya.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end text-right bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20">
            <span className="text-3xl font-black">{items.length}+</span>
            <span className="text-xs text-orange-100 uppercase tracking-wider mt-1">
              Produk Terkurasi
            </span>
          </div>
        </div>
      </section>

      {/* Filter Kategori */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <a
                key={cat}
                href={cat === 'Semua' ? '/' : `/?cat=${encodeURIComponent(cat)}`}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </a>
            );
          })}
        </div>
      </div>

      {/* Grid Katalog Produk */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-base mb-2">
              Belum ada produk yang sesuai kriteria.
            </p>
            <a
              href="/"
              className="inline-block mt-2 text-sm font-semibold text-orange-600 hover:underline"
            >
              Reset Filter
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
              <article
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-300 transition flex flex-col"
              >
                {/* Gambar Produk */}
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-slate-900/75 text-white backdrop-blur-sm rounded-md">
                      {item.category}
                    </span>
                    {item.is_xtra_commission && (
                      <span className="px-2 py-0.5 text-[11px] font-bold bg-orange-600 text-white rounded-md shadow-sm">
                        PILIHAN
                      </span>
                    )}
                  </div>
                </div>

                {/* Detail Produk */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.seo_description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-2.5">
                      <span className="text-sm sm:text-base font-extrabold text-orange-600">
                        {item.price_text}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.click_count}x dilihat
                      </span>
                    </div>

                    <a
                      href={`/go/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="block w-full text-center py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-sm transition"
                    >
                      Cek Harga & Promo →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto">
          <p className="font-medium text-slate-700 mb-1">
            SmartKatalog • Kurasi Produk Pilihan Terbaik
          </p>
          <p>
            Sebagai mitra afiliasi, kami dapat memperoleh komisi dari pembelian yang memenuhi syarat tanpa biaya tambahan bagi Anda.
          </p>
        </div>
      </footer>
    </div>
  );
}
