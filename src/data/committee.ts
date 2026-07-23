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
    name: 'Eka Rista Y',
    position: 'Penanggung Jawab',
    phone: '0821-7129-9984',
    whatsapp: '082171299984',
    isPrimary: true
  },
  {
    id: 2,
    name: 'Bayu S.Permana',
    position: 'Ketua Panitia',
    phone: '0812-8839-5550',
    whatsapp: '6281288395550',
    isPrimary: true
  },
  {
    id: 3,
    name: 'Sugiono',
    position: 'Wakil Ketua',
    phone: '0831-8395-0205',
    whatsapp: '6283183950205',
    isPrimary: true
  },
  {
    id: 4,
    name: 'Lani',
    position: 'Sekretaris 1',
    phone: '0812-3456-7891',
    whatsapp: '6281234567891'
  },
  {
    id: 5,
    name: 'Aulia Komari',
    position: 'Bendahara 1',
    phone: '0812-3456-7892',
    whatsapp: '6281234567892'
  },
  {
    id: 6,
    name: 'Puput',
    position: 'Bendahara 2',
    phone: '0812-3456-7893',
    whatsapp: '6281234567893'
  },
  {
    id: 7,
    name: 'M.Dzaki',
    position: 'MC',
    phone: '0858-3660-5110',
    whatsapp: '6285836605110'
  },
  {
    id: 8,
    name: 'M.Haikal',
    position: 'MC',
    phone: '0853-5574-7998',
    whatsapp: '6285355747998'
  },
  {
    id: 9,
    name: 'Ridho Ananda',
    position: 'Koordinator Lomba',
    phone: '0823-8718-8929',
    whatsapp: '6282387188929'
  },
  {
    id: 10,
    name: 'Agha',
    position: 'Koordinator Lomba',
    phone: '0851-9433-4760',
    whatsapp: '6285194334760'
  },
  {
    id: 11,
    name: 'Adib',
    position: 'Koordinator Lomba',
    phone: '0813-6365-2626',
    whatsapp: '6281363652626'
  },
  {
    id: 12,
    name: 'Hanif',
    position: 'Koordinator Lomba',
    phone: '0881-3712-0796',
    whatsapp: '6281234567898'
  },
  {
    id: 13,
    name: 'Satria',
    position: 'Koordinator Lomba',
    phone: '0819-9201-0197',
    whatsapp: '6281992010197'
  },
  {
    id: 14,
    name: 'Hafiz',
    position: 'Koordinator Lomba',
    phone: '0818-835-875',
    whatsapp: '62818835875'
  },
  {
    id: 15,
    name: 'Andre',
    position: 'Koordinator Lomba',
    phone: '08xx-xxx-xxx',
    whatsapp: '628xxxxxxxx'
  },
  {
    id: 16,
    name: 'Dio',
    position: 'Koordinator Lomba',
    phone: '0813-7112-100',
    whatsapp: '628137112100'
  },
  {
    id: 17,
    name: 'Reza',
    position: 'Koordinator Lomba',
    phone: '08xx-xxx-xxx',
    whatsapp: '628xxxxxxxx'
  },
];

export const primaryContacts = committee.filter(c => c.isPrimary);
