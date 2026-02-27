import { Zap, CheckCircle, Lightbulb } from 'lucide-react';

export const specialities = [
  {
    icon: <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    color: 'blue',
    title: 'Unmatched Speed',
    desc: 'Our proprietary engine processes bids 10x faster than standard e-commerce platforms.',
  },
  {
    icon: (
      <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
    ),
    color: 'purple',
    title: 'Reliability Guaranteed',
    desc: '99.99% Uptime SLA ensures your high-stakes auctions are never interrupted.',
  },
  {
    icon: (
      <Lightbulb className="w-6 h-6 text-orange-600 dark:text-orange-400" />
    ),
    color: 'orange',
    title: 'Continuous Innovation',
    desc: 'We ship updates weekly, keeping you ahead of market trends and technology.',
  },
];
