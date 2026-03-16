import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 md:p-10 mb-16 shadow-lg border border-white/50 dark:border-white/10 relative overflow-hidden flex flex-col lg:flex-row items-center gap-8">
      <div className="lg:w-1/2 z-10 relative">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-semibold mb-4 uppercase tracking-[0.2em]">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
          Next-Gen Auction Platform
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white mb-4 leading-snug tracking-tight">
          Bidding Reimagined <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-600">
            For the Future.
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm md:text-base leading-relaxed max-w-lg">
          Experience the worlds most reliable, secure, and scalable auction
          infrastructure. Real-time updates with zero latency.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            className="bg-gray-900 text-white px-6 py-3 text-xs md:text-sm uppercase tracking-[0.25em] font-medium rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            href="/login"
          >
            Get Started / Login
          </Link>
          <Link
            className="bg-transparent border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-6 py-3 text-xs md:text-sm uppercase tracking-[0.25em] font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center"
            href="#"
          >
            Contact Us
          </Link>
        </div>
        <div className="mt-6 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white dark:border-gray-800"></div>
            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-gray-800"></div>
            <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white dark:border-gray-800"></div>
          </div>
          <span>Trusted by 500+ Auction Houses</span>
        </div>
      </div>

      {/* Hero Illustration */}
      <div className="lg:w-1/2 relative w-full h-100 md:h-125 flex items-center justify-center">
        <div className="relative w-full max-w-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 relative z-10 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-xs font-mono text-gray-400">
                live_bid_stream_v2.0
              </div>
            </div>
            <div className="flex gap-4 mb-6">
              <div className="w-1/3 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="w-2/3 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="flex justify-between items-end mt-4">
                  <div className="h-8 bg-blue-100 dark:bg-blue-900/40 rounded w-24"></div>
                  <div className="h-8 w-8 bg-gray-900 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Bidder #4029</span>
                <span className="text-green-500 font-bold">New Bid Placed</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-3/4 h-full"></div>
              </div>
            </div>
          </div>
          <div
            className="absolute -bottom-10 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 flex items-center gap-3 z-20 border border-gray-50 dark:border-gray-700 animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            <span className="text-green-500 bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </span>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Security Check
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                Verified 100%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
