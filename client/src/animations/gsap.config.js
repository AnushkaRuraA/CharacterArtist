import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const splitAndAnimate = (element, vars = {}) => {
  const split = new SplitType(element, { types: 'chars,words' });
  gsap.fromTo(
    split.chars,
    { y: '100%', opacity: 0 },
    {
      y: '0%',
      opacity: 1,
      duration: 0.8,
      stagger: 0.025,
      ease: 'power3.out',
      ...vars,
    }
  );
  return split;
};

export const clipReveal = (element, trigger, vars = {}) =>
  gsap.fromTo(
    element,
    { clipPath: 'inset(0 0 100% 0)' },
    {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: trigger || element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      ...vars,
    }
  );

export const fadeUp = (elements, trigger, stagger = 0.1) =>
  gsap.fromTo(
    elements,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );
