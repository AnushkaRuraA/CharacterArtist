import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';
import api from '@/services/api';

gsap.registerPlugin(ScrollTrigger);

const FloatingField = ({ label, type = 'text', value, onChange, multiline, required, ...rest }) => {
  const [focused, setFocused] = useState(false);
  const up = focused || value;
  return (
    <div className="relative group">
      <label className={cn(
        'absolute left-0 pointer-events-none font-body transition-all duration-300',
        up ? 'top-0 text-[10px] text-amber tracking-widest uppercase' : 'top-4 text-sm text-off-white/25'
      )}>
        {label}{required && <span className="text-amber ml-0.5">*</span>}
      </label>
      {multiline
        ? <textarea
            value={value} onChange={onChange} rows={4}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className="w-full bg-transparent border-b border-dark-border focus:border-amber outline-none font-body text-off-white text-sm pt-6 pb-2 resize-none transition-colors duration-300"
            {...rest}
          />
        : <input
            type={type} value={value} onChange={onChange}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className="w-full bg-transparent border-b border-dark-border focus:border-amber outline-none font-body text-off-white text-sm pt-6 pb-2 transition-colors duration-300"
            {...rest}
          />
      }
    </div>
  );
};

const empty = (mode) => mode === 'quick'
  ? { name: '', email: '', subject: '', message: '' }
  : { name: '', email: '', projectType: '', budget: '', deadline: '', referenceLinks: '', message: '' };

export const ContactSection = () => {
  const sectionRef = useRef(null);
  const headRef    = useRef(null);
  const [mode,    setMode]    = useState('quick');
  const [form,    setForm]    = useState(empty('quick'));
  const [done,    setDone]    = useState(false);

  const setF = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitType(headRef.current, { types: 'words' });
      gsap.fromTo(split.words,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.06, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
      gsap.fromTo('.contact-reveal',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const mutation = useMutation({
    mutationFn: d => api.post('/contact', d),
    onSuccess: () => { setDone(true); toast.success('Message sent!'); },
    onError: e  => toast.error(e.response?.data?.message || 'Failed to send'),
  });

  if (done) return (
    <section id="contact" className="min-h-screen bg-dark-surface flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="font-display font-black text-amber text-8xl mb-6 leading-none">✦</div>
        <h2 className="font-display font-bold text-off-white text-3xl mb-4">Transmission Received.</h2>
        <p className="font-body text-off-white/40 text-sm leading-relaxed mb-10">
          I'll review your inquiry and get back to you within 24 hours. Expect something worth the wait.
        </p>
        <button onClick={() => { setDone(false); setForm(empty(mode)); }}
          className="section-label border border-amber text-amber px-8 py-3 hover:bg-amber hover:text-black transition-all duration-300">
          Send Another
        </button>
      </div>
    </section>
  );

  return (
    <section ref={sectionRef} id="contact" className="py-32 bg-dark-surface overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        <div className="flex items-center gap-6 mb-6">
          <span className="section-label text-amber/50">08 — Contact</span>
          <div className="flex-1 h-px bg-dark-border" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">

          {/* left */}
          <div className="flex flex-col gap-10">
            <div className="overflow-hidden">
              <h2
                ref={headRef}
                className="font-display font-black text-off-white leading-[0.92]"
                style={{ fontSize: 'clamp(3rem,7vw,7rem)' }}
              >
                Let's Build<br />
                Something<br />
                <em className="text-amber not-italic">Unforgettable.</em>
              </h2>
            </div>

            <div className="contact-reveal h-px bg-dark-border" style={{ opacity: 0 }} />

            <div className="contact-reveal flex flex-col gap-5" style={{ opacity: 0 }}>
              {[
                ['Response Time', '24–48 Hours'],
                ['Availability',  'Open for Projects'],
                ['Based In',      'Available Worldwide'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center border-b border-dark-border/40 pb-4">
                  <span className="section-label text-off-white/25">{k}</span>
                  <span className="font-body text-off-white/60 text-sm">{v}</span>
                </div>
              ))}
            </div>

            {/* big amber decorative text */}
            <div
              className="contact-reveal font-display font-black text-amber/4 select-none leading-none -mb-4 mt-auto hidden lg:block"
              style={{ fontSize: 'clamp(4rem,9vw,9rem)', opacity: 0 }}
            >
              HIRE ME
            </div>
          </div>

          {/* right — form */}
          <div className="contact-reveal" style={{ opacity: 0 }}>
            {/* mode toggle */}
            <div className="flex border border-dark-border mb-10">
              {['quick', 'project'].map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setForm(empty(m)); }}
                  className={cn(
                    'flex-1 py-3.5 section-label transition-all duration-300',
                    mode === m ? 'bg-amber text-black' : 'text-off-white/30 hover:text-off-white/60'
                  )}
                >
                  {m === 'quick' ? 'Quick Message' : 'Book a Project'}
                </button>
              ))}
            </div>

            <form onSubmit={e => { e.preventDefault(); mutation.mutate({ ...form, type: mode }); }} className="flex flex-col gap-7">
              <FloatingField label="Your Name"     value={form.name}    onChange={setF('name')}    required />
              <FloatingField label="Email Address" value={form.email}   onChange={setF('email')}   type="email" required />

              {mode === 'quick' && (
                <FloatingField label="Subject" value={form.subject} onChange={setF('subject')} />
              )}

              {mode === 'project' && (<>
                <FloatingField label="Project Type"    value={form.projectType}    onChange={setF('projectType')} />
                <div className="grid grid-cols-2 gap-5">
                  <FloatingField label="Budget Range"  value={form.budget}    onChange={setF('budget')} />
                  <FloatingField label="Deadline"      value={form.deadline}  onChange={setF('deadline')} type="date" />
                </div>
                <FloatingField label="Reference Links" value={form.referenceLinks} onChange={setF('referenceLinks')} />
              </>)}

              <FloatingField label="Message" value={form.message} onChange={setF('message')} multiline required />

              <button
                type="submit"
                disabled={mutation.isPending}
                className="relative mt-2 w-full py-5 bg-amber text-black section-label text-sm hover:bg-amber/90 disabled:opacity-40 transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10">
                  {mutation.isPending ? 'Transmitting…' : mode === 'project' ? 'Send Project Brief' : 'Send Message'}
                </span>
                {/* fill animation on hover */}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
