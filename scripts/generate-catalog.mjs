import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Gunakan Service Role Key di GitHub Secrets
);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const rawData = JSON.parse(fs.readFileSync('./scripts/raw-links.json', 'utf-8'));

  for (const item of rawData) {
    const slug = item.raw_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const prompt = `Buatkan JSON berisi "title" (judul artikel/produk yang menarik pencarian Google), "category" (1-2 kata kategori umum), dan "seo_description" (2 kalimat persuasif yang menjelaskan manfaat produk ini untuk menyelesaikan masalah sehari-hari) untuk produk: "${item.raw_name}". Balas HANYA JSON valid.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const cleanJson = response.text.replace(/```json|```/g, '').trim();
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
  }
}

run();
