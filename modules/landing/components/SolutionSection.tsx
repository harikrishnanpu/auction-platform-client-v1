export function SolutionSection() {
  return (
    <section className="mb-24 text-center" id="solutions">
      <div className="max-w-3xl mx-auto mb-16">
        <span className="text-blue-500 font-medium tracking-[0.18em] uppercase text-xs mb-1.5 block">
          Our Mission
        </span>
        <h2 className="text-2xl md:text-3xl   font-semibold text-gray-900 dark:text-white mb-4">
          Bridging the Gap Between <br />
          <span className="italic text-gray-500">Legacy</span> and{' '}
          <span className="italic text-blue-500">Innovation</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          We provide a seamless infrastructure that solves the complexities of
          digital auctions, transforming how assets are exchanged globally.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group text-left">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <h3 className="text-lg   font-semibold text-gray-900 dark:text-white mb-2">
            The Problem
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
            Traditional auctions suffer from latency, lack of transparency, and
            geographical limitations that hinder fair value discovery.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center md:pt-12">
          <svg
            className="w-10 h-10 text-gray-300 dark:text-gray-600 hidden md:block transform rotate-90 md:rotate-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group text-left">
          <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h3 className="text-lg   font-semibold text-gray-900 dark:text-white mb-2">
            Our Solution
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
            An automated, real-time ecosystem that ensures sub-second bidding,
            immutable audit trails, and global accessibility.
          </p>
        </div>
      </div>
    </section>
  );
}
