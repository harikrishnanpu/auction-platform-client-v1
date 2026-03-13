import useUserStore from '@/store/user.store';
import { User as UserIcon, Mail, Phone, ShieldCheck } from 'lucide-react';

export function PersonalInfo() {
  const { user } = useUserStore();

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-border overflow-hidden relative group hover:border-blue-500/30 transition-all duration-500">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            Personal Information
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Information pulled from your registered profile.
          </p>
        </div>
        <div className="bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 p-3 rounded-2xl">
          <UserIcon size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Full Legal Name
          </label>
          <div className="relative group/input">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <UserIcon className="text-muted-foreground w-4 h-4" />
            </div>
            <input
              className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground/70"
              readOnly
              type="text"
              value={user.name || ''}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <ShieldCheck className="text-blue-500/50 w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Email Address
          </label>
          <div className="relative group/input">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="text-muted-foreground w-4 h-4" />
            </div>
            <input
              className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground/70"
              readOnly
              type="email"
              value={user.email || ''}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <ShieldCheck className="text-blue-500/50 w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="space-y-2.5 md:col-span-1">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Phone Number
          </label>
          <div className="relative group/input flex">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="text-muted-foreground w-4 h-4" />
            </div>
            <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-xs font-bold text-muted-foreground border-r border-slate-200 dark:border-slate-800 pr-3">
              +91
            </div>
            <input
              className="w-full pl-[5.5rem] pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground/70"
              readOnly
              type="tel"
              value={user.phone || ''}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <ShieldCheck className="text-blue-500/50 w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
          Verified account information
        </p>
      </div>
    </div>
  );
}
