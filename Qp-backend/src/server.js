import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { encryptRecord } from './crypto.js';
import { Resend } from 'resend';
import ContactMessage from './model.js';



const {
  PORT = 5000,
  MONGODB_URI,
  CORS_ORIGIN,
  MLKEM_PUBLIC_KEY,
  RESEND_API_KEY,
  FROM_EMAIL,
  COMPANY_EMAIL,
} = process.env;

if (
  !MONGODB_URI ||
  !MLKEM_PUBLIC_KEY ||
  !RESEND_API_KEY ||
  !FROM_EMAIL ||
  !COMPANY_EMAIL
) {
  console.error('Missing required environment variables in .env');
  process.exit(1);
}
const resend = new Resend(RESEND_API_KEY);

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://qprakriti.com",
  "https://www.qprakriti.com"
];

app.use(helmet());

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "20kb" }));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, subject, message }) {
  const isStr = (v, max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
  if (!isStr(name, 100)) return 'Invalid name';
  if (!isStr(email, 200) || !EMAIL_RE.test(email)) return 'Invalid email';
  if (!isStr(subject, 200)) return 'Invalid subject';
  if (!isStr(message, 5000)) return 'Invalid message';
  return null;
}


app.post('/api/contact', limiter, async (req, res) => {
  try {
    const { name, organisation = '', email, message } = req.body || {};

    const isValidString = (value, max) =>
      typeof value === 'string' &&
      value.trim().length > 0 &&
      value.length <= max;

    if (!isValidString(name, 100)) {
      return res.status(400).json({ error: 'Invalid name' });
    }

    if (
      typeof organisation !== 'string' ||
      organisation.length > 200
    ) {
      return res.status(400).json({ error: 'Invalid organisation' });
    }

    if (!isValidString(email, 200) || !EMAIL_RE.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    if (!isValidString(message, 5000) || message.trim().length < 10) {
      return res.status(400).json({ error: 'Invalid message' });
    }

    const contactData = {
      name: name.trim(),
      organisation: organisation.trim(),
      email: email.trim(),
      subject: 'New Q-Prakriti Website Enquiry',
      message: message.trim(),
    };

    // Encrypt and save the contact message.
    const record = encryptRecord(contactData, MLKEM_PUBLIC_KEY);
    await ContactMessage.create(record);

    // Send the notification email.
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: [COMPANY_EMAIL],
        replyTo: contactData.email,
        subject: 'New Contact Form Submission - Q-Prakriti',
        text: [
          'A new contact form submission has been received.',
          '',
          `Name: ${contactData.name}`,
          `Organisation: ${contactData.organisation || 'Not provided'}`,
          `Visitor email: ${contactData.email}`,
          '',
          'Message:',
          contactData.message,
        ].join('\n'),
      });

      console.log('Resend response:', {
        emailId: data?.id,
        error: error
          ? { name: error.name, message: error.message }
          : null,
      });

      if (error || !data?.id) {
        console.error('Resend did not accept the email:', error);

        return res.status(201).json({
          success: true,
          saved: true,
          emailSent: false,
          message: 'Your message was saved, but the email notification failed.',
        });
      }

      return res.status(201).json({
        success: true,
        saved: true,
        emailSent: true,
        message: 'Your message was submitted successfully.',
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);

      return res.status(201).json({
        success: true,
        saved: true,
        emailSent: false,
        message: 'Your message was saved, but the email notification failed.',
      });
    }
  } catch (err) {
    console.error('Contact error:', err);

    return res.status(500).json({
      success: false,
      error: 'Unable to process your message.',
    });
  }
});





const calendly = (url) =>
  fetch(url, { headers: { Authorization: `Bearer ${process.env.CALENDLY_TOKEN}` } });

app.post("/api/booking-notify", express.json(), async (req, res) => {
  try {
    const { inviteeUri } = req.body;

    // Calendly URL ye ani check chey
    const u = new URL(inviteeUri);
    if (u.protocol !== "https:" || u.hostname !== "api.calendly.com") {
      return res.sendStatus(400);
    }

    // Calendly nundi name, email, time techchuko
    const inv = (await (await calendly(inviteeUri)).json()).resource;
    const ev = (await (await calendly(inv.event)).json()).resource;

    const when = new Date(ev.start_time).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });

    await resend.emails.send({
      from: "Q-Prakriti <noreply@qprakriti.com>", // Resend lo verify chesina domain avvali
      to:"quantumprakriti@gmail.com",
      replyTo: inv.email,
      subject: `New demo booked: ${inv.name}`,
      html: `
        <p><b>Name:</b> ${inv.name}</p>
        <p><b>Email:</b> ${inv.email}</p>
        <p><b>Time (IST):</b> ${when}</p>
      `,
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("booking-notify error:", err);
    res.sendStatus(500);
  }
});
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });