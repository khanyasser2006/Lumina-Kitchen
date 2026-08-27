import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getCraftStages } from '../utils/storage';

const craftStages = [
  {
    phase: 'Phase 01',
    title: 'Timber Selection & Natural Seasoning',
    subtitle: 'Aged for 12 years to achieve zero internal tension.',
    description: 'We do not kiln-dry timber rapidly. Hardwoods are aged in temperature-stabilized open-air timber yards in the Austrian Alps for up to 12 years. This ensures the wood grain stabilizes completely, preventing warping across decades of domestic use.',
    metric: '12 Years',
    metricLabel: 'Natural Aging Cycle',
    details: [
      'Hand-inspected grain density mapping',
      'Moisture content certified below 6.8%',
      'Sustainably harvested from certified alpine forests',
      'Zero synthetic chemical pre-treatments'
    ]
  },
  {
    phase: 'Phase 02',
    title: '0.1mm CNC Micro-Joinery',
    subtitle: 'Tolerances measured in microns, not millimeters.',
    description: 'Every panel, cabinet frame, and concealed drawer runner is milled using 5-axis German CNC robotics operating at a 0.1mm tolerance. Mitered joints lock together with micro-precision so door gaps remain an invisible 1.5mm hairline.',
    metric: '0.1mm',
    metricLabel: 'Machining Tolerance',
    details: [
      '5-Axis German CNC milling precision',
      'Concealed blind mortise and tenon joints',
      'Stress-relieved aluminum structural ribbing',
      'Continuous wood grain matching across door fronts'
    ]
  },
  {
    phase: 'Phase 03',
    title: 'Hand-Applied Organic Finishes',
    subtitle: 'Seven coats of natural oils & organic beeswax.',
    description: 'No plastic lacquers. Our master artisans hand-rub timber surfaces with seven successive coats of cold-pressed linseed oil and organic Bavarian beeswax. The wood breathes, ages gracefully, and develops a warm tactile patina over generations.',
    metric: '7 Coats',
    metricLabel: 'Hand-Rubbed Finish',
    details: [
      '100% VOC-free organic oil formulation',
      '24-hour cure time between successive hand coats',
      'Self-healing surface properties for micro-scratches',
      'Food-safe certified natural wax seal'
    ]
  },
  {
    phase: 'Phase 04',
    title: 'Concealed Systems & Hardware',
    subtitle: 'Silent, motorized mechanisms that serve in whisper quietness.',
    description: 'Integrated push-to-open motorized drives, heavy-duty 80kg drawer slides, and magnetic dampening channels are embedded seamlessly into cabinet carcasses. Technology exists to serve without ever disrupting visual harmony.',
    metric: '80kg',
    metricLabel: 'Per-Drawer Load Rating',
    details: [
      'Concealed electric Servo-Drive motorized opening',
      'Air-cushioned hydraulic soft-close dampeners',
      'Integrated 2700K warm diffused LED channels',
      'Magnetic flush-closing pocket door systems'
    ]
  }
];

export default function CraftPage({ onNavigate }) {
  const [stagesList, setStagesList] = useState(() => getCraftStages());
  const [activeStage, setActiveStage] = useState(0);
  const pageRef = useRef(null);

  useEffect(() => {
    setStagesList(getCraftStages());
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
          Engineering Excellence
        </div>
        <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-editorial font-light leading-[1.02] text-deep mb-6 max-w-[960px]">
          Uncompromising precision & <br />
          <em className="italic text-bark font-light">artisanal heritage</em>
        </h1>
        <p className="text-graphite text-[16px] max-w-[580px] leading-relaxed font-body">
          Explore the four stages of Lumina craftsmanship—from 12-year timber aging in the Alps 
          to micron-level CNC joinery and hand-rubbed organic finishes.
        </p>
      </section>

      {/* ── Interactive 4-Stage Chronology ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto mb-32 animate-fade">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Stage Selector Column */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-taupe text-xs tracking-[0.2em] uppercase font-body block mb-4">
              Chronology of Craft
            </span>

            {stagesList.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStage(idx)}
                  className={`w-full text-left p-6 transition-all duration-300 border cursor-pointer ${
                    isActive
                      ? 'bg-surface border-bronze shadow-xs'
                      : 'bg-page border-hairline hover:border-hairline-dark'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-bronze text-xs tracking-[0.15em] font-body uppercase font-medium">
                      {stage.phase}
                    </span>
                    <span className="text-graphite text-xs font-editorial italic">
                      {stage.metric}
                    </span>
                  </div>
                  <h3 className="text-xl font-editorial font-light text-deep mb-1">
                    {stage.title}
                  </h3>
                  <p className="text-taupe text-[13px] font-body line-clamp-1">
                    {stage.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detail Ledger */}
          <div className="lg:col-span-7 bg-surface p-8 md:p-12 border border-hairline min-h-[500px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-hairline">
                <span className="text-bronze text-xs font-body tracking-[0.2em] uppercase font-medium">
                  {stagesList[activeStage].phase} — Detailed Protocol
                </span>
                <div className="text-right">
                  <span className="text-3xl font-editorial font-light text-deep leading-none block">
                    {stagesList[activeStage].metric}
                  </span>
                  <span className="text-taupe text-[11px] font-body tracking-[0.08em] uppercase">
                    {stagesList[activeStage].metricLabel}
                  </span>
                </div>
              </div>

              <h2 className="text-3xl font-editorial text-deep mb-3">
                {stagesList[activeStage].title}
              </h2>
              <p className="text-lg font-editorial italic text-bark mb-6">
                "{stagesList[activeStage].subtitle}"
              </p>
              <p className="text-graphite text-[15px] leading-relaxed font-body mb-8">
                {stagesList[activeStage].description}
              </p>

              <div className="space-y-3 pt-6 border-t border-hairline">
                <span className="text-taupe text-xs tracking-[0.1em] uppercase font-body block mb-2">
                  Technical Specifications
                </span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stagesList[activeStage].details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2 text-xs font-body text-deep">
                      <span className="w-1.5 h-1.5 rounded-full bg-bronze mt-1.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-hairline flex items-center justify-between">
              <span className="text-taupe text-xs font-body">
                Step {activeStage + 1} of 4
              </span>
              <button
                onClick={() => onNavigate('enquire')}
                className="text-xs tracking-[0.15em] uppercase text-bronze font-body font-medium hover:text-deep transition-colors cursor-pointer"
              >
                Discuss Custom Engineering →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── Structural Integrity Guarantee ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="bg-bark text-page p-12 md:p-16 border border-hairline">
          <div className="max-w-[720px]">
            <span className="text-bronze-light text-xs tracking-[0.25em] uppercase font-body block mb-4">
              Lumina Warranty Guarantee
            </span>
            <h3 className="text-3xl md:text-4xl font-editorial font-light leading-tight mb-6">
              Built to endure for half a century of culinary living.
            </h3>
            <p className="text-linen text-[15px] leading-relaxed font-body mb-8">
              Every Lumina cabinetry installation is registered with a unique brass serial plaque 
              and backed by a 25-year structural guarantee on timber joinery and lifetime hardware support.
            </p>
            <button
              onClick={() => onNavigate('enquire')}
              className="px-8 py-3 bg-bronze text-page text-[13px] tracking-[0.15em] uppercase font-body font-medium rounded-full hover:bg-bronze-light transition-all cursor-pointer"
            >
              Enquire About Private Workshop Tour
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
