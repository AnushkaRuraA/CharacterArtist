import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import api from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

const OdometerNum = ({ target, label, trigger }) => {
  const [val, setVal] = useState(0);
  const fired = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    ScrollTrigger.create({
      trigger,
      start: 'top 65%',
      onEnter: () => {
        if (fired.current) return;
        fired.current = true;
        gsap.to({ n: 0 }, {
          n: target, duration: 2.4, ease: 'power3.out',
          onUpdate() { setVal(Math.round(this.targets()[0].n)); },
        });
      },
    });
  }, [target, trigger]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display font-black text-amber" style={{ fontSize: 'clamp(2.8rem,6vw,5rem)', lineHeight: 1 }}>
        {val}<span className="text-amber/50">+</span>
      </p>
      <p className="section-label text-off-white/30 mt-3">{label}</p>
    </div>
  );
};

export const AboutSection = () => {
  const sectionRef  = useRef(null);
  const imgWrapRef  = useRef(null);
  const imgRef      = useRef(null);
  const maskRef     = useRef(null);
  const headRef     = useRef(null);
  const linesRef    = useRef(null);
  const tagsRef     = useRef(null);
  const statsRef    = useRef(null);

  const { data } = useQuery({
    queryKey: ['about'],
    queryFn: () => api.get('/about').then(r => r.data.data),
  });

  useEffect(() => {
    if (!data) return;
    const ctx = gsap.context(() => {

      /* ── headline split ── */
      const headSplit = new SplitType(headRef.current, { types: 'lines,words' });
      gsap.set(headSplit.words, { yPercent: 110, opacity: 0 });

      /* ── PINNED scroll timeline ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // 0-20%: image mask wipes up (curtain lift)
      tl.fromTo(
        maskRef.current,
        { scaleY: 1, transformOrigin: 'bottom' },
        { scaleY: 0, ease: 'none' },
        0
      )
      // 0-25%: image subtle parallax inward
      .fromTo(imgRef.current, { scale: 1.18 }, { scale: 1, ease: 'none' }, 0)
      // 15-50%: headline words cascade in
      .to(headSplit.words, {
        yPercent: 0, opacity: 1,
        stagger: { amount: 0.5 },
        ease: 'power3.out',
      }, 0.15)
      // 40-70%: bio lines
      .fromTo(
        linesRef.current?.querySelectorAll('.bio-line') ?? [],
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 0.08, ease: 'power2.out' },
        0.4
      )
      // 60-80%: tags
      .fromTo(
        tagsRef.current?.querySelectorAll('.skill-tag') ?? [],
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, stagger: 0.05, ease: 'back.out(1.5)' },
        0.6
      )
      // 75-100%: stats fade in
      .fromTo(
        statsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0.75
      );

    }, sectionRef);
    return () => ctx.revert();
  }, [data]);

  const bioLines = (data?.bio || '<p>Character artist specializing in hyper-detailed 3D sculpts and game-ready assets.</p>')
    .replace(/<[^>]*>/g, '')
    .split('. ')
    .filter(Boolean)
    .map(s => s.trim() + (s.endsWith('.') ? '' : '.'));

  return (
    <section ref={sectionRef} id="about" className="h-screen bg-black overflow-hidden">
      <div className="h-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-center">

        <div className="flex items-center gap-6 mb-12">
          <span className="section-label text-amber/50">01 — About</span>
          <div className="flex-1 h-px bg-dark-border" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── portrait with mask reveal ── */}
          <div ref={imgWrapRef} className="relative overflow-hidden" style={{ maxHeight: '60vh' }}>
            <div className="aspect-[3/4] overflow-hidden relative">
              <div
                ref={imgRef}
                className="w-full h-full"
                style={{ transform: 'scale(1.18)', transformOrigin: 'center' }}
              >
                {data?.portrait?.url
                  ? <img src={data.portrait.url} alt="Artist" className="w-full h-full object-cover" data-cursor="art" />
                  : <div className="w-full h-full bg-dark-surface flex items-center justify-center text-off-white/10 font-body text-xs">Portrait</div>
                }
              </div>
              {/* mask overlay — lifts up via scaleY */}
              <div
                ref={maskRef}
                className="absolute inset-0 bg-black"
                style={{ transformOrigin: 'bottom' }}
              />
            </div>
            {/* amber corner accent */}
            <div className="absolute -bottom-3 -right-3 w-1/2 h-1/2 border border-amber/20 pointer-events-none" />
          </div>

          {/* ── text ── */}
          <div className="flex flex-col gap-8">
            <div className="overflow-hidden">
              <h2
                ref={headRef}
                className="font-display font-black text-off-white leading-tight"
                style={{ fontSize: 'clamp(1.8rem,3.5vw,3.5rem)' }}
              >
                Crafting Characters That<br />
                <em className="text-amber not-italic">Live</em> Beyond the Screen
              </h2>
            </div>

            <div className="h-px bg-dark-border w-12" />

            {/* bio lines */}
            <div ref={linesRef} className="flex flex-col gap-3">
              {bioLines.slice(0, 5).map((line, i) => (
                <p key={i} className="bio-line font-body text-off-white/55 text-sm leading-relaxed" style={{ opacity: 0 }}>
                  {line}
                </p>
              ))}
            </div>

            {/* tags */}
            {data?.skillTags?.length > 0 && (
              <div ref={tagsRef} className="flex flex-wrap gap-2">
                {data.skillTags.map(tag => (
                  <span key={tag} className="skill-tag px-3 py-1 border border-dark-border text-off-white/40 font-body text-xs tracking-widest uppercase" style={{ opacity: 0 }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4 pt-6 border-t border-dark-border" style={{ opacity: 0 }}>
              <OdometerNum target={data?.yearsExperience || 0} label="Years" trigger={statsRef.current} />
              <OdometerNum target={data?.projectsCompleted || 0} label="Projects" trigger={statsRef.current} />
              <OdometerNum target={data?.clientsServed || 0} label="Clients" trigger={statsRef.current} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
