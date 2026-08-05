import { useEffect, useRef } from "react";
import { useMediaQuery } from "../lib/hooks";

/**
 * Crosshair cursor. Desktop-only, and the rAF loop parks itself once the
 * ring catches up to the pointer so an idle page burns no frames.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  /* Desktop only: a real hovering pointer, and never on phone-width layouts
     (some mobile browsers still report `pointer: fine`). Evaluated reactively
     so resizing across the breakpoint turns the cursor on and off. */
  const desktop = useMediaQuery("(hover: hover) and (pointer: fine) and (min-width: 901px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = desktop && !reduced;

  useEffect(() => {
    if (!enabled) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    document.body.classList.add("has-custom-cursor");

    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...mouse };
    let raf = 0;
    let idle = 0;

    const frame = () => {
      pos.x += (mouse.x - pos.x) * 0.22;
      pos.y += (mouse.y - pos.y) * 0.22;
      const settled = Math.abs(mouse.x - pos.x) < 0.3 && Math.abs(mouse.y - pos.y) < 0.3;

      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

      idle = settled ? idle + 1 : 0;
      if (idle > 6) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      idle = 0;
      wake();

      const t = e.target;
      const interactive = t instanceof Element && t.closest("a, button, .reel-card, .frame-card, input, textarea, [role='tab']");
      document.body.classList.toggle("cursor-hot", !!interactive);
    };

    const down = () => document.body.classList.add("cursor-down");
    const up = () => document.body.classList.remove("cursor-down");
    const leave = () => document.body.classList.add("cursor-hidden");
    const enter = () => document.body.classList.remove("cursor-hidden");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    wake();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.body.classList.remove("has-custom-cursor", "cursor-hot", "cursor-down", "cursor-hidden");
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
