import Link from 'next/link';

export function CTASection() {
  return (
    <section className="mb-12">
      <div className="bg-gray-900 rounded-3xl p-8 md:p-14 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500 rounded-full blur-[100px]"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl   font-semibold text-white mb-4">
            Ready to Transform Your Auctions?
          </h2>
          <p className="text-gray-300 text-sm md:text-base mb-8 max-w-2xl mx-auto">
            Join the platform that is defining the future of digital asset
            exchange. Start your journey with Hammr.Down today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="bg-white text-gray-900 px-6 py-3 text-xs md:text-sm uppercase tracking-[0.25em] font-medium rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Login Now
            </Link>
            <button className="bg-transparent border border-gray-600 text-white px-6 py-3 text-xs md:text-sm uppercase tracking-[0.25em] font-medium rounded-xl hover:bg-white/10 transition-all">
              Contact Sales
            </button>
          </div>
          <p className="mt-5 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
            No credit card required for demo
          </p>
        </div>
      </div>
    </section>
  );
}
