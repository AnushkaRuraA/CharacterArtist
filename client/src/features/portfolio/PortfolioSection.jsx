import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { PortfolioLightbox } from './PortfolioLightbox';
import api from '@/services/api';
import { cn } from '@/utils/cn';

gsap.registerPlugin(ScrollTrigger);

const CATS = [
  { value: '', label: 'All' },
  { value: 'characters',   label: 'Characters' },
  { value: 'creatures',    label: 'Creatures' },
  { value: 'environments', label: 'Environments' },
  { value: 'concepts',     label: 'Concepts' },
  { value: 'fanart',       label: 'Fan Art' },
  { value: 'game-ready',   label: 'Game Ready' },
];

const SIZE = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
];

/* Which column a card lands in (mod 3), used to determine entry direction */
const colPosition = (index) => {
  /* rough estimation: track grid column by pattern */
  const map = [0, 2, 0, 1, 0, 2]; // left=0, mid=1, right=2
  return map[index % map.length];
};

const Card = ({ item, index, onClick, className }) => {
  const cardRef  = useRef(null);
  const maskRef  = useRef(null);
  const imgRef   = useRef(null);
  const infoRef  = useRef(null);

  const sizeClass    = SIZE[index % SIZE.length];
  const primary      = item?.images?.find(i => i.isPrimary) || item?.images?.[0];
  const editorialNum = String(index + 1).padStart(2, '0');
  const col          = colPosition(index);
  /* entry direction: left cards come from left, right cards from right, center from below */
  const entryX = col === 0 ? -80 : col === 2 ? 80 : 0;
  const entryY = col === 1 ? 60  : 20;

  useEffect(() => {
    const card = cardRef.current;
    const mask = maskRef.current;
    const img  = imgRef.current;
    if (!card || !mask) return;

    /* dramatic directional entry */
    const tl = gsap.timeline({
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
    });

    tl.fromTo(card,
        { x: entryX, y: entryY, opacity: 0, rotateZ: entryX !== 0 ? (col === 0 ? -1.5 : 1.5) : 0 },
        { x: 0, y: 0, opacity: 1, rotateZ: 0, duration: 1, ease: 'power4.out', delay: (index % 3) * 0.1 }
      )
      .fromTo(mask,
        { scaleY: 1, transformOrigin: 'bottom' },
        { scaleY: 0, duration: 0.8, ease: 'power4.out' },
        0
      );

    if (img) {
      tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1, ease: 'power4.out' }, 0);

      /* slow parallax as card scrolls through */
      gsap.to(img, {
        yPercent: -10, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 2 },
      });
    }

    /* hover */
    const title = infoRef.current?.querySelector('.card-title');
    if (title) {
      const split = new SplitType(title, { types: 'words' });
      gsap.set(split.words, { yPercent: 115, opacity: 0 });

      const onEnter = () => {
        gsap.to(split.words, { yPercent: 0, opacity: 1, stagger: 0.04, duration: 0.45, ease: 'power3.out' });
        gsap.to(infoRef.current?.querySelector('.card-cat'),  { opacity: 1, x: 0,      duration: 0.35, ease: 'power3.out' });
        gsap.to(infoRef.current?.querySelector('.card-line'), { scaleX: 1, duration: 0.45, ease: 'power3.out', delay: 0.08 });
      };
      const onLeave = () => {
        gsap.to(split.words, { yPercent: 115, opacity: 0, stagger: 0.02, duration: 0.25, ease: 'power2.in' });
        gsap.to(infoRef.current?.querySelector('.card-cat'),  { opacity: 0, x: -10,   duration: 0.25 });
        gsap.to(infoRef.current?.querySelector('.card-line'), { scaleX: 0, duration: 0.25 });
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      return () => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
        split.revert();
      };
    }
  }, [index, entryX, entryY, col]);

  if (!item) {
    return <div className={cn(sizeClass, className, 'h-full bg-dark-surface/40 animate-pulse')} />;
  }

  return (
    <div
      ref={cardRef}
      className={cn(sizeClass, className, 'group relative overflow-hidden bg-dark-surface h-full')}
      style={{ opacity: 0 }}
      data-cursor="art"
      onClick={() => onClick(item)}
    >
      <div className="relative overflow-hidden h-full w-full">
        {primary?.url
          ? <img ref={imgRef} src={primary.url} alt={item.title}
              className="absolute inset-0 w-full h-full object-cover will-change-transform"
              style={{ transform: 'scale(1.25)' }} loading="lazy" />
          : <div className="absolute inset-0 bg-dark-border" />
        }

        {/* reveal mask */}
        <div ref={maskRef} className="absolute inset-0 bg-[#0A0A0A] z-10" />

        {/* hover overlay */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/50 to-transparent
          translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />

        {/* editorial number — always visible watermark */}
        <span className="absolute top-4 left-5 z-30 font-display font-black text-white/6 leading-none select-none pointer-events-none"
          style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)' }}>
          {editorialNum}
        </span>

        {item.isFeatured && (
          <div className="absolute top-4 right-4 z-30 w-2 h-2 rounded-full bg-amber ring-4 ring-amber/15" />
        )}

        {/* hover info */}
        <div ref={infoRef} className="absolute bottom-0 left-0 right-0 z-30 p-5 md:p-7">
          <p className="card-cat section-label text-amber mb-2 tracking-[0.3em]"
            style={{ opacity: 0, transform: 'translateX(-10px)' }}>
            {item.category}
          </p>
          <div className="overflow-hidden">
            <h3 className="card-title font-display font-black text-off-white leading-tight"
              style={{ fontSize: 'clamp(1rem,2.2vw,1.9rem)' }}>
              {item.title}
            </h3>
          </div>
          <div className="card-line mt-3 h-px bg-amber origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
    </div>
  );
};

