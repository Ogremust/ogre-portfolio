import { useEffect, useRef } from "react";
import { useMediaQuery } from "./lib/hooks";

/* Eye centres as a fraction of the image box. */
const EYES = [
  { id: "L", cx: 0.37, cy: 0.495 },
  { id: "R", cx: 0.637, cy: 0.495 },
];

const IRIS_SIZE = 0.07;
const EYEBALL_SIZE = 0.145;
const MAX_SHIFT = 8;
const MAX_HEAD_SHIFT = 10;

/**
 * Layered ogre avatar that tracks the cursor.
 *
 * All tracking is written straight to the DOM from a single rAF loop — the
 * previous version called setState three times per mousemove, re-rendering
 * React on every pointer event. The loop also parks itself once the pointer
 * stops moving, so an idle page costs nothing.
 */
export default function OgreAvatar({ faceSrc, eyeSrc, eyeballSrc }) {
  const containerRef = useRef(null);
  const irisRefs = useRef([]);
  const glowRef = useRef(null);

  /* Pointer tracking is desktop-only, and re-evaluates live on resize.
     Off it goes the cursor glow too: parked at its default 50%/40% the glow
     sits squarely between the eyes and washes the irises out. */
  const desktop = useMediaQuery("(hover: hover) and (pointer: fine) and (min-width: 901px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const tracks = desktop && !reduced;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !tracks) return undefined;

    const irises = irisRefs.current;
    let rect = el.getBoundingClientRect();
    const target = { hx: 0, hy: 0, ix: 0, iy: 0, gx: 50, gy: 40 };
    const current = { hx: 0, hy: 0, ix: 0, iy: 0, gx: 50, gy: 40 };
    let raf = 0;
    let idleFrames = 0;

    const measure = () => {
      rect = el.getBoundingClientRect();
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const frame = () => {
      let moved = false;
      for (const k of ["hx", "hy", "ix", "iy", "gx", "gy"]) {
        const next = lerp(current[k], target[k], 0.18);
        if (Math.abs(next - current[k]) > 0.01) moved = true;
        current[k] = next;
      }

      el.style.transform = `translate3d(${current.hx.toFixed(2)}px, ${current.hy.toFixed(2)}px, 0)`;
      const iris = `translate3d(${current.ix.toFixed(2)}px, ${current.iy.toFixed(2)}px, 0)`;
      for (const node of irises) if (node) node.style.transform = iris;
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle at ${current.gx.toFixed(1)}% ${current.gy.toFixed(1)}%, rgba(255,195,120,.45) 0%, rgba(255,145,65,.20) 25%, rgba(255,110,40,0) 60%)`;
      }

      // Park the loop after it settles; the next pointer move restarts it.
      idleFrames = moved ? 0 : idleFrames + 1;
      if (idleFrames > 8) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

    const onMove = (e) => {
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      /* Unclamped, a pointer far above the avatar (i.e. after scrolling down
         the page) drove the irises clean out of the socket and exposed the
         white eyeball. Travel is capped, and upward travel more tightly than
         downward so the eyes read as looking down the page. */
      const nx = clamp((cx / rect.width) * 2 - 1, -1, 1);
      const ny = clamp((cy / rect.height) * 2 - 1, -0.5, 1);

      target.gx = clamp((cx / rect.width) * 100, 0, 100);
      target.gy = clamp((cy / rect.height) * 100, 0, 100);
      target.hx = nx * -MAX_HEAD_SHIFT;
      target.hy = ny * -MAX_HEAD_SHIFT;
      target.ix = nx * MAX_SHIFT;
      target.iy = ny * MAX_SHIFT;
      idleFrames = 0;
      wake();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      if (raf) cancelAnimationFrame(raf);
      /* Clear inline transforms so the CSS idle drift can take over. */
      el.style.transform = "";
      for (const node of irises) if (node) node.style.transform = "";
    };
  }, [tracks]);

  const shared = { position: "absolute", inset: 0, width: "100%", height: "100%" };

  return (
    /* Sizing lives in App.css (`--avatar-size`) rather than inline, so media
       queries can shrink it — an inline style would outrank every rule. */
    <div className={`ogre-avatar${tracks ? "" : " is-idle"}`} ref={containerRef}>
      {/* Eyeball spheres */}
      <img
        src={eyeballSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{ ...shared, objectFit: "cover", mixBlendMode: "screen", opacity: 0.9, pointerEvents: "none" }}
      />

      {/* Irises — translated in lockstep */}
      {EYES.map((eye, i) => (
        <div
          key={eye.id}
          className="ogre-iris"
          ref={(n) => (irisRefs.current[i] = n)}
          style={{
            position: "absolute",
            left: `calc(${eye.cx * 100}% - ${(IRIS_SIZE * 100) / 2}%)`,
            top: `calc(${eye.cy * 100}% - ${(IRIS_SIZE * 100) / 2}%)`,
            width: `${IRIS_SIZE * 100}%`,
            height: `${IRIS_SIZE * 100}%`,
            pointerEvents: "none",
            borderRadius: "50%",
            overflow: "hidden",
            /* Own stacking context so the iris `screen` blend composites against
               transparency instead of the bright eyeball sphere underneath —
               without this the irises wash out to solid white. */
            isolation: "isolate",
            transform: "translate3d(0,0,0)",
          }}
        >
          <img
            src={eyeSrc}
            alt=""
            aria-hidden="true"
            draggable={false}
            style={{ width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "screen", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,2,0,.85) 0%, transparent 40%, rgba(255,160,60,.25) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      ))}

      {/* Socket volume shading */}
      {EYES.map((eye) => (
        <div
          key={`socket-${eye.id}`}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: `calc(${eye.cx * 100}% - ${(EYEBALL_SIZE * 100) / 2}%)`,
            top: `calc(${eye.cy * 100}% - ${(EYEBALL_SIZE * 100) / 2}%)`,
            width: `${EYEBALL_SIZE * 100}%`,
            height: `${EYEBALL_SIZE * 100}%`,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 120%, transparent 40%, rgba(5,2,0,.6) 100%), linear-gradient(180deg, rgba(5,2,0,.7) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Face */}
      <img
        src={faceSrc}
        alt="OGRE"
        draggable={false}
        style={{
          ...shared,
          objectFit: "cover",
          pointerEvents: "none",
          filter: "hue-rotate(-10deg) saturate(.85) contrast(1.05)",
        }}
      />

      {/* Cursor glow, masked to the face silhouette. Pointer-driven only. */}
      {tracks && (
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          ...shared,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 50% 40%, rgba(255,195,120,.45) 0%, rgba(255,145,65,.20) 25%, rgba(255,110,40,0) 60%)",
          mixBlendMode: "screen",
          WebkitMaskImage: `url(${faceSrc})`,
          WebkitMaskSize: "cover",
          WebkitMaskPosition: "center",
          maskImage: `url(${faceSrc})`,
          maskSize: "cover",
          maskPosition: "center",
        }}
      />
      )}
    </div>
  );
}
