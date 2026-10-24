import { useState } from 'react';
import { motion } from 'framer-motion';

import {
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import SectionHeading from '../components/SectionHeading.jsx';

import '../styles/contact.css';
const socialLinks = [
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/' },
  { name: 'X', icon: 'x', url: 'https://x.com/' },
  { name: 'GitHub', icon: 'github', url: 'https://github.com/' },
  { name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/' },
  { name: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com/' },
];
const icons = {
  linkedin: (
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  ),
  x: (
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  ),
  github: (
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  ),
  instagram: (
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  ),
  youtube: (
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  ),
};
const initialForm = {
  name: '',
  organisation: '',
  email: '',
  message: '',
};

/* ------------------------------------------------------------------
   TODO: connect a real delivery service here (own API, Formspree,
   EmailJS, etc.). Until then this throws, so the form honestly
   tells the visitor that the message was NOT sent.
------------------------------------------------------------------- */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function sendMessage(data) {
  
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name.trim(),
      organisation: data.organisation.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Unable to submit your message.');
  }

  return result;
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const validate = (fields) => {
    const next = {};

    if (!fields.name.trim()) {
      next.name = 'Please enter your name.';
    }

    if (!fields.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      next.email = 'Please enter a valid email address.';
    }

    if (!fields.message.trim()) {
      next.message = 'Please enter your message.';
    } else if (fields.message.trim().length < 10) {
      next.message = 'Please provide a message of at least 10 characters.';
    }

    return next;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setForm((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      if (!prev[field]) return prev;
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });

    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return;

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('submitting');

    try {
      await sendMessage(form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setStatus('idle');
  };

  const fieldError = (field) =>
    errors[field] ? (
      <span id={`${field}-error`} className="field__error" role="alert">
        {errors[field]}
      </span>
    ) : null;

  return (
    <>
      

      {/* CONTACT SECTION */}
      <section className="section section--dark">
        <div className="container contact-grid">
          {/* LEFT: CONTACT INFORMATION */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <SectionHeading eyebrow="Get in touch" title="Contact information" />

            <ul className="contact-info__list">
              <li>
                <Mail size={18} />
                <div>
                  <strong>Email</strong>
                  <span>info@qprakriti.com</span>
                </div>
              </li>

              <li>
                <Phone size={18} />
                <div>
                  <strong>Phone</strong>
                  <span>+91 9618225394</span>
                </div>
              </li>

              <li>
                <MapPin size={18} />
                <div>
                  <strong>Office Address</strong>
                  <span>4th floor,Medha Hi-tech City,<br/>Kesarapalli,Gannavaram,Vijayawada,Andhra Pradesh 521102,India.</span>
                </div>
              </li>
            </ul>

            <div className="footer__socials" aria-label="Social media links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Q-Prakrithi on ${social.name}`}
                  title={social.name}
                  className={`footer__social-link footer__social-link--${social.icon}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="footer__social-icon"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    {icons[social.icon]}
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: SIMPLE CONTACT FORM */}
          <motion.div
            className="contact-form"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {status === 'success' ? (
              <div className="contact-completed">
                <div className="contact-completed__icon">
                  <CheckCircle2 size={30} />
                </div>

                <h3>Thank you!</h3>

                <p>
                  Your message has been sent. Our team will get back to you soon.
                </p>

                <button
                  type="button"
                  className="btn btn--gold btn--md"
                  onClick={resetForm}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="contact-form__heading">
                  <span className="eyebrow">Let's connect</span>
                  <h2>Send us a message</h2>
                  <p>Tell us how we can help and we will get back to you.</p>
                </div>

                <form className="contact-form__form" onSubmit={handleSubmit} noValidate>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="contact-name">
                        Name <span>*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={handleChange('name')}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        placeholder="Your full name"
                      />
                      {fieldError('name')}
                    </div>

                    <div className="field">
                      <label htmlFor="contact-organisation">
                        Organisation <em>(optional)</em>
                      </label>
                      <input
                        id="contact-organisation"
                        name="organisation"
                        type="text"
                        autoComplete="organization"
                        value={form.organisation}
                        onChange={handleChange('organisation')}
                        placeholder="Company or institution"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="contact-email">
                      Email <span>*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      placeholder="you@example.com"
                    />
                    {fieldError('email')}
                  </div>

                  <div className="field">
                    <label htmlFor="contact-message">
                      Message <span>*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange('message')}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      placeholder="Tell us about your enquiry..."
                    />
                    {fieldError('message')}
                  </div>

                  {status === 'error' && (
                    <div className="form-status form-status--err" role="alert">
                      <AlertCircle size={16} />
                      Message not sent. This form is not connected to an email
                      service yet.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn--gold btn--md contact-form__submit"
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send Message'}
                    <Send size={15} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}