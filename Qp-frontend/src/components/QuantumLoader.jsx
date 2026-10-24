import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './QuantumLoader.css';
import logoMark from './q-prakriti-mark.png';
import logoBody from './lm-body.png';
import logoP from './lm-p.png';
import logoOrbits from './lm-orbits.png';

/* ============================================================
   QUANTUM LOADER v24 — staged logo assembly, glint, flare
   (no cursor / hover interaction — visuals stay clean)
   ------------------------------------------------------------
     <QuantumLoader onComplete={fn} targetSelector="#quantum-slot" />
     dispatches window event "quantum-loader-handoff"

   Timeline (ms)
   0      letterbox bars close, particles spiral toward the name
   300    Q-PRAKRITI logo mark draws itself (ring, orbits, p, disc)
   1300   champagne-gold wordmark rises, light streak + sweep
   3300   SHATTER: mark + letters dissolve into particles
   4100   ASSEMBLE: particles lock into the gold quantum computer
   4800   loader fades out

   Esc / Enter jumps ahead.
   ============================================================ */

const BRAND = 'Q-PRAKRITI';
const FONT = "'Syncopate', 'Michroma', 'Arial Black', sans-serif";

const MARK_AT = 300;
const BRAND_AT = 1300;
const SHATTER_AT = 3300;
const ASSEMBLE_AT = 4100;
const EXIT_AT = 4800;

const TRACK = 0.04;
const SHIFT = 0.3;
const NUDGE = 0.0;

// 0 gold, 1 cyan, 2 white-blue
const RGB = ['255,240,220', '96,226,255', '214,232,255'];
const GOLD = '255,168,76';
const CYAN = RGB[1];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const TAU = Math.PI * 2;
const COPPER_Y = 1.35;

/* ------------------------------------------------------------
   Procedural point-cloud of the gold chandelier quantum computer
   ------------------------------------------------------------ */
