import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar({ activePage = 'home', onNavigate }) {
  const navRef = useRef(null);
  const revealedRef = useRef(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // ── Subpages: always visible immediately ──
    if (activePage !== 'home') {
      nav.style.transform = 'translateY(0%)';
      nav.style.opacity = '1';
      nav.style.visibility = 'visible';
      return;
    }

    // ── Home: already revealed once this session → stay visible ──
    if (revealedRef.current) {
      nav.style.transform = 'translateY(0%)';
      nav.style.opacity = '1';
      nav.style.visibility = 'visible';
      return;
    }

    // ── Home: initial state → completely hidden ──
    nav.style.transform = 'translateY(-100%)';
    nav.style.opacity = '0';
    nav.style.visibility = 'hidden';

    // ── Wait for #statement to enter viewport ──
    // Use a small delay to make sure ScrollTrigger finds the DOM element
    const timerId = setTimeout(() => {
      const statementEl = document.getElementById('statement');
      if (!statementEl) {
        // Fallback: if #statement doesn't exist, reveal after hero ends
        return;
      }

      const trigger = ScrollTrigger.create({
        trigger: statementEl,
        start: 'top 90%',
        once: true, // Fire only once, then self-destruct
        onEnter: () => {
          revealedRef.current = true;
          nav.style.visibility = 'visible';
          gsap.to(nav, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            clearProps: 'transform',
          });
        },
      });

      // Store for cleanup
      nav._navTrigger = trigger;
    }, 200);

    return () => {
      clearTimeout(timerId);
      if (nav._navTrigger) {
        nav._navTrigger.kill();
        nav._navTrigger = null;
      }
    };
  }, [activePage]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'collections', label: 'Collections' },
    { id: 'craft', label: 'Craft' },
    { id: 'atelier', label: 'Atelier' },
  ];

  // On home page initial load: start fully hidden via inline styles
  const initiallyHidden = activePage === 'home' && !revealedRef.current;

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-8 md:px-16 py-5"
      style={{
        background: 'hsla(40, 30%, 97%, 0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid hsla(30, 12%, 86%, 0.5)',
        transform: initiallyHidden ? 'translateY(-100%)' : 'translateY(0%)',
        opacity: initiallyHidden ? 0 : 1,
        visibility: initiallyHidden ? 'hidden' : 'visible',
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo — brand home link */}
        <button
          onClick={() => onNavigate('home')}
          className="font-editorial text-xl tracking-[0.15em] uppercase text-deep font-light cursor-pointer hover:opacity-80 transition-opacity"
          style={{ letterSpacing: '0.15em' }}
        >
          Lumina
        </button>

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-12">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`text-[13px] tracking-[0.12em] uppercase font-body font-medium transition-colors duration-200 cursor-pointer relative ${
                    isActive ? 'text-deep font-semibold' : 'text-graphite hover:text-deep'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-bronze" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('enquire')}
            className={`text-[12px] md:text-[13px] tracking-[0.1em] uppercase px-4 md:px-5 py-2 rounded-full font-body font-medium transition-all duration-300 cursor-pointer ${
              activePage === 'enquire'
                ? 'bg-bark text-page border border-bark'
                : 'text-bronze border border-hairline-dark hover:bg-surface hover:text-deep hover:border-bronze'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          >
            Enquire
          </button>
          <button
            onClick={() => onNavigate('login')}
            className={`text-[12px] md:text-[13px] tracking-[0.1em] uppercase px-4 md:px-5 py-2 rounded-full font-body font-medium transition-all duration-300 cursor-pointer ${
              activePage === 'auth' || activePage === 'login'
                ? 'bg-deep text-page border border-deep'
                : 'text-deep border border-hairline-dark hover:border-deep hover:bg-surface'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          >
            Login
          </button>
          <button
            onClick={() => onNavigate('register')}
            className={`text-[12px] md:text-[13px] tracking-[0.1em] uppercase px-4 md:px-5 py-2 rounded-full font-body font-medium transition-all duration-300 cursor-pointer ${
              activePage === 'register'
                ? 'bg-deep text-page border border-deep'
                : 'bg-bark text-page border border-bark hover:bg-deep hover:border-deep'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}
