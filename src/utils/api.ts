import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function submitRegistration(data: any) {
  const { error } = await supabase.from('registrations').insert([data]);
  if (error) throw error;
  return true;
}

export async function getRegistrations() {
  const { data, error } = await supabase.from('registrations').select('*').order('waktu', { ascending: false });
  if (error) {
    console.warn('Gagal ambil data registrasi:', error);
    return [];
  }
  return data || [];
}

export async function submitDonation(data: any) {
  const { error } = await supabase.from('donations').insert([data]);
  if (error) throw error;
  return true;
}

export async function getDonations() {
  const { data, error } = await supabase.from('donations').select('*').order('waktu', { ascending: false });
  if (error) {
    console.warn('Gagal ambil data donasi:', error);
    return [];
  }
  return data || [];
}
