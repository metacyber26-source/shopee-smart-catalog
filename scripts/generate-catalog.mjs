import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function run() {
  const rawData = JSON.parse(fs.readFileSync('./scripts/raw-links.json', 'utf-8'));

  for (const item of rawData) {
    const slug = item.raw_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const prompt = `Buatkan JSON HANYA berisi field: "title" (judul produk ramah SEO untuk Google), "category" (1-2 kata kategori umum), dan "seo_description" (2 kalimat persuasif manfaat produk) untuk produk: "${item.raw_name}". Jangan pakai markdown backtick, berikan format JSON murni.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const result = await response.json();
      const rawText = result.candidates[0].content.parts[0].text;
      const cleanJson = rawText.replace(/```json|```/g, '').trim();
      const generated = JSON.parse(cleanJson);

      await supabase.from('products').upsert({
        slug,
        title: generated.title,
        seo_description: generated.seo_description,
        category: generated.category,
        price_text: item.price,
        image_url: item.image_url,
        affiliate_url: item.affiliate_url,
        is_xtra_commission: item.is_xtra,
      }, { onConflict: 'slug' });

      console.log(`Berhasil memproses: ${generated.title}`);
    } catch (err) {
      console.error(`Gagal memproses ${item.raw_name}:`, err.message);
    }
  }
}

run();
