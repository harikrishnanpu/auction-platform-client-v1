import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  colorClass: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  delay?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  colorClass,
  trend,
  delay,
}) => (
  <div
    className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group transition-all duration-300 hover:shadow-md animate-fade-in-up`}
    style={{ animationDelay: delay }}
  >
    <div
      className={`absolute right-0 top-0 h-24 w-24 ${colorClass} rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 opacity-20 dark:opacity-10`}
    ></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <div
          className={`p-2 rounded-lg ${colorClass} bg-opacity-20 dark:bg-opacity-20`}
        >
          <Icon size={18} className="text-current opacity-80" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </h2>
      <div className="flex items-center mt-2 text-sm">
        {trend && (
          <span
            className={`flex items-center font-medium ${trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}
          >
            {trend.value}
          </span>
        )}
        <span className="text-slate-400 ml-2">{subtext}</span>
      </div>
    </div>
  </div>
);
