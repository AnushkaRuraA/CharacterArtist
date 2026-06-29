import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import api from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK = [
  { _id: 'f1', title: 'Brief & Research',  desc: 'Deep reference gathering, mood boards, competitive analysis. Understanding the character\'s world before a single line is drawn.' },
  { _id: 'f2', title: 'Concept Sketching', desc: 'Rapid silhouette exploration. 20 rough thumbnails become 3 refined directions. Personality locked in 2D before touching 3D.' },
  { _id: 'f3', title: 'Base Mesh',         desc: 'Clean topology in Maya or Blender. Proportions locked. Animation-ready edge loops from the very first session.' },
  { _id: 'f4', title: 'Sculpt & Detail',   desc: 'ZBrush. Skin pores, fabric weave, micro surface noise. The character stops being a model and starts being a person.' },
  { _id: 'f5', title: 'Texture & Shading', desc: 'PBR maps baked and painted in Substance. Every material tells a story — worn leather, fresh blood, polished chrome.' },
  { _id: 'f6', title: 'Final Delivery',    desc: 'Cinematic lighting pass. Compositing. Full texture packages, LODs, documented handoff. Done right, not done fast.' },
];

export const ProcessSection = () => {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const stepsRef   = useRef(null);

  const { data } = useQuery({
    queryKey: ['process'],
    queryFn: () => api.get('/process').then(r => r.data.data),
  });

  const steps = (data && data.length > 0) ? data : FALLBACK;

  useEffect(() => {
    if (!headRef.current || !stepsRef.current) return;

    const ctx = gsap.context(() => {

      /* ── headline chars slam in with 3D flip ── */
      const headSplit = new SplitType(headRef.current, { types: 'chars,words' });
      gsap.fromTo(headSplit.chars,
        { yPercent: 120, rotateX: -90, opacity: 0 },
        {
          yPercent: 0, rotateX: 0, opacity: 1,
          stagger: 0.03, ease: 'power4.out', duration: 0.9,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
        }
      );

      /* ── SVG line draws on scroll ── */
      const line = sectionRef.current.querySelector('.process-svg-line');
      if (line) {
        const len = line.getTotalLength ? line.getTotalLength() : 600;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 60%',
            end: 'bottom 60%',
            scrub: 1,
          },
        });
      }

      /* ── each step: number from opposite side, body from its side ── */
      const stepEls = stepsRef.current.querySelectorAll('.step-row');
      stepEls.forEach((el, i) => {
        const isLeft  = i % 2 === 0;
        const numEl   = el.querySelector('.step-number');
        const titleEl = el.querySelector('.step-title');
        const descEl  = el.querySelector('.step-desc');
        const dotEl   = el.querySelector('.step-dot');
        const lineEl  = el.querySelector('.step-horiz');

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        });

        tl.fromTo(numEl,
          { x: isLeft ? 120 : -120, opacity: 0, scale: 1.3 },
          { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power4.out' }, 0
        )
        .fromTo(lineEl,
          { scaleX: 0, transformOrigin: isLeft ? 'right' : 'left' },
          { scaleX: 1, duration: 0.6, ease: 'power3.out' }, 0.1
        )
        .fromTo(dotEl,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, 0.3
        )
        .fromTo(titleEl,
          { x: isLeft ? -60 : 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.35
        )
        .fromTo(descEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.5
        );
      });

    }, sectionRef);
    return () => ctx.revert();
  }, [steps]);   // re-run when steps data loads

  return (
    <section ref={sectionRef} id="process" className="py-40 bg-dark-surface overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        <div className="flex items-center gap-6 mb-6">
          <span className="section-label text-amber/40">05 — Process</span>
          <div className="flex-1 h-px bg-dark-border" />
        </div>

        <div className="overflow-hidden mb-24" style={{ perspective: '600px' }}>
          <h2
            ref={headRef}
            className="font-display font-black text-off-white leading-[0.9]"
            style={{ fontSize: 'clamp(3rem,8vw,8rem)' }}
          >
            How the<br />
            <em className="text-amber not-italic">Magic</em> Happens
          </h2>
        </div>

        <div ref={stepsRef} className="relative">

          <svg
            className="absolute left-1/2 top-0 bottom-0 h-full pointer-events-none hidden md:block"
            style={{ width: '2px', transform: 'translateX(-50%)' }}
            preserveAspectRatio="none"
          >
            <line x1="1" y1="0%" x2="1" y2="100%" stroke="#1E1E1E" strokeWidth="2" />
            <line className="process-svg-line" x1="1" y1="0%" x2="1" y2="100%"
              stroke="#FF6B1A" strokeWidth="2" />
          </svg>

          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;
            const num    = String(i + 1).padStart(2, '0');
            return (
              <div
                key={step._id}
                className="step-row relative grid grid-cols-1 md:grid-cols-2 gap-0 py-16 md:py-20"
              >
                <div className="step-dot hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                  w-4 h-4 rounded-full bg-amber z-10 ring-8 ring-dark-surface" />

                <div
                  className="step-horiz hidden md:block absolute top-1/2 h-px bg-dark-border/60 z-0"
                  style={{
                    left:   isLeft ? 0 : '50%',
                    right:  isLeft ? '50%' : 0,
                    transformOrigin: isLeft ? 'right' : 'left',
                  }}
                />

                {/* left column */}
                <div className={cn('flex items-center', isLeft ? 'md:pr-20 justify-end' : 'md:pl-20 order-2')}>
                  {isLeft ? (
                    <div className="text-left md:text-right max-w-sm w-full">
                      <h3 className="step-title font-display font-bold text-off-white text-2xl md:text-3xl mb-4" style={{ opacity: 0 }}>
                        {step.title}
                      </h3>
                      <p className="step-desc font-body text-off-white/40 text-sm leading-relaxed" style={{ opacity: 0 }}>
                        {step.desc}
                      </p>
                    </div>
                  ) : (
                    <div className="step-number font-display font-black text-amber/10 select-none leading-none text-right w-full"
                      style={{ fontSize: 'clamp(5rem,12vw,10rem)', opacity: 0 }}>
                      {num}
                    </div>
                  )}
                </div>

                {/* right column */}
                <div className={cn('flex items-center', isLeft ? 'md:pl-20 order-2' : 'md:pr-20 justify-end')}>
                  {isLeft ? (
                    <div className="step-number font-display font-black text-amber/10 select-none leading-none w-full"
                      style={{ fontSize: 'clamp(5rem,12vw,10rem)', opacity: 0 }}>
                      {num}
                    </div>
                  ) : (
                    <div className="text-left max-w-sm w-full">
                      <h3 className="step-title font-display font-bold text-off-white text-2xl md:text-3xl mb-4" style={{ opacity: 0 }}>
                        {step.title}
                      </h3>
                      <p className="step-desc font-body text-off-white/40 text-sm leading-relaxed" style={{ opacity: 0 }}>
                        {step.desc}
                      </p>
                    </div>
                  )}
                </div>

                {/* mobile */}
                <div className="md:hidden flex gap-5 col-span-1">
                  <div className="step-dot w-3 h-3 rounded-full bg-amber flex-shrink-0 mt-2 ring-4 ring-dark-surface" style={{ opacity: 0 }} />
                  <div>
                    <h3 className="step-title font-display font-bold text-off-white text-xl mb-2" style={{ opacity: 0 }}>{step.title}</h3>
                    <p className="step-desc font-body text-off-white/40 text-sm leading-relaxed" style={{ opacity: 0 }}>{step.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const cn = (...c) => c.filter(Boolean).join(' ');
