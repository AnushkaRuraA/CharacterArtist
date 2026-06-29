import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import api from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

export const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const quoteRef   = useRef(null);
  const lineRef    = useRef(null);
  const [active, setActive] = useState(0);
  const [auto,   setAuto]   = useState(true);
  const splitRef = useRef(null);

  const { data } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.get('/testimonials').then(r => r.data.data),
  });

  /* auto rotate */
  useEffect(() => {
    if (!data?.length || !auto) return;
    const id = setInterval(() => setActive(p => (p + 1) % data.length), 5500);
    return () => clearInterval(id);
  }, [data, auto]);

  /* animate quote on change */
  useEffect(() => {
    if (!quoteRef.current || !data?.[active]) return;

    if (splitRef.current) splitRef.current.revert();
    splitRef.current = new SplitType(quoteRef.current, { types: 'words' });

    gsap.fromTo(splitRef.current.words,
      { yPercent: 60, opacity: 0 },
      { yPercent: 0, opacity: 1, stagger: 0.025, duration: 0.7, ease: 'power3.out' }
    );
  }, [active, data]);

  /* entry */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (!data?.length) return null;
  const cur = data[active];

  return (
    <section ref={sectionRef} id="testimonials" className="py-40 bg-black overflow-hidden" style={{ opacity: 0 }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-center gap-6 mb-24">
          <span className="section-label text-amber/50">06 — Client Words</span>
          <div className="flex-1 h-px bg-dark-border" />
        </div>

        <div className="max-w-5xl mx-auto">
          {/* huge decorative quote */}
          <div
            className="font-display font-black text-amber/6 leading-none select-none -mb-10 pointer-events-none"
            style={{ fontSize: 'clamp(8rem,20vw,18rem)' }}
          >
            "
          </div>

          <div className="overflow-hidden">
            <blockquote
              ref={quoteRef}
              className="font-display font-bold text-off-white leading-[1.2]"
              style={{ fontSize: 'clamp(1.4rem,3.2vw,3rem)' }}
            >
              {cur.quote}
            </blockquote>
          </div>

          <div ref={lineRef} className="mt-12 flex items-center gap-6">
            {cur.avatar?.url
              ? <img src={cur.avatar.url} alt={cur.clientName} className="w-14 h-14 rounded-full object-cover border-2 border-amber/30 flex-shrink-0" />
              : <div className="w-14 h-14 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-off-white/30 font-display font-bold flex-shrink-0">
                  {cur.clientName?.[0]}
                </div>
            }
            <div>
              <p className="font-body font-semibold text-off-white">{cur.clientName}</p>
              {cur.company && <p className="font-body text-off-white/30 text-xs tracking-widest uppercase mt-0.5">{cur.company}</p>}
            </div>
            <div className="flex gap-1 ml-2">
              {Array.from({ length: cur.rating || 5 }).map((_, i) => (
                <span key={i} className="text-amber">★</span>
              ))}
            </div>
          </div>

          {/* navigation */}
          {data.length > 1 && (
            <div className="flex items-center gap-4 mt-14">
              {data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActive(i); setAuto(false); }}
                  className={`h-px transition-all duration-500 ${i === active ? 'w-14 bg-amber' : 'w-6 bg-dark-border hover:bg-off-white/20'}`}
                />
              ))}
              <span className="font-body text-off-white/20 text-xs ml-auto">
                {String(active + 1).padStart(2, '0')} / {String(data.length).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
