import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import api from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  const wrapRef    = useRef(null);
  const bgRef      = useRef(null);
  const overlayRef = useRef(null);
  const titleRef   = useRef(null);
  const subRef     = useRef(null);
  const scrollRef  = useRef(null);
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);

  const { data } = useQuery({
    queryKey: ['hero'],
    queryFn: () => api.get('/hero').then(r => r.data.data),
  });

  /* ── particles ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.05),
      a: Math.random() * 0.35 + 0.05,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,107,26,${p.a})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
  }, []);

  /* ── cinematic intro + scroll storytelling ── */
  useEffect(() => {
    if (!data) return;

    const title = titleRef.current;
    const sub   = subRef.current;
    if (!title) return;

    // Split title into chars
    const split = new SplitType(title, { types: 'chars' });

    /* === INTRO (load animation, not scroll) === */
    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // chars slam in staggered from below
    intro
      .set(wrapRef.current, { autoAlpha: 1 })
      .fromTo(
        split.chars,
        { yPercent: 120, rotateX: -80, opacity: 0 },
        { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.1, stagger: { amount: 0.6 } },
        0
      )
      .fromTo(
        sub,
        { opacity: 0, y: 30, letterSpacing: '0.6em' },
        { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 1.2 },
        0.7
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' },
        1.4
      );

    /* === SCROLL-OUT: section exits cinematically as you scroll away === */
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
      },
    });

    // bg zooms in and darkens
    exitTl
      .to(bgRef.current,      { scale: 1.18, filter: 'blur(4px) brightness(0.3)', ease: 'none' }, 0)
      .to(overlayRef.current, { opacity: 0.92, ease: 'none' }, 0)
      // title chars scatter outward
      .to(split.chars, {
        yPercent: () => gsap.utils.random(-140, -60),
        xPercent: () => gsap.utils.random(-40, 40),
        opacity: 0,
        stagger: { amount: 0.4, from: 'random' },
        ease: 'power2.in',
      }, 0)
      .to(sub,         { opacity: 0, y: -40, ease: 'power2.in' }, 0)
      .to(scrollRef.current, { opacity: 0 }, 0);

    return () => { split.revert(); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [data]);

  return (
    <section
      ref={wrapRef}
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ visibility: 'hidden', perspective: '800px' }}
    >
      {/* bg */}
      <div ref={bgRef} className="absolute inset-0 scale-110 will-change-transform">
        {data?.backgroundImage?.url
          ? <img src={data.backgroundImage.url} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-[#0a0a0a] via-[#0f0808] to-[#1a0c06]" />
        }
      </div>

      {/* overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-black opacity-40 pointer-events-none" />
      {/* bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
      {/* side vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#000_100%)] pointer-events-none" />

      {/* particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* content */}
      <div className="relative z-10 text-center px-6 max-w-[1200px] mx-auto">
        <p className="section-label mb-8 text-amber/60 tracking-[0.5em]">Character Artist</p>

        <div className="overflow-hidden" style={{ perspective: '600px' }}>
          <h1
            ref={titleRef}
            className="font-display font-black leading-[0.88] text-off-white tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 11rem)' }}
          >
            {data?.artistName || 'Your Name'}
          </h1>
        </div>

        <div ref={subRef} className="mt-10 flex items-center justify-center gap-5 opacity-0">
          <span className="h-px w-20 bg-amber/60" />
          <p className="font-body text-off-white/50 text-sm md:text-base uppercase" style={{ letterSpacing: '0.3em' }}>
            {data?.subtitle || 'Concept · Sculpt · 3D'}
          </p>
          <span className="h-px w-20 bg-amber/60" />
        </div>
      </div>

      {/* scroll indicator */}
      <div ref={scrollRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0">
        <span className="section-label text-off-white/25">Scroll</span>
        <div className="w-px h-14 bg-gradient-to-b from-amber to-transparent" />
      </div>
    </section>
  );
};
