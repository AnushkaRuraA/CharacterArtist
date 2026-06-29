import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { cn } from '@/utils/cn';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const links = [
  { href: '#about', label: 'About' },
  { href: '#works', label: 'Works' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  const { data } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((r) => r.data.data),
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' }
    );
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'py-3 bg-black/90 backdrop-blur border-b border-dark-border' : 'py-6'
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="font-display font-black text-xl tracking-tight text-off-white hover:text-amber transition-colors">
          {data?.seoTitle?.split('—')[0]?.trim() || 'ARTIST'}
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => scrollTo(l.href)}
                className="section-label text-off-white/50 hover:text-amber transition-colors"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          {data?.isAvailableForWork && (
            <span className="flex items-center gap-1.5 text-xs text-green-400 font-body">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Available
            </span>
          )}
          <button
            onClick={() => scrollTo('#contact')}
            className="section-label border border-amber text-amber px-4 py-2 hover:bg-amber hover:text-black transition-all duration-300"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-8"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={cn('w-full h-px bg-off-white transition-all duration-300', menuOpen && 'rotate-45 translate-y-[7px]')} />
          <span className={cn('w-full h-px bg-off-white transition-all duration-300', menuOpen && 'opacity-0')} />
          <span className={cn('w-full h-px bg-off-white transition-all duration-300', menuOpen && '-rotate-45 -translate-y-[7px]')} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        'md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur border-b border-dark-border transition-all duration-500 overflow-hidden',
        menuOpen ? 'max-h-96 py-8' : 'max-h-0'
      )}>
        <ul className="flex flex-col items-center gap-6">
          {links.map((l) => (
            <li key={l.href}>
              <button onClick={() => scrollTo(l.href)} className="section-label text-off-white/70 hover:text-amber">
                {l.label}
              </button>
            </li>
          ))}
          <li>
            <button onClick={() => scrollTo('#contact')} className="section-label border border-amber text-amber px-6 py-2">
              Hire Me
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
