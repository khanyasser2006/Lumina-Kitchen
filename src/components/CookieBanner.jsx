import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const bannerRef = React.useRef(null);

  useEffect(() => {
    const consent = localStorage.getItem('lumina-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (visible && bannerRef.current) {
      gsap.fromTo(
        bannerRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [visible]);

  const handleAccept = () => {
    localStorage.setItem('lumina-cookie-consent', 'accepted');
    gsap.to(bannerRef.current, {
      y: 100,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => setVisible(false),
    });
  };

  const handleDecline = () => {
    localStorage.setItem('lumina-cookie-consent', 'declined');
    gsap.to(bannerRef.current, {
      y: 100,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => setVisible(false),
    });
  };

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      style={{ opacity: 0 }}
    >
      <div
        className="max-w-[680px] mx-auto p-6 md:p-8 border border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg"
        style={{
          background: 'hsla(40, 30%, 97%, 0.95)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex-1">
          <p className="text-deep text-[13px] font-body leading-relaxed">
            We use essential cookies to ensure our site functions properly. 
            Analytics cookies help us understand how you interact with our collections.
          </p>
          <p className="text-taupe text-[11px] font-body mt-1">
            Your privacy is protected under strict client confidentiality.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="text-graphite text-[12px] tracking-[0.1em] uppercase font-body font-medium hover:text-deep transition-colors cursor-pointer px-4 py-2"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 bg-bark text-page text-[12px] tracking-[0.12em] uppercase font-body font-medium rounded-full hover:bg-deep transition-all cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
