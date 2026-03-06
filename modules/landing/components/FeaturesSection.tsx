import { features } from '@/data/landing/features';

export function FeaturesSection() {
  return (
    <section className="mb-24" id="features">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl   font-bold text-gray-900 dark:text-white mb-4">
            Engineered for Peak Performance
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Everything you need to run professional auctions at scale.
          </p>
        </div>
        <a
          className="hidden md:flex items-center text-blue-500 font-semibold hover:text-blue-700 transition-colors mt-4 md:mt-0"
          href="#"
        >
          View full specs
          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <div className="mb-4 flex justify-center md:justify-start">
              {feature.icon}
            </div>
            <h4 className="text-xl   font-bold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
