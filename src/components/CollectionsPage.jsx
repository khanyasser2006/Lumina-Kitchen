import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getCollections } from '../utils/storage';

const collections = [
  {
    id: 'mono',
    tag: 'Series 01',
    name: 'Minimalist Mono',
    tagline: 'Monolithic forms sculpted from continuous stone & smoked timber.',
    description: 'Designed for architectural spaces where visual noise is eliminated. Every cabinet face is hand-matched from a single log, seamlessly aligning wood grain across 4-meter runs.',
    primaryMaterial: 'Smoked Austrian Oak',
    secondaryMaterial: 'Honed Calacatta Marble',
    hardware: 'Custom Brushed Bronze Pulls',
    joinery: '0.1mm Precision Mitered Edges',
    lighting: 'Concealed 2700K Warm Linear LED',
    image: '/images/kitchen_mono.webp',
    location: 'Mayfair Residence, London',
    year: '2025 Commission',
    architect: 'Lumina Atelier — London Studio',
    specs: [
      { label: 'Wood Species', value: 'Quarter-sawn Smoked Austrian Oak' },
      { label: 'Countertop Stone', value: 'Honed Calacatta Oro (Carrara, Italy)' },
      { label: 'Drawer Hardware', value: 'Silent Blumotion Soft-Close Dampers' },
      { label: 'Structural Framework', value: 'Laser-Cut Anodized Aluminum Chassis' },
      { label: 'Finish', value: 'Hand-Rubbed Organic Beeswax & Matte Lacquer' }
    ]
  },
  {
    id: 'floating',
    tag: 'Series 02',
    name: 'Architectural Floating',
    tagline: 'Gravity-defying cabinetry elevated above continuous floor planes.',
    description: 'Cantilevered steel subframes lift the entire kitchen island 18 centimeters above the floor. Floor-reflected ambient light creates an illusion of weightlessness.',
    primaryMaterial: 'American Black Walnut',
    secondaryMaterial: 'Matte Anodized Titanium',
    hardware: 'Push-to-Open Motorized Drive',
    joinery: 'Concealed Cantilever Steel Truss',
    lighting: 'Under-Cabinet Diffused Shadow Strip',
    image: '/images/kitchen_floating.webp',
    location: 'Alpine Villa, Zurich',
    year: '2026 Commission',
    architect: 'Lumina Atelier — Zurich Studio',
    specs: [
      { label: 'Wood Species', value: 'Select American Black Walnut' },
      { label: 'Subframe Engineering', value: 'High-Tensile Structural Steel Truss' },
      { label: 'Control Systems', value: 'Servo-Drive Motorized Opening' },
      { label: 'Cabinet Interiors', value: 'Matte Charcoal Birch Plywood' },
      { label: 'Load Capacity', value: '650kg Cantilevered Weight Rating' }
    ]
  },
  {
    id: 'heritage',
    tag: 'Series 03',
    name: 'Heritage Craft',
    tagline: 'Fluted timber millwork paired with patinated brass details.',
    description: 'A tribute to artisanal joinery. Individually carved vertical flutes run across cabinet doors, catching shadow and light throughout the day.',
    primaryMaterial: 'Fluted White Ash',
    secondaryMaterial: 'Patinated Aged Brass',
    hardware: 'Solid Machined Brass Knurled Handles',
    joinery: 'Traditional Mortise & Tenon',
    lighting: 'Integrated Glass Cabinet Spotlights',
    image: '/images/kitchen_heritage.webp',
    location: 'Brera Penthouse, Milan',
    year: '2025 Commission',
    architect: 'Lumina Atelier — Milan Studio',
    specs: [
      { label: 'Wood Species', value: 'European White Ash (Hand-Fluted)' },
      { label: 'Metal Work', value: 'Hand-Patinated Architectural Brass' },
      { label: 'Drawer Lining', value: 'Hand-Stitched Saddle Leather Insert' },
      { label: 'Hinge Mechanisms', value: 'Concealed 3D Adjustable Brass Hinges' },
      { label: 'Craftsmanship Time', value: '340 Hours Hand-Artisanship Per Unit' }
    ]
  },
  {
    id: 'industrial',
    tag: 'Series 04',
    name: 'Industrial Raw',
    tagline: 'Cast ultra-thin concrete & hand-beaten patinated copper.',
    description: 'Raw architectural elements refined for private culinary spaces. Ultra-lightweight engineered concrete surfaces paired with warm copper accents.',
    primaryMaterial: 'Ultra-High-Performance Concrete',
    secondaryMaterial: 'Beaten Antique Copper',
    hardware: 'Recessed Integrated Channel Grips',
    joinery: 'Monolithic Cast Joints',
    lighting: 'Task Light Channels with Dimmer Control',
    image: '/images/kitchen_industrial.webp',
    location: 'Ginza Loft, Tokyo',
    year: '2026 Commission',
    architect: 'Lumina Atelier — Tokyo Studio',
    specs: [
      { label: 'Island Material', value: '12mm UHPC Architectural Concrete' },
      { label: 'Accent Metals', value: 'Natural Flame-Patinated Copper' },
      { label: 'Storage Systems', value: 'Full-Extension Heavy Duty Trays' },
      { label: 'Pantry Dooring', value: 'Motorized Vertical Pocket Doors' },
      { label: 'Heat & Stain Rating', value: 'Sealant Protected to 300°C' }
    ]
  }
];