function genComputer(n) {
  const rnd = Math.random;
  const PY = [0.7, -0.4, -0.86, -1.59];
  const PR = [1.0, 0.82, 0.82, 0.82];
  const pol = (r, a, y) => [Math.cos(a) * r, y, Math.sin(a) * r];
  const WSEG = [[0.66, -1.55], [0.66, -0.37], [-0.43, -0.83], [-0.89, -1.56]];
  const SLABS = [[-0.42, -2.1, 0, 0.26, 0.85, 0.5], [0.42, -2.1, 0, 0.26, 0.85, 0.5], [0, -2.15, 0.2, 0.3, 0.7, 0.34]];

  const comps = [
    { w: 0.17, g: 0, f: () => {
      const j = Math.floor(rnd() * 4);
      if (rnd() < 0.5) return pol(PR[j], rnd() * TAU, PY[j] + (rnd() < 0.5 ? 0.03 : -0.03));
      return pol(PR[j] * Math.sqrt(rnd()), rnd() * TAU, PY[j] + 0.03);
    } },
    { w: 0.1, g: 2, f: () => {
      const top = rnd() < 0.5;
      const R = top ? 1.17 : 1.14;
      const y = top ? 2.67 : 2.49;
      if (rnd() < 0.55) return pol(R, rnd() * TAU, y + (rnd() - 0.5) * 0.12);
      return pol(R * Math.sqrt(rnd()), rnd() * TAU, y - 0.065);
    } },
    { w: 0.06, g: 0, f: () => {
      if (rnd() < 0.6) return pol(1.08, rnd() * TAU, 2.17 + rnd() * 0.2);
      return pol(0.9 + rnd() * 0.1, rnd() * TAU, 2.0 + rnd() * 0.12);
    } },
    { w: 0.07, g: 0, f: () => {
      if (rnd() < 0.5) return pol(0.15, rnd() * TAU, 0.9 + rnd() * 1.0);
      const s = rnd() < 0.5 ? -0.43 : 0.35;
      const a = rnd() * TAU;
      return [s + Math.cos(a) * 0.17, COPPER_Y + 0.35 + (rnd() - 0.5) * 0.12, Math.sin(a) * 0.17];
    } },
    { w: 0.02, g: 2, f: () => {
      const x = rnd() < 0.5 ? -0.5 : 0.38;
      return pol(0.1, rnd() * TAU, COPPER_Y - 0.35 + (rnd() - 0.5) * 0.3).map((v, i) => (i === 0 ? v + x : v));
    } },
    { w: 0.1, g: 2, f: () => {
      const k = rnd();
      if (k < 0.4) return pol(0.92, (Math.floor(rnd() * 7) / 7) * TAU + 0.2, 0.8 + rnd() * 1.05);
      const gap = k < 0.7 ? 0 : 2;
      const a = (Math.floor(rnd() * 6) / 6) * TAU + gap * 0.5;
      const y0 = gap === 0 ? 0.66 : -0.9;
      const y1 = gap === 0 ? -0.37 : -1.55;
      return pol(gap === 0 ? 0.8 : 0.75, a, y1 + rnd() * (y0 - y1));
    } },
    { w: 0.12, g: 2, f: () => {
      const sg = WSEG[rnd() < 0.4 ? 0 : 1 + Math.floor(rnd() * 3)];
      return pol(0.3 + rnd() * 0.55, rnd() * TAU, sg[1] + rnd() * (sg[0] - sg[1]));
    } },
    { w: 0.04, g: 2, f: () => {
      const lvl = rnd() < 0.5 ? 0.15 : -1.2;
      const c = pol(0.4 + rnd() * 0.35, rnd() * TAU, lvl);
      const th = rnd() * TAU;
      const ph = rnd() * TAU;
      return [c[0] + Math.cos(ph) * 0.06 * Math.cos(th), c[1] + Math.sin(ph) * 0.06, c[2] + Math.cos(ph) * 0.06 * Math.sin(th)];
    } },
    { w: 0.02, g: 0, f: () => pol(0.22 * Math.sqrt(rnd()), rnd() * TAU, 0.53 + (rnd() < 0.5 ? 0 : 0.07)) },
    { w: 0.02, g: 2, f: () => pol(0.18, rnd() * TAU, -0.1 + (rnd() - 0.5) * 0.2) },
    { w: 0.02, g: 0, f: () => {
      const f = rnd();
      const a = f * 4.5 * TAU;
      return [Math.cos(a) * 0.14, -0.63 + (f - 0.5) * 0.35, Math.sin(a) * 0.14];
    } },
    { w: 0.03, g: 2, f: () => pol(0.22, rnd() * TAU, -1.22 + (rnd() - 0.5) * 0.55) },
    { w: 0.01, g: 0, f: () => pol(0.225, rnd() * TAU, -1.22 + (Math.floor(rnd() * 4) - 1.5) * 0.13) },
    { w: 0.06, g: 2, f: () => {
      const a = rnd() * TAU;
      const t = rnd();
      const u = 1 - t;
      const r = u * u * 0.6 + 2 * u * t * 0.85 + t * t * 0.5;
      const y = u * u * -1.6 + 2 * u * t * -1.75 + t * t * -2.5;
      return pol(r + (rnd() - 0.5) * 0.04, a, y);
    } },
    { w: 0.04, g: 2, f: () => {
      const s = rnd() < 0.5 ? -1 : 1;
      const f = rnd();
      const a = f * 16 * TAU;
      return [s * (0.62 + Math.floor(rnd() * 3) * 0.06) + Math.cos(a) * 0.035, -1.75 - f * 0.8, (Math.floor(rnd() * 3) - 1) * 0.16 + Math.sin(a) * 0.035];
    } },
    { w: 0.08, g: 0, f: () => {
      const [cx, cy, cz, w, h, d] = SLABS[Math.floor(rnd() * 3)];
      const face = Math.floor(rnd() * 3);
      const sgn = rnd() < 0.5 ? -0.5 : 0.5;
      const u = rnd() - 0.5;
      const v = rnd() - 0.5;
      if (face === 0) return [cx + sgn * w, cy + u * h, cz + v * d];
      if (face === 1) return [cx + u * w, cy + sgn * h, cz + v * d];
      return [cx + u * w, cy + v * h, cz + sgn * d];
    } },
    { w: 0.03, g: 2, f: () => pol(0.16, rnd() * TAU, -2.35 + (rnd() - 0.5) * 0.7) },
    { w: 0.01, g: 1, f: () => {
      const a = rnd() * TAU; const b = Math.acos(2 * rnd() - 1); const r = 0.03 + rnd() * 0.06;
      return [r * Math.sin(b) * Math.cos(a), -2.7 + r * Math.cos(b), r * Math.sin(b) * Math.sin(a)];
    } },
  ];

  const S = 0.64;
  const out = [];
  for (let i = 0; i < n; i++) {
    let r = rnd();
    let c = comps[comps.length - 1];
    for (let k = 0; k < comps.length; k++) { if (r < comps[k].w) { c = comps[k]; break; } r -= comps[k].w; }
    const p = c.f();
    out.push({ x: p[0] * S, y: p[1] * S, z: p[2] * S, g: c.g });
  }
  return out;
}

