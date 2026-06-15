import { useEffect, useRef, useState } from "react";

// Eye centers as % of image — YOU NEED TO CALIBRATE THESE!
const EYES = [
  { id: "L", cx: 0.37, cy: 0.495 }, // left eye
  { id: "R", cx: 0.637, cy: 0.495 }, // right eye
];

const IRIS_SIZE = 0.07; 
const EYEBALL_SIZE = 0.145;

const MAX_SHIFT = 8; // Increased slightly for better tracking range
const MAX_HEAD_SHIFT = 10; 

export default function OgreAvatar({
  faceSrc,
  eyeSrc,
  eyeballSrc,
  size = "480px",
}) {
  const containerRef = useRef(null);
  const [light, setLight] = useState({ x: 50, y: 40 }); 
  
  // CHANGED: One single offset for BOTH eyes so they stay locked together
  const [irisOffset, setIrisOffset] = useState({ dx: 0, dy: 0 }); 
  const [headOffset, setHeadOffset] = useState({ dx: 0, dy: 0 }); 

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rect = el.getBoundingClientRect();
    
    const updateRect = () => { rect = el.getBoundingClientRect(); };
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });

    const handleMove = (e) => {
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const w = rect.width;
      const h = rect.height;

      setLight({
        x: (cx / w) * 100,
        y: (cy / h) * 100,
      });

      // Normalize mouse position from -1 to 1 based on container center
      const normalizedX = (cx / w) * 2 - 1;
      const normalizedY = (cy / h) * 2 - 1;

      // Head opposes cursor
      setHeadOffset({
        dx: normalizedX * -MAX_HEAD_SHIFT, 
        dy: normalizedY * -MAX_HEAD_SHIFT
      });

      // CHANGED: Eyes perfectly follow cursor in lockstep
      setIrisOffset({
        dx: normalizedX * MAX_SHIFT,
        dy: normalizedY * MAX_SHIFT,
      });
    };

    window.addEventListener("mousemove", handleMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
    };
  }, []);

  const shared = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        userSelect: "none",
        transform: `translate(${headOffset.dx}px, ${headOffset.dy}px)`,
        // Sped up transition slightly so the head doesn't feel floaty
        transition: "transform 0.08s ease-out" 
      }}
    >
      {/* ── Layer 1: Eyeball spheres (static) ── */}
      <img
        src={eyeballSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          ...shared,
          objectFit: "cover",
          mixBlendMode: "screen",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />

      {/* ── Layer 2: Iris × 2 (tracks cursor in lockstep) ── */}
      {EYES.map((eye) => (
        <div
          key={eye.id}
          style={{
            position: "absolute",
            left: `calc(${eye.cx * 100}% - ${(IRIS_SIZE * 100) / 2}%)`,
            top: `calc(${eye.cy * 100}% - ${(IRIS_SIZE * 100) / 2}%)`,
            width: `${IRIS_SIZE * 100}%`,
            height: `${IRIS_SIZE * 100}%`,
            // CHANGED: Uses the single locked offset
            transform: `translate(${irisOffset.dx}px, ${irisOffset.dy}px)`,
            // Sped up eye transition for sharper tracking
            transition: "transform 0.06s ease-out", 
            pointerEvents: "none",
            willChange: "transform",
            borderRadius: "50%",
            overflow: "hidden", 
          }}
        >
          <img
            src={eyeSrc}
            alt=""
            aria-hidden="true"
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              mixBlendMode: "screen",
              display: "block",
            }}
          />
          {/* THE CORNEA SHADER */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(5,2,0,0.85) 0%, transparent 40%, rgba(255,160,60,0.25) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      ))}

      {/* ── Layer 2.5: Eye Socket Volume Shader ── */}
      {EYES.map((eye) => (
        <div
          key={`socket-${eye.id}`}
          style={{
            position: "absolute",
            left: `calc(${eye.cx * 100}% - ${(EYEBALL_SIZE * 100) / 2}%)`,
            top: `calc(${eye.cy * 100}% - ${(EYEBALL_SIZE * 100) / 2}%)`,
            width: `${EYEBALL_SIZE * 100}%`,
            height: `${EYEBALL_SIZE * 100}%`,
            borderRadius: "50%",
            background: "radial-gradient(circle at 50% 120%, transparent 40%, rgba(5,2,0,0.6) 100%), linear-gradient(180deg, rgba(5,2,0,0.7) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />
      ))}

	 {/* ── Layer 3: Face mask (Solid Alpha Blend) ── */}
      <img
        src={faceSrc}
        alt="OGRE"
        draggable={false}
        style={{
          ...shared,
          objectFit: "cover",
          pointerEvents: "none",
          position: "absolute",
          
          // ADD THIS LINE:
          filter: "hue-rotate(-10deg) saturate(0.85) contrast(1.05)"
        }}
      />

      {/* ── Layer 4: Cursor glow (Masked strictly to the face shape) ── */}
      <div
        aria-hidden="true"
        style={{
          ...shared,
          position: "absolute",
          borderRadius: "inherit",
          pointerEvents: "none",
          background: `radial-gradient(
            circle at ${light.x}% ${light.y}%,
            rgba(255, 195, 120, 0.45) 0%,
            rgba(255, 145, 65, 0.20) 25%,
            rgba(255, 110, 40, 0) 60%
          )`,
          mixBlendMode: "screen",
          transition: "background 0.1s linear",
          WebkitMaskImage: `url(${faceSrc})`,
          WebkitMaskSize: "cover",
          WebkitMaskPosition: "center",
          maskImage: `url(${faceSrc})`,
        }}
      />
    </div>
  );
}