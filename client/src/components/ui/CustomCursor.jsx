import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'none' });
      gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power2.out' });
    };

    const onEnterArt = () => {
      gsap.to(cursor, { scale: 2.5, backgroundColor: 'transparent', border: '1.5px solid #FF6B1A', duration: 0.3 });
      gsap.to(follower, { scale: 0.3, opacity: 0, duration: 0.3 });
    };

    const onLeaveArt = () => {
      gsap.to(cursor, { scale: 1, backgroundColor: '#FF6B1A', border: 'none', duration: 0.3 });
      gsap.to(follower, { scale: 1, opacity: 1, duration: 0.3 });
    };

    const onEnterLink = () => {
      gsap.to(cursor, { scale: 1.8, duration: 0.3 });
    };

    const onLeaveLink = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
    };

    document.addEventListener('mousemove', onMove);

    const bindArt = () => {
      document.querySelectorAll('[data-cursor="art"]').forEach((el) => {
        el.addEventListener('mouseenter', onEnterArt);
        el.addEventListener('mouseleave', onLeaveArt);
      });
      document.querySelectorAll('a, button, [data-cursor="link"]').forEach((el) => {
        el.addEventListener('mouseenter', onEnterLink);
        el.addEventListener('mouseleave', onLeaveLink);
      });
    };

    bindArt();
    const observer = new MutationObserver(bindArt);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-amber pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
        style={{ mixBlendMode: 'difference' }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-amber/40 pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};
