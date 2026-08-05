import { useEffect, useRef, useState } from "react";
import { navSections } from "../data";
import { useScrollLock } from "../lib/hooks";
import logo from "../assets/new-logo.webp";

export function OgreMark({ className = "" }) {
  return (
    <span className={`logo-mark ${className}`}>
      <img src={logo} alt="" aria-hidden="true" width="46" height="46" draggable={false} />
    </span>
  );
}

export default function Nav({ onBook, onGo }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const ticking = useRef(false);

  useScrollLock(open);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlight whichever section owns the middle of the viewport. */
  useEffect(() => {
    const ids = navSections.map(([id]) => id);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (id) => {
    setOpen(false);
    onGo(id);
  };

  return (
    <>
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="nav-inner">
          <button className="brand" onClick={() => onGo("top")} aria-label="OGRE — back to top">
            <OgreMark />
            <span className="brand-word">OGRE</span>
          </button>

          <nav className="nav-links" aria-label="Sections">
            {navSections.map(([id, label]) => (
              <button
                key={id}
                className={`nav-link${active === id ? " is-active" : ""}`}
                onClick={() => go(id)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="nav-actions">
            <button className="btn btn--solid btn--sm" onClick={onBook}>
              <span className="btn-label">Book a call</span>
            </button>
            <button
              className={`hamburger${open ? " is-open" : ""}`}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer${open ? " is-open" : ""}`} hidden={!open}>
        <nav className="drawer-links" aria-label="Mobile navigation">
          {navSections.map(([id, label], i) => (
            <button key={id} onClick={() => go(id)} style={{ "--i": i }}>
              <span className="drawer-index">{String(i + 1).padStart(2, "0")}</span>
              {label}
            </button>
          ))}
        </nav>
        <button className="btn btn--solid drawer-cta" onClick={() => { setOpen(false); onBook(); }}>
          <span className="btn-label">Book a call</span>
        </button>
      </div>
    </>
  );
}
