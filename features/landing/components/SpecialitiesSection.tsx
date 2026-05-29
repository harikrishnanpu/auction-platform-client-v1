import {
  Video,
  Zap,
  ShieldCheck,
  CreditCard,
  Bot,
  BarChart3,
} from 'lucide-react';

export function SpecialitiesSection() {
  const items = [
    {
      icon: <Video className="w-6 h-6 text-purple-500" />,
      title: 'Live WebRTC Media Streaming',
      desc: 'Broadcast high-definition video & audio of live auctioneers directly into bidding rooms via Mediasoup integration with zero delay.',
      gradient:
        'from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20',
      border: 'hover:border-purple-500/30',
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: 'Sub-50ms WebSocket Bid Sync',
      desc: 'Powering sub-second bid updates, immediate high-bidder notifications, and synchronized countdowns across thousands of concurrent clients.',
      gradient:
        'from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20',
      border: 'hover:border-amber-500/30',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      title: 'Automated KYC & Verification',
      desc: 'Robust seller and buyer background vetting workflows. Restrict bidding access to verified users only, ensuring a safe transaction space.',
      gradient:
        'from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20',
      border: 'hover:border-blue-500/30',
    },
    {
      icon: <CreditCard className="w-6 h-6 text-emerald-500" />,
      title: 'Escrow & Automated Payments',
      desc: 'Deposit validation, automatic bid security holds, and instant online checkouts for auction winners using secure banking gateways.',
      gradient:
        'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20',
      border: 'hover:border-emerald-500/30',
    },
    {
      icon: <Bot className="w-6 h-6 text-rose-500" />,
      title: 'Anti-Sniping & Proxy Bidding',
      desc: 'Automated anti-sniping bid extensions in the final minutes, combined with custom proxy limits for bidders to bid hands-free.',
      gradient:
        'from-rose-500/10 to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/20',
      border: 'hover:border-rose-500/30',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-orange-500" />,
      title: 'Seller & Admin Insights Panels',
      desc: 'Rich interactive dashboards packed with Recharts metrics, tracking user activity, inventory performance, and revenue trends in real time.',
      gradient:
        'from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20',
      border: 'hover:border-orange-500/30',
    },
  ];

  return (
    <section className="mb-24 scroll-mt-20" id="solutions">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase text-xs mb-3 block">
          Platform Capabilities
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Next-Generation Auction Features
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Hammr.Down represents a massive upgrade over traditional catalog
          bidding sites, combining live broadcast engineering with
          high-performance transactional logic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`group bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${item.border}`}
          >
            <div>
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2.5 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed mb-4">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
