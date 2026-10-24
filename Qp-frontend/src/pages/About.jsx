import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CursorGrid from "../components/CursorGrid.jsx";
import {
  ArrowRight,
  Atom,
  ShieldCheck,
  FlaskConical,
  Compass,
  Target,
  Sparkles,
  Network,
  HeartHandshake,
  Play,
  FileText,
  Lightbulb,
} from "lucide-react";
import SectionHeading from "../components/SectionHeading.jsx";
import "../styles/about.css";

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const heroTelemetry = [
  { label: "CODE MATRIX", value: "ACTIVE" },
  { label: "COHERENCE", value: "99.987 QPS" },
  { label: "SOVEREIGN ARCHITECTURE", value: "TIER-1" },
];

/* Company values — icon + label */
const companyValues = [
  { label: "Innovation", icon: Lightbulb },
  { label: "Security", icon: ShieldCheck },
  { label: "Responsible Technology", icon: HeartHandshake },
  { label: "Research-Driven Thinking", icon: FlaskConical },
  { label: "Future-Ready Solutions", icon: Network },
];

/* Cursor-follow spotlight: writes mouse position into CSS variables */
const trackSpotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function About() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="ahero">
      <div className="ahero__bg" aria-hidden="true">
          <div className="ahero__grid" />
          <div className="ahero__glow ahero__glow--blue" />
          <div className="ahero__glow ahero__glow--gold" />
        </div>

        <div className="container ahero__inner">
          <motion.span
            className="ahero__pill"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="ahero__pill-dot" />
            ABOUT Q-PRAKRITHI · EST. 2026
          </motion.span>

          <motion.h1
            className="ahero__title"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05 }}
          >
            Pioneering <span className="text-gradient-gold">Quantum</span>
            <br />
            Intelligence &amp; Sustainable
            <br />
            Deep-Tech Systems
          </motion.h1>

          <motion.p
            className="ahero__lead"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            Bridging the eternal balance of natural synergy{" "}
            <em className="ahero__em">(Prakrithi)</em> with quantum
            computational breakthroughs. We engineer sovereign fault-tolerant
            hardware and algorithms optimized for planetary equilibrium.
          </motion.p>

          <motion.div
            className="ahero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Link to="/services" className="ahero__btn ahero__btn--gold">
              <FileText size={14} /> Our Architectural Blueprint
            </Link>
            <a href="#" className="ahero__btn ahero__btn--ghost">
              <span className="ahero__play">
                <Play size={9} fill="currentColor" />
              </span>
              Watch Keynote
            </a>
          </motion.div>

          <motion.div
            className="ahero__telemetry"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {heroTelemetry.map((t) => (
              <span key={t.label} className="ahero__telemetry-item">
                <span className="ahero__telemetry-dot" />
                <em>{t.label}:</em>
                <strong>{t.value}</strong>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ FOUNDATION & PHILOSOPHY ============ */}
      <section className="section section--blue">
        <div className="container about-grid">
          <motion.div {...fade}>
            <span className="eyebrow">Foundation &amp; Philosophy</span>
            <h2>The Science of Natural Synergy</h2>
            <p>
              Q-Prakrithi Private Limited is a technology company exploring the
              frontier of quantum computing, emerging technologies, and
              quantum-safe cybersecurity. We combine technical curiosity with a
              security-first mindset to explore solutions designed for a
              post-quantum world.
            </p>
            <p className="muted">
              <em>
                Placeholder copy — to be replaced with the official company
                description.
              </em>
            </p>
          </motion.div>

          <motion.div {...fade} className="about-visual">
            <Atom size={120} strokeWidth={0.8} />
          </motion.div>
        </div>
      </section>

      {/* ============ VISION & MISSION ============ */}
      <section className="section section--dark">
        <div className="container">
          <div className="grid grid-2">
            <motion.article className="about-card" {...fade}>
              <Compass size={22} />
              <h3>Vision</h3>
              <p>
                To contribute to a future where quantum technologies and secure
                digital infrastructure advance together responsibly.
              </p>
              <span className="about-card__note">
                Placeholder — pending official vision statement.
              </span>
            </motion.article>
            <motion.article className="about-card" {...fade}>
              <Target size={22} />
              <h3>Mission</h3>
              <p>
                To explore, research, and build capabilities in quantum
                technologies and quantum-safe cybersecurity with rigour and
                care.
              </p>
              <span className="about-card__note">
                Placeholder — pending official mission statement.
              </span>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ============ TECHNOLOGY PHILOSOPHY ============ */}
      <section className="section section--blue">
        <div className="container">
          <SectionHeading
            eyebrow="Technology Philosophy"
            title="How we approach technology"
            description="We believe emerging technologies should be explored with clarity, grounded in research, and applied responsibly."
          />
          <div className="grid grid-3">
            {[
              {
                icon: FlaskConical,
                title: "Research-Driven",
                desc: "We ground our exploration in evidence and technical rigour.",
              },
              {
                icon: ShieldCheck,
                title: "Security-First",
                desc: "Security is treated as a design principle, not an afterthought.",
              },
              {
                icon: Atom,
                title: "Quantum Curious",
                desc: "We follow advances in quantum computing and related technologies closely.",
              },
              {
                icon: Network,
                title: "Resilient by Design",
                desc: "We aim for systems that endure through technological shifts.",
              },
              {
                icon: Sparkles,
                title: "Emerging Tech",
                desc: "We investigate technologies where real-world impact is emerging.",
              },
              {
                icon: HeartHandshake,
                title: "Responsible Innovation",
                desc: "We consider impact on people and society alongside capability.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} className="about-tile" {...fade}>
                <Icon size={22} strokeWidth={1.8} />
                <h4>{title}</h4>
                <p>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ QUANTUM & SECURITY SPLIT ============ */}
      <section className="section section--dark">
        <div className="container about-split">
          <motion.div {...fade}>
            <span className="eyebrow">Quantum &amp; Emerging Tech</span>
            <h2>Exploring the quantum landscape</h2>
            <p>
              Quantum computing is an emerging paradigm that leverages quantum
              mechanical phenomena to process information. Its long-term
              potential spans areas such as materials science, chemistry, and
              optimisation — though it is not universally faster than classical
              computing.
            </p>
            <p>
              We track developments across quantum computing, quantum
              communication, quantum sensing, and their intersections with other
              emerging technologies.
            </p>
          </motion.div>
          <motion.div {...fade}>
            <span className="eyebrow">Quantum-Safe Security</span>
            <h2>Preparing cryptography for what&rsquo;s next</h2>
            <p>
              Post-quantum cryptography refers to cryptographic algorithms
              designed to resist attacks from both classical and future quantum
              computers. Standards such as ML-KEM, ML-DSA, and SLH-DSA are part
              of a broader migration effort across the industry.
            </p>
            <p>
              We focus on understanding cryptographic inventories, assessing
              risk, and planning quantum-safe migrations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ VALUES (animated) ============ */}
      <section className="section section--blue values-section">
        {/* orbiting rings behind the chips */}
        <div className="values-orbits" aria-hidden="true">
          <span className="values-orbit values-orbit--1" />
          <span className="values-orbit values-orbit--2" />
          <span className="values-orbit values-orbit--3" />
        </div>

        <div className="container">
          <SectionHeading
            eyebrow="Company Values"
            title="What we stand for"
            align="center"
          />
          <div className="values-row">
            {companyValues.map(({ label, icon: Icon }, i) => (
              <div
                className="value-item"
                key={label}
                style={{ animationDelay: `${i * 0.7}s` }}
              >
                <motion.span
                  className="value-chip"
                  initial={{
                    opacity: 0,
                    y: 28,
                    scale: 0.85,
                    filter: "blur(6px)",
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 14,
                    delay: i * 0.09,
                  }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  onMouseMove={trackSpotlight}
                >
                  <span className="value-chip__num">0{i + 1}</span>
                  <span className="value-chip__icon">
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <span className="value-chip__text">{label}</span>
                </motion.span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="section section--dark">
        <div className="container center-cta">
          <h2>Want to work with us?</h2>
          <p>Explore our services or reach out to start a conversation.</p>
          <div className="cta-row">
            <Link to="/services" className="btn btn--gold btn--md">
              View Services <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn--ghost btn--md">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}