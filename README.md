# 🪵 Lumina

A cinematic, scroll-driven site for a luxury kitchen atelier — a 600-frame scroll-scrubbed hero, a four-collection product catalog, a craft/process story, global salon locations, a working consultation-request form with real email delivery, and a full admin panel for managing it all.

![React](https://img.shields.io/badge/-React%2019-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![GSAP](https://img.shields.io/badge/-GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS%20v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)

---

## 🧰 Technologies

- React 19
- Vite 8
- JavaScript
- GSAP (ScrollTrigger)
- Tailwind CSS v4
- Express + Resend (consultation email API)
- Browser `localStorage` (admin content persistence)

---

## ✨ Features

- **600-Frame Scroll Hero**: A cabinet door opening, scrubbed frame-by-frame across a 900vh hero section, decoded off the main thread via `createImageBitmap` and painted through a canvas render loop decoupled from the scroll handler for zero dropped frames.
- **Three-Stage Synchronized Headline**: Three separate headline blocks — Typology, Materiality, Engineering — fade in and out at hand-tuned scroll percentages as the frame sequence plays.
- **Four-Collection Catalog**: A detailed product catalog (Minimalist Mono, Architectural Floating, Heritage Craft, Industrial Raw), each with materials, joinery, lighting, and a full spec sheet.
- **Craft Process Story**: A four-phase breakdown of the manufacturing process, from twelve-year timber aging to hand-applied finishes.
- **Global Salon Directory**: Four showroom locations — London, Milan, Zurich, Tokyo — with named directors and contact details.
- **Working Consultation Form**: A real Express + Resend backend that emails a formatted consultation request to the business, complete with rate limiting, input sanitization, and a generated reference code.
- **Admin Content Panel**: A password-gated `/admin` area for editing collections, craft stages, salons, and enquiries.
- **Cookie-Consent-Gated Analytics**: Google Analytics only loads after the visitor accepts the cookie banner, with IP anonymization enabled.
- **Scroll-Scrubbed Copy**: Body text that dims and brightens word by word as it scrolls through the viewport, echoing the hero's own frame-by-frame scrubbing.
- **Editorial Typography & Layout**: A cream-and-graphite palette with a light display serif, asymmetric grid layouts, and hairline dividers throughout.

---

## 🪜 The Process

I built the hero first, since it had to prove the concept before anything else was worth building: a cabinet door opening, filmed and exported as 600 individual frames, scrubbed against scroll position on a canvas instead of played as a video. Getting decode performance right — using `createImageBitmap` instead of plain `<img>` tags, and running the paint loop on its own `requestAnimationFrame` decoupled from GSAP's scroll updates — took longer than every content page combined.

Once the hero could hold three synchronized headline stages without stutter, I built the rest of the site around GSAP's ScrollTrigger as the one animation system, rather than mixing in a second library: word-by-word statement reveals, staggered pillar and stat call-ins, and the same scroll-triggered fade pattern reused on every page.

The consultation form needed to feel real, not like a `mailto:` link, so I built an actual Express API behind it — rate-limited, input-sanitized, sending a formatted HTML email through Resend — instead of just logging the form data to the console.

The admin panel was the deliberate trade-off: rather than standing up a full database for a portfolio piece, collections, craft stages, salons, and enquiries all read and write through a small `localStorage` layer. It's enough to demonstrate the editing experience end to end, with the honest caveat that it's per-browser, not a shared backend.

---

## 📚 What I Learned

- **Off-Main-Thread Image Decoding**: Used `createImageBitmap()` instead of `Image()`/`<img>` so 600 frames decode without blocking the main thread or scroll responsiveness.
- **Decoupling Scroll Events from Paint**: Split the scroll handler, which only updates a ref, from the actual canvas draw — its own `requestAnimationFrame` loop with a dedup guard — so redundant scroll events never trigger redundant paints.
- **One Animation Library, Used Consistently**: Standardized every scroll effect on GSAP's ScrollTrigger instead of mixing in the Framer Motion dependency, keeping the animation mental model consistent page to page.
- **Hardening a Small API Surface**: Added rate limiting, a request body size cap, and HTML-escaping on every field before shipping the email server, rather than treating a single-endpoint API as too small to secure.
- **Choosing `localStorage` as a Deliberate Constraint**: Built a full CRUD admin experience against browser storage to prototype the editing workflow itself, with the understanding it would need a real backend before going further than a demo.
- **Consent-Gated Analytics**: Wired analytics initialization to check stored cookie consent before loading any tracking script, instead of loading it unconditionally and hiding the banner as an afterthought.

---

## 🔧 How Can It Be Improved?

- The `/admin` login and every admin page currently check only `sessionStorage` in the browser — there's no server verifying the session, so the check can be bypassed entirely from the browser's developer console. This needs a real, server-verified session before it actually protects anything.
- The CORS origin check in `server.cjs` calls `callback(null, true)` in both the allowed and rejected branches, so the `allowedOrigins` allowlist is built but never actually enforced.
- Move admin-edited content (collections, craft stages, salons, enquiries) from `localStorage` to a real database — edits currently only exist in the browser that made them, not for actual site visitors.
- Remove the unused `framer-motion` dependency, since every animation in the app runs through GSAP.
- Add `.env` to `.gitignore` — it isn't currently ignored, so a real `RESEND_API_KEY` filled in locally is one commit away from being exposed (the shipped `.env` only has empty placeholder values today, but the gap is worth closing before that changes).
- Consider a progressive loading strategy for the 600 hero frames — a sparse set first, the rest in the background — instead of blocking on all 600 before the hero becomes visible.

---

## 🚀 Running the Project

### Step 1 — Clone the Repository

```bash
git clone https://github.com/<your-username>/lumina-kitchens.git
cd lumina-kitchens
```

---

### Step 2 — Install Dependencies

**Prerequisites:** Node.js 20.19+ (required by Vite 8)

```bash
npm install
```

---

### Step 3 — Configure Email

Copy the example environment file and add a [Resend](https://resend.com) API key and recipient email:

```bash
cp .env.example .env
```

```
RESEND_API_KEY=re_your_key_here
RECIPIENT_EMAIL=you@example.com
PORT=3001
```

*(The site still renders without this — only submitting the consultation form requires it.)*

---

### Step 4 — Run the Email API

```bash
npm run server
```

---

### Step 5 — Run the Frontend

In a new terminal:

```bash
npm run dev
```

---

### Step 6 — Open the Application

Open the address shown in your terminal (usually):

```
http://localhost:5173
```

---

## 🎥 Video



https://github.com/user-attachments/assets/3784ee9f-192c-4de1-96cf-d19371784461


---
