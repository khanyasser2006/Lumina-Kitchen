// ═══════════════════════════════════════════════════════
// LUMINA — Analytics Configuration
//
// INSTRUCTIONS FOR CLIENT:
// 1. Create a Google Analytics 4 property at https://analytics.google.com
// 2. Copy your Measurement ID (e.g. 'G-XXXXXXXXXX')
// 3. Paste it below
//
// Alternative: For privacy-focused analytics, use:
// - Plausible Analytics (https://plausible.io)
// - Fathom Analytics (https://usefathom.com)
// ═══════════════════════════════════════════════════════

export const ANALYTICS_CONFIG = {
  // Replace with your Google Analytics 4 Measurement ID:
  GA_MEASUREMENT_ID: '', // e.g. 'G-XXXXXXXXXX'
};

/**
 * Initialize Google Analytics 4.
 * Call this once in App.jsx or main.jsx after cookie consent is accepted.
 */
export function initAnalytics() {
  const { GA_MEASUREMENT_ID } = ANALYTICS_CONFIG;
  if (!GA_MEASUREMENT_ID) return;

  // Check if user has accepted cookies
  const consent = localStorage.getItem('lumina-cookie-consent');
  if (consent !== 'accepted') return;

  // Load GA4 script dynamically
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });
}

/**
 * Track a custom event in GA4.
 * @param {string} eventName - The event name (e.g. 'enquiry_submitted')
 * @param {object} params - Additional parameters
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
