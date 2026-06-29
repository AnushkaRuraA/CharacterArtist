import { useEffect, useRef, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { useLenis } from '@/hooks/useLenis';
import gsap from 'gsap';

const Preloader = ({ onDone }) => {
  const ref     = useRef(null);
  const barRef  = useRef(null);
  const numRef  = useRef(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const obj = { n: 0 };
    gsap.to(obj, {
      n: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate() { setPct(Math.round(obj.n)); },
      onComplete() {
        gsap.to(ref.current, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
          onComplete: onDone,
        });
      },
    });
  }, [onDone]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center"
    >
      <p
        ref={numRef}
        className="font-display font-black text-amber"
        style={{ fontSize: 'clamp(5rem,15vw,14rem)', lineHeight: 1 }}
      >
        {pct}
      </p>
      <div ref={barRef} className="absolute bottom-0 left-0 h-px bg-dark-border w-full">
        <div className="h-full bg-amber transition-none" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export const PageWrapper = ({ children }) => {
  const [ready, setReady] = useState(false);
  useLenis();

  return (
    <>
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <div className="grain relative" style={{ visibility: ready ? 'visible' : 'hidden' }}>
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
};
