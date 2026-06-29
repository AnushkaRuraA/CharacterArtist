import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import api from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

const Ring = ({ skill, index }) => {
  const ref  = useRef(null);
  const R    = 44;
  const C    = 2 * Math.PI * R;
  const fired = useRef(false);

  useEffect(() => {
    const circle = ref.current?.querySelector('.ring-fill');
    if (!circle) return;
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      onEnter: () => {
        if (fired.current) return;
        fired.current = true;
        gsap.fromTo(ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, delay: index * 0.06, ease: 'power3.out' });
        gsap.fromTo(circle,
          { strokeDashoffset: C },
          { strokeDashoffset: C - (skill.proficiency / 100) * C, duration: 1.6, delay: index * 0.06 + 0.2, ease: 'power3.out' }
        );
      },
    });
  }, [skill.proficiency, index, C]);

  return (
    <div ref={ref} className="group flex flex-col items-center gap-4 p-6 border border-dark-border hover:border-amber/30 transition-colors duration-500 opacity-0">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="#1E1E1E" strokeWidth="5" />
          <circle
            className="ring-fill"
            cx="50" cy="50" r={R}
            fill="none"
            stroke="#FF6B1A"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {skill.icon
            ? <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{skill.icon}</span>
            : <span className="font-display font-bold text-amber text-sm">{skill.proficiency}%</span>
          }
        </div>
      </div>
      <div className="text-center">
        <p className="font-body font-medium text-off-white text-sm">{skill.name}</p>
        <p className="font-body text-off-white/25 text-xs mt-1">{skill.proficiency}%</p>
      </div>
      {/* amber line grows from 0 on hover */}
      <div className="w-0 h-px bg-amber group-hover:w-8 transition-all duration-500" />
    </div>
  );
};

export const SkillsSection = () => {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);

  const { data } = useQuery({
    queryKey: ['skills'],
    queryFn: () => api.get('/skills').then(r => r.data.data),
  });

  useEffect(() => {
    if (!headRef.current) return;
    const split = new SplitType(headRef.current, { types: 'chars' });
    gsap.fromTo(split.chars,
      { opacity: 0, yPercent: 80 },
      { opacity: 1, yPercent: 0, stagger: 0.03, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
    );
    return () => split.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-32 bg-dark-surface">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex items-center gap-6 mb-6">
          <span className="section-label text-amber/50">02 — Expertise</span>
          <div className="flex-1 h-px bg-dark-border" />
        </div>

        <div className="overflow-hidden mb-20">
          <h2
            ref={headRef}
            className="font-display font-black text-off-white/6 select-none"
            style={{ fontSize: 'clamp(3.5rem,9vw,9rem)', lineHeight: 0.88 }}
          >
            Arsenal
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border border-dark-border">
          {(data || []).map((skill, i) => (
            <div key={skill._id} className="border-b border-r border-dark-border last:border-r-0">
              <Ring skill={skill} index={i} />
            </div>
          ))}
          {!data?.length && (
            <div className="col-span-full py-20 text-center text-off-white/15 font-body text-sm">
              Skills will appear here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
