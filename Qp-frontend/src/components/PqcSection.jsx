import { useEffect, useRef, useState } from "react";
import "./PqcSection.css";

const DUR = 4500;
const delay = (i, start = 0.3, gap = 0.5) => ({ "--d": `${(start + i * gap).toFixed(2)}s` });

const STEPS = [
  {
    title: "Cryptographic Discovery",
    desc: "Identify where cryptography is used across systems.",
    gets: "You get: an inventory of keys, certificates and libraries.",
    icon: (<><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.2-4.2" /></>),
    panel: "discovery",
    rows: [["TLS certificates", "RSA-2048"], ["SSH host keys", "ECDSA"], ["Code signing", "RSA-3072"], ["VPN tunnels", "ECDH"], ["Payment API tokens", "RSA-2048"]],
  },
  {
    title: "Quantum Threat Assessment",
    desc: "Evaluate exposure to future quantum attacks.",
    gets: "You get: a ranked list of what a quantum attacker could break first.",
    icon: (<><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" /><path d="M12 9v4M12 16h.01" /></>),
    panel: "threat",
    rows: [["TLS certificates", 92, "High"], ["VPN tunnels", 78, "High"], ["Code signing", 55, "Medium"], ["Backups", 24, "Low"]],
  },
  {
    title: "Post-Quantum Cryptography",
    desc: "Adopt PQC algorithms such as ML-KEM, ML-DSA, and SLH-DSA.",
    gets: "You get: an algorithm chosen and tested for each use.",
    icon: (<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>),
    panel: "swap",
    rows: [["RSA-2048", "ML-DSA"], ["ECDH", "ML-KEM"], ["RSA-3072", "SLH-DSA"]],
  },
  {
    title: "Quantum-Safe Migration",
    desc: "Transition systems to quantum-resistant cryptography.",
    gets: "You get: systems on quantum-resistant cryptography, tracked in a CBOM.",
    icon: (<path d="M4 12h12M12 6l6 6-6 6" />),
    panel: "migrate",
    rows: ["Customer portal", "Payments API", "Internal VPN", "Code signing"],
  },
];

const ALGORITHMS = [
  ["ML-KEM", "Shared-secret establishment", "Two parties agree on a secret key over an open channel."],
  ["ML-DSA", "Digital signatures", "Proves who sent something and that it was not changed."],
  ["SLH-DSA", "Hash-based digital signatures", "A signature scheme that relies only on hash functions."],
];
const CHIPS = ["Post-Quantum Cryptography (PQC)", "Cryptographic Bill of Materials (CBOM)", "Quantum-Safe Migration", "Cryptographic Risk Assessment"];

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = (e) => setReduce(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduce;
}

// true while the element is on screen. With `once`, it stays true after the first time.
function useInView(ref, { threshold = 0.3, once = false } = {}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setOn(true);
    const io = new IntersectionObserver(([e]) => {
      setOn(e.isIntersecting);
      if (e.isIntersecting && once) io.disconnect();
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);
  return on;
}

// Counts 0 -> `to` each time `on` becomes true.
function useCount(on, to, reduce, ms = 3000) {
  const [value, setValue] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) return setValue(to);
    if (!on) return;
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      setValue(Math.round(k * to));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, to, ms, reduce]);
  return value;
}

