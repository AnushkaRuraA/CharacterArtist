import { cn } from '@/utils/cn';

export const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const base = 'inline-flex items-center justify-center gap-2 font-body font-medium tracking-widest uppercase transition-all duration-300 select-none';

  const variants = {
    primary: 'bg-amber text-black hover:bg-amber/90 active:scale-95',
    outline: 'border border-amber text-amber hover:bg-amber hover:text-black',
    ghost: 'text-off-white hover:text-amber border-b border-transparent hover:border-amber',
    danger: 'bg-crimson text-white hover:bg-crimson/90',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-xs',
    lg: 'px-10 py-4 text-sm',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};
