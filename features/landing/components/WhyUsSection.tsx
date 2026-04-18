import { specialities } from '@/data/landing/specialities';

export function WhyUsSection() {
  return (
    <section className="mb-24 relative" id="why-us">
      <div className="absolute inset-0 bg-white/50 dark:bg-white/5 rounded-3xl -z-10 blur-xl"></div>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl   font-semibold text-gray-900 dark:text-white mb-4">
              Why Industry Leaders Trust Hammr.Down
            </h2>
            <div className="space-y-6">
              {specialities.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center shrink-0`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-base   font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-1  ">
                ₹100Cr+
              </div>
              <div className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-6">
                Asset Value Processed
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-white dark:bg-black/40 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-xl md:text-2xl font-semibold text-blue-600">
                    50k+
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Active Bidders
                  </div>
                </div>
                <div className="bg-white dark:bg-black/40 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-xl md:text-2xl font-semibold text-green-600">
                    0.01s
                  </div>
                  <div className="text-[11px] text-gray-500">Avg. Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
