import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const socialLinks = [
  { label: 'ArtStation', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'Twitter/X', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Behance', href: '#' },
];

const navLinks = ['Works', 'About', 'Services', 'Process', 'Contact'];

export const Footer = () => {
  const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((r) => r.data.data),
  });

  const artistName = data?.seoTitle?.split('—')[0]?.trim() || 'ARTIST';

  return (
    <footer className="bg-black border-t border-dark-border pt-20 pb-10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Big name */}
        <div className="overflow-hidden mb-16">
          <h2 className="font-display font-black text-[12vw] leading-none text-off-white/5 select-none">
            {artistName}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-dark-border pt-10">
          {/* Nav */}
          <div>
            <p className="section-label mb-6">Navigation</p>
            <ul className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l}>
                  <button
                    onClick={() => document.querySelector(`#${l.toLowerCase()}`)?.scrollIntoView({ behavior: 'smooth' })}
                    className="font-body text-off-white/50 hover:text-amber transition-colors text-sm"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="section-label mb-6">Find Me</p>
            <ul className="flex flex-col gap-3">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer"
                    className="font-body text-off-white/50 hover:text-amber transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-4 h-px bg-off-white/20 group-hover:bg-amber group-hover:w-6 transition-all duration-300" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status + CTA */}
          <div className="flex flex-col gap-4">
            <p className="section-label mb-2">Status</p>
            {data?.isAvailableForWork ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-body text-green-400 text-sm">Available for work</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="font-body text-red-400 text-sm">Currently unavailable</span>
              </div>
            )}
            <p className="font-body text-off-white/40 text-sm leading-relaxed mt-2">
              {data?.seoDescription || 'Character art, 3D sculpting, and concept design.'}
            </p>
          </div>
        </div>

        <div className="border-t border-dark-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-off-white/25 text-xs">
            © {new Date().getFullYear()} {artistName}. All rights reserved.
          </p>
          <p className="font-body text-off-white/25 text-xs">
            Built with passion & precision.
          </p>
        </div>
      </div>
    </footer>
  );
};
