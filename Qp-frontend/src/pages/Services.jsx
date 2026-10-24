import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import CursorGrid from '../components/CursorGrid';
import {
  ChevronRight, ArrowUpRight, ArrowRight, Download, Lock, CheckCircle2,
  Cpu, Atom, ShieldCheck, Zap, Network, FlaskConical, Microscope,
} from 'lucide-react';
import '../styles/services.css';
import {  RotateCw, /* ...your existing icons */ } from 'lucide-react';
import TiltedCard, { TiltedCardLayer } from '../components/TiltedCard';
import cardImg1 from '../assets/q-optimization.jpg'; 
import cardImg2 from '../assets/PQC.png'; 
import cardImg3 from '../assets/bio-molecular.jpeg'; 
import cardImg4 from '../assets/q-reselient-neural.jpeg'; 
import cardImg5 from '../assets/q-cloud.jpeg'; 
import cardImg6 from '../assets/q-advisory.jpeg'; 

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const filters = ['All Solutions', 'Quantum Computing', 'Bio-Informatics', 'Post-Quantum Security', 'High-Performance Cloud'];

const primaryServices = [
  {
    icon: Atom,
    image : cardImg1,
    badge: 'SPEEDUP · 100x',
    badgeTone: 'blue',
    title: 'Quantum Optimization Engine',
    desc: 'Combinatorial optimization, dynamic logistics orchestration, and supply chain topological routing solving multi-million-variable NP-hard challenges in milliseconds.',
    meta: [
      { k: 'ALGORITHM', v: 'QAOA / Hybrid' },
      { k: 'EXECUTION', v: 'Real-time' },
    ],
  },
  {
    icon: Lock,
    image :cardImg2,

    badge: 'NIST STANDARDIZED',
    badgeTone: 'red',
    title: 'Post-Quantum Cryptography (PQC)',
    desc: 'Lattice-based encryption and zero-knowledge sovereign defense designed to neutralize Harvest-Now-Decrypt-Later threats and quantum decoherence vectoring.',
    meta: [
      { k: 'CRYPTO', v: 'Kyber-1024' },
      { k: 'SECURE VECTOR', v: '~' },
    ],
  },
  {
    icon: FlaskConical,
    image : cardImg3,

    badge: 'AB INITIO ACCURACY',
    badgeTone: 'gold',
    title: 'Bio-Molecular Simulation & Discovery',
    desc: 'Accelerated quantum chemistry modeling for drug discovery, active-site protein folding, and catalyst-reaction kinetics beyond classical DFT capacities.',
    meta: [
      { k: 'MODELS', v: 'VQE / RBM' },
      { k: 'ELECTRONIC', v: '~' },
    ],
  },
];

const secondaryServices = [
  {
    icon: Cpu,
    image : cardImg4,

    badge: 'HYBRID GPU',
    title: 'Quantum-Resilient Neural Architectures',
    desc: 'Parameterized quantum circuits interwoven with high-parameter LLMs and classical convolutional frameworks for hyper-dimensional pattern recognition.',
    meta: [{ k: 'HYBRID', v: 'QNN + LLM' }],
  },
  {
    icon: Network,
    image : cardImg5,

    badge: 'CRYOGENIC BUS',
    title: 'Enterprise Quantum Cloud (QaaS)',
    desc: 'Low-latency direct gRPC/REST endpoints into Dilution Refrigerator arrays, coupled with error mitigation pipelines and qubit scheduling.',
    meta: [{ k: 'LATENCY', v: 'Sub-10ms' }],
  },
  {
    icon: ShieldCheck,
    image : cardImg6,

    badge: 'TIER-1 ADVISORY',
    title: 'Specialized Quantum Advisory & Architecture',
    desc: 'Enterprise transformation roadmaps, proof-of-concept synthesis, patent IP defensibility, and algorithmic transition for executive leadership teams.',
    meta: [{ k: 'DELIVERY', v: 'Executive' }],
  },
];

const framework = [
  {
    step: '01',
    title: 'Exploration & Feasibility',
    desc: 'Comprehensive quantum readiness audit, business case mathematical abstraction, and identification of high-ROI operational advantages.',
    time: 'Hamiltonian Mapping',
  },
  {
    step: '02',
    title: 'Algorithm Co-design',
    desc: 'Proprietary algorithmic engineering: quantum circuit synthesis, noise suppression protocol structuring, and simulator validation.',
    time: 'Custom Qubit Routing',
  },
  {
    step: '03',
    title: 'Hybrid Benchmarking',
    desc: 'Side-by-side verification comparing top-tier classical HPC clusters against our accelerated quantum runtimes for statistical parity.',
    time: 'Parity Certification',
  },
  {
    step: '04',
    title: 'Production Deployment',
    desc: 'Zero-friction containerized orchestration, cryptographic key migration, real-time pulse correction, and SLA-backed maintenance.',
    time: 'Continuous Telemetry',
  },
];

