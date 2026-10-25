import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import LetterGlitch from "../components/LetterGlitch.jsx";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  X,
  ShieldCheck,
  Lock,
  Mail,
} from "lucide-react";
import "../styles/services.css";
import PqcSection from "../components/PqcSection.jsx";
import SecureConnection from "../components/secureConnection.jsx";
/* ================= DATA ================= */

// FIPS 203 (ML-KEM) was finalised on 13 Aug 2024
const FIPS_FINAL = new Date("2024-08-13T00:00:00Z").getTime();

const threatFacts = [
  { k: "X", t: "How long your data must stay secret", tone: "plain" },
  { k: "Y", t: "How long your migration will take", tone: "plain" },
  { k: "Z", t: "Time until a quantum computer can break your keys", tone: "gold" },
];

const timeline = [
  {
    year: "1994",
    tag: "THE BREAK",
    title: "Shor's algorithm",
    desc: "Peter Shor shows a quantum computer can factor large numbers efficiently. RSA and elliptic-curve cryptography are, in theory, finished.",
  },
  {
    year: "1996",
    tag: "SYMMETRIC IMPACT",
    title: "Grover's algorithm",
    desc: "A quadratic speedup against symmetric ciphers — AES-128 is effectively halved. AES-256 and SHA-384 become the quantum-safe choices.",
  },
  {
    year: "2016",
    tag: "THE RACE OPENS",
    title: "NIST calls for algorithms",
    desc: "NIST launches its post-quantum standardisation programme. More than 80 candidate algorithms arrive from researchers worldwide.",
  },
  {
    year: "2024",
    tag: "STANDARDS FINAL",
    title: "FIPS 203, 204 and 205 published",
    desc: "The first post-quantum standards are final: ML-KEM, ML-DSA and SLH-DSA. The migration officially begins.",
  },
  {
    year: "2030",
    tag: "DEADLINE NEARS",
    title: "Classical crypto deprecated",
    desc: "Under NIST's draft transition roadmap, 112-bit classical algorithms — RSA-2048, ECDSA-256 — enter deprecation.",
    alert: true,
  },
  {
    year: "2035",
    tag: "DISALLOWED",
    title: "Quantum-vulnerable algorithms retired",
    desc: "Vulnerable public-key algorithms are disallowed outright. Anything still relying on them is out of compliance.",
    alert: true,
  },
];

const standards = [
  {
    name: "ML-KEM",
    fips: "FIPS 203",
    from: "FROM CRYSTALS-KYBER · LATTICE",
    desc: "Module-Lattice Key Encapsulation. The workhorse of the migration — replaces RSA and ECDH key exchange in TLS, VPNs and messaging.",
    use: "KEY ESTABLISHMENT",
    featured: false,
  },
  {
    name: "ML-DSA",
    fips: "FIPS 204",
    from: "FROM CRYSTALS-DILITHIUM · LATTICE",
    desc: "Module-Lattice Digital Signatures for general-purpose use — code signing, certificates and authentication.",
    use: "GENERAL SIGNATURES",
    featured: true,
  },
  {
    name: "SLH-DSA",
    fips: "FIPS 205",
    from: "FROM SPHINCS+ · HASH-BASED",
    desc: "Stateless hash-based signatures. A conservative backup that rests on hash security alone, not lattice assumptions.",
    use: "LONG-LIVED SIGNATURES",
    featured: false,
  },
  {
    name: "FN-DSA",
    fips: "FIPS 206 · DRAFT",
    from: "FROM FALCON · LATTICE",
    desc: "Falcon-derived compact signatures, in draft. Designed for constrained devices where signature size and speed matter most.",
    use: "IN PROGRESS",
    featured: false,
  },
];

