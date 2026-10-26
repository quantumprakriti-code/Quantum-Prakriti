
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { flushSync } from 'react-dom';
import './Navbar.css';
import qprakritimark from './q-prakriti-mark.png';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'PQC Readiness' },
  // { to: '/team', label: 'Team' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact Us' },
];

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

const getSavedLang = () => {
  try {
    return localStorage.getItem('qp-lang') || 'en';
  } catch {
    return 'en';
  }
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState(getSavedLang);

  const langRef = useRef(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const handleThemeToggle = async (e) => {
    const btn = e.currentTarget; // capture before any await
  
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  
    // Fallback for unsupported browsers / reduced motion
    if (!document.startViewTransition || reduceMotion) {
      toggleTheme();
      return;
    }
  
    const { top, left, width, height } = btn.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );
  
    const transition = document.startViewTransition(() => {
      flushSync(() => toggleTheme());
    });
  
    await transition.ready;
  
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  // Close the language dropdown on outside click / Escape
  useEffect(() => {
    if (!langOpen) return;

    const onPointerDown = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };

    const onKey = (e) => {
      if (e.key === 'Escape') setLangOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [langOpen]);

  // Remember language choice
  const chooseLang = (code) => {
    setLang(code);
    setLangOpen(false);
    document.documentElement.lang = code;

    try {
      localStorage.setItem('qp-lang', code);
    } catch {
      // Ignore localStorage errors
    }

    // TODO: Connect real translations using react-i18next or Google Translate.
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Reusable theme toggle: displays only one icon at a time.
  const renderThemeToggle = (mobile = false) => (
    <button
      type="button"
      className="nav__theme-toggle nav__theme-toggle--single"
      onClick={handleThemeToggle}
      aria-label={
        theme === 'light'
          ? 'Switch to dark mode'
          : 'Switch to light mode'
      }
      aria-pressed={theme === 'dark'}
      title={theme === 'light' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? (
  <Sun
    className="nav__single-theme-icon nav__sun-icon"
    aria-hidden="true"
  />
) : (
  <Moon
    className="nav__single-theme-icon nav__moon-icon"
    aria-hidden="true"
  />
)}
    </button>
  );

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" aria-label="Q-Prakriti home">
          <span className="nav__mark">
            <img src={qprakritimark} alt="Q-Prakriti logo" />
          </span>

          <span className="nav__word">Q-Prakriti</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `nav__link ${isActive ? 'is-active' : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__right">
          {/* Desktop theme toggle */}
          {renderThemeToggle()}

          <Link
            to="/book-demo"
            className="advisory__btn advisory__btn--gold"
          >
            Book a Demo <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="nav__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav__mobile"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="container nav__mobile-inner">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `nav__mobile-link ${isActive ? 'is-active' : ''}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}

              <div className="nav__mobile-actions">
                {/* Mobile language selection */}
                <div className="nav__mobile-theme">
                  <span className="nav__mobile-theme-label">
                    Language
                  </span>

                  <select
                    className="nav__mobile-lang"
                    value={lang}
                    onChange={(e) => chooseLang(e.target.value)}
                    aria-label="Change language"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.native} ({l.label})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile theme toggle */}
                <div className="nav__mobile-theme">
                  <span className="nav__mobile-theme-label">
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>

                  {renderThemeToggle(true)}
                </div>

                <Link
                  to="/contact"
                  className="nav__consult nav__consult--block"
                >
                  Book a Demo ↗
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
