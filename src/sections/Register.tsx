import { useState } from 'react';
import { activities } from '../data';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    address: '',
    selectedActivities: [] as number[],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Terima kasih! Pendaftaran Anda telah diterima. Panitia akan menghubungi Anda melalui WhatsApp.');
  };

  const toggleActivity = (id: number) => {
    setFormData(prev => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(id)
        ? prev.selectedActivities.filter(a => a !== id)
        : [...prev.selectedActivities, id]
    }));
  };

  return (
    <section id="register" className="py-20 px-4 bg-gradient-to-br from-red-600 via-red-700 to-red-800">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
            PENDAFTARAN
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
            Daftar Lomba Sekarang!
          </h2>
          <div className="w-24 h-1.5 bg-white mx-auto mt-6 rounded-full" />
          <p className="text-red-100 mt-4">
            Isi formulir di bawah ini untuk mendaftar lomba
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & WhatsApp */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Alamat (RT/RW) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Contoh: RT 002 / RW 014"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all"
              />
            </div>

            {/* Activities Selection */}
            <div>
              <label className="block text-gray-700 font-bold mb-4">
                Pilih Lomba <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {activities.map((activity) => (
                  <label
                    key={activity.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.selectedActivities.includes(activity.id)
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedActivities.includes(activity.id)}
                      onChange={() => toggleActivity(activity.id)}
                      className="w-5 h-5 text-red-600 focus:ring-red-500 rounded"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800">{activity.title}</div>
                      <div className="text-xs text-gray-500">{activity.prize}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Catatan Tambahan
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informasi tambahan (opsional)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              📤 Kirim Pendaftaran
            </button>
          </form>

          {/* WhatsApp Alternative */}
          <div className="mt-8 pt-8 border-t-2 border-gray-100 text-center">
            <p className="text-gray-600 mb-4 font-medium">
              Atau daftar langsung melalui WhatsApp:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: 'Ketua Pembina', phone: '0812-7129-9984', wa: '6281271299984' },
                { name: 'Ketua Panitia', phone: '0812-8839-5550', wa: '6281288395550' },
                { name: 'Wakil Ketua', phone: '0831-8395-0205', wa: '6283183950205' },
              ].map((contact) => (
                <a
                  key={contact.phone}
                  href={`https://wa.me/${contact.wa}?text=Assalamualaikum, saya ingin mendaftar lomba HUT RI Ke-81`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {contact.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