export const PortfolioSection = () => {
  const [cat, setCat]           = useState('');
  const [selected, setSelected] = useState(null);
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const gridRef    = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', cat],
    queryFn: () => api.get('/portfolio', { params: { category: cat || undefined, limit: 50 } }).then(r => r.data.data),
  });

  /* massive headline: chars fly in from below, stagger */
  useEffect(() => {
    if (!headRef.current) return;
    const split = new SplitType(headRef.current, { types: 'chars' });
    gsap.fromTo(split.chars,
      { yPercent: 130, opacity: 0, rotateX: -90 },
      {
        yPercent: 0, opacity: 1, rotateX: 0,
        stagger: 0.022, ease: 'power4.out', duration: 1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      }
    );
    gsap.fromTo('.works-filter-btn',
      { opacity: 0, y: 20, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1, stagger: 0.07, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', once: true },
      }
    );
    return () => split.revert();
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(gridRef.current.querySelectorAll('[style*="opacity: 0"], [style*="opacity:0"]'),
      { opacity: 0 },
      { opacity: 1, duration: 0.01 }   // let card's own ScrollTrigger handle opacity
    );
  }, [cat, data]);

  const items = data?.items || [];

  return (
    <section ref={sectionRef} id="works" className="py-32 bg-black overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        <div className="flex items-center gap-6 mb-4">
          <span className="section-label text-amber/40">03 — Works</span>
          <div className="flex-1 h-px bg-dark-border" />
          {!isLoading && items.length > 0 && (
            <span className="font-body text-off-white/15 text-xs">{items.length} pieces</span>
          )}
        </div>

        {/* headline with 3D char reveal */}
        <div className="overflow-hidden mb-14" style={{ perspective: '600px' }}>
          <h2
            ref={headRef}
            className="font-display font-black text-off-white/[0.055] select-none leading-[0.86]"
            style={{ fontSize: 'clamp(5rem,14vw,14rem)' }}
          >
            THE WORK
          </h2>
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATS.map(c => (
            <button key={c.value} onClick={() => setCat(c.value)}
              className={cn(
                'works-filter-btn section-label px-4 py-2 border transition-all duration-300 opacity-0',
                cat === c.value
                  ? 'border-amber text-amber bg-amber/5'
                  : 'border-dark-border/50 text-off-white/20 hover:border-amber/40 hover:text-off-white/50'
              )}>
              {c.label}
            </button>
          ))}
        </div>

        {/* editorial grid */}
        {items.length === 0 && !isLoading ? (
          <div className="border border-dark-border/30 py-40 flex flex-col items-center justify-center gap-4">
            <span className="font-display font-black text-off-white/5 select-none"
              style={{ fontSize: 'clamp(3rem,8vw,7rem)' }}>
              {cat ? `No ${cat}` : 'Coming Soon'}
            </span>
            <p className="section-label text-off-white/10">Portfolio items will appear here</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-3 gap-3" style={{ gridAutoRows: '280px' }}>
            {items.map((item, i) => (
              <Card key={item._id} item={item} index={i} onClick={setSelected} />
            ))}
          </div>
        )}
      </div>

      {selected && <PortfolioLightbox item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
};
