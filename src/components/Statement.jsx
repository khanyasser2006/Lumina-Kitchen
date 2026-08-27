import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Statement() {
  const textRef = useRef(null);

  useEffect(() => {
    const words = textRef.current?.querySelectorAll('.word');
    if (!words) return;

    gsap.set(words, { opacity: 0.12 });

    gsap.to(words, {
      opacity: 1,
      stagger: 0.06,
      ease: 'none',
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 70%',
        end: 'bottom 40%',
        scrub: 1,
      },
    });
  }, []);

  const sentence =
    'A kitchen should not impress — it should belong. We design spaces where material, light, and function exist in quiet agreement.';

  return (
    <section id="statement" className="relative bg-surface py-40 md:py-56">
      <div className="px-8 md:px-16 max-w-[960px] mx-auto">
        <p
          ref={textRef}
          className="text-[clamp(1.5rem,3.5vw,2.8rem)] leading-[1.35] font-editorial font-light text-deep"
        >
          {sentence.split(' ').map((word, i) => (
            <span key={i} className="word inline-block mr-[0.3em]">
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