/* ------------------------------------------------------------
   Q-PRAKRITI LOGO MARK — exact logo, split into 3 layers
   1  ignition glow + shock ring
   2  orange body sweeps in (clockwise)
   3  white "p" rises through the body
   4  atom orbits draw around, a light runs along them
   5  idle: glass sheen
   ------------------------------------------------------------ */
const ease = [0.16, 1, 0.3, 1];

function LogoMark({ on }) {
  const maskStyle = { WebkitMaskImage: `url(${logoMark})`, maskImage: `url(${logoMark})` };
  const orbitMask = { WebkitMaskImage: `url(${logoOrbits})`, maskImage: `url(${logoOrbits})` };
  return (
    <div className={`lm${on ? ' is-on' : ''}`}>
      <span className="lm-glow" aria-hidden="true" />
      <span className="lm-ring" aria-hidden="true" />
      <span className="lm-ring lm-ring-2" aria-hidden="true" />
      <div className="lm-layer lm-body"><img src={logoBody} alt="" draggable={false} /></div>
      <div className="lm-layer lm-p"><img src={logoP} alt="" draggable={false} /></div>
      <div className="lm-layer lm-orb"><img src={logoOrbits} alt="" draggable={false} /></div>
      <div className="lm-layer lm-orb-glow" aria-hidden="true"><img src={logoOrbits} alt="" draggable={false} /></div>
      <span className="lm-orb-runner" style={orbitMask} aria-hidden="true" />
      <span className="lm-sheen" style={maskStyle} aria-hidden="true" />
    </div>
  );
}