export default function CollectionsPage({ onNavigate }) {
  const [collectionsList, setCollectionsList] = useState(() => getCollections());
  const [selectedSeries, setSelectedSeries] = useState(() => collectionsList[0] || getCollections()[0]);
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    const data = getCollections();
    setCollectionsList(data);
    if (!selectedSeries && data.length > 0) {
      setSelectedSeries(data[0]);
    }
  }, []);
  
  const pageRef = useRef(null);
  const mainPhotoRef = useRef(null);

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

  // Keyboard navigation for Lightbox (ESC to close, Left/Right arrows to cycle)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxItem) return;
      if (e.key === 'Escape') setLightboxItem(null);
      if (e.key === 'ArrowRight') handleNextLightbox();
      if (e.key === 'ArrowLeft') handlePrevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem]);

  const handleSelectSeriesFromPortfolio = (item) => {
    setSelectedSeries(item);
    // Smoothly scroll to the main photo banner at the top
    if (mainPhotoRef.current) {
      mainPhotoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextLightbox = () => {
    if (!lightboxItem) return;
    const currentIndex = collections.findIndex((c) => c.id === lightboxItem.id);
    const nextIndex = (currentIndex + 1) % collections.length;
    setLightboxItem(collections[nextIndex]);
  };

  const handlePrevLightbox = () => {
    if (!lightboxItem) return;
    const currentIndex = collections.findIndex((c) => c.id === lightboxItem.id);
    const prevIndex = (currentIndex - 1 + collections.length) % collections.length;
    setLightboxItem(collections[prevIndex]);
  };

  return (
    <main ref={pageRef} className="pt-32 pb-32 bg-page min-h-screen">
      {/* ── Header / Hero Banner ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto mb-16 animate-fade">
        <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-bronze font-body mb-6">
          <span className="w-8 h-[1px] bg-bronze inline-block" />
          Architectural Series & Built Commissions
        </div>
        <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-editorial font-light leading-[1.02] text-deep mb-6 max-w-[900px]">
          Four archetypes of <br />
          <em className="italic text-bark font-light">restrained luxury</em>
        </h1>
        <p className="text-graphite text-[16px] max-w-[560px] leading-relaxed font-body">
          Each Lumina kitchen series is engineered around a core material philosophy. 
          Click any photo to open full architectural detail preview, or select a portfolio commission below to promote it to the top.
        </p>
      </section>

      {/* ── Series Navigation Tabs ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto mb-16 border-b border-hairline animate-fade">
        <div className="flex flex-wrap gap-8 md:gap-12">
          {collectionsList.map((item) => {
            const isActive = selectedSeries.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedSeries(item)}
                className={`pb-4 text-[13px] tracking-[0.15em] uppercase font-body font-medium transition-all duration-300 relative cursor-pointer ${
                  isActive ? 'text-deep' : 'text-taupe hover:text-graphite'
                }`}
              >
                <span className="text-bronze text-[11px] mr-2">{item.tag}</span>
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-bronze transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Active Series Showcase (Main Photo + Story + Specs) ── */}
      <section ref={mainPhotoRef} className="px-8 md:px-16 max-w-[1400px] mx-auto mb-28 scroll-mt-28">
        
        {/* Editorial Photo Banner — Clickable to open full detail preview */}
        <div 
          onClick={() => setLightboxItem(selectedSeries)}
          className="mb-16 border border-hairline overflow-hidden relative group cursor-pointer animate-fade shadow-sm"
        >
          <img
            src={selectedSeries.image}
            alt={selectedSeries.name}
            className="w-full h-[480px] md:h-[640px] object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          


          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-deep/90 via-deep/50 to-transparent flex flex-col md:flex-row md:items-end justify-between gap-4 text-page">
            <div>
              <span className="text-bronze-light text-xs font-body tracking-[0.2em] uppercase block mb-1">
                {selectedSeries.tag} — Built Commission
              </span>
              <h3 className="text-3xl md:text-4xl font-editorial font-light text-page">
                {selectedSeries.name}
              </h3>
            </div>
            <div className="text-right font-body text-xs text-linen tracking-[0.1em] uppercase">
              <span>{selectedSeries.location}</span>
              <span className="block text-taupe">{selectedSeries.year}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Series Story & Specs */}
          <div className="lg:col-span-6 space-y-10 animate-fade">
            <div>
              <span className="text-bronze text-xs font-body tracking-[0.2em] uppercase block mb-3">
                {selectedSeries.tag} — Provenance
              </span>
              <h2 className="text-3xl md:text-5xl font-editorial font-light text-deep leading-tight mb-4">
                {selectedSeries.name}
              </h2>
              <p className="text-lg font-editorial italic text-bark leading-relaxed mb-6">
                "{selectedSeries.tagline}"
              </p>
              <p className="text-graphite text-[15px] leading-relaxed font-body">
                {selectedSeries.description}
              </p>
            </div>

            {/* Quick Material Highlights Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-hairline">
              <div>
                <span className="text-taupe text-xs tracking-[0.1em] uppercase font-body block mb-1">
                  Primary Material
                </span>
                <span className="text-deep text-sm font-body font-medium">
                  {selectedSeries.primaryMaterial}
                </span>
              </div>
              <div>
                <span className="text-taupe text-xs tracking-[0.1em] uppercase font-body block mb-1">
                  Secondary Surface
                </span>
                <span className="text-deep text-sm font-body font-medium">
                  {selectedSeries.secondaryMaterial}
                </span>
              </div>
              <div>
                <span className="text-taupe text-xs tracking-[0.1em] uppercase font-body block mb-1">
                  Hardware Integration
                </span>
                <span className="text-deep text-sm font-body font-medium">
                  {selectedSeries.hardware}
                </span>
              </div>
              <div>
                <span className="text-taupe text-xs tracking-[0.1em] uppercase font-body block mb-1">
                  Joinery Standard
                </span>
                <span className="text-deep text-sm font-body font-medium">
                  {selectedSeries.joinery}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 flex items-center gap-6">
              <button
                onClick={() => onNavigate('enquire')}
                className="px-8 py-3 bg-bark text-page text-[13px] tracking-[0.15em] uppercase font-body font-medium
                           rounded-full hover:bg-deep transition-all duration-300 shadow-sm cursor-pointer"
              >
                Request Architectural Specs & Consult
              </button>
            </div>
          </div>

          {/* Right Column: Full Specifications Sheet */}
          <div className="lg:col-span-6 bg-surface p-8 md:p-12 border border-hairline animate-fade">
            <h3 className="text-2xl font-editorial font-light text-deep mb-6 pb-4 border-b border-hairline flex items-center justify-between">
              <span>Technical Ledger</span>
              <span className="text-xs font-body tracking-[0.15em] text-bronze uppercase">
                {selectedSeries.tag}
              </span>
            </h3>

            <dl className="divide-y divide-hairline">
              {selectedSeries.specs.map((spec, index) => (
                <div key={index} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <dt className="text-graphite text-xs tracking-[0.08em] font-body uppercase font-medium">
                    {spec.label}
                  </dt>
                  <dd className="text-deep text-sm font-body font-medium text-right sm:text-left">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 pt-6 border-t border-hairline flex items-center justify-between text-xs text-taupe font-body">
              <span>Bespoke Customization Available</span>
              <span className="text-bronze tracking-[0.1em] uppercase font-medium">0.1mm Tolerance</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Built Kitchen Commissions Portfolio (Clicking any card swaps top photo & scrolls up) ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto mb-28">
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-hairline pb-6">
          <div>
            <span className="text-taupe text-xs tracking-[0.2em] uppercase font-body block mb-2">
              Portfolio
            </span>
            <h3 className="text-3xl font-editorial font-light text-deep">
              Completed Residence Commissions
            </h3>
          </div>
          <span className="text-bronze text-xs font-body tracking-[0.15em] uppercase font-medium">
            Click any card to load at top ↑
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collectionsList.map((item) => {
            const isCurrent = selectedSeries.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectSeriesFromPortfolio(item)}
                className={`group bg-surface border overflow-hidden cursor-pointer transition-all duration-300 ${
                  isCurrent ? 'border-bronze shadow-md ring-1 ring-bronze' : 'border-hairline hover:border-hairline-dark'
                }`}
              >
                <div className="h-[320px] overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-bark/90 text-page text-[11px] font-body tracking-[0.15em] uppercase px-3 py-1 rounded-full">
                      {item.tag}
                    </span>
                    {isCurrent && (
                      <span className="bg-bronze text-page text-[11px] font-body tracking-[0.15em] uppercase px-3 py-1 rounded-full font-medium">
                        Active at Top
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-8 flex items-end justify-between">
                  <div>
                    <h4 className="text-2xl font-editorial text-deep mb-1 group-hover:text-bronze transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-graphite text-xs font-body">{item.location}</p>
                  </div>
                  <span className="text-bronze text-xs font-body uppercase tracking-[0.1em] font-medium group-hover:-translate-y-1 transition-transform flex items-center gap-1">
                    Load at Top ↑
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── INTERACTIVE LIGHTBOX / DETAIL PREVIEW MODAL ── */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-deep/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-fade">
          
          {/* Close Button */}
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-6 right-8 text-page text-sm font-body tracking-[0.2em] uppercase hover:text-bronze-light transition-colors cursor-pointer z-50 flex items-center gap-2"
          >
            <span>Close</span>
            <span className="text-2xl font-light">✕</span>
          </button>

          {/* Previous Arrow Button */}
          <button
            onClick={handlePrevLightbox}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-page text-2xl p-4 hover:text-bronze-light transition-colors cursor-pointer z-50"
            title="Previous Photo"
          >
            ❮
          </button>

          {/* Next Arrow Button */}
          <button
            onClick={handleNextLightbox}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-page text-2xl p-4 hover:text-bronze-light transition-colors cursor-pointer z-50"
            title="Next Photo"
          >
            ❯
          </button>

          {/* Lightbox Content Container */}
          <div className="max-w-[1200px] w-full max-h-[90vh] overflow-y-auto bg-page text-deep border border-hairline p-6 md:p-10 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Photo Display */}
              <div className="lg:col-span-8 overflow-hidden border border-hairline">
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.name}
                  className="w-full h-[400px] md:h-[540px] object-cover"
                />
              </div>

              {/* Photo Details Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <span className="text-bronze text-xs font-body tracking-[0.2em] uppercase block mb-1">
                    {lightboxItem.tag} — Architectural Preview
                  </span>
                  <h3 className="text-3xl font-editorial text-deep mb-2">
                    {lightboxItem.name}
                  </h3>
                  <p className="text-sm font-body text-graphite mb-1 font-medium">
                    {lightboxItem.location}
                  </p>
                  <p className="text-xs font-body text-taupe">
                    {lightboxItem.year} • {lightboxItem.architect}
                  </p>
                </div>

                <p className="text-sm font-body text-graphite leading-relaxed border-t border-b border-hairline py-4">
                  {lightboxItem.description}
                </p>

                <div className="space-y-2 text-xs font-body">
                  <div className="flex justify-between py-1 border-b border-hairline">
                    <span className="text-taupe">Primary Wood:</span>
                    <span className="text-deep font-medium">{lightboxItem.primaryMaterial}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-hairline">
                    <span className="text-taupe">Countertop Stone:</span>
                    <span className="text-deep font-medium">{lightboxItem.secondaryMaterial}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-hairline">
                    <span className="text-taupe">Hardware Finish:</span>
                    <span className="text-deep font-medium">{lightboxItem.hardware}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-taupe">Joinery Standard:</span>
                    <span className="text-deep font-medium">{lightboxItem.joinery}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setSelectedSeries(lightboxItem);
                      setLightboxItem(null);
                      if (mainPhotoRef.current) {
                        mainPhotoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="w-full py-3 bg-surface border border-hairline text-deep text-xs tracking-[0.15em] uppercase font-body font-medium rounded-full hover:border-bronze transition-all cursor-pointer"
                  >
                    Promote to Main Top Photo
                  </button>
                  
                  <button
                    onClick={() => {
                      setLightboxItem(null);
                      onNavigate('enquire');
                    }}
                    className="w-full py-3 bg-bark text-page text-xs tracking-[0.15em] uppercase font-body font-medium rounded-full hover:bg-deep transition-all cursor-pointer"
                  >
                    Enquire About This Build →
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* ── Material Texture Showcase Cards ── */}
      <section className="px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="mb-12">
          <span className="text-taupe text-xs tracking-[0.2em] uppercase font-body block mb-2">
            Materiality
          </span>
          <h3 className="text-3xl font-editorial font-light text-deep">
            Tactile Architectural Palette
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-hairline">
          {[
            {
              title: 'Smoked Oak',
              desc: 'Fumed with organic ammonia to darken heartwood fibers naturally.',
              origin: 'Austria'
            },
            {
              title: 'Calacatta Oro',
              desc: 'High-density marble with subtle gold and grey veining.',
              origin: 'Carrara, Italy'
            },
            {
              title: 'Patinated Bronze',
              desc: 'Hand-treated architectural bronze with protective wax finish.',
              origin: 'Bavaria'
            },
            {
              title: 'Fluted Ash',
              desc: 'Precision CNC fluted timber with hand-sanded ridge contours.',
              origin: 'Black Forest'
            }
          ].map((mat, i) => (
            <div key={i} className="bg-page p-8 flex flex-col justify-between h-[240px] hover:bg-surface transition-colors duration-300">
              <div>
                <span className="text-bronze text-xs tracking-[0.15em] block mb-4 uppercase">
                  {mat.origin}
                </span>
                <h4 className="text-2xl font-editorial text-deep mb-3">{mat.title}</h4>
                <p className="text-graphite text-[13px] font-body leading-relaxed">{mat.desc}</p>
              </div>
              <div className="w-6 h-[1px] bg-bronze" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
