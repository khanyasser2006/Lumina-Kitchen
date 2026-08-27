import React, { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import frameFiles from './frames.json';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = frameFiles.length;
const frameSrc = (i) => `/cabinet_frames_600fps/${frameFiles[i]}`;

export default function HeroSequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const bitmapsRef = useRef([]);       // ImageBitmap array — GPU-decoded
  const frameIndexRef = useRef(0);     // Current target frame (set by GSAP)
  const lastDrawnRef = useRef(-1);     // Last actually painted frame (dedup guard)
  const rafIdRef = useRef(null);       // rAF handle for cleanup
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Direct refs for the 3 distinct headline text stages
  const stage1Ref = useRef(null);
  const stage2Ref = useRef(null);
  const stage3Ref = useRef(null);

  /* ═══════════════════════════════════════════════════════
     RENDER LOOP — runs on its own rAF, completely decoupled
     from GSAP's onUpdate.
     ═══════════════════════════════════════════════════════ */
  const startRenderLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const tick = () => {
      const idx = frameIndexRef.current;

      if (idx !== lastDrawnRef.current) {
        const bmp = bitmapsRef.current[idx];
        if (bmp) {
          const cw = canvas.width;
          const ch = canvas.height;
          const iw = bmp.width;
          const ih = bmp.height;
          const scale = Math.max(cw / iw, ch / ih);
          const sw = (iw * scale) | 0;
          const sh = (ih * scale) | 0;
          const sx = ((cw - sw) / 2) | 0;
          const sy = ((ch - sh) / 2) | 0;

          ctx.drawImage(bmp, sx, sy, sw, sh);
          lastDrawnRef.current = idx;
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  /* ═══════════════════════════════════════════════════════
     CANVAS SIZING — DPR-aware
     ═══════════════════════════════════════════════════════ */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = (window.innerWidth * dpr) | 0;
    canvas.height = (window.innerHeight * dpr) | 0;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    lastDrawnRef.current = -1;
  }, []);

  /* ═══════════════════════════════════════════════════════
     PRELOADING — Uses createImageBitmap off main thread
     ═══════════════════════════════════════════════════════ */
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const bitmaps = new Array(FRAME_COUNT);

    const loadFrame = async (i) => {
      try {
        const response = await fetch(frameSrc(i));
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        if (cancelled) return;
        bitmaps[i] = bitmap;
      } catch (e) {
        // Treat broken frames gracefully
      }

      loadedCount++;
      if (loadedCount % 10 === 0 || loadedCount === FRAME_COUNT) {
        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
      }
      if (loadedCount === FRAME_COUNT) {
        bitmapsRef.current = bitmaps;
        setLoaded(true);
      }
    };

    const loadAll = async () => {
      const batchSize = 8;
      for (let start = 0; start < FRAME_COUNT; start += batchSize) {
        if (cancelled) return;
        const batch = [];
        for (let j = start; j < Math.min(start + batchSize, FRAME_COUNT); j++) {
          batch.push(loadFrame(j));
        }
        await Promise.all(batch);
      }
    };

    loadAll();

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      cancelled = true;
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  /* ═══════════════════════════════════════════════════════
     SCROLL & DYNAMIC HEADLINE ANIMATION ENGINE
     Evaluates frame index & exact text opacities/displays
     in real time at 60fps on scroll. Zero ghosting.
     ═══════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!loaded) return;

    resizeCanvas();
    frameIndexRef.current = 0;
    lastDrawnRef.current = -1;
    startRenderLoop();

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress; // 0.0 to 1.0

        // 1. Update Video Frame Index
        frameIndexRef.current = Math.min(
          FRAME_COUNT - 1,
          Math.max(0, Math.round(p * (FRAME_COUNT - 1)))
        );

        // ── STAGE 1: Bottom Left (0% to 26% scroll) ──
        if (stage1Ref.current) {
          if (p <= 0.26) {
            stage1Ref.current.style.display = 'block';
            let opacity = 1;
            let y = 0;
            if (p < 0.04) {
              opacity = p / 0.04;
              y = (1 - opacity) * 20;
            } else if (p > 0.18) {
              opacity = (0.26 - p) / (0.26 - 0.18);
              y = (1 - opacity) * -20;
            }
            stage1Ref.current.style.opacity = Math.max(0, Math.min(1, opacity));
            stage1Ref.current.style.transform = `translateY(${y}px)`;
          } else {
            stage1Ref.current.style.display = 'none';
          }
        }

        // ── STAGE 2: Top Right (30% to 62% scroll) ──
        if (stage2Ref.current) {
          if (p >= 0.30 && p <= 0.62) {
            stage2Ref.current.style.display = 'flex';
            let opacity = 1;
            let y = 0;
            if (p < 0.38) {
              opacity = (p - 0.30) / (0.38 - 0.30);
              y = (1 - opacity) * 20;
            } else if (p > 0.52) {
              opacity = (0.62 - p) / (0.62 - 0.52);
              y = (1 - opacity) * -20;
            }
            stage2Ref.current.style.opacity = Math.max(0, Math.min(1, opacity));
            stage2Ref.current.style.transform = `translateY(${y}px)`;
          } else {
            stage2Ref.current.style.display = 'none';
          }
        }

        // ── STAGE 3: Bottom Right (66% to 96% scroll) ──
        if (stage3Ref.current) {
          if (p >= 0.66 && p <= 0.96) {
            stage3Ref.current.style.display = 'flex';
            let opacity = 1;
            let y = 0;
            if (p < 0.74) {
              opacity = (p - 0.66) / (0.74 - 0.66);
              y = (1 - opacity) * 20;
            } else if (p > 0.86) {
              opacity = (0.96 - p) / (0.96 - 0.86);
              y = (1 - opacity) * -20;
            }
            stage3Ref.current.style.opacity = Math.max(0, Math.min(1, opacity));
            stage3Ref.current.style.transform = `translateY(${y}px)`;
          } else {
            stage3Ref.current.style.display = 'none';
          }
        }
      },
    });

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      trigger.kill();
    };
  }, [loaded, startRenderLoop, resizeCanvas]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full bg-page"
      style={{ height: '900vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas is GPU-promoted via will-change */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: 'transform' }}
        />

        {/* Soft cream vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 40%, hsla(42,35%,94%,0.4) 100%)',
          }}
        />

        {/* Bottom fade to cream page */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, hsl(42,35%,94%) 0%, transparent 100%)',
          }}
        />

        {/* ── Loading State ── */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-page z-30">
            <div className="w-48 h-[1px] bg-hairline mb-4 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-bronze"
                style={{
                  width: `${loadProgress}%`,
                  transition: 'width 0.15s ease-out',
                }}
              />
            </div>
            <span className="text-drift text-xs tracking-[0.2em] uppercase font-body">
              Loading {loadProgress}%
            </span>
          </div>
        )}

        {/* ── Dynamic Scroll-Driven Headline Stages ── */}
        {loaded && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            
            {/* STAGE 1: Bottom Left */}
            <div
              ref={stage1Ref}
              className="absolute left-8 md:left-16 bottom-24 md:bottom-32 max-w-[540px] space-y-4"
              style={{ display: 'block', opacity: 1 }}
            >
              <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-bronze font-body">
                <span className="w-8 h-[1px] bg-bronze inline-block" />
                01. Typology
              </div>
              <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] leading-[1.04] font-light text-deep font-editorial tracking-tight">
                Sculpted for <br />
                <em className="italic text-bark font-light">living</em>
              </h1>
              <p className="text-[15px] leading-relaxed max-w-[420px] font-body text-graphite">
                Bespoke cabinetry where architectural precision meets the warmth of home. 
                Scroll to explore every contour.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-taupe font-body">
                  <span className="w-6 h-[1px] bg-taupe inline-block" />
                  Scroll to explore
                </span>
              </div>
            </div>

            {/* STAGE 2: Top Right */}
            <div
              ref={stage2Ref}
              className="absolute right-8 md:right-16 top-28 md:top-36 max-w-[520px] text-right space-y-4 flex flex-col items-end"
              style={{ display: 'none', opacity: 0 }}
            >
              <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-bronze font-body">
                02. Materiality
                <span className="w-8 h-[1px] bg-bronze inline-block" />
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.06] font-light text-deep font-editorial tracking-tight">
                Precision in <br />
                <em className="italic text-bark font-light">every grain</em>
              </h2>
              <p className="text-[15px] leading-relaxed max-w-[400px] font-body text-graphite ml-auto">
                12-year naturally aged Alpine hardwoods and 0.1mm CNC micro-joinery 
                engineered for architectural eternity.
              </p>
            </div>

            {/* STAGE 3: Bottom Right */}
            <div
              ref={stage3Ref}
              className="absolute right-8 md:right-16 bottom-24 md:bottom-32 max-w-[520px] text-right space-y-4 flex flex-col items-end"
              style={{ display: 'none', opacity: 0 }}
            >
              <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-bronze font-body">
                03. Engineering
                <span className="w-8 h-[1px] bg-bronze inline-block" />
              </div>
              <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.06] font-light text-deep font-editorial tracking-tight">
                Sanctuary of <br />
                <em className="italic text-bark font-light">silence</em>
              </h2>
              <p className="text-[15px] leading-relaxed max-w-[400px] font-body text-graphite ml-auto">
                Concealed motorized mechanisms and acoustic dampening operating 
                in whisper-quiet, serene harmony.
              </p>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
