import { useState } from "react";
import { MagneticButton, Reveal, SectionHead, Stars } from "./ui";
import { useScrollProgress } from "../lib/hooks";
import { CONTACT_EMAIL, faqs, navSections, pricing, process, services, socials, testimonials, toolkit } from "../data";
import { OgreMark } from "./Nav";
import profilePic from "../assets/jeric-photo.webp";

/* Vite needs statically analysable paths, so the icons are eagerly mapped. */
const toolIcons = import.meta.glob("../assets/{pr,ae,resolve,ps,capcut,ai,fig,hig}.webp", {
  eager: true,
  import: "default",
});
const iconFor = (slug) => toolIcons[`../assets/${slug}.webp`];

/* ── Services ─────────────────────────────── */
export function Services() {
  return (
    <section className="section" id="services">
      <SectionHead kicker="Services" title="Edit weapons." lede="Three things I do, and do properly." />
      <div className="service-grid">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 80} variant="flare">
            <article className="service-card">
              <span className="service-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <Toolkit />
    </section>
  );
}

/* ── Toolkit ──────────────────────────────── */
export function Toolkit() {
  return (
    <Reveal className="toolkit" variant="lift">
      <span className="toolkit-label">Built in</span>
      <ul className="toolkit-list">
        {toolkit.map(([name, slug]) => (
          <li key={slug} className="tool">
            <img src={iconFor(slug)} alt="" aria-hidden="true" width="30" height="30" loading="lazy" decoding="async" />
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

/* ── Process (scroll-linked timeline) ─────── */
export function Process() {
  const ref = useScrollProgress();
  return (
    <section className="section section--alt" id="process">
      <SectionHead kicker="Process" title="Cut. Polish. Ship." lede="No mystery, no drift. Four steps from footage to final file." />
      <div className="timeline" ref={ref}>
        <div className="timeline-rail" aria-hidden="true">
          <span className="timeline-fill" />
        </div>
        <div className="timeline-steps">
          {process.map(([n, title, body], i) => (
            <Reveal key={n} delay={i * 90} variant="left">
              <article className="step">
                <span className="step-n">{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ──────────────────────────────── */
export function Pricing({ onBook }) {
  return (
    <section className="section" id="pricing">
      <SectionHead
        kicker="Pricing"
        title="Straight numbers."
        lede="No discovery-call gatekeeping to find out if you can afford it."
        align="center"
        single
      />
      <div className="price-grid">
        {pricing.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 90} variant="flare">
            <article className={`price-card${tier.featured ? " is-featured" : ""}`}>
              {tier.featured && <span className="price-flag">Most popular</span>}
              <h3>{tier.name}</h3>
              <p className="price-blurb">{tier.blurb}</p>
              <div className="price-amount">
                <strong>{tier.price}</strong>
                {tier.unit && <span>{tier.unit}</span>}
              </div>
              <ul className="price-features">
                {tier.features.map((f) => (
                  <li key={f}>
                    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`btn ${tier.featured ? "btn--solid" : "btn--ghost"} price-cta`}
                onClick={() => onBook(tier)}
              >
                <span className="btn-label">{tier.cta}</span>
              </button>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Reviews ──────────────────────────────── */
export function Reviews() {
  return (
    <section className="section section--alt" id="reviews">
      <SectionHead kicker="Client reviews" title="They felt the bite." />
      <div className="review-grid">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 90} variant="lift">
            <article className="review-card">
              <div className="review-top">
                <Stars />
                {t.metric && <span className="review-metric">{t.metric}</span>}
              </div>
              <blockquote>{t.quote}</blockquote>
              <footer className="review-who">
                <span className="review-initial" aria-hidden="true">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </span>
              </footer>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── About ────────────────────────────────── */
export function About() {
  return (
    <section className="section" id="about">
      <div className="about-grid">
        <Reveal className="about-photo" variant="left">
          <img src={profilePic} alt="Jeric Lauresta" width="500" height="576" loading="lazy" decoding="async" />
        </Reveal>

        <Reveal className="about-copy" delay={80} variant="right">
          <span className="kicker">About</span>
          <h2 className="section-title">The engine behind OGRE.</h2>
          <p>
            I'm Jeric Lauresta, and I built OGRE because the editing space was getting soft. Coming from
            computer engineering, I treat video editing like system architecture — I don't just cut clips,
            I reverse-engineer what makes people keep watching.
          </p>
          <p>You hand over the raw footage. I give you back a weapon.</p>

          <dl className="about-facts">
            <div>
              <dt>Style</dt>
              <dd>Clean cuts, sharp hooks, zero filler.</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Direct-response UGC and viral-format replication.</dd>
            </div>
            <div>
              <dt>Promise</dt>
              <dd>Ruthless precision, edits that move the needle.</dd>
            </div>
          </dl>

          <div className="social-links">
            {socials.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────── */
export function Faq() {
  const [open, setOpen] = useState(null);
  return (
    <section className="section" id="faq">
      <SectionHead kicker="FAQ" title="Ask before cut." />
      <div className="faq-list">
        {faqs.map(([q, a], i) => (
          <Reveal key={q} delay={i * 50} variant="unfurl">
            <div className={`faq-row${open === i ? " is-open" : ""}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <span>{q}</span>
                <span className="faq-sign" aria-hidden="true" />
              </button>
              <div className="faq-a">
                <div className="faq-a-inner">
                  <p>{a}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Closing CTA ──────────────────────────── */
export function ClosingCta({ onBook }) {
  return (
    <section className="section" id="cta">
      <Reveal className="cta-panel" variant="lift">
        <div className="cta-glow" aria-hidden="true" />
        <span className="kicker">Let's get started</span>
        <h2 className="cta-title">Ready to roar?</h2>
        <p>Send the footage. Get back something that actually converts.</p>
        <div className="cta-actions">
          <MagneticButton onClick={onBook}>Book a free discovery call</MagneticButton>
          <a className="btn btn--ghost" href={`mailto:${CONTACT_EMAIL}`}>
            <span className="btn-label">Email direct</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Footer ───────────────────────────────── */
export function Footer({ onGo }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <OgreMark />
          <span>OGRE</span>
        </div>
        <nav className="footer-links" aria-label="Footer">
          {navSections.map(([id, label]) => (
            <button key={id} onClick={() => onGo(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="footer-contact">
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <span className="footer-note">Jeric Lauresta · Video Editor · {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
