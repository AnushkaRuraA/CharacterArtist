import { cn } from '@/utils/cn';

export const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-dark-border text-off-white/60',
    amber: 'bg-amber/10 text-amber border border-amber/30',
    available: 'bg-green-900/30 text-green-400 border border-green-700/40',
    unavailable: 'bg-red-900/30 text-red-400 border border-red-700/40',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-body font-medium', variants[variant], className)}>
      {children}
    </span>
  );
};
