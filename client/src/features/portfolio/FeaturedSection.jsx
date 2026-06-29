import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { PortfolioLightbox } from './PortfolioLightbox';
import api from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

export const FeaturedSection = () => {
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const labelRef    = useRef(null);
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);

  const { data } = useQuery({
    queryKey: ['portfolio', 'featured'],
    queryFn: () => api.get('/portfolio', { params: { featured: 'true', limit: 6 } })
                      .then(r => r.data.data?.items || []),
  });

  useEffect(() => {
    if (!data?.length) return;

    const track   = trackRef.current;
    const section = sectionRef.current;
    const cards   = track.querySelectorAll('.feat-card');
    const totalDrag = track.scrollWidth - window.innerWidth;

    /* ── header reveal ── */
    const labelSplit = new SplitType(labelRef.current, { types: 'words' });
    gsap.fromTo(labelSplit.words,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, stagger: 0.07, ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 80%' } }
    );

    /* ── horizontal scroll + pin ── */
    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${totalDrag + window.innerHeight}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: self => setProgress(self.progress),
      },
    });

    pinTl.to(track, { x: -totalDrag, ease: 'none' });

    /* ── per-card parallax (image moves slower than card) ── */
    cards.forEach(card => {
      const img = card.querySelector('.card-img');
      if (!img) return;
      gsap.to(img, {
        xPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: pinTl,
          start: 'left right',
          end: 'right left',
          scrub: true,
        },
      });
    });

    /* ── card title clip-reveal as each card enters ── */
    cards.forEach(card => {
      const titleEl = card.querySelector('.card-title');
      if (!titleEl) return;
      const split = new SplitType(titleEl, { types: 'words' });
      gsap.fromTo(split.words,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0, opacity: 1, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: pinTl,
            start: 'left 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [data]);

  if (!data?.length) return null;

  return (
    <section ref={sectionRef} id="featured" className="overflow-hidden bg-black">
      {/* header */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-16 px-6 md:px-12 max-w-[1440px] mx-auto pointer-events-none">
        <div className="flex items-center gap-6">
          <div className="overflow-hidden">
            <h2
              ref={labelRef}
              className="font-display font-black text-off-white/10 select-none"
              style={{ fontSize: 'clamp(3rem,7vw,7rem)', lineHeight: 1 }}
            >
              Featured
            </h2>
          </div>
          <div className="flex-1 h-px bg-dark-border" />
          <span className="section-label text-off-white/20">
            {Math.round(progress * (data?.length || 1))} / {data?.length}
          </span>
        </div>
      </div>

      {/* scroll progress bar */}
      <div className="absolute bottom-0 left-0 z-20 h-px bg-dark-border w-full pointer-events-none">
        <div className="h-full bg-amber transition-none" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* track */}
      <div
        ref={trackRef}
        className="flex h-screen"
        style={{ width: `${(data?.length || 1) * 100}vw` }}
      >
        {data.map((item, i) => {
          const img = item.images?.find(x => x.isPrimary) || item.images?.[0];
          return (
            <div
              key={item._id}
              className="feat-card relative flex-shrink-0 w-screen h-full overflow-hidden group"
              data-cursor="art"
              onClick={() => setSelected(item)}
            >
              {/* full bleed image */}
              {img?.url
                ? <img src={img.url} alt={item.title} className="card-img absolute inset-0 w-full h-full object-cover scale-110 will-change-transform" />
                : <div className="absolute inset-0 bg-dark-border" />
              }

              {/* cinematic overlay: gradient bottom-left */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* index number — huge bg watermark */}
              <span
                className="absolute right-12 top-1/2 -translate-y-1/2 font-display font-black text-off-white/4 select-none pointer-events-none"
                style={{ fontSize: 'clamp(10rem,22vw,22rem)', lineHeight: 1 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* content */}
              <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
                <p className="section-label text-amber mb-4 tracking-[0.3em]">
                  {String(i + 1).padStart(2, '0')} — {item.category}
                </p>
                <div className="overflow-hidden">
                  <h3
                    className="card-title font-display font-black text-off-white leading-[0.9]"
                    style={{ fontSize: 'clamp(2.5rem,6vw,6rem)' }}
                  >
                    {item.title}
                  </h3>
                </div>
                {item.description && (
                  <p className="font-body text-off-white/40 text-sm mt-4 max-w-md line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
                <button className="mt-8 section-label border border-amber/60 text-amber px-6 py-3 hover:bg-amber hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0">
                  View Project →
                </button>
              </div>

              {/* vertical divider */}
              <div className="absolute top-0 right-0 bottom-0 w-px bg-dark-border/40" />
            </div>
          );
        })}
      </div>

      {selected && <PortfolioLightbox item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};