export default function QuantumLoader({ onComplete, targetSelector }) {
  const reduce = !!useReducedMotion();

  const [finished, setFinished] = useState(false);
  const [markIn, setMarkIn] = useState(false);
  const [brandIn, setBrandIn] = useState(false);
  const [shatter, setShatter] = useState(false);
  const [assembled, setAssembled] = useState(false);

  const rootRef = useRef(null);
  const camRef = useRef(null);
  const canvasRef = useRef(null);

  const waves = useRef([]); // only the automatic assemble ring
  const skipFn = useRef(() => {});
  const timers = useRef([]);

  const letters = useMemo(() => BRAND.split(''), []);

  /* ---------- keyboard + scroll lock ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') skipFn.current();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  /* ---------- reduced motion ---------- */
  useEffect(() => {
    if (!reduce) return undefined;
    const t = timers.current;
    t.push(
      setTimeout(() => setMarkIn(true), 100),
      setTimeout(() => setBrandIn(true), 500),
      setTimeout(() => window.dispatchEvent(new CustomEvent('quantum-loader-handoff')), 1900),
      setTimeout(() => setFinished(true), 2300)
    );
    skipFn.current = () => {
      window.dispatchEvent(new CustomEvent('quantum-loader-handoff'));
      setFinished(true);
    };
    return () => { t.forEach(clearTimeout); t.length = 0; };
  }, [reduce]);

  /* ---------- cinematic engine ---------- */
  useEffect(() => {
    if (reduce) return undefined;
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const cam = camRef.current;
    if (!canvas || !root || !cam) return undefined;
    const ctx = canvas.getContext('2d');

    let W = 0;
    let H = 0;
    let dpr = 1;
    let parts = [];
    let dust = [];
    let raf = 0;
    let cancelled = false;
    let resizeTimer = 0;

    let start = performance.now();
    let last = start;
    const T = { mark: 0, brand: 0, shatter: 0, assemble: 0, exit: 0 };
    const fired = { mark: false, brand: false, shatter: false, assemble: false, exit: false };
    const slot = { x: 0, y: 0, u: 90 };

    const resetClock = () => {
      start = performance.now();
      last = start;
      T.mark = start + MARK_AT;
      T.brand = start + BRAND_AT;
      T.shatter = start + SHATTER_AT;
      T.assemble = start + ASSEMBLE_AT;
      T.exit = start + EXIT_AT;
    };
    resetClock();

    skipFn.current = () => {
      const now = performance.now();
      if (!fired.shatter) {
        T.mark = Math.min(T.mark, now);
        T.brand = Math.min(T.brand, now);
        T.shatter = now + 250;
        T.assemble = T.shatter + 1000;
        T.exit = T.assemble + 600;
      } else if (!fired.exit) {
        T.assemble = Math.min(T.assemble, now + 400);
        T.exit = Math.min(T.exit, T.assemble + 450);
      }
    };

    function measureSlot() {
      const el = document.querySelector(targetSelector || '#quantum-slot');
      let x = W / 2;
      let y = H / 2;
      let u = Math.min(W, H) * 0.14;
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 10 && r.height > 10) {
          x = clamp(r.left + r.width / 2, 60, W - 60);
          y = clamp(r.top + r.height / 2, 80, H - 80);
          u = clamp(Math.min(r.height * 0.18, r.width * 0.22), 46, 150);
        }
      }
      slot.x = x; slot.y = y; slot.u = u;
    }

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      const off = document.createElement('canvas');
      off.width = W; off.height = H;
      const o = off.getContext('2d');
      const hasLS = 'letterSpacing' in o;

      o.font = `700 100px ${FONT}`;
      if (hasLS) o.letterSpacing = `${100 * TRACK}px`;
      let w100 = o.measureText(BRAND).width || 800;
      if (!hasLS) w100 += BRAND.length * 100 * TRACK;
      const fs = Math.min(120, (W * 0.8 / w100) * 100);
      root.style.setProperty('--brand-fs', `${fs}px`);

      o.fillStyle = '#fff';
      o.font = `700 ${fs}px ${FONT}`;
      o.textAlign = 'center';
      o.textBaseline = 'middle';
      if (hasLS) o.letterSpacing = `${fs * TRACK}px`;
      o.fillText(BRAND, W / 2, H / 2 + fs * SHIFT + fs * NUDGE);

      const step = Math.max(3, Math.round(fs / 26));
      const data = o.getImageData(0, 0, W, H).data;
      const targets = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4 + 3] > 140) targets.push([x, y]);
        }
      }
      const cap = W < 700 ? 1500 : 3000;
      while (targets.length > cap) targets.splice((Math.random() * targets.length) | 0, 1);

      const settled = performance.now() - start > 3000;
      const model = genComputer(targets.length);
      const order = targets.map((_, i) => i).sort((a, b) => targets[a][0] - targets[b][0]);
      const rank = new Array(targets.length);
      order.forEach((idx, r) => { rank[idx] = r / Math.max(1, targets.length - 1); });

      parts = targets.map((tg, i) => {
        const old = parts[i];
        const base = old || (() => {
          const a = Math.random() * TAU;
          const r = Math.max(W, H) * (0.55 + Math.random() * 0.5);
          return {
            x: settled ? tg[0] : W / 2 + Math.cos(a) * r,
            y: settled ? tg[1] : H / 2 + Math.sin(a) * r,
            vx: 0, vy: 0,
            delay: Math.random() * 0.3,
            size: 1 + Math.random() * 1.5,
            tw: Math.random() * TAU,
            group: Math.random() < 0.74 ? 0 : 1,
            shat: false,
            dep: 1,
          };
        })();
        base.tx = tg[0];
        base.ty = tg[1];
        base.sd = rank[i] * 0.25 + Math.random() * 0.05;
        base.m = model[i];
        return base;
      });

      dust = Array.from({ length: W < 700 ? 60 : 140 }, () => ({
        x: Math.random() * W, y: Math.random() * H, z: 0.3 + Math.random() * 0.7, s: 0.6 + Math.random() * 1.2, p: Math.random() * TAU,
      }));
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = (now - start) / 1000;

      if (!fired.mark && now >= T.mark) { fired.mark = true; setMarkIn(true); }
      if (!fired.brand && now >= T.brand) { fired.brand = true; setBrandIn(true); }
      if (!fired.shatter && now >= T.shatter) { fired.shatter = true; setShatter(true); }
      if (!fired.assemble && now >= T.assemble) {
        fired.assemble = true;
        setAssembled(true);
        window.dispatchEvent(new CustomEvent('quantum-loader-handoff'));
        waves.current.push({ x: slot.x, y: slot.y, t0: now });
      }
      if (!fired.exit && now >= T.exit) { fired.exit = true; setFinished(true); }

      const shatterT = fired.shatter ? (now - T.shatter) / 1000 : -1;
      const asmT = fired.assemble ? (now - T.assemble) / 1000 : -1;

      if (fired.shatter) measureSlot();

      let scale = 1;
      let sx = 0;
      let sy = 0;
      const easeIO = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
      if (!fired.shatter) scale = 1 + 0.06 * easeIO(clamp(t / (SHATTER_AT / 1000), 0, 1));
      else scale = 1 + 0.06 * (1 - easeOutCubic(clamp(shatterT / 1.4, 0, 1)));
      if (asmT >= 0 && asmT < 0.45) {
        const k = (1 - asmT / 0.45);
        sx = (Math.random() - 0.5) * 9 * k;
        sy = (Math.random() - 0.5) * 9 * k;
        scale += 0.012 * k;
      }
      cam.style.transform = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;

      for (let i = waves.current.length - 1; i >= 0; i--) {
        if (now - waves.current[i].t0 > 1300) waves.current.splice(i, 1);
      }

      const ang = t * 0.55;
      const ca = Math.cos(ang);
      const sa = Math.sin(ang);
      const tilt = 0.16;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const U = slot.u;

      const cx = W / 2;
      const cy = H / 2;

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        let tx = p.tx;
        let ty = p.ty;
        let k;
        let swirl = 0;
        let scx = cx;
        let scy = cy;

        const ft = shatterT - p.sd;
        if (fired.shatter && ft >= 0) {
          if (!p.shat) {
            p.shat = true;
            p.group = p.m.g;
            const a = Math.random() * TAU;
            const f = 260 + Math.random() * 520;
            p.vx += Math.cos(a) * f;
            p.vy += Math.sin(a) * f - 160;
          }
          const m = p.m;
          const rx = m.x * ca + m.z * sa;
          const rz = -m.x * sa + m.z * ca;
          const ry = m.y * ct - rz * st;
          const rz2 = m.y * st + rz * ct;
          const persp = 4 / (4 - rz2 * 0.55);
          tx = slot.x + rx * U * persp;
          ty = slot.y - ry * U * persp;
          p.dep = 0.55 + 0.45 * ((rz2 + 1.5) / 3);
          const g = clamp(ft / 0.6, 0, 1);
          k = 3 + 90 * g * g;
          swirl = 1.5 * (1 - g);
          scx = slot.x;
          scy = slot.y;
        } else {
          const gather = clamp((t - p.delay) / 1.4, 0, 1);
          k = 3 + 58 * gather * gather;
          swirl = 1.25 * (1 - gather);
        }

        let ax = (tx - p.x) * k - p.vx * 1.7 * Math.sqrt(k);
        let ay = (ty - p.y) * k - p.vy * 1.7 * Math.sqrt(k);

        if (swirl > 0) {
          ax += -(p.y - scy) * swirl;
          ay += (p.x - scx) * swirl;
        }

        p.vx += ax * dt;
        p.vy += ay * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      if (fired.shatter) {
        const glow = clamp(shatterT / 2.2, 0, 1) * (asmT >= 0 ? 1 : 0.6);
        const gr = U * 3.2;
        const gg = ctx.createRadialGradient(slot.x, slot.y, 0, slot.x, slot.y, gr);
        gg.addColorStop(0, `rgba(${CYAN},${(0.2 * glow).toFixed(3)})`);
        gg.addColorStop(0.5, `rgba(${GOLD},${(0.07 * glow).toFixed(3)})`);
        gg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = gg;
        ctx.fillRect(slot.x - gr, slot.y - gr, gr * 2, gr * 2);
      }

      ctx.fillStyle = `rgba(${GOLD},1)`;
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        d.y -= d.z * 6 * dt;
        d.x += Math.sin(t * 0.4 + d.p) * 3 * dt;
        if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
        ctx.globalAlpha = 0.1 + 0.22 * Math.abs(Math.sin(t * d.z + d.p));
        ctx.fillRect(d.x, d.y, d.s, d.s);
      }

      // assemble ring (automatic, not interactive)
      for (let w = 0; w < waves.current.length; w++) {
        const wv = waves.current[w];
        const age = Math.max(0, (now - wv.t0) / 1000);
        const rad = age * 520;
        ctx.globalAlpha = Math.max(0, 0.8 * (1 - age / 1.3));
        ctx.strokeStyle = `rgba(${CYAN},1)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(wv.x, wv.y, rad, 0, TAU);
        ctx.stroke();
      }

      const scanY = slot.y + Math.sin(t * 2.1) * U * 1.7;

      for (let pass = 0; pass < 3; pass++) {
        ctx.fillStyle = `rgba(${RGB[pass]},1)`;
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          if (p.group !== pass) continue;
          const sp = Math.abs(p.vx) + Math.abs(p.vy);
          const twinkle = 0.55 + 0.45 * Math.sin(t * 2.2 + p.tw);
          let a = clamp(0.45 * twinkle + sp / 380, 0.12, 1);
          if (fired.brand && !p.shat) a *= 0.55;
          let sz = p.size * (1 + clamp(sp / 500, 0, 0.9));
          if (p.shat) {
            a *= p.dep;
            sz *= 0.8 + 0.5 * p.dep;
            if (asmT >= 0) {
              const dScan = Math.abs(p.y - scanY);
              if (dScan < 22) { a = Math.min(1, a + (1 - dScan / 22) * 0.8); sz += 0.8; }
              if (asmT < 0.5) a = Math.min(1, a + (1 - asmT / 0.5) * 0.7);
            }
          }
          ctx.globalAlpha = a;
          ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
        }
      }

      if (asmT >= 0 && asmT < 1.2) {
        const k = asmT / 1.2;
        const flare = Math.sin(Math.min(1, k * 1.4) * Math.PI) * (1 - k * 0.3);
        const fw = W * 0.95 * easeOutCubic(Math.min(1, k * 1.6));
        const lg = ctx.createLinearGradient(slot.x - fw / 2, 0, slot.x + fw / 2, 0);
        lg.addColorStop(0, 'rgba(96,226,255,0)');
        lg.addColorStop(0.5, 'rgba(235,250,255,1)');
        lg.addColorStop(1, 'rgba(96,226,255,0)');
        ctx.fillStyle = lg;
        ctx.globalAlpha = 0.85 * flare;
        ctx.fillRect(slot.x - fw / 2, slot.y - 1, fw, 2);
        ctx.globalAlpha = 0.18 * flare;
        ctx.fillRect(slot.x - fw / 2, slot.y - 9, fw, 18);

        const fr = U * (1.2 + k * 4);
        const fg = ctx.createRadialGradient(slot.x, slot.y, 0, slot.x, slot.y, fr);
        fg.addColorStop(0, 'rgba(255,255,255,1)');
        fg.addColorStop(0.3, `rgba(${GOLD},0.6)`);
        fg.addColorStop(0.65, `rgba(${CYAN},0.2)`);
        fg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fg;
        ctx.globalAlpha = Math.max(0, 1 - k * 1.1) * 0.9;
        ctx.fillRect(slot.x - fr, slot.y - fr, fr * 2, fr * 2);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    };
    window.addEventListener('resize', onResize);

    const fontReady = () => {
      if (!document.fonts || !document.fonts.load) return Promise.resolve();
      return Promise.race([
        Promise.all([
          document.fonts.load(`700 64px ${FONT}`),
          document.fonts.load(`400 20px ${FONT}`),
        ]).catch(() => {}),
        new Promise((r) => setTimeout(r, 1200)),
      ]);
    };

    const run = () => {
      if (cancelled) return;
      resetClock();
      build();
      raf = requestAnimationFrame(frame);
    };
    fontReady().then(run, run);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      skipFn.current = () => {};
    };
  }, [reduce, targetSelector]);

  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {!finished && (
        <motion.div
          key="quantum-loader"
          ref={rootRef}
          className="quantum-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
          role="status"
          aria-label="Loading Q-Prakriti"
        >
          <div className="loader-bg" aria-hidden="true">
            <div className="loader-aurora" />
            <div className="loader-grid" />
            <div className="loader-energy loader-energy-blue" />
            <div className="loader-energy loader-energy-gold" />
          </div>

          <div ref={camRef} className="loader-camera">
            <canvas ref={canvasRef} className="loader-canvas" aria-hidden="true" />

            <div className="loader-hero">
              <div className="loader-brand-wrap">
                <motion.span
                  className="loader-brand-halo"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={shatter ? { opacity: 0, scale: 1.3 } : brandIn ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: shatter ? 0.8 : 1.6, ease }}
                />

                {/* company logo mark */}
                <motion.div
                  className="loader-mark"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={shatter ? { opacity: 0, scale: 1.5 } : markIn ? { opacity: 1, scale: 1 } : {}}
                  transition={shatter ? { duration: 0.7, ease: [0.7, 0, 0.84, 0] } : { duration: 1.2, ease }}
                >
                  <LogoMark on={markIn} />
                </motion.div>

                {/* wordmark */}
                <h1 className="loader-brand" aria-label={BRAND}>
                  {letters.map((ch, i) => (
                    <span className="loader-brand-mask" key={`${ch}-${i}`} aria-hidden="true">
                      <motion.span
                        className="loader-brand-letter"
                        initial={{ y: '115%', opacity: 0, filter: 'blur(14px)' }}
                        animate={
                          shatter
                            ? { y: '-125%', opacity: 0, filter: 'blur(6px)' }
                            : brandIn
                              ? { y: 0, opacity: 1, filter: 'blur(0px)' }
                              : {}
                        }
                        transition={
                          shatter
                            ? { duration: 0.4, delay: (i / (letters.length - 1)) * 0.35, ease: [0.7, 0, 0.84, 0] }
                            : { duration: 0.95, delay: i * 0.06, ease }
                        }
                      >
                        {ch}
                      </motion.span>
                    </span>
                  ))}
                  <motion.span
                    className="loader-brand-shimmer"
                    initial={{ x: '-140%', opacity: 0 }}
                    animate={brandIn && !shatter ? { x: ['-140%', '170%'], opacity: 1 } : {}}
                    transition={{ duration: 1.1, delay: 0.7, ease: 'easeInOut', repeat: 1, repeatDelay: 0.5 }}
                  />
                </h1>
              </div>
            </div>
          </div>

          <div className="loader-vignette" aria-hidden="true" />
          <div className="loader-grain" aria-hidden="true" />
          <motion.div
            className="loader-bar loader-bar-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease }}
            aria-hidden="true"
          />
          <motion.div
            className="loader-bar loader-bar-bottom"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease }}
            aria-hidden="true"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}