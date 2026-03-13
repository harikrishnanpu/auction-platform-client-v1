import { Gem, Globe, ShieldCheck, CreditCard, Truck } from 'lucide-react';

export function BenefitsSection() {
  const benefits = [
    {
      icon: <Globe className="text-foreground mb-3" size={24} />,
      title: 'Global Exposure',
      description:
        'Instantly reach qualified collectors and investors in over 50 countries.',
    },
    {
      icon: <ShieldCheck className="text-foreground mb-3" size={24} />,
      title: 'Authentication First',
      description:
        'Our team verifies every item, building instant trust with potential buyers.',
    },
    {
      icon: <CreditCard className="text-foreground mb-3" size={24} />,
      title: 'Secured Payouts',
      description:
        'Funds are held in escrow and released immediately upon verified delivery.',
    },
    {
      icon: <Truck className="text-foreground mb-3" size={24} />,
      title: 'White-Glove Logistics',
      description:
        'We handle fully insured shipping, customs, and delivery coordination.',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-border">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-foreground">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <Gem size={16} />
        </span>
        Why Sell with Us?
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-muted/50 border border-border"
          >
            {benefit.icon}
            <h3 className="font-semibold text-lg mb-2 text-foreground">
              {benefit.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
