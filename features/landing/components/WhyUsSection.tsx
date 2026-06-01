import { specialities } from '@/data/landing/specialities';
import { Users, Zap, TrendingUp } from 'lucide-react';

export function WhyUsSection() {
  // Explicit tailwind class mappings for safety in compilation
  const colorMap: Record<string, { bg: string; iconBg: string }> = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/30',
      iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    },
    orange: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    },
  };

  return (
    <section className="mb-24 relative" id="why-us">
      {/* Soft background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-transparent rounded-3xl -z-10 blur-2xl"></div>

      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 md:p-14 border border-gray-150 dark:border-gray-800/80 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Block: Description & Speciality Items */}
          <div className="lg:col-span-7">
            <span className="text-purple-600 dark:text-purple-400 font-semibold tracking-wider uppercase text-xs mb-3 block">
              Why Hammr.Down
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-950 dark:text-white mb-8 tracking-tight">
              Why Industry Leaders Trust Hammr.Down
            </h2>
            <div className="space-y-6">
              {specialities.map((item, idx) => {
                const colors = colorMap[item.color] || colorMap.blue;
                return (
                  <div
                    key={idx}
                    className={`flex gap-5 p-4 rounded-2xl border transition-all duration-300 hover:translate-x-1 ${colors.bg}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors.iconBg}`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-950 dark:text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Block: Interactive Statistics Board */}
          <div className="lg:col-span-5 relative h-96 bg-gradient-to-br from-gray-55 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-2xl border border-gray-200/40 dark:border-gray-800 flex items-center justify-center p-6 md:p-8">
            {/* Glowing blur backdrops */}
            <div className="absolute top-10 right-10 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl"></div>

            <div className="text-center relative z-10 w-full">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                <TrendingUp className="w-3.5 h-3.5" />
                Live Performance Metrics
              </div>
              <div className="text-5xl font-extrabold text-gray-950 dark:text-white mb-2 font-mono tracking-tight">
                ₹100Cr+
              </div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-8">
                Asset Value Transacted Globally
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 backdrop-blur-md flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-100/50 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-xl font-bold text-gray-950 dark:text-white font-mono">
                    50k+
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    Active Bidders
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50 backdrop-blur-md flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-yellow-100/50 dark:bg-yellow-900/30 flex items-center justify-center mb-2">
                    <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400 animate-pulse" />
                  </div>
                  <div className="text-xl font-bold text-gray-950 dark:text-white font-mono">
                    0.01s
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    Avg response
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
