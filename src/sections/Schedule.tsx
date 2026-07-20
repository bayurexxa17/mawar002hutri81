import { schedule } from '../data';

export default function Schedule() {
  return (
    <section id="schedule" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-sm mb-4">
            RUNDOWN ACARA
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mt-2">
            Jadwal Kegiatan
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 to-red-700 mx-auto mt-6 rounded-full" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-red-200 via-red-300 to-red-200 transform md:-translate-x-1/2 rounded-full" />

          {/* Schedule Items */}
          <div className="space-y-6">
            {schedule.map((item, index) => (
              <div
                key={item.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content Side */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} pl-20 md:pl-0`}>
                  <div
                    className={`bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                      item.isHighlight
                        ? 'border-red-500 bg-gradient-to-r from-red-50 to-white'
                        : 'border-gray-100'
                    } hover:border-red-300 transform hover:-translate-x-1 md:hover:translate-x-0`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-red-600 font-black text-xl">{item.time}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">{item.event}</h3>
                    <p className="text-gray-500 text-sm mt-1">📍 {item.location}</p>
                    {item.isHighlight && (
                      <span className="inline-block mt-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        ⭐ Acara Utama
                      </span>
                    )}
                  </div>
                </div>

                {/* Center Dot */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-5 h-5 rounded-full border-4 border-white shadow-lg ${
                    item.isHighlight ? 'bg-red-500 animate-pulse' : 'bg-red-300'
                  }`} />
                </div>

                {/* Empty Side */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        {/* Download Schedule CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-red-50 to-white p-6 rounded-2xl border border-red-100">
            <div className="text-4xl">📥</div>
            <div className="text-left">
              <div className="font-bold text-gray-800">Download Jadwal Lengkap</div>
              <div className="text-sm text-gray-500">Format PDF - Siap cetak</div>
            </div>
            <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-all shadow-md">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
