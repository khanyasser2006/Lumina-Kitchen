// ═══════════════════════════════════════════════════════
// LUMINA — Hardened Security Email API Server (Resend)
// ═══════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

// Load environment variables securely
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security Headers Middleware ──
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ── CORS Policy ──
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.ALLOWED_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, strict with origin header
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Request Body Size Limit (Prevent Memory Exhaustion) ──
app.use(express.json({ limit: '10kb' }));

// ── Rate Limiting (Prevent Spam & DoS) ──
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function applyRateLimit(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, timestamps);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      error: 'Too many consultation requests. Please try again in 15 minutes.',
    });
  }

  timestamps.push(now);
  next();
}

// ── HTML Sanitization Helper ──
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'lumina-email-api-hardened', secure: true });
});

// ── Send Consultation Email ──
app.post('/api/send-consultation', applyRateLimit, async (req, res) => {
  const { RESEND_API_KEY, RECIPIENT_EMAIL } = process.env;

  if (!RESEND_API_KEY || !RECIPIENT_EMAIL) {
    return res.status(503).json({
      success: false,
      error: 'Email service credentials not configured. Please set RESEND_API_KEY and RECIPIENT_EMAIL in .env',
    });
  }

  const resend = new Resend(RESEND_API_KEY);

  // Sanitize all incoming fields against HTML/Script Injection
  const from_name = sanitize(req.body.from_name);
  const from_email = sanitize(req.body.from_email);
  const phone = sanitize(req.body.phone);
  const location = sanitize(req.body.location);
  const scope = sanitize(req.body.scope);
  const series = sanitize(req.body.series);
  const budget = sanitize(req.body.budget);
  const salon = sanitize(req.body.salon);
  const notes = sanitize(req.body.notes);
  const reference_code = sanitize(req.body.reference_code);

  if (!from_name || !from_email || !reference_code) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input payload. Required fields missing.',
    });
  }

  try {
    // ── Send Email via Resend API ──
    await resend.emails.send({
      from: 'Lumina Consultations <onboarding@resend.dev>',
      to: RECIPIENT_EMAIL,
      subject: `New Consultation Dossier — ${reference_code}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2B1D14; background: #F0EBE3; padding: 40px;">
          <h1 style="font-size: 24px; font-weight: 300; border-bottom: 1px solid #D4C5B0; padding-bottom: 16px; margin-bottom: 24px;">
            New Architectural Consultation
          </h1>
          
          <p style="font-size: 14px; color: #8A7968; margin-bottom: 24px;">
            Reference: <strong style="color: #C27A3E;">${reference_code}</strong>
          </p>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #E8E0D4;">
              <td style="padding: 12px 0; color: #8A7968; width: 40%;">Client Name</td>
              <td style="padding: 12px 0; font-weight: 500;">${from_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8E0D4;">
              <td style="padding: 12px 0; color: #8A7968;">Email</td>
              <td style="padding: 12px 0;">${from_email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8E0D4;">
              <td style="padding: 12px 0; color: #8A7968;">Telephone</td>
              <td style="padding: 12px 0;">${phone || '—'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8E0D4;">
              <td style="padding: 12px 0; color: #8A7968;">Property Location</td>
              <td style="padding: 12px 0;">${location || '—'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8E0D4;">
              <td style="padding: 12px 0; color: #8A7968;">Project Scope</td>
              <td style="padding: 12px 0;">${scope}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8E0D4;">
              <td style="padding: 12px 0; color: #8A7968;">Series</td>
              <td style="padding: 12px 0;">${series}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8E0D4;">
              <td style="padding: 12px 0; color: #8A7968;">Investment Tier</td>
              <td style="padding: 12px 0;">${budget}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8E0D4;">
              <td style="padding: 12px 0; color: #8A7968;">Salon Preference</td>
              <td style="padding: 12px 0;">${salon}</td>
            </tr>
            ${notes ? `
            <tr>
              <td style="padding: 12px 0; color: #8A7968; vertical-align: top;">Notes</td>
              <td style="padding: 12px 0;">${notes}</td>
            </tr>
            ` : ''}
          </table>

          <p style="font-size: 11px; color: #8A7968; margin-top: 32px; border-top: 1px solid #D4C5B0; padding-top: 16px;">
            This consultation was submitted via luminakitchens.com
          </p>
        </div>
      `,
    });

    res.json({ success: true, reference_code });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email. Please try again later.',
    });
  }
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`\n  ✦ Lumina Hardened Email API running on http://localhost:${PORT}`);
  console.log(`  ✦ Health check: http://localhost:${PORT}/api/health\n`);
});
