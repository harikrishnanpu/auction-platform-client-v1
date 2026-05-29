import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Users,
  Clock,
  Radio,
  Volume2,
  TrendingUp,
} from 'lucide-react';

export function HeroSection() {
  return (
    <section className="p-4 md:p-8 mb-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 pt-10">
      <div className="lg:w-7/12 z-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 uppercase tracking-wider">
          <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          Next-Gen Live Bidding Infrastructure
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-950 dark:text-white mb-6 leading-tight tracking-tight">
          Bidding Reimagined <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
            For the Future.
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-base md:text-lg leading-relaxed max-w-xl">
          {
            "Experience the world's most reliable, secure, and scalable auction infrastructure. Live WebRTC video broadcasts and sub-50ms WebSocket bid streams combined."
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 text-sm uppercase tracking-widest font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            href="/login"
          >
            Get Started / Login
          </Link>
          <Link
            className="bg-transparent border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-4 text-sm uppercase tracking-widest font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center"
            href="#solutions"
          >
            Explore Specs
          </Link>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-bold text-white">
              HK
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-bold text-white">
              AP
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-bold text-white">
              SL
            </div>
          </div>
          <span>Trusted by 500+ Premium Auction Houses</span>
        </div>
      </div>

      {/* Hero Illustration: Interactive simulated live auction console */}
      <div className="lg:w-5/12 relative w-full flex items-center justify-center">
        <div className="relative w-full max-w-md">
          {/* Decorative glowing background gradients */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 dark:bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 dark:bg-purple-400/20 rounded-full blur-3xl -z-10"></div>

          {/* Premium Bidding Terminal Card */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-800/80 p-5 relative z-10 hover:border-blue-500/30 transition-all duration-500">
            {/* Header: Stream info */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-bold tracking-widest text-red-600 dark:text-red-400 uppercase">
                  Live Broadcast
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-mono text-gray-500 dark:text-gray-400">
                <Radio className="w-3 h-3 text-blue-500 animate-pulse" />
                <span>50ms latency</span>
              </div>
            </div>

            {/* Video Placeholder (Simulated Mediasoup Stream) */}
            <div className="relative h-44 bg-gray-950 dark:bg-black rounded-xl overflow-hidden mb-4 group flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 z-10"></div>
              {/* Decorative grid pattern simulating camera screen */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]"></div>

              {/* Stylized camera view content */}
              <div className="text-center z-10">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Volume2 className="w-5 h-5 text-white animate-pulse" />
                </div>
                <span className="text-xs font-semibold text-white/95 tracking-wide">
                  Live Auctioneer Stream Active
                </span>
              </div>

              {/* Badges on video */}
              <div className="absolute top-3 left-3 z-20 flex gap-2">
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-gray-300">
                  CAM_01_HD
                </span>
              </div>
              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 text-white text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                <Users className="w-3 h-3 text-blue-400" />
                <span>48 Bidders</span>
              </div>
            </div>

            {/* Item Title & Live Stats */}
            <div className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Vintage Chronograph Ref. 3970
                </h3>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                  Lot #248
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800/40">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block mb-0.5">
                    Current Bid
                  </span>
                  <span className="text-base font-extrabold text-gray-900 dark:text-white font-mono flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ₹18,45,000
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block mb-0.5">
                    Time Remaining
                  </span>
                  <span className="text-base font-extrabold text-rose-500 dark:text-rose-400 font-mono flex items-center gap-1">
                    <Clock className="w-4 h-4 animate-pulse" />
                    02m 45s
                  </span>
                </div>
              </div>
            </div>

            {/* Bid History Stream (Simulated Websocket messages) */}
            <div className="space-y-2 border-t border-gray-100 dark:border-gray-800/60 pt-3">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                Live Bid Stream
              </span>
              <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-950/20 px-2.5 py-1.5 rounded-lg border border-blue-100/30 dark:border-blue-900/20 text-xs">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-yellow-500 animate-bounce" />
                  <span className="font-bold text-blue-950 dark:text-blue-300">
                    Bidder #142 (Delhi)
                  </span>
                </div>
                <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                  ₹18,45,000
                </span>
              </div>
              <div className="flex justify-between items-center opacity-70 px-2.5 py-1 text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Bidder #890 (Mumbai)
                </span>
                <span className="font-mono text-gray-500 dark:text-gray-400">
                  ₹18,20,000
                </span>
              </div>
              <div className="flex justify-between items-center opacity-40 px-2.5 py-0.5 text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Bidder #311 (Bengaluru)
                </span>
                <span className="font-mono text-gray-500 dark:text-gray-400">
                  ₹18,00,000
                </span>
              </div>
            </div>
          </div>

          {/* Floating trust badge below the terminal */}
          <div
            className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-3.5 flex items-center gap-3.5 z-20 border border-gray-100 dark:border-gray-700/80 animate-bounce"
            style={{ animationDuration: '4s' }}
          >
            <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </span>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                Platform Security
              </div>
              <div className="text-xs font-extrabold text-gray-900 dark:text-white">
                Escrow & KYC Verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
