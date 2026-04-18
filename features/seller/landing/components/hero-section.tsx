export function HeroSection() {
  return (
    <div className="relative mb-12 text-center max-w-2xl mx-auto">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-200/50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10"></div>
      <span className="inline-block py-1 px-3 rounded-full bg-background border border-border text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm text-muted-foreground">
        Start Selling
      </span>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-foreground">
        Turn Assets into Legacy.
      </h1>
      <p className="text-muted-foreground text-lg leading-relaxed">
        Join the elite circle of sellers on HammerDown. High-value auctions,
        verified buyers, and seamless white-glove transactions.
      </p>
    </div>
  );
}
