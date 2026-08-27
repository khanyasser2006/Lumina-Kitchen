import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '12', unit: 'yr', label: 'Average material aging' },
  { value: '0.1', unit: 'mm', label: 'Joinery tolerance' },
  { value: '43', unit: '', label: 'Artisans worldwide' },
  { value: '∞', unit: '', label: 'Configurations' },
];

export default function Numbers() {
  const containerRef = useRef(null);

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('.stat-item');
    if (!items) return;

    gsap.set(items, { opacity: 0, y: 24 });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
        });
      },
    });
  }, []);

  return (
    <section className="relative bg-page border-t border-b border-hairline">
      <div
        ref={containerRef}
        className="px-8 md:px-16 max-w-[1400px] mx-auto py-20 md:py-24"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-[clamp(2.5rem,5vw,4rem)] font-editorial font-light text-deep leading-none">
                  {s.value}
                </span>
                {s.unit && (
                  <span className="text-bronze text-lg font-editorial italic">
                    {s.unit}
                  </span>
                )}
              </div>
              <span className="text-graphite text-[13px] tracking-[0.08em] font-body block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
