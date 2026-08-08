import { useEffect, useRef } from "react";
import { useCounter, useEscape, useReveal, useScrollLock } from "../lib/hooks";

/** Section wrapper that fades/lifts its children in once, on scroll. */
/**
 * `variant` picks the entrance: "lift" | "wipe" | "left" | "right" | "flare" |
 * "unfurl". Omit for the default rise.
 */
export function Reveal({ as: Tag = "div", className = "", delay = 0, variant, children, ...rest }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal${variant ? ` reveal--${variant}` : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Eyebrow label above a section heading. */
export function Kicker({ children }) {
  return <span className="kicker">{children}</span>;
}

/** Kicker slides in, title wipes open, lede lifts — staggered in that order. */
export function SectionHead({ kicker, title, lede, align = "left", single = false }) {
  return (
    <div className={`section-head section-head--${align}`}>
      {kicker && (
        <Reveal as="span" className="kicker" variant="left">
          {kicker}
        </Reveal>
      )}
      {/* Inner span carries the wipe; see .reveal--wipe in App.css */}
      <Reveal
        as="h2"
        variant="wipe"
        delay={90}
        className={`section-title${single ? " section-title--single" : ""}`}
      >
        <span>{title}</span>
      </Reveal>
      {lede && (
        <Reveal as="p" className="section-lede" variant="lift" delay={200}>
          {lede}
        </Reveal>
      )}
    </div>
  );
}

/**
 * Button that leans toward the cursor.
 * Movement is written directly to style from a pointer handler — no state,
 * so hovering never triggers a React render.
 */
export function MagneticButton({ children, onClick, className = "", variant = "solid", type = "button", ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist < 140) {
      el.style.transform = `translate3d(${dx * 0.22}px, ${dy * 0.28}px, 0)`;
      el.dataset.pulled = "true";
    }
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0,0,0)";
    delete el.dataset.pulled;
  };

  return (
    <button
      ref={ref}
      type={type}
      className={`btn btn--${variant} ${className}`}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onBlur={reset}
      {...rest}
    >
      <span className="btn-label">{children}</span>
    </button>
  );
}

/** Animated stat. Counts on scroll-in, writes text straight to the node. */
export function Stat({ target, prefix = "", suffix = "", label, start = true }) {
  const ref = useCounter(target, { start });
  return (
    <div className="stat">
      <strong className="stat-value">
        {prefix}
        <span ref={ref}>0</span>
        {suffix}
      </strong>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/** Infinite horizontal marquee. Pure CSS transform; pauses when offscreen. */
export function Marquee({ items, speed = 40, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle("is-paused", !entry.isIntersecting),
      { rootMargin: "150px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee-track" style={{ "--marquee-duration": `${speed}s` }}>
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {items.map((item, i) => (
              <span className="marquee-item" key={`${copy}-${i}`}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Accessible modal shell: scroll-locked, Escape-closable, click-outside-closable. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, children, className = "", label }) {
  useScrollLock(open);
  useEscape(open, onClose);
  const panelRef = useRef(null);
  const restoreRef = useRef(null);

  /* Move focus in on open, keep Tab inside the dialog, and hand focus back to
     whatever opened it on close — otherwise keyboard users land on <body> and
     lose their place in the page. */
  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    panelRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const items = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const el = restoreRef.current;
      if (el && typeof el.focus === "function" && document.contains(el)) el.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-layer" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`modal ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export function Stars({ count = 5 }) {
  return (
    <div className="stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/** Placeholder cards shown while sheet data is in flight. */
export function CardSkeleton({ count = 6, className = "" }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div className={`skeleton ${className}`} key={i} style={{ "--reveal-delay": `${i * 60}ms` }} />
      ))}
    </>
  );
}
