import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Sesuaikan jalur foldernya

export default function PanitiaAdmin() {
  const [isAuth, setIsAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'pendaftar' | 'donasi' | 'notif'>('pendaftar');
  const [participants, setParticipants] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [lastNotif, setLastNotif] = useState<any>(null);

  // Ambil data online dari Supabase dan aktifkan Realtime listener
  useEffect(() => {
    const auth = localStorage.getItem('hutri-admin-auth');
    if (auth === 'true') setIsAuth(true);

    fetchDataFromCloud();

    // Realtime Listener untuk tabel pendaftar & donasi
    const channel = supabase
      .channel('public:admin_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pendaftar' },
        () => fetchDataFromCloud()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donasi' },
        () => fetchDataFromCloud()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDataFromCloud = async () => {
    // 1. Ambil data pendaftar dari Supabase
    const { data: dataPendaftar } = await supabase
      .from('pendaftar')
      .select('*')
      .order('id', { ascending: false });
    
    if (dataPendaftar) {
      // Petakan struktur kolom database dengan benar sesuai kolom asli Supabase
      const formattedParticipants = dataPendaftar.map(p => ({
        id: p.id,
        name: p.nama || '',
        rt: p.rt || '-',
        hp: p.telepon || '-',
        lomba: p.lomba ? p.lomba.split(', ').map((s: string) => s.trim()) : [],
        waktu: p.created_at ? new Date(p.created_at).toLocaleString('id-ID') : '',
        catatan: p.catatan || ''
      }));
      setParticipants(formattedParticipants);
    }

    // 2. Ambil data donasi dari Supabase
    const { data: dataDonasi } = await supabase
      .from('donasi')
      .select('*')
      .order('id', { ascending: false });
    
    if (dataDonasi) {
      const formattedDonors = dataDonasi.map(d => ({
        id: d.id,
        name: d.nama,
        alamat: '-',
        jumlah: Number(d.nominal) || 0,
        pesan: d.pesan || '-',
        waktu: d.created_at ? new Date(d.created_at).toLocaleString('id-ID') : ''
      }));
      setDonors(formattedDonors);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const allowed = ['admin81', 'panitia81'];
    if (allowed.includes(password.toLowerCase())) {
      setIsAuth(true);
      localStorage.setItem('hutri-admin-auth', 'true');
    } else {
      alert('Password salah! Hubungi Ketua Panitia.');
    }
  };
