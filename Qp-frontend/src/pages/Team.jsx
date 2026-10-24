import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import CursorGrid from "../components/CursorGrid.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import "../styles/team.css";

const placeholders = [
  {
    id: 1,
    name: "Mr. Praveen Kumar Cherukuri",
    role: "Founder",
    bio: "",
    social: {
      linkedin: "https://www.linkedin.com/in/praveenkumarcherukuri/",
      github: "https://github.com/your-username",
      email: "mailto:praveenkumarcherukuri9@gmail.com",
    },
  },
  {
    id: 2,
    name: "Mr. D. Kasim Vali",
    role: "Founder",
    bio: "",
    social: {
      linkedin: "https://www.linkedin.com/in/kasimvali-in/",
      github: "https://github.com/",
      email: "mailto:kasimvalinspl@gmail.com",
    },
  },
];

export default function Team() {
  return (
    <section className="section section--dark">
      <div className="hero__bg" aria-hidden="true">
        <CursorGrid
          cellSize={60}
          color="#D4AF37"
          gridColor="#D4AF37"
          highlight="area"
          gridStyle="lines"
          radius={100} // was 140: smaller area around the cursor
          holdTime={250} // was 400: lit cells fade sooner
          fadeDuration={600} // was 800
          fillOpacity={0.02} // was 0.05: softer fill inside lit cells
          maxOpacity={1.5} // was 1: dimmer outline on lit cells
          gridOpacity={0.07}
          spotlight={0.25} // was 0.6: less brightening of lines near the cursor
          edgeFade={0.15}
          clickPulse
        />
        <div className="hero__glow hero__glow--blue" />
        <div className="hero__glow hero__glow--gold" />
      </div>
      <div className="container">
        <SectionHeading
          eyebrow="Meet Our Founders"
          title="The People Behind Q-Prakriti"
          description="Meet the founders driving innovation and building technology for the quantum era."
          align="center"
        />

        <div className="grid grid-2">
          {placeholders.map((m, i) => (
            <motion.article
              key={m.id}
              className="team-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <div className="team-card__avatar">
                <User size={36} strokeWidth={1.5} />
              </div>

              <h3 className="team-card__name">{m.name}</h3>
              <p className="team-card__role">{m.role}</p>

              {m.bio && <p className="team-card__bio">{m.bio}</p>}

              <div className="team-card__socials">
                <a
                  className="team-card__socials_linkedin"
                  href={m.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on LinkedIn`}
                  title="LinkedIn"
                >
                  <FaLinkedinIn size={18} />
                </a>

                <a
                  className="team-card__socials_github"
                  href={m.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on GitHub`}
                  title="GitHub"
                >
                  <FaGithub size={18} />
                </a>

                <a
                  className="team-card__socials_email"
                  href={m.social.email}
                  aria-label={`Email ${m.name}`}
                  title="Email"
                >
                  <Mail size={18} />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
