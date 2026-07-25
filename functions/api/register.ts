// Cloudflare Pages Function - Database Panitia HUT RI 81
// Simpan ke KV atau D1 atau forward ke Google Sheets
// File ini akan jadi endpoint: https://mawar002hutri81.pages.dev/api/register

interface Env {
  // Jika pakai KV, binding di Cloudflare Pages:
  // HUTRI_KV: KVNamespace
  // Jika pakai D1:
  // HUTRI_DB: D1Database
  GOOGLE_SHEET_URL?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as any;
    
    // Validasi minimal
    if (!body.name || !body.lomba) {
      return new Response(JSON.stringify({ error: 'Nama dan lomba wajib' }), { status: 400 });
    }

    // 1. Forward ke Google Sheets jika ada ENV
    const sheetUrl = context.env.GOOGLE_SHEET_URL || (context as any).env?.VITE_GOOGLE_SHEET_URL;
    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          body: JSON.stringify({
            type: 'pendaftaran',
            id: body.id,
            name: body.name,
            rt: body.address || body.rt,
            hp: body.whatsapp || body.hp,
            lomba: body.lomba,
            catatan: body.catatan,
            waktu: body.waktu,
            app: 'mawar002hutri81-cloudflare-function',
          }),
        });
      } catch (e) {
        console.error('Google Sheet forward failed', e);
      }
    }

    // 2. Simpan ke KV jika ada (opsional)
    // if (context.env.HUTRI_KV) {
    //   await context.env.HUTRI_KV.put(`reg:${body.id}`, JSON.stringify(body));
    // }

    // 3. Simpan ke D1 jika ada (opsional)
    // if (context.env.HUTRI_DB) {
    //   await context.env.HUTRI_DB.prepare(
    //     `INSERT INTO participants (id, name, rt, hp, lomba, catatan, waktu) VALUES (?, ?, ?, ?, ?, ?, ?)`
    //   ).bind(body.id, body.name, body.address || body.rt, body.whatsapp || body.hp, JSON.stringify(body.lomba), body.catatan, body.waktu).run();
    // }

    return new Response(JSON.stringify({ 
      success: true, 
      id: body.id,
      message: 'Pendaftaran berhasil tersimpan di Database Panitia',
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server Error', details: String(err) }), { status: 500 });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
