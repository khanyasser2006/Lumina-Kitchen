import React from 'react';

export default function Footer({ onNavigate }) {
  const footerLinks = [
    { id: 'home', label: 'Home' },
    { id: 'collections', label: 'Collections' },
    { id: 'craft', label: 'Craft' },
    { id: 'atelier', label: 'Atelier' },
    { id: 'enquire', label: 'Enquire' },
    { id: 'login', label: 'Login' },
    { id: 'register', label: 'Register' },
  ];

  return (
    <footer className="bg-surface border-t border-hairline">
      <div className="px-8 md:px-16 max-w-[1400px] mx-auto py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-16 items-end">
          {/* Left: brand + tagline */}
          <div>
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="font-editorial text-2xl tracking-[0.15em] uppercase text-deep font-light block mb-4 cursor-pointer hover:opacity-80 transition-opacity"
            >
              Lumina
            </button>
            <p className="text-graphite text-[15px] font-body max-w-[360px] leading-relaxed">
              Bespoke kitchen architecture for homes that value
              silence, substance, and enduring craft.
            </p>
          </div>

          {/* Right: navigation links */}
          <div className="flex flex-wrap gap-8 md:gap-12">
            {footerLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate && onNavigate(link.id)}
                className="text-graphite text-[13px] tracking-[0.1em] uppercase font-body font-medium
                           hover:text-deep transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom divider + copyright */}
        <div className="mt-16 pt-8 border-t border-hairline flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <span className="text-taupe text-[12px] tracking-[0.08em] font-body">
            © {new Date().getFullYear()} Lumina Kitchen Architecture
          </span>
          <span className="text-taupe text-[12px] tracking-[0.08em] font-body">
              Crafted with intention
          </span>
        </div>
      </div>
    </footer>
  );
}
