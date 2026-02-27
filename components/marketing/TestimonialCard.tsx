export function TestimonialCard() {
  return (
    <div className="hidden lg:flex flex-col gap-8 pr-8">
      <div className="relative animate-in slide-in-from-left-10 duration-700 fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 w-fit mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 tracking-wider uppercase">
            Live Bidding Platform
          </span>
        </div>
        <h1 className="  text-6xl xl:text-7xl font-medium leading-none text-foreground mb-6">
          Join the <br />
          <span className="italic text-blue-600 dark:text-blue-400">
            Winning Circle.
          </span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
          Create an account to experience{' '}
          <span className="text-foreground font-medium">real-time bidding</span>
          , secure payment locking, and fair auction extensions.
        </p>
      </div>

      {/* Testimonial Card */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-white/10 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-lg">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 overflow-hidden shrink-0 flex items-center justify-center text-white   text-lg">
            M
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2 italic">
              The anti-sniping protection is a game changer. I finally feel like
              online auctions are fair.
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              — Marcus T., Watch Collector
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white dark:border-slate-800"></div>
            <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white dark:border-slate-800"></div>
            <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white dark:border-slate-800"></div>
          </div>
          <div className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            36 Active Listeners
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
