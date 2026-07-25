import { getSponsorsByTier } from '../data/sponsors';

const tierConfig = {
  platinum: { label: 'Platinum', color: 'from-gray-700 to-gray-900', textColor: 'text-gray-700' },
  gold: { label: 'Gold', color: 'from-yellow-400 to-yellow-600', textColor: 'text-yellow-600' },
  silver: { label: 'Silver', color: 'from-gray-300 to-gray-500', textColor: 'text-gray-500' },
  bronze: { label: 'Bronze', color: 'from-amber-600 to-amber-800', textColor: 'text-amber-700' },
};

export default function Sponsor() {
  return (
    <section id="sponsor" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-sm mb-4">
            SPONSOR & DONATUR
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mt-2">
            Mitra Pendukung
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 to-red-700 mx-auto mt-6 rounded-full" />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Terima kasih kepada para sponsor dan donatur yang telah mendukung kesuksesan acara HUT RI Ke-81
          </p>
        </div>

        {/* Sponsors by Tier */}
        {Object.entries(tierConfig).map(([tier, config]) => {
          const tierSponsors = getSponsorsByTier(tier);
          if (tierSponsors.length === 0) return null;

          return (
            <div key={tier} className="mb-12">
              {/* Tier Label */}
              <div className="text-center mb-6">
                <span className={`inline-block px-6 py-2 rounded-full font-bold text-sm bg-gradient-to-r ${config.color} text-white`}>
                  🏆 {config.label} Sponsor
                </span>
              </div>

              {/* Sponsors Grid */}
              <div className={`grid gap-6 ${
                tier === 'platinum' ? 'grid-cols-1 md:grid-cols-2' :
                tier === 'gold' ? 'grid-cols-2 md:grid-cols-2' :
                'grid-cols-3 md:grid-cols-4'
              }`}>
                {tierSponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1"
                  >
                    {/* Logo Placeholder */}
                    <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-transform">
                      {sponsor.logo}
                    </div>
                    
                    {/* Name */}
                    <h3 className="font-bold text-gray-800 text-center text-sm group-hover:text-red-600 transition-colors">
                      {sponsor.name}
                    </h3>
                    
                    {/* Tier Badge */}
                    <div className="text-center mt-2">
                      <span className={`text-xs font-semibold ${config.textColor}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Become Sponsor CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-red-50 to-white p-8 rounded-3xl border-2 border-dashed border-red-300">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Ingin Menjadi Sponsor?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Dukung acara HUT RI Ke-81 dan dapatkan exposure untuk bisnis Anda
            </p>
            <a
              href="#committee"
              className="inline-flex items-center gap-2 bg-red-500 text-white px-8 py-4 rounded-full font-bold hover:bg-red-600 transition-all shadow-lg hover:shadow-xl"
            >
              📞 Hubungi Panitia
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
