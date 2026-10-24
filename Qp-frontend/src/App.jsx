import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import QuantumLoader from './components/QuantumLoader.jsx';
import CursorGrid from './components/CursorGrid.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Team from './pages/Team.jsx';
import Careers from './pages/Careers.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import BookDemo from './pages/BookDemo';


const pageVariants = {
  initial: {
    opacity: 0,
    y: 12
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.25
    }
  }
};

const PageWrapper = ({ children }) => (
  <motion.main
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.main>
);

const titles = {
  '/': 'Q-Prakrithi | Engineering a Quantum-Ready Future',
  '/about': 'About Us | Q-Prakrithi',
  '/services': 'Services | Q-Prakrithi',
  '/team': 'Team | Q-Prakrithi',
  '/careers': 'Careers | Q-Prakrithi',
  '/contact': 'Contact Us | Q-Prakrithi'
};

export default function App() {
  const location = useLocation();

  // Show the cinematic loader only on first load
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Update page title + scroll to top on navigation
  useEffect(() => {
    document.title = titles[location.pathname] || 'Q-Prakrithi';

    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [location.pathname]);

  // Lock body scroll while loader is on screen
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  return (
    <ThemeProvider>
      {/* Cinematic opening animation — overlays everything */}
      <AnimatePresence>
        {isLoading && (
          <QuantumLoader
            key="quantum-loader"
            targetSelector="#quantum-slot"
            onComplete={handleLoadingComplete}
          />
        )}
      </AnimatePresence>

      
  
    
      {/*
        Main website is ALWAYS mounted.
        Why: the loader needs #quantum-slot to exist in the DOM
        so it can measure the target and FLIP the computer there.

        The slot itself starts invisible and fades in on the
        `quantum-loader-handoff` event (fired by the loader).
      */}
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
          <Route
            path="/about"
            element={
              <PageWrapper>
                <About />
              </PageWrapper>
            }
          />
          <Route
            path="/services"
            element={
              <PageWrapper>
                <Services />
              </PageWrapper>
            }
          />
          <Route
            path="/team"
            element={
              <PageWrapper>
                <Team />
              </PageWrapper>
            }
          />
          <Route
            path="/careers"
            element={
              <PageWrapper>
                <Careers />
              </PageWrapper>
            }
          />
          <Route
            path="/contact"
            element={
              <PageWrapper>
                <Contact />
              </PageWrapper>
            }
          />
          <Route path="/book-demo" element={<BookDemo />} />
          <Route
            path="*"
            element={
              <PageWrapper>
                <NotFound />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
      
      <Footer />
    </ThemeProvider>
  );
}