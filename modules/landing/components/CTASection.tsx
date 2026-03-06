import Link from 'next/link';

export function CTASection() {
  return (
    <section className="mb-12">
      <div className="bg-gray-900 rounded-3xl p-10 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500 rounded-full blur-[100px]"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl   font-bold text-white mb-6">
            Ready to Transform Your Auctions?
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Join the platform that is defining the future of digital asset
            exchange. Start your journey with Hammr.Down today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/login"
              className="bg-white text-gray-900 px-8 py-4 text-sm uppercase tracking-widest font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Login Now
            </Link>
            <button className="bg-transparent border border-gray-600 text-white px-8 py-4 text-sm uppercase tracking-widest font-semibold rounded-xl hover:bg-white/10 transition-all">
              Contact Sales
            </button>
          </div>
          <p className="mt-6 text-xs text-gray-500 uppercase tracking-wide">
            No credit card required for demo
          </p>
        </div>
      </div>
    </section>
  );
}
