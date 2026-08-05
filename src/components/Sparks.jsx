import { useMemo } from "react";

/**
 * Ambient ember field.
 *
 * Each spark is a single absolutely-positioned span animating only transform
 * and opacity, so the whole field composites on the GPU and never triggers
 * layout or paint. Values are generated once and frozen into custom properties.
 */
const COUNT = 22;

function makeSparks(count) {
  // Deterministic pseudo-random so the field is stable across re-renders.
  let seed = 9301;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  return Array.from({ length: count }, () => {
    const size = 2 + rand() * 3.6;
    return {
      left: `${rand() * 100}%`,
      size: `${size.toFixed(1)}px`,
      rise: `${(48 + rand() * 42).toFixed(0)}vh`,
      drift: `${(rand() * 130 - 65).toFixed(0)}px`,
      duration: `${(11 + rand() * 13).toFixed(1)}s`,
      delay: `-${(rand() * 22).toFixed(1)}s`,
      peak: (0.28 + rand() * 0.42).toFixed(2),
      sway: `${(5 + rand() * 4).toFixed(1)}s`,
    };
  });
}

export default function Sparks() {
  const sparks = useMemo(() => makeSparks(COUNT), []);

  return (
    <div className="sparks" aria-hidden="true">
      {sparks.map((s, i) => (
        <span
          key={i}
          className="spark"
          style={{
            left: s.left,
            "--s": s.size,
            "--rise": s.rise,
            "--dx": s.drift,
            "--dur": s.duration,
            "--delay": s.delay,
            "--peak": s.peak,
            "--sway": s.sway,
          }}
        />
      ))}
    </div>
  );
}