function Panel({ step, found, pct }) {
  const { panel, rows } = step;
  if (panel === "discovery") {
    return (
      <div className="pqc-scanbox" aria-hidden="true">
        <span className="pqc-sweep" />
        <div className="pqc-top"><span>Scanning systems</span><span><strong>{found}</strong> assets found</span></div>
        {rows.map(([name, algo], i) => (
          <div className="pqc-row" style={delay(i, 0.35, 0.55)} key={name}><span>{name}</span><em>{algo}</em></div>
        ))}
      </div>
    );
  }
  if (panel === "threat") {
    return (
      <div className="pqc-scanbox" aria-hidden="true">
        <div className="pqc-top"><span>Quantum exposure</span><span>Highest risk first</span></div>
        {rows.map(([name, w, label], i) => (
          <div className="pqc-rrow" style={{ ...delay(i), "--w": `${w}%` }} key={name}>
            <span>{name}</span><span className="pqc-rb"><i /></span><em className="pqc-rlab">{label}</em>
          </div>
        ))}
      </div>
    );
  }
  if (panel === "swap") {
    return (
      <div className="pqc-scanbox" aria-hidden="true">
        <div className="pqc-top"><span>Replacing weak algorithms</span><span>Tested per use</span></div>
        {rows.map(([o, n], i) => (
          <div className="pqc-swap" style={delay(i, 0.3, 0.8)} key={o}>
            <span className="pqc-old">{o}</span><span className="pqc-arr">→</span><span className="pqc-new">{n}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="pqc-scanbox" aria-hidden="true">
      <div className="pqc-top"><span>Migrating systems</span><span>CBOM coverage <strong>{pct}</strong>%</span></div>
      {rows.map((name, i) => (
        <div className="pqc-rrow" style={{ ...delay(i, 0.2, 0.7), "--w": "100%" }} key={name}>
          <span>{name}</span><span className="pqc-rb"><i /></span><em className="pqc-chk">✓</em>
        </div>
      ))}
    </div>
  );
}

export default function PqcSection() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const intro = useInView(rootRef, { threshold: 0.1, once: true }); // headline plays once
  const live = useInView(mainRef, { threshold: 0.35 });             // steps + animation: on while visible

  // Leaving the section resets it, so it replays from step 1 next time.
  useEffect(() => { if (!live) setActive(0); }, [live]);

  useEffect(() => {
    if (reduce || !live) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), DUR);
    return () => clearTimeout(id);
  }, [active, reduce, live]);

  const found = useCount(live && active === 0, 24, reduce);
  const pct = useCount(live && active === 3, 100, reduce);
  const step = STEPS[active];

  return (
    <section ref={rootRef} className={`pqc${intro ? " is-in" : ""}`}>
      <div className="pqc-wrap">
        <h2 className="pqc-h1">
        Preparing cryptography for a<br/> post-quantum world
        </h2>
        <p className="pqc-lede">
          Quantum computing and post-quantum cryptography are<br/> related but distinct fields.
          Post-quantum cryptography refers to cryptographic algorithms <br/>designed to remain secure
          against attacks from both classical and future <br/>quantum computers.
        </p>

        {/* Steps on the left, animation on the right */}
        <div className="pqc-main" ref={mainRef} style={{ "--dur": `${DUR}ms` }}>
          <ol className="pqc-route" role="tablist" aria-label="Migration path">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <button role="tab" aria-selected={i === active} onClick={() => setActive(i)}>
                  <span className="pqc-node"><svg viewBox="0 0 24 24" aria-hidden="true">{s.icon}</svg></span>
                  <span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    {i === active && live && !reduce && <span className="pqc-bar"><i key={active} /></span>}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className={`pqc-stage${live ? " is-open" : ""}`} aria-live="polite">
            {live && (
              <div className="pqc-panel" key={active}>
                <div className="pqc-ph">
                  <span className="pqc-pn"><svg viewBox="0 0 24 24" aria-hidden="true">{step.icon}</svg></span>
                  <h3>{step.title}</h3>
                </div>
                <Panel step={step} found={found} pct={pct} />
                <p className="pqc-gets">{step.gets}</p>
              </div>
            )}
          </div>
        </div>

        {/* Concepts below, full width */}
        <div className="pqc-concepts">
          <h2 className="pqc-h2">Concepts we focus on</h2>
          <p className="pqc-sub">Three algorithms do the core work. The rest is how you plan and prove the move.</p>
          <div className="pqc-grid">
            {ALGORITHMS.map(([name, job, text]) => (
              <div className="pqc-alg" key={name}><b>{name}</b><em>{job}</em><p>{text}</p></div>
            ))}
          </div>
          <div className="pqc-marquee">
            <div className="pqc-track">{[...CHIPS, ...CHIPS].map((c, i) => <span className="pqc-chip" key={i}>{c}</span>)}</div>
          </div>
          <p className="pqc-note">These are technology focus areas. Service availability should be confirmed with Q-Prakriti directly.</p>
        </div>
      </div>
    </section>
  );
}
