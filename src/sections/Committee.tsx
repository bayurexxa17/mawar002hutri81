import { useState } from 'react';
import { committee, CommitteeMember } from '../data/committee';
import Modal from '../components/Modal';

export default function Committee() {
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
  const primaryContacts = committee.filter(c => c.isPrimary);
  const otherMembers = committee.filter(c => !c.isPrimary);

  return (
    <section id="committee" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-sm mb-4">
            PANITIA PELAKSANA
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mt-2">
            Struktur Panitia
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 to-red-700 mx-auto mt-6 rounded-full" />
          <p className="text-gray-600 mt-4">Klik panitia untuk lihat detail & hubungi via WhatsApp</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {primaryContacts.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="relative group bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl p-8 text-white shadow-2xl hover:shadow-red-200/50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform">
                  👤
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-red-800 text-xs px-3 py-1 rounded-full font-bold">
                  ⭐ {member.position}
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl mb-4">{member.name}</h3>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold">
                  📱 {member.phone}
                </div>
                <div className="mt-3 text-xs text-red-100">Klik untuk detail →</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Anggota Panitia Lainnya
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-2xl group-hover:from-red-100 group-hover:to-red-200 transition-all">
                  👤
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{member.name}</div>
                  <div className="text-sm text-red-600 font-medium">{member.position}</div>
                  <div className="text-xs text-gray-500">📞 {member.phone}</div>
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  💬
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedMember && (
        <Modal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title={selectedMember.name}
          subtitle={selectedMember.position}
          size="md"
        >
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-5xl mb-4">👤</div>
              <h3 className="font-bold text-xl">{selectedMember.name}</h3>
              <p className="text-red-600 font-semibold">{selectedMember.position}</p>
              <p className="text-sm text-gray-500 mt-1">Perumahan Ciptaland Blok Mawar RT 002/RW 014</p>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <div className="text-xs text-gray-500">No. Telepon</div>
                  <div className="font-bold">{selectedMember.phone}</div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-xs text-gray-500 mb-2">Tugas & Tanggung Jawab:</div>
                <div className="text-sm text-gray-700">
                  {selectedMember.position.includes('Ketua') && 'Bertanggung jawab atas kelancaran seluruh acara HUT RI Ke-81'}
                  {selectedMember.position.includes('Sekretaris') && 'Mengurus administrasi, surat-menyurat, dan dokumentasi acara'}
                  {selectedMember.position.includes('Bendahara') && 'Mengelola keuangan panitia dan laporan dana'}
                  {selectedMember.position.includes('Koordinator') && `Koordinator ${selectedMember.position.split(' ')[1]} untuk kelancaran kegiatan`}
                  {!selectedMember.position.includes('Ketua') && !selectedMember.position.includes('Sekretaris') && !selectedMember.position.includes('Bendahara') && !selectedMember.position.includes('Koordinator') && 'Anggota panitia pelaksana HUT RI Ke-81'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <a href={`tel:${selectedMember.phone}`} className="bg-gray-800 text-white py-3 rounded-xl font-bold text-center hover:bg-gray-700 transition">📞 Telepon</a>
              <a href={`https://wa.me/${selectedMember.whatsapp}?text=Assalamualaikum, saya ingin bertanya tentang HUT RI Ke-81`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white py-3 rounded-xl font-bold text-center hover:bg-green-600 transition flex items-center justify-center gap-2">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
