import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, ArrowUpRight } from 'lucide-react';
import CursorGrid from '../components/CursorGrid';
import '../styles/careers.css';

/* ------------------------------------------------------------------
   CAREERS PAGE: temporarily showing "Coming Soon".
   The full original page (hero, open positions, filters, journey,
   expandable job modal) is saved in CareersOriginal.jsx.
   To bring it back: delete this file and rename
   CareersOriginal.jsx -> Careers.jsx
------------------------------------------------------------------- */

export default function Careers() {
  return (
    <div className="careers-dash">
     
      <section className="careers-soon">
        <div className="container">
          <motion.div
            className="careers-soon__inner"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="careers-soon__icon" aria-hidden="true">
              <BriefcaseBusiness size={38} strokeWidth={1.5} />
            </div>

            <span className="chero__pill">
              <span className="chero__pill-dot" />
              CAREERS
            </span>

            <h1 className="careers-soon__title">Coming Soon</h1>

            <p className="careers-soon__text">
              We are preparing our careers page. Open positions at Q-Prakrithi
              will be listed here very soon.
            </p>

            <Link to="/contact" className="chero__btn chero__btn--ghost">
              Contact Us <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}