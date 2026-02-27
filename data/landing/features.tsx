import {
  Zap,
  ShieldCheck,
  TrendingUp,
  Bot,
  BarChart3,
  Fingerprint,
} from 'lucide-react';

export const features = [
  {
    icon: <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
    color: 'purple',
    title: 'Ultra-Low Latency',
    desc: 'Real-time WebSocket infrastructure delivering bid updates in under 50ms globally.',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    color: 'blue',
    title: 'Bank-Grade Security',
    desc: 'AES-256 encryption, 2FA, and automated fraud detection systems built-in.',
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />,
    color: 'green',
    title: 'Infinite Scalability',
    desc: 'Cloud-native architecture that auto-scales to handle millions of concurrent users.',
  },
  {
    icon: <Bot className="w-8 h-8 text-orange-600 dark:text-orange-400" />,
    color: 'orange',
    title: 'Smart Automation',
    desc: 'Set it and forget it. Automated extensions, notifications, and payment processing.',
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
    color: 'pink',
    title: 'Deep Analytics',
    desc: 'Comprehensive dashboards tracking bidder behavior, revenue forecasts, and more.',
  },
  {
    icon: <Fingerprint className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
    color: 'teal',
    title: 'Intuitive UX',
    desc: 'Design-led interface ensuring zero learning curve for admins and bidders alike.',
  },
];