const phases = [
  {
    n: "01",
    title: "Cryptographic Discovery & Inventory",
    desc: "Map every key, certificate, algorithm and vendor across your estate. You cannot migrate what you cannot see — the output is a Cryptographic Bill of Materials (CBOM).",
    tags: ["CBOM", "ASSET MAPPING", "VENDOR AUDIT"],
  },
  {
    n: "02",
    title: "Risk Assessment & Prioritisation",
    desc: "Rank systems by data lifespan, exposure and business impact, so the longest-lived and most exposed assets move first.",
    tags: ["MOSCA ANALYSIS", "DATA LIFESPAN", "RISK REGISTER"],
  },
  {
    n: "03",
    title: "Crypto-Agility Planning",
    desc: "Design the architecture so algorithms can be swapped without rewriting applications — abstraction layers, key management and policy.",
    tags: ["ARCHITECTURE", "KMS / HSM", "POLICY"],
  },
  {
    n: "04",
    title: "Hybrid Deployment & Testing",
    desc: "Run classical and post-quantum cryptography side by side in live paths — hybrid TLS key exchange, pilot systems, performance baselines — and build confidence before cutover.",
    tags: ["HYBRID TLS", "PERFORMANCE", "ROLLOUT PLANS"],
  },
  {
    n: "05",
    title: "Full Migration & Monitoring",
    desc: "Cut over in waves, retire legacy algorithms, and monitor continuously for drift, regressions and new standards.",
    tags: ["CUTOVER", "TELEMETRY", "COMPLIANCE"],
  },
];

const checkChips = ["8 QUESTIONS", "~2 MINUTES", "INSTANT SCORE", "REPORT BY EMAIL"];

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

/* ================= SMALL PIECES ================= */

function SectionHead({ eyebrow, children, lead }) {
  return (
    <motion.div className="pqc-head" {...fadeUp}>
      <span className="pqc-eyebrow">
        <span className="pqc-eyebrow__dot" /> {eyebrow}
      </span>
      <h2 className="pqc-title">{children}</h2>
      {lead && <p className="pqc-lead">{lead}</p>}
    </motion.div>
  );
}

/* Live count since FIPS 203 went final */
function useElapsed() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.max(0, Math.floor((now - FIPS_FINAL) / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  };
}

function QuantumClock() {
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  return (
    <figure className="pqc-clock" aria-label="Estimated CRQC window, 2030 to 2040">
      <svg viewBox="-200 -200 400 400" role="img" aria-hidden="true">
        <circle className="pqc-clock__ring" r="170" />
        <circle className="pqc-clock__ring pqc-clock__ring--dash" r="130" />
        <circle className="pqc-clock__ring" r="80" />
        {ticks.map((i) => {
          const major = i % 5 === 0;
          return (
            <line
              key={i}
              className={major ? "pqc-clock__tick pqc-clock__tick--major" : "pqc-clock__tick"}
              x1="0"
              y1={-170}
              x2="0"
              y2={major ? -154 : -162}
              transform={`rotate(${i * 6})`}
            />
          );
        })}
        {/* risk window arc, roughly 2030–2035 */}
        <path
          className="pqc-clock__arc"
          d="M 85 -147 A 170 170 0 0 1 147 85"
          fill="none"
        />
        <g className="pqc-clock__hand">
          <line x1="0" y1="0" x2="0" y2="-120" />
        </g>
        <circle className="pqc-clock__hub" r="9" />
        <circle className="pqc-clock__hub-dot" r="3" />
        <text x="178" y="4" className="pqc-clock__year">2030</text>
        <text x="0" y="196" textAnchor="middle" className="pqc-clock__year">2035</text>
        <text x="-178" y="4" textAnchor="end" className="pqc-clock__year">2040</text>
      </svg>
      <figcaption>FIG. 01 — THE QUANTUM CLOCK · EST. CRQC WINDOW 2030–2040</figcaption>
    </figure>
  );
}

/* ================= TIMELINE ================= */

function QuantumTimeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 65%"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="pqc-tl" ref={ref}>
      <div className="pqc-tl__track" aria-hidden="true" />
      <motion.div className="pqc-tl__progress" style={{ height: progress }} aria-hidden="true" />

      {timeline.map((t, i) => (
        <motion.div
          key={t.year}
          className={`pqc-tl__item ${t.alert ? "pqc-tl__item--alert" : ""}`}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pqc-tl__year">{t.year}</div>
          <span className="pqc-tl__dot" aria-hidden="true" />
          <div className="pqc-tl__body">
            <span className="pqc-tl__tag">{t.tag}</span>
            <h3 className="pqc-tl__heading">{t.title}</h3>
            <p className="pqc-tl__desc">{t.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ================= ROADMAP ACCORDION ================= */

function Roadmap() {
  const [open, setOpen] = useState(0);
  return (
    <div className="pqc-acc">
      {phases.map((p, i) => {
        const isOpen = open === i;
        return (
          <div key={p.n} className={`pqc-acc__row ${isOpen ? "is-open" : ""}`}>
            <button
              className="pqc-acc__btn"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`pqc-phase-${p.n}`}
            >
              <span className="pqc-acc__num">{p.n}</span>
              <span className="pqc-acc__name">{p.title}</span>
              <span className="pqc-acc__icon" aria-hidden="true">
                {isOpen ? <X size={16} /> : <Plus size={16} />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`pqc-phase-${p.n}`}
                  className="pqc-acc__panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="pqc-acc__inner">
                    <p>{p.desc}</p>
                    <div className="pqc-acc__tags">
                      {p.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ================= PAGE ================= */

export default function PQCReadiness() {
  const el = useElapsed();
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="pqc-hero">
        <div className="pqc-hero__bg" aria-hidden="true">
          <LetterGlitch
            glitchColors={["#ffffff", "#38bdf8", "#61dca3"]}
            characters="01ABCDEF<>[]{}/\\#$%"
            glitchAmount={0.5}
            speed={1}
            flow={0.5}
            centerFade={0.8}
            edgeFade={0.15}
            clickEffect="tear"
          />
        </div>

        <div className="container pqc-hero__grid">
          <div className="pqc-hero__copy">
            <motion.span
              className="pqc-pill"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="pqc-pill__dot" />
              NIST FIPS 203 · 204 · 205 NOW FINAL
            </motion.span>

            <motion.h1
              className="pqc-hero__title"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
            >
              Post-Quantum
              <br />
              Cryptography
              <br />
              <span className="text-gradient-gold">READINESS.</span>
            </motion.h1>

            <motion.p
              className="pqc-hero__lead"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Quantum computers will break the public-key cryptography protecting
              the world's data. Q-Prakriti helps you discover what you use,
              assess your exposure, and migrate to NIST-standardised
              post-quantum cryptography — before the clock runs out.
            </motion.p>
            <motion.div
              className="pqc-hero__actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <Link to="/contact" className="pqc-btn pqc-btn--gold">
                Begin your readiness assessment <ArrowRight size={14} />
              </Link>
              <a href="#standards" className="pqc-btn pqc-btn--ghost">
                Explore the standards
              </a>
            </motion.div>

            <motion.div
              className="pqc-counter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
            >
              <span className="pqc-counter__label">
                <span className="pqc-counter__dot" />
                LIVE — TIME SINCE FIPS 203 WENT FINAL (AUG 13, 2024)
              </span>
              <div className="pqc-counter__cells">
                {[
                  [el.days, "DAYS"],
                  [pad(el.hours), "HRS"],
                  [pad(el.mins), "MIN"],
                  [pad(el.secs), "SEC"],
                ].map(([v, l]) => (
                  <div className="pqc-counter__cell" key={l}>
                    <strong>{v}</strong>
                    <em>{l}</em>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

         
        </div>

        <span className="pqc-scrollhint" aria-hidden="true">SCROLL</span>
      </section>

      {/* ============ 01 — THE QUANTUM THREAT ============ */}
      <section className="pqc-sec">
        <div className="container">
        <div className="hndl-section">
  {/* Left Side: Sticky Text */}
  <div className="hndl-section__text">
    <SectionHead eyebrow="01 / THE QUANTUM THREAT">
      Harvest now.
      <br />
      <span className="text-gradient-gold">Decrypt later.</span>
    </SectionHead>

    <motion.p className="pqc-prose" {...fadeUp}>
      A quantum computer that breaks RSA won't arrive announced — and it
      doesn't need to. Encrypted data captured today is being stored in
      bulk, waiting for the machine that can open it. Email, archives,
      financial records, state secrets: anything that must stay
      confidential for years is already exposed.
    </motion.p>
  </div>

  {/* Right Side: The Animation */}
  <div className="hndl-section__anim">
    <SecureConnection />
  </div>
</div>
          <motion.div className="pqc-mosca" {...fadeUp}>
            <span className="pqc-mosca__label">
              MOSCA'S INEQUALITY — WHEN TO START WORRYING
            </span>
            <div className="pqc-mosca__row">
              {threatFacts.map((f, i) => (
                <div className="pqc-mosca__group" key={f.k}>
                  <div className={`pqc-mosca__tile pqc-mosca__tile--${f.tone}`}>
                    <strong>{f.k}</strong>
                    <span>{f.t}</span>
                  </div>
                  {i === 0 && <span className="pqc-mosca__op">+</span>}
                  {i === 1 && <span className="pqc-mosca__op">&gt;</span>}
                </div>
              ))}
            </div>
            <p className="pqc-mosca__verdict">
              <Lock size={13} /> If X + Y is greater than Z, your data is
              already at risk.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ 02 — THE QUANTUM TIMELINE ============ */}
      <section className="pqc-sec pqc-sec--alt">
        <div className="container">
          <SectionHead
            eyebrow="02 / THE QUANTUM TIMELINE"
            lead="The milestones that set your migration clock — from the algorithm that broke public-key crypto to the deadline that retires it."
          >
            Thirty years from proof to{" "}
            <span className="text-gradient-gold">deadline.</span>
          </SectionHead>
          <QuantumTimeline />
        </div>
      </section>

      {/* ============ 03 — NIST STANDARDS ============ */}
      <PqcSection/>


      {/* ============ 04 — MIGRATION ROADMAP ============ */}
      <section className="pqc-sec pqc-sec--alt">
        <div className="container">
          <SectionHead
            eyebrow="04 / THE MIGRATION ROADMAP"
            lead="PQC migration is not a software upgrade — it is a multi-year programme. Here is how we take you from unknown exposure to a verified quantum-safe estate."
          >
            Five phases.
            <br />
            One <span className="text-gradient-gold">quantum-safe estate.</span>
          </SectionHead>
          <Roadmap />
        </div>
      </section>

      {/* ============ 05 — SELF-CHECK ============ */}
      <section className="pqc-sec">
        <div className="container">
          <motion.div className="pqc-check" {...fadeUp}>
            <span className="pqc-pill pqc-pill--sm">
              <ShieldCheck size={11} /> 05 / READINESS SELF-CHECK
            </span>
            <h2 className="pqc-check__title">
              How quantum-ready
              <br />
              is your organisation?
            </h2>
            <p className="pqc-check__lead">
              Eight questions on your cryptographic visibility, exposure and
              agility. About two minutes — you get an instant score and a
              personalised report by email.
            </p>
            <div className="pqc-check__chips">
              {checkChips.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <div className="pqc-check__actions">
              {/* point this at your self-check route when it exists */}
              <Link to="/contact" className="pqc-btn pqc-btn--gold">
                Start the self-check <ArrowRight size={14} />
              </Link>
              <Link to="/contact" className="pqc-btn pqc-btn--ghost">
                Prefer to talk to us?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="pqc-sec pqc-sec--last">
        <div className="container">
          <motion.div className="pqc-final" {...fadeUp}>
            <span className="pqc-pill pqc-pill--sm">
              <Lock size={11} /> THE CLOCK IS RUNNING
            </span>
            <h2 className="pqc-final__title">
              The right time to map your
              <br />
              cryptographic estate is now.
            </h2>
            <div className="pqc-final__actions">
              <Link to="/contact" className="pqc-btn pqc-btn--gold">
                Book a demo <ArrowUpRight size={14} />
              </Link>
              <a href="mailto:info@qprakriti.com" className="pqc-btn pqc-btn--ghost">
                <Mail size={14} /> info@qprakriti.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
