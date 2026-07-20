export interface CommitteeMember {
  id: number;
  name: string;
  position: string;
  phone: string;
  whatsapp: string;
  photo?: string;
  isPrimary?: boolean;
}

export const committee: CommitteeMember[] = [
  {
    id: 1,
    name: 'Bapak H. Ahmad Suryadi',
    position: 'Ketua Pembina',
    phone: '0812-7129-9984',
    whatsapp: '6281271299984',
    isPrimary: true
  },
  {
    id: 2,
    name: 'Bapak Budi Santoso',
    position: 'Ketua Panitia',
    phone: '0812-8839-5550',
    whatsapp: '6281288395550',
    isPrimary: true
  },
  {
    id: 3,
    name: 'Ibu Siti Nurhaliza',
    position: 'Wakil Ketua',
    phone: '0831-8395-0205',
    whatsapp: '6283183950205',
    isPrimary: true
  },
  {
    id: 4,
    name: 'Ibu Ratna Dewi',
    position: 'Sekretaris 1',
    phone: '0812-3456-7891',
    whatsapp: '6281234567891'
  },
  {
    id: 5,
    name: 'Ibu Mei Ling',
    position: 'Sekretaris 2',
    phone: '0812-3456-7892',
    whatsapp: '6281234567892'
  },
  {
    id: 6,
    name: 'Bapak Joko Widodo',
    position: 'Bendahara 1',
    phone: '0812-3456-7893',
    whatsapp: '6281234567893'
  },
  {
    id: 7,
    name: 'Bapak Andi Wijaya',
    position: 'Bendahara 2',
    phone: '0812-3456-7894',
    whatsapp: '6281234567894'
  },
  {
    id: 8,
    name: 'Bapak Rudi Hartono',
    position: 'Koordinator Lomba',
    phone: '0812-3456-7895',
    whatsapp: '6281234567895'
  },
  {
    id: 9,
    name: 'Ibu Dewi Lestari',
    position: 'Koordinator Konsumsi',
    phone: '0812-3456-7896',
    whatsapp: '6281234567896'
  },
  {
    id: 10,
    name: 'Bapak Agus Setiawan',
    position: 'Koordinator Perlengkapan',
    phone: '0812-3456-7897',
    whatsapp: '6281234567897'
  },
  {
    id: 11,
    name: 'Ibu Rina Susanti',
    position: 'Koordinator Dekorasi',
    phone: '0812-3456-7898',
    whatsapp: '6281234567898'
  },
  {
    id: 12,
    name: 'Bapak Dedi Kurniawan',
    position: 'Koordinator Keamanan',
    phone: '0812-3456-7899',
    whatsapp: '6281234567899'
  }
];

export const primaryContacts = committee.filter(c => c.isPrimary);
