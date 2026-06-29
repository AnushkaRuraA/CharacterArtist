import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import api from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT = [
  { name: 'Game-Ready Character', description: 'Full pipeline from concept to engine-ready. Optimized topology, PBR textures, rigging-ready.', priceLabel: 'From $800', icon: '◈' },
  { name: 'Concept Art',          description: 'Silhouette studies, colour scripts, final character sheets. 2D that informs the 3D.', priceLabel: 'From $200',  icon: '✦' },
  { name: 'Creature Design',      description: 'Fantastical or grounded. Concept through fully sculpted, textured, rigged.', priceLabel: 'From $600',  icon: '◉' },
  { name: 'Fan Art Commission',   description: 'Your favourite character. Stylised or hyper-real. Delivered in print-ready resolution.', priceLabel: 'From $150',  icon: '◇' },
];

export const ServicesSection = () => {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);

  const { data } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then(r => r.data.data),
  });
  const services = data?.length ? data : DEFAULT;

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* headline */
      const split = new SplitType(headRef.current, { types: 'words' });
      gsap.fromTo(split.words,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.07, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );

      /* cards stagger in */
      gsap.utils.toArray('.svc-card').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' } }
        );
      });

    }, sectionRef);
    return () => ctx.revert();
  }, [services]);

  return (
    <section ref={sectionRef} id="services" className="py-32 bg-black overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        <div className="flex items-center gap-6 mb-6">
          <span className="section-label text-amber/50">07 — Services</span>
          <div className="flex-1 h-px bg-dark-border" />
        </div>

        <div className="overflow-hidden mb-20">
          <h2
            ref={headRef}
            className="font-display font-black text-off-white leading-tight"
            style={{ fontSize: 'clamp(2.5rem,6vw,6rem)' }}
          >
            What I Build<br />
            <em className="text-amber not-italic">For You</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-dark-border">
          {services.map((svc, i) => (
            <div
              key={svc._id || i}
              className="svc-card group relative p-10 md:p-12 border-b border-r border-dark-border hover:bg-dark-surface transition-colors duration-500 overflow-hidden"
              style={{ opacity: 0 }}
            >
              {/* hover spotlight effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_var(--mx,50%)_var(--my,50%),rgba(255,107,26,0.05),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                <span className="text-amber/30 font-display text-4xl mb-6 block">{svc.icon || '◈'}</span>
                <h3 className="font-display font-bold text-off-white text-xl mb-4 group-hover:text-amber transition-colors duration-300">
                  {svc.name}
                </h3>
                <p className="font-body text-off-white/40 text-sm leading-[1.9] mb-8">{svc.description}</p>
                {svc.priceLabel && (
                  <p className="section-label text-amber">{svc.priceLabel}</p>
                )}
                {/* underline grows on hover */}
                <div className="mt-6 h-px bg-amber scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