const benchmarks = [
  {
    icon: Network,
    domain: 'Global Supply Routing (3.2M Combinations)',
    classical: '48.4 Hours (Approximation)',
    quantum: '142 Milliseconds (Exact)',
    advantage: '1,230x Speedup',
    tone: 'gold',
  },
  {
    icon: Lock,
    domain: 'Multi-Party Key Synthesis Vulnerability',
    classical: 'RSA-4096 (Deprecated by Shor)',
    quantum: 'Kyber Modulo-LWE (Immune)',
    advantage: '≈ Mathematical Ceiling',
    tone: 'blue',
  },
  {
    icon: FlaskConical,
    domain: 'Nitrogenase FeMo-Cofactor Simulation',
    classical: 'Infeasible (> 12,000 Years)',
    quantum: '18.4 Minutes (Ground State)',
    advantage: 'Definitive Supremacy',
    tone: 'gold',
  },
  {
    icon: Zap,
    domain: 'Aggregate Energy Consumption Per Run',
    classical: '3.81 Megawatt Hours',
    quantum: '12.5 Kilowatt Hours',
    advantage: '99.3% Reduction',
    tone: 'blue',
  },
];
/* ================= FRAMEWORK TIMELINE ================= */

function FrameworkTimeline() {
  const timelineRef = useRef(null);

  // Track scrolling through the timeline section.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 65%', 'end 65%'],
  });

  // Animate the vertical progress line from top to bottom.
  const progressHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '100%']
  );

  return (
    <div className="framework-timeline" ref={timelineRef}>
      {/* Background timeline track */}
      <div className="framework-timeline__track" aria-hidden="true" />

      {/* Scroll-responsive progress line */}
      <motion.div
        className="framework-timeline__progress"
        style={{ height: progressHeight }}
        aria-hidden="true"
      />

      {framework.map((item, index) => (
        <div
          className="framework-timeline__item"
          key={item.step}
        >
          {/* Timeline marker */}
          <motion.div
            className="framework-timeline__marker"
            initial={{ opacity: 0.35, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.45,
              delay: 0.05,
            }}
          >
            <span>{item.step}</span>
            <span
              className="framework-timeline__marker-glow"
              aria-hidden="true"
            />
          </motion.div>

          {/* Animated stage card */}
          <motion.article
            className="framework-timeline__card"
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="framework-timeline__card-top">
              <span className="framework-timeline__label">
                OPERATIONAL PHASE {item.step}
              </span>

              <span className="framework-timeline__arrow">
                <ArrowUpRight size={17} />
              </span>
            </div>

            <h3 className="framework-timeline__title">
              {item.title}
            </h3>

            <p className="framework-timeline__description">
              {item.desc}
            </p>

            <div className="framework-timeline__footer">
              <span className="framework-timeline__status">
                <CheckCircle2 size={13} />
                <span>FRAMEWORK CHECKPOINT</span>
              </span>

              <span className="framework-timeline__technology">
                {item.time}
              </span>
            </div>

            {/* Decorative animated bottom accent */}
            <div
              className="framework-timeline__card-accent"
              aria-hidden="true"
            />
          </motion.article>
        </div>
      ))}
    </div>
  );
}
function ServiceTile({ s, i, variant, height = 310 }) {
  const [flipped, setFlipped] = useState(false);
  const stop = (e) => e.stopPropagation();
  const tone = s.badgeTone || 'plain';

  return (
    <motion.div {...fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }}>
      
      <TiltedCard
        className="svc-tilt"
        imageSrc={s.image}
        altText=""
        captionText={s.title}
        containerWidth="100%"
        containerHeight={height}
        imageWidth="100%"
        imageHeight="100%"
        radius={14}
        rotateAmplitude={8}
        scaleOnHover={1.03}
        glare={0.35}
        glareColor="#f5dc8a"
        shadow={0.6}
        parallax={0.6}
        showTooltip={false}
        intro={false}
        flipped={flipped}
        onFlip={setFlipped}
        backContent={
          <div className={`svc-tile svc-tile--back ${variant}`}>
            <div className="svc-tile__top">
              <div className="svc-tile__icon"><s.icon size={16} strokeWidth={1.8} /></div>
              <span className={`svc-badge svc-badge--${tone}`}>{s.badge}</span>
            </div>
            <h3 className="svc-tile__title">{s.title}</h3>
            <p className="svc-tile__desc">{s.desc}</p>
            <div className="svc-tile__meta">
              {s.meta.map((m) => (
                <span key={m.k}><em>{m.k}</em><strong>{m.v}</strong></span>
              ))}
            </div>
            <div className="svc-tile__foot svc-tile__foot--split">
              <Link
                to={s.to || '/contact'}
                className="svc-tile__cta"
                onClick={stop}
                tabIndex={flipped ? 0 : -1}
              >
                Explore Route <ChevronRight size={12} />
              </Link>
              <span className="svc-tile__hint">
                <RotateCw size={11} /> Flip back
              </span>
            </div>
          </div>
        }
      >
        {/* FRONT: photo (from imageSrc) + shade + floating content */}
        <div className="svc-front__shade" aria-hidden="true" />
        <TiltedCardLayer depth={16} className={`svc-front svc-front--${tone}`}>
          <div className="svc-front__top">
            <div className="svc-tile__icon"><s.icon size={18} strokeWidth={1.8} /></div>
            <span className={`svc-badge svc-badge--${tone}`}>{s.badge}</span>
          </div>
          <div className="svc-front__body">
            <h3 className="svc-front__title">{s.title}</h3>
            <p className="svc-front__short">{s.short}</p>
            <span className="svc-front__hint">
              <RotateCw size={12} /> Flip for details
            </span>
          </div>
        </TiltedCardLayer>
      </TiltedCard>
    </motion.div>
  );
}
export default function Services() {
  const [active, setActive] = useState('All Solutions');

  return (
    <div className="svc-dash">

      {/* ============ HERO ============ */}
      <section className="shero">
      <div className="hero__bg" aria-hidden="true">
  <CursorGrid
  cellSize={60}
  color="#D4AF37"
  gridColor="#D4AF37"
  highlight="area"
  gridStyle="lines"
  radius={100}        // was 140: smaller area around the cursor
  holdTime={250}      // was 400: lit cells fade sooner
  fadeDuration={600}  // was 800
  fillOpacity={0.02}  // was 0.05: softer fill inside lit cells
  maxOpacity={1.5}    // was 1: dimmer outline on lit cells
  gridOpacity={0.07}
  spotlight={0.25}    // was 0.6: less brightening of lines near the cursor
  edgeFade={0.15}
  clickPulse
/>
    <div className="hero__glow hero__glow--blue" />
    <div className="hero__glow hero__glow--gold" />
  </div>

        <div className="container shero__inner">
          <motion.span
            className="shero__pill"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="shero__pill-dot" />
            STATE-OF-THE-ART QUANTUM RUNTIME · v4.2
          </motion.span>

          <motion.h1
            className="shero__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            Next-Generation <span className="text-gradient-gold">Deep-Tech</span><br />
            &amp; Quantum Engineering<br />
            Services
          </motion.h1>

          <motion.p
            className="shero__lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Empowering tier-1 enterprises, aerospace, biomedical, and fintech institutions
            with fault-tolerant quantum algorithms and distributed neural networks.
          </motion.p>

          <motion.div
            className="shero__filters"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`chip ${active === f ? 'chip--active' : ''}`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ SECTION 01 — ARCHITECTED FOR SUPREMACY ============ */}
      <section className="dash-sec">
        <div className="container">
          <div className="dash-head">
            <div>
              <span className="dash-eyebrow">
                <span className="dash-eyebrow__dot" /> SOVEREIGN CAPABILITIES
              </span>
              <h2 className="dash-title">Architected for Supremacy</h2>
            </div>
            <p className="dash-note">
              Engineered to withstand geopolitical disruption, cryptographic degradation,
              and classical computational ceilings.
            </p>
          </div>

          <div className="svc-grid">
  {primaryServices.map((s, i) => (
    <ServiceTile key={s.title} s={s} i={i} variant={`svc-tile--${s.badgeTone}`} height={380} withCta />
  ))}
</div>

<div className="svc-grid svc-grid--sub">
  {secondaryServices.map((s, i) => (
    <ServiceTile key={s.title} s={s} i={i} variant={`svc-tile--${s.badgeTone}`} height={380} />
  ))}
</div>
        </div>
      </section>

      {/* ============ SECTION 02 — DELIVERY FRAMEWORK ============ */}
      <section className="dash-sec dash-sec--alt">
        <div className="container">
          <div className="dash-head">
            <div>
              <span className="dash-eyebrow">
                <span className="dash-eyebrow__dot" /> DELIVERY DISCIPLINE
              </span>
              <h2 className="dash-title">Precision Operational Framework</h2>
            </div>
            <p className="dash-note dash-note--left">
              From theoretical Hamiltonian mapping to cryogenic hardware compilation and
              production pipeline deployment.
            </p>
          </div>

          <FrameworkTimeline />
        </div>
      </section>

      {/* ============ SECTION 03 — TELEMETRY BENCHMARK ============ */}
      

      {/* ============ SECTION — ENCRYPTED ADVISORY ============ */}
      <section className="dash-sec dash-sec--advisory">
        <div className="container">
          <motion.div className="advisory" {...fadeUp}>
            <span className="advisory__pill">
              <Lock size={11} /> ENCRYPTED ADVISORY PORTAL
            </span>
            <h2 className="advisory__title">
              Prepare Your Sovereign<br />Infrastructure For The Post-Classical<br />Era
            </h2>
            <p className="advisory__lead">
              Schedule a confidential technical audit and algorithmic alignment session
              with our principal quantum scientists and systems architects.
            </p>

            <div className="advisory__actions">
              <Link to="/contact" className="advisory__btn advisory__btn--gold">
                Initiate Sovereign Consultation <ArrowRight size={14} />
              </Link>
              <a href="#" className="advisory__btn advisory__btn--ghost">
                Download Whitepaper <Download size={14} />
              </a>
            </div>

            <div className="advisory__trust">
              <span><ShieldCheck size={12} /> Zero-Knowledge Verification</span>
              <span><Lock size={12} /> Strict NDA Protection</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}