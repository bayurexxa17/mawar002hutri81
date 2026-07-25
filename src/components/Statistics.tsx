import { statistics } from '../data';

export default function Statistics() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {statistics.map((stat, index) => (
            <div
              key={stat.id}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className="relative text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              
              {/* Value */}
              <div className="relative">
                <div className="text-3xl md:text-4xl font-black text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-lg md:text-xl text-red-600 ml-1">{stat.suffix}</span>
                  )}
                </div>
                
                {/* Label */}
                <div className="text-sm text-gray-500 mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-red-100 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
