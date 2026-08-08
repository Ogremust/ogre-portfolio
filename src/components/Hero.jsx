import { useEffect, useRef } from "react";
import OgreAvatar from "../OgreAvatar";
import { MagneticButton, Marquee, Stat } from "./ui";
import { clients, stats } from "../data";
import faceSrc from "../assets/ogre-face.webp";
import eyeSrc from "../assets/ogre-eye.webp";
import eyeballSrc from "../assets/ogre-eyeball.webp";

/* Split into words so each masks in independently. The gradient lives on the
   LINE, not the word — per-word gradients restarted on every word and made the
   letters read as mismatched colour blocks. */
const LINES = [
  { tone: "ink", words: ["Raw", "in."] },
  { tone: "acid", words: ["Roar", "out."] },
];

export default function Hero({ onBook, onGo, ready = true }) {
  const artRef = useRef(null);
  const titleRef = useRef(null);

  /* Publish each word's x-offset (--wx) and its line's text width (--lw) so the
     per-word gradients in App.css can sample one line-wide ramp. Without this
     every word restarts the gradient and the headline reads as colour blocks. */
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return undefined;

    const measure = () => {
      el.querySelectorAll(".title-line").forEach((line) => {
        const inks = [...line.querySelectorAll(".title-ink")];
        if (!inks.length) return;
        const left = inks[0].getBoundingClientRect().left;
        const right = inks[inks.length - 1].getBoundingClientRect().right;
        line.style.setProperty("--lw", `${Math.round(right - left)}px`);
        inks.forEach((ink) => {
          ink.style.setProperty("--wx", `${Math.round(ink.getBoundingClientRect().left - left)}px`);
        });
      });
    };

    measure();
    // Re-measure once webfonts land, since Archivo Black changes the metrics.
    document.fonts?.ready.then(measure).catch(() => {});

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Gentle parallax on the avatar. rAF-throttled, transform-only. */
  useEffect(() => {
    const el = artRef.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        el.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="availability">
            <span className="pulse-dot" aria-hidden="true" />
            Available for new projects
          </div>

          <h1 className="hero-title" ref={titleRef}>
            {LINES.map((line, li) => (
              <span className={`title-line title-line--${line.tone}`} key={li}>
                {line.words.map((word, wi) => (
                  <span className="title-word" key={wi} style={{ "--d": `${(li * 2 + wi) * 90 + 120}ms` }}>
                    {/* data-text feeds the ::before glow layer, which re-draws the
                        same glyphs masked to the orange bands only. */}
                    <span className="title-ink" data-text={word}>
                      {word}
                    </span>
                  </span>
                ))}
              </span>
            ))}
            <span className="playhead" aria-hidden="true" />
          </h1>

          <p className="hero-lede">
            Short-form edits with bite — sharper hooks, tighter pacing, cleaner captions.
            I turn raw creator footage into cuts that stop the scroll and move product.
          </p>

          <div className="hero-actions">
            <MagneticButton onClick={onBook}>Start a project</MagneticButton>
            <MagneticButton variant="ghost" onClick={() => onGo("work")}>
              See the work
            </MagneticButton>
          </div>

          <div className="hero-stats">
            {stats.map((s) => (
              <Stat key={s.label} {...s} start={ready} />
            ))}
          </div>
        </div>

        <div className="hero-art" ref={artRef}>
          <div className="hero-art-glow" aria-hidden="true" />
          <OgreAvatar faceSrc={faceSrc} eyeSrc={eyeSrc} eyeballSrc={eyeballSrc} />
        </div>
      </div>

      <div className="trust-bar">
        <span className="trust-label">Trusted by</span>
        <Marquee items={clients} speed={38} className="trust-marquee" />
      </div>

      <button className="scroll-cue" onClick={() => onGo("work")} aria-label="Scroll to work">
        <span className="scroll-cue-line" aria-hidden="true" />
        Scroll
      </button>
    </section>
  );
}
