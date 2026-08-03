import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://afyyozywnupfdcshxjhk.supabase.co';
const DEFAULT_KEY = 'sb_publishable_EMfJHsDHNjTIatH07CuIzA_BopfHXTe';

// Abaikan nilai localStorage yang kosong / placeholder / rusak agar koneksi
// tidak pernah mengarah ke server yang salah (penyebab data "tidak sinkron").
function isValidUrl(v: string | null): v is string {
  return !!v && v.startsWith('https://') && !v.includes('placeholder') && v.length > 20;
}
function isValidKey(v: string | null): v is string {
  return !!v && v.length > 20 && !v.includes('placeholder');
}

function getUrl() {
  try {
    const ls = localStorage.getItem('supabaseUrl');
    if (isValidUrl(ls)) return ls;
  } catch {}
  return (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_URL;
}
function getAnonKey() {
  try {
    const ls = localStorage.getItem('supabaseAnonKey');
    if (isValidKey(ls)) return ls;
  } catch {}
  return (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;
}
function getSecretKey() {
  try {
    const ls = localStorage.getItem('supabaseSecretKey');
    if (ls) return ls;
  } catch {}
  return '';
}

export const supabase = createClient(getUrl(), getAnonKey());

export const getSupabaseAdmin = () => {
  // For admin write operations with secret key (still client-side, use with caution)
  return createClient(getUrl(), getSecretKey());
};

export const setSupabaseConfig = (url: string, anonKey?: string, secretKey?: string) => {
  if (url) localStorage.setItem('supabaseUrl', url);
  if (anonKey) localStorage.setItem('supabaseAnonKey', anonKey);
  if (secretKey) localStorage.setItem('supabaseSecretKey', secretKey);
};

export const getSupabaseConfig = () => ({
  url: getUrl(),
  anonKey: getAnonKey(),
  secretKey: getSecretKey(),
});
