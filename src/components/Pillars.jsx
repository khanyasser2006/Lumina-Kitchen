import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    number: '01',
    title: 'Material\nIntegrity',
    body: 'Sustainably sourced hardwoods aged to perfection. Every grain pattern is selected by hand — never templated, never repeated.',
  },
  {
    number: '02',
    title: 'Geometric\nPrecision',
    body: 'CNC-milled joinery at 0.1mm tolerance. Doors align to an invisible grid that the eye recognises before the mind does.',
  },
  {
    number: '03',
    title: 'Embedded\nIntelligence',
    body: 'Concealed lighting, motorised drawers, and climate-aware ventilation — technology that serves without announcing itself.',
  },
];

export default function Pillars() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean);

    items.forEach((item, i) => {
      const elements = item.querySelectorAll('.pillar-animate');

      gsap.set(elements, { opacity: 0, y: 32 });

      ScrollTrigger.create({
        trigger: item,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
          });
        },
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-page py-40 md:py-56"
    >
      {/* Section eyebrow */}
      <div className="px-8 md:px-16 mb-24 md:mb-32 max-w-[1400px] mx-auto">
        <span className="text-taupe text-xs tracking-[0.25em] uppercase font-body block mb-6">
          Philosophy
        </span>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] font-editorial font-light text-deep max-w-[600px] text-balance">
          Three pillars of
          <br />
          <em className="italic text-bronze">uncommon craft</em>
        </h2>
      </div>

      {/* Pillar grid — asymmetric, editorial */}
      <div className="px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline">
          {pillars.map((p, i) => (
            <div
              key={i}
              ref={(el) => (itemsRef.current[i] = el)}
              className="bg-page p-8 md:p-12 flex flex-col justify-between min-h-[320px]"
            >
              <div>
                <span className="pillar-animate text-bronze text-[13px] font-body tracking-[0.15em] block mb-8">
                  {p.number}
                </span>
                <h3 className="pillar-animate text-2xl md:text-3xl font-editorial font-light text-deep leading-[1.15] whitespace-pre-line mb-6">
                  {p.title}
                </h3>
              </div>
              <p className="pillar-animate text-graphite text-[15px] leading-[1.65] font-body">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
