// ═══════════════════════════════════════════════════════
// LUMINA — Email Configuration (Resend via API)
//
// The frontend calls a local API endpoint which
// securely sends emails via the Resend service.
//
// SETUP:
// 1. Sign up at https://resend.com (free tier: 3000 emails/month)
// 2. Create an API key
// 3. Add to .env:
//    RESEND_API_KEY=re_your_key_here
//    RECIPIENT_EMAIL=sales@luminakitchens.com
// 4. Run the server: node server.cjs
// ═══════════════════════════════════════════════════════

export const EMAIL_CONFIG = {
  // API endpoint for the consultation email server
  // In development: http://localhost:3001/api/send-consultation
  // In production: /api/send-consultation (same origin, behind reverse proxy)
  API_ENDPOINT: import.meta.env.PROD
    ? '/api/send-consultation'
    : 'http://localhost:3001/api/send-consultation',
};
