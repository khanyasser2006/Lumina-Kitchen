import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getSalons } from '../utils/storage';

const salons = [
  {
    city: 'London',
    district: 'Mayfair',
    address: '42 Berkeley Square, London W1J 5AW',
    phone: '+44 (0)20 7946 0188',
    director: 'Lord Alistair Sterling'
  },
  {
    city: 'Milan',
    district: 'Brera',
    address: 'Via Solferino 18, 20121 Milano',
    phone: '+39 02 8901 4210',
    director: 'Elena Bellini'
  },
  {
    city: 'Zurich',
    district: 'Bahnhofstrasse',
    address: 'Talstrasse 62, 8001 Zürich',
    phone: '+41 44 211 8890',
    director: 'Markus von Berg'
  },
  {
    city: 'Tokyo',
    district: 'Ginza',
    address: '6-10-1 Ginza, Chuo-ku, Tokyo 104-0061',
    phone: '+81 3 5537 9100',
    director: 'Kenzo Takahashi'
  }
];

const steps = [
  {
    number: '01',
    title: 'Spatial Audit & Architectural Briefing',
    desc: 'Our senior architects conduct an in-depth spatial assessment of your floorplan, analyzing natural light pathways, ceiling heights, and lifestyle flow.'
  },
  {
    number: '02',
    title: '1:1 Material Prototyping & CAD',
    desc: 'You receive physical timber & stone samples milled specifically for your project, paired with photorealistic 3D spatial renderings.'
  },
  {
    number: '03',
    title: 'Artisanal Workshop Fabrication',
    desc: 'Your kitchen is constructed over 300 hours in our Bavarian workshop. Master cabinetmakers dry-fit the entire structure before shipment.'
  },
  {
    number: '04',
    title: 'White-Glove On-Site Installation',
    desc: 'Lumina master joiners travel directly to your residence to oversee installation, aligning every door reveal to micron precision.'
  }
];

export default function AtelierPage({ onNavigate }) {
  const [salonsList, setSalonsList] = useState(() => getSalons());
  const pageRef = useRef(null);

  useEffect(() => {
    setSalonsList(getSalons());
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const elements = pageRef.current?.querySelectorAll('.animate-fade');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <main ref={pageRef} className="pt-32 pb-32 bg-page min-h-screen">
      {/* ── Editorial Header ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto mb-24 animate-fade">
        <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-bronze font-body mb-6">
          <span className="w-8 h-[1px] bg-bronze inline-block" />
          The Practice & Heritage
        </div>
        <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-editorial font-light leading-[1.02] text-deep mb-6 max-w-[960px]">
          Bespoke studio practice for <br />
          <em className="italic text-bark font-light">discerning private clients</em>
        </h1>
        <p className="text-graphite text-[16px] max-w-[580px] leading-relaxed font-body">
          Founded on the principle that the kitchen is the architectural soul of the private residence. 
          We operate across London, Milan, Zurich, Tokyo, and New York.
        </p>
      </section>

      {/* ── Manifesto Section ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto mb-32 bg-surface p-12 md:p-20 border border-hairline animate-fade">
        <div className="max-w-[800px]">
          <span className="text-bronze text-xs tracking-[0.25em] uppercase font-body block mb-4">
            Studio Manifesto
          </span>
          <h2 className="text-3xl md:text-5xl font-editorial font-light text-deep leading-tight mb-8">
            "Silence is the ultimate architectural statement."
          </h2>
          <p className="text-graphite text-[16px] leading-relaxed font-body mb-6">
            In a world dominated by disposable trends and mass production, Lumina stands for quiet permanence. 
            We do not design kitchens that shout for attention; we craft monolithic culinary spaces where material integrity, 
            natural light, and mechanical perfection exist in complete harmony.
          </p>
          <p className="text-graphite text-[16px] leading-relaxed font-body">
            Every commission is limited to 48 private residences worldwide per calendar year, ensuring uncompromised 
            dedication from our principal architects and master cabinetmakers.
          </p>
        </div>
      </section>

      {/* ── 4-Step Private Process ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto mb-32 animate-fade">
        <div className="mb-16">
          <span className="text-taupe text-xs tracking-[0.2em] uppercase font-body block mb-2">
            Methodology
          </span>
          <h3 className="text-3xl font-editorial font-light text-deep">
            The Commissioning Process
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-page p-8 flex flex-col justify-between min-h-[300px]">
              <div>
                <span className="text-bronze font-body text-xs tracking-[0.2em] block mb-6 font-medium">
                  {step.number}
                </span>
                <h4 className="text-2xl font-editorial text-deep mb-4 leading-snug">
                  {step.title}
                </h4>
                <p className="text-graphite text-[14px] font-body leading-relaxed">
                  {step.desc}
                </p>
              </div>
              <div className="pt-6 border-t border-hairline">
                <span className="text-taupe text-[11px] font-body uppercase tracking-[0.1em]">Stage {idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Global Private Salons ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto animate-fade">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-taupe text-xs tracking-[0.2em] uppercase font-body block mb-2">
              Presence
            </span>
            <h3 className="text-3xl font-editorial font-light text-deep">
              Global Private Salons
            </h3>
          </div>
          <button
            onClick={() => onNavigate('enquire')}
            className="px-6 py-2.5 border border-hairline-dark text-deep text-xs tracking-[0.15em] uppercase font-body font-medium rounded-full hover:bg-surface hover:border-bronze transition-all cursor-pointer"
          >
            Book Private Appointment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {salonsList.map((salon, i) => (
            <div key={i} className="bg-surface p-8 border border-hairline flex flex-col justify-between h-[280px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-body tracking-[0.15em] text-bronze uppercase font-medium">
                    {salon.city}
                  </span>
                  <span className="text-xs font-body text-taupe">{salon.district}</span>
                </div>
                <h4 className="text-2xl font-editorial text-deep mb-3">{salon.city} Studio</h4>
                <p className="text-graphite text-[13px] font-body leading-relaxed mb-4">{salon.address}</p>
                <p className="text-taupe text-[12px] font-body">{salon.phone}</p>
              </div>
              <div className="pt-4 border-t border-hairline flex items-center justify-between text-xs text-graphite font-body">
                <span>Director: {salon.director}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
