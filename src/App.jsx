import { useEffect, useRef, useState } from "react";
import "./App.css"; // MOVE YOUR CSS STRING INTO THIS FILE

/* ───────────────────────────────────────────────
   1. ASSETS & STATIC DATA
─────────────────────────────────────────────── */
import prLogo from "./assets/pr.png";
import aeLogo from "./assets/ae.png";
import resolveLogo from "./assets/resolve.png";
import psLogo from "./assets/ps.png";
import capcutLogo from "./assets/capcut.png";
import aiLogo from "./assets/ai.png";
import figLogo from "./assets/fig.png";
import higLogo from "./assets/hig.png";
import profilePic from "./assets/jeric-photo.png";
import OgreAvatar from "./OgreAvatar";
import facePng from "./assets/ogre-face.png";
import eyePng from "./assets/ogre-eye.png";
import eyeballPng from "./assets/ogre-eyeball.png";
import newLogo from "./assets/new-logo.png";

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDMjFftiGf4lMHQOXG7Z2AqAZz9oxEtCqsov2gh3KocXHBX40oJ3PSmSJJhtyYbAeI4PwOhe8d1_g7/pub?gid=315975212&single=true&output=csv";
const VIDEO_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDMjFftiGf4lMHQOXG7Z2AqAZz9oxEtCqsov2gh3KocXHBX40oJ3PSmSJJhtyYbAeI4PwOhe8d1_g7/pub?gid=1855750606&single=true&output=csv";

const services = [
  { title: "UGC that bites", body: "Raw creator footage shaped into direct-response edits with stronger hooks, tighter pacing, captions, and product clarity.", tags: ["Hooks", "Captions", "Product proof"] },
  { title: "Shorts with teeth", body: "YouTube Shorts and TikTok cuts built around rhythm, retention, and a first second that does not waste attention.", tags: ["Retention", "Pacing", "Sound"] },
  { title: "Thumbnail pressure", body: "Frames, titles, and visual hierarchy designed to make the click feel obvious before the viewer starts thinking.", tags: ["CTR", "Title frames", "Still exports"] },
];

const process = [
  ["01", "Brief", "You send footage, references, audience notes, and what the video needs to make people do."],
  ["02", "Cut", "I build the hook, pacing, captions, sound, and visual emphasis around the strongest moments."],
  ["03", "Sharpen", "We review the first pass and tighten the edit instead of wandering through vague revisions."],
  ["04", "Ship", "Final files are exported for the platform, format, and campaign you are actually using."],
];

const faqs = [
  ["What is your pricing and engagement model?", "I work primarily on monthly retainers for brands scaling their organic reach, or batch-projects (minimum 5 videos) for creators. Custom quotes depend on footage complexity and volume."],
  ["What type of videos do you edit?", "UGC, Reels, TikToks, YouTube Shorts, talking-head clips, product demos, and thumbnail frames."],
  ["What's your turnaround time?", "Most short-form edits are ready in 24 to 48 hours, depending on footage and scope."],
  ["How do I send footage?", "Google Drive, Dropbox, or WeTransfer works. Keep the files organized and I can start faster."],
  ["How many revisions are included?", "Two focused revision rounds are included so the edit gets sharper without dragging."],
];

const testimonials = [
  ["Zelie Pascal", "Founder @ Paw Guardian", "Jeric took our raw UGC clips for the Denta Clean campaign and turned them into absolute weapons. The hooks were so sharp our CTR doubled on day one. He knows exactly how to pace pet ads to make people stop scrolling and buy."],
  ["Vizoya Rewards", "YouTube Creator (2.5M Subs)", "With 2.5 million subscribers, we can't afford dead air. OGRE handles our UGC ad cuts across multiple product lines, and the pacing is always ruthlessly efficient. He understands exactly how to keep the algorithm fed and retention graphs flat."],
  ["Kenyatta Robinson", "Founder @ Backyard SmokeMaster BBQ", "I do long-form BBQ content, and keeping people engaged for 15 minutes is tough. Jeric cuts the fat. He knows exactly when to let the B-roll sizzle and when to push the tempo. My audience retention has never been higher since he took over the timeline."],
];

const programBadges = [
  ["Pr", prLogo, 1.25], ["Ae", aeLogo, 1.43], ["Resolve", resolveLogo, 1.7], 
  ["Ps", psLogo, 1.4], ["CapCut", capcutLogo, 1.5], ["Ai", aiLogo, 1.4],
  ["figma", figLogo, 1.7], ["higgsfield", higLogo, 1.0],   
];

const editActions = [
  ["Hook", "Open hard"], ["Cut", "Kill dead air"], ["Caption", "Make it readable"],
  ["Grade", "Heat the frame"], ["Export", "Platform-ready"],
];

const DEFAULT_VIDEO_GRADIENTS = [
  "linear-gradient(145deg,#211412,#6b1b20 48%,#ff8a1f)",
  "linear-gradient(145deg,#1d1614,#7a2432 48%,#ffb13d)",
  "linear-gradient(145deg,#201212,#86243b 48%,#ff5c2a)",
  "linear-gradient(145deg,#1c1111,#5d1c24 46%,#ff2a52)",
  "linear-gradient(145deg,#211611,#7b3518 48%,#ffbd3d)",
  "linear-gradient(145deg,#20100f,#721b24 48%,#ff8a1f)",
];

/* ───────────────────────────────────────────────
   2. UTILITY FUNCTIONS
─────────────────────────────────────────────── */
const driveImage = (id, size = 1000) => `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;

const extractDriveId = (value) => {
  if (!value) return "";
  const trimmed = value.trim();
  return trimmed.match(/\/d\/([a-zA-Z0-9_-]{10,})/)?.pop() || trimmed.match(/[?&]id=([a-zA-Z0-9_-]{10,})/)?.pop() || trimmed;
};

const parseSheetCsv = (text) => {
  const rows = []; let row = []; let field = ""; let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i], next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') { field += '"'; i++; } 
      else if (char === '"') inQuotes = false;
      else field += char;
      continue;
    }
    if (char === '"') inQuotes = true;
    else if (char === ",") { row.push(field); field = ""; } 
    else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i++;
      row.push(field); field = "";
      if (row.some(c => c.trim())) rows.push(row);
      row = [];
    } else field += char;
  }
  if (field || row.length) { row.push(field); if (row.some(c => c.trim())) rows.push(row); }
  return rows;
};

const buildImagePortfolio = (csvText) => {
  const rows = parseSheetCsv(csvText);
  if (rows.length < 2) return [];
  const header = rows[0].map(c => c.trim().toLowerCase());
  return rows.slice(1).map(cells => {
    const entry = {};
    header.forEach((k, i) => entry[k] = (cells[i] || "").trim());
    return entry;
  }).filter(e => e.link || e.driveid || e.id).map((e, i) => ({
    stage: e.stage || "Concept",
    title: e.title || `Image ${i + 1}`,
    driveId: extractDriveId(e.link || e.driveid || e.id),
    prompt: e.prompt || "",
    context: e.context || ""
  })).filter(e => e.driveId);
};

const buildVideoPortfolio = (csvText) => {
  const rows = parseSheetCsv(csvText);
  if (rows.length < 2) return [];
  const header = rows[0].map(c => c.trim().toLowerCase());
  return rows.slice(1).map(cells => {
    const entry = {};
    header.forEach((k, i) => entry[k] = (cells[i] || "").trim());
    return entry;
  }).filter(e => e.link || e.driveid || e.id).map((e, i) => [
    e.type || "Reel",
    e.title || `Video ${i + 1}`,
    e.gradient || DEFAULT_VIDEO_GRADIENTS[i % DEFAULT_VIDEO_GRADIENTS.length],
    extractDriveId(e.link || e.driveid || e.id),
  ]).filter(([, , , driveId]) => driveId);
};

/* ───────────────────────────────────────────────
   3. CUSTOM HOOKS & SUB-COMPONENTS
─────────────────────────────────────────────── */
const useGoogleSheet = (url, parser) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!url || url.includes("PASTE_")) return;
    let cancelled = false;
    fetch(url).then(res => res.text()).then(csv => {
      if (!cancelled) setData(parser(csv));
    }).catch(err => console.error("Sheet load failed:", err));
    return () => { cancelled = true; };
  }, [url, parser]);
  return data;
};

function OgreMark({ id }) {
  return (
    <span className="logo-mark" aria-hidden="true">
      <img src={newLogo} alt="OGRE" draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
    </span>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function MagneticButton({ children, onClick, className = "", ghost = false }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    setPosition(Math.sqrt(dx * dx + dy * dy) < 120 ? { x: dx * 0.3, y: dy * 0.3 } : { x: 0, y: 0 });
  };

  return (
    <button
      ref={ref} type="button" className={`btn ${ghost ? "ghost" : ""} ${className}`} onClick={onClick}
      onMouseMove={handleMouseMove} onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      style={{ transform: `translate(${position.x}px, ${position.y}px)`, transition: position.x === 0 ? "transform 0.4s ease" : "none", zIndex: position.x !== 0 ? 10 : 1 }}
    >
      {children}
    </button>
  );
}

function StatCounter({ target, label, prefix = "", suffix = "", delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          let startTime;
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / 1800, 1);
            setCount(Math.floor((progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)) * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }, delay);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, delay]);

  return (
    <div className="proof glass" ref={ref}>
      <svg className="proof-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,25 L15,10 L30,20 L45,5 L60,15 L75,2 L90,12 L100,25" />
      </svg>
      <strong>{prefix}{count}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

/* ───────────────────────────────────────────────
   4. MAIN COMPONENT
─────────────────────────────────────────────── */
export default function OgrePortfolio() {
  const [open, setOpen] = useState(null);
  const [booking, setBooking] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [intro, setIntro] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", link: "", brief: "" });
  const [formStatus, setFormStatus] = useState("idle");

  const imagePortfolio = useGoogleSheet(SHEET_CSV_URL, buildImagePortfolio);
  const videoPortfolio = useGoogleSheet(VIDEO_SHEET_CSV_URL, buildVideoPortfolio);

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });
  const ring = useRef({ x: -999, y: -999 });
  const raf = useRef(null);

  const handleTelegramSubmit = async (e) => {
    e.preventDefault();
    if (formStatus === "sending") return;
    setFormStatus("sending");
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to send message');
      setFormStatus("sent");
      setFormData({ name: "", email: "", link: "", brief: "" });
      setTimeout(() => setFormStatus("idle"), 4000);
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus("idle");
      alert('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      if (dotRef.current) { dotRef.current.style.left = `${mouse.current.x}px`; dotRef.current.style.top = `${mouse.current.y}px`; }
      if (ringRef.current) {
        ring.current.x = lerp(ring.current.x, mouse.current.x, 0.6);
        ring.current.y = lerp(ring.current.y, mouse.current.y, 0.6);
        ringRef.current.style.left = `${ring.current.x}px`; ringRef.current.style.top = `${ring.current.y}px`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      mouse.current = { x: event.clientX, y: event.clientY };
      const target = event.target;
      const onButton = target instanceof Element && Boolean(target.closest("button, .reel, .image-card, .viewer"));
      const onFocusBlock = target instanceof Element && Boolean(target.closest(".card,.process-card,.review-card,.about-main,.about-item,.action-cell,.footer-cta,.section-band,.console,.about-photo"));
      document.body.classList.toggle("chov", onButton);
      document.body.classList.toggle("cfocus", !onButton && onFocusBlock);
    };

    raf.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", () => document.body.classList.remove("chov", "cfocus"));
    window.addEventListener("mousedown", () => document.body.classList.add("cclick"));
    window.addEventListener("mouseup", () => document.body.classList.remove("cclick"));

    return () => { cancelAnimationFrame(raf.current); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); obs.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-down").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!intro) return;
    const timer = setTimeout(() => setIntro(false), 2600);
    return () => clearTimeout(timer);
  }, [intro]);

  useEffect(() => {
    document.body.style.overflow = (booking || intro || navOpen || activeVideo || activeImage) ? "hidden" : "";
    return () => document.body.style.overflow = "";
  }, [booking, intro, navOpen, activeVideo, activeImage]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navRect = document.querySelector(".nav-inner")?.getBoundingClientRect();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - (navRect ? navRect.top + navRect.height / 2 : 90), behavior: "smooth" });
    setNavOpen(false);
  };

  return (
    <main className="page">
      <svg style={{ width: 0, height: 0, position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="spark-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff8a1f" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff2a52" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff8a1f" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div id="cur-dot" ref={dotRef} />
      <div id="cur-ring" ref={ringRef} />

      {intro && (
        <div className="intro-screen" onClick={() => setIntro(false)}>
          <div className="intro-core"><OgreMark id="intro" /></div>
        </div>
      )}

      <div className="side-icons" aria-hidden="true">
        {programBadges.map(([label, src, zoom]) => (
          <span className="side-tool" key={label}>
            <div className="tool-icon"><img src={src} alt={label} style={{ transform: `scale(${zoom})` }} loading="lazy" /></div>
          </span>
        ))}
      </div>

      <div className="blob-layer" aria-hidden="true">
        <div className="blob" style={{ top: "-16%", left: "-12%", width: 780, height: 780, background: "radial-gradient(circle,rgba(255,138,31,.13) 0%,transparent 68%)", animation: "blob1 22s infinite" }} />
        <div className="blob" style={{ top: "40%", right: "-16%", width: 820, height: 820, background: "radial-gradient(circle,rgba(255,42,82,.1) 0%,transparent 68%)", animation: "blob2 28s infinite" }} />
        <div className="blob" style={{ top: "22%", left: "36%", width: 560, height: 560, background: "radial-gradient(circle,rgba(255,189,61,.075) 0%,transparent 68%)", animation: "blob3 18s infinite" }} />
        <div className="blob" style={{ bottom: "-12%", left: "18%", width: 640, height: 640, background: "radial-gradient(circle,rgba(255,95,28,.08) 0%,transparent 68%)", animation: "blob4 24s infinite" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 62% at 50% 50%,transparent 0%,rgba(26,26,25,.55) 100%)" }} />
      </div>

      <header className="nav">
        <div className="nav-inner glass">
          <button className={`hamburger${navOpen ? " open" : ""}`} onClick={() => setNavOpen(!navOpen)}><span /><span /><span /></button>
          <div className="brand"><OgreMark id="nav" /><span>OGRE</span></div>
          <nav className="nav-links">
            {["work", "about", "services", "process", "reviews", "faq"].map(id => <button key={id} onClick={() => go(id)}>{id}</button>)}
          </nav>
          <button className="btn" onClick={() => setBooking(true)}>Book Call</button>
        </div>
        {navOpen && (
          <div className="mobile-drawer glass">
            {["work", "about", "services", "process", "reviews", "faq"].map(id => <button key={id} onClick={() => go(id)}>{id}</button>)}
          </div>
        )}
      </header>

      <div className="shell">
        <section className="hero">
          <div style={{ zIndex: 10, position: 'relative' }}>
            <div className="availability glass"><span className="dot" />Jeric Lauresta / Video Editor</div>
            <h1 className="playhead-container">
              <span className="base-text" aria-hidden="true">Raw in. Roar out.</span>
              <span className="highlight-text">Raw in. <span className="roar-shine">Roar out.</span></span>
              <span className="playhead-line"></span>
            </h1>
            <p className="hero-lede">Short-form edits with bite: sharper hooks, tighter pacing, cleaner captions, and videos that feel built instead of decorated.</p>
            <div className="hero-proof">
              <StatCounter target={10} suffix="M+" label="Views Generated" delay={5800} />
              <StatCounter target={15} suffix="+" label="Brand Partners" delay={5800} />
              <StatCounter target={5} prefix="Top " suffix="%" label="Avg. Retention Rate" delay={5800} />
            </div>
            <div className="actions">
              <MagneticButton onClick={() => setBooking(true)}>Start a Project</MagneticButton>
              <MagneticButton ghost onClick={() => go("work")}>View Work</MagneticButton>
            </div>
          </div>
          <div className="console-wrap"><OgreAvatar faceSrc={facePng} eyeSrc={eyePng} eyeballSrc={eyeballPng} size="min(650px, 90vw)" /></div>
        </section>

        <div className="action-strip">
          {editActions.map(([label, detail]) => (
            <div className="action-cell glass" key={label}><strong>{label}</strong><span>{detail}</span></div>
          ))}
        </div>

        {videoPortfolio.length > 0 && (
          <section id="work" className="section">
            <span className="kicker">Portfolio</span>
            <div className="section-band">
              <div className="section-head"><h2>Cuts that bite.</h2><p>Real client work. Click any reel to watch.</p></div>
              <div className="portfolio-wrap">
                <div className="river">
                  {[...videoPortfolio, ...videoPortfolio].map(([, title, , id], i) => (
                    <article className="reel" key={`${title}-${i}`} onClick={() => setActiveVideo(id)}>
                      <img src={driveImage(id, 800)} alt={title} className="reel-img" loading="lazy" referrerPolicy="no-referrer" />
                      <div className="play">Play</div><div className="reel-meta"><strong>{title}</strong></div>
                    </article>
                  ))}
                </div>
                <div className="river reverse">
                  {[...videoPortfolio].reverse().concat([...videoPortfolio].reverse()).map(([, title, , id], i) => (
                    <article className="reel" key={`r-${title}-${i}`} onClick={() => setActiveVideo(id)}>
                      <img src={driveImage(id, 800)} alt={title} className="reel-img" loading="lazy" referrerPolicy="no-referrer" />
                      <div className="play">Play</div><div className="reel-meta"><strong>{title}</strong></div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {imagePortfolio.length > 0 && (
          <section id="image-work" className="section">
            <span className="kicker">Image Portfolio</span>
            <div className="section-band">
              <div className="section-head"><h2>Frames with teeth.</h2><p>Direct-response concepts by awareness stage.</p></div>
              <div className="portfolio-wrap">
                <div className="river">
                  {[...imagePortfolio, ...imagePortfolio].map((item, i) => (
                    <button className="image-card" key={`${item.title}-${i}`} onClick={() => setActiveImage(item)}>
                      <img src={driveImage(item.driveId, 800)} alt={item.title} loading="lazy" referrerPolicy="no-referrer" />
                      <span className="image-pill">View</span>
                      <div className="image-card-meta"><small>{item.stage}</small><strong>{item.title}</strong><span>Prompt + context</span></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="about" className="section">
          <span className="kicker reveal">About</span>
          <div className="about-grid">
            <article className="about-main glass reveal-left">
              <h3>The Engine Behind OGRE.</h3>
              <p>My name is Jeric Lauresta, and I built OGRE because the editing space was getting soft. Coming from a background in computer engineering, I treat video editing like system architecture. I don't just "edit" videos—I reverse-engineer platform algorithms to find out exactly what makes people watch. You hand over the raw footage. I give you back a weapon.</p>
              <div className="social-links">
                <a href="https://facebook.com/jeilauea" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a href="https://instagram.com/jeilauea" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://wa.me/09154330005" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <a href="https://www.linkedin.com/in/jeric-lauresta-15ab43315/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
            </article>
            <div className="about-photo glass reveal-down"><img src={profilePic} alt="Jeric Lauresta" className="profile-img" loading="lazy" /></div>
            <div className="about-list reveal-right">
              <div className="about-item"><strong>Style</strong><span>Clean cuts, sharp hooks, zero filler.</span></div>
              <div className="about-item"><strong>Focus</strong><span>Direct-response UGC, viral style replication.</span></div>
              <div className="about-item"><strong>Promise</strong><span>Ruthless precision, edits that move the needle.</span></div>
            </div>
          </div>
        </section>

        <section id="services" className="section reveal">
          <span className="kicker">Services</span>
          <div className="section-head"><h2>Edit weapons.</h2></div>
          <div className="grid3">
            {services.map(s => (
              <article className="card glass" key={s.title}>
                <h3>{s.title}</h3><p>{s.body}</p>
                <div className="tags">{s.tags.map(t => <span key={t}>{t}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="section reveal">
          <span className="kicker">Process</span>
          <div className="section-band">
            <div className="section-head"><h2>Cut. Polish. Ship.</h2></div>
            <div className="grid4">
              {process.map(([num, title, body]) => (
                <article className="process-card" key={num}><strong>{num}</strong><h3>{title}</h3><p>{body}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="section reveal">
          <span className="kicker">Client Reviews</span>
          <div className="section-head"><h2>They felt the bite.</h2></div>
          <div className="review-grid">
            {testimonials.map(([name, role, quote]) => (
              <article className="review-card glass" key={name}>
                <div className="stars">{[...Array(5)].map((_, i) => <Star key={i} />)}</div>
                <p className="quote">"{quote}"</p>
                <div className="who"><span className="avatar" /><div><strong>{name}</strong><span>{role}</span></div></div>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="section faq reveal">
          <span className="kicker">FAQ</span><h2>Ask before cut.</h2>
          <div style={{ marginTop: 26 }}>
            {faqs.map(([q, a], i) => (
              <div className="faq-row" key={q}>
                <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}><span>{q}</span><span>{open === i ? "-" : "+"}</span></button>
                <div className={`faq-a${open === i ? " open" : ""}`}><div className="faq-a-inner"><p>{a}</p></div></div>
              </div>
            ))}
          </div>
        </section>

        <section id="cta" className="section reveal">
          <div className="footer-cta glass">
            <div><span className="kicker">Let's get started</span><h2>Ready to roar?</h2><p>Stop settling for average edits.</p></div>
            <button className="btn" onClick={() => setBooking(true)}>Book a Free Discovery Call</button>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-inner">
            <div className="brand"><OgreMark id="footer" /><span>OGRE</span></div>
            <div className="footer-links">
              {["work", "about", "services", "process", "reviews", "faq"].map(id => <button key={id} onClick={() => go(id)}>{id}</button>)}
            </div>
            <div className="footer-note">Jeric Lauresta / Video Editor / 2026</div>
          </div>
        </footer>
      </div>

      {booking && (
        <div className="booking-layer" onClick={() => setBooking(false)}>
          <div className="booking-modal glass" onClick={e => e.stopPropagation()}>
            <div className="booking-top">
              <div><span className="kicker">Book OGRE</span><h3>Feed the brief.</h3></div>
              <button className="modal-close" onClick={() => setBooking(false)}>x</button>
            </div>
            <form className="booking-form" onSubmit={handleTelegramSubmit}>
              <input required placeholder="Name / Brand" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required className="wide-field" placeholder="Footage link" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
              <textarea required placeholder="What are we cutting?" value={formData.brief} onChange={e => setFormData({...formData, brief: e.target.value})} />
              <div className="booking-actions">
                <button className="btn" type="submit" disabled={formStatus === "sending"}>
                  {formStatus === "idle" ? "Send Brief" : formStatus === "sending" ? "Sending…" : "Brief Sent ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeImage && (
        <div className="booking-layer" onClick={() => setActiveImage(null)}>
          <div className="image-modal glass" onClick={e => e.stopPropagation()}>
            <div className="image-modal-art">
              <div className="image-modal-bg" style={{ backgroundImage: `url(${driveImage(activeImage.driveId, 400)})` }} />
              <img src={driveImage(activeImage.driveId, 1600)} alt={activeImage.title} referrerPolicy="no-referrer" />
            </div>
            <div className="image-modal-copy">
              <div className="image-modal-top">
                <div><span className="kicker">{activeImage.stage}</span><h3>{activeImage.title}</h3></div>
                <button className="modal-close" onClick={() => setActiveImage(null)}>x</button>
              </div>
              {activeImage.prompt && <div className="image-detail-block"><strong>Prompt</strong><div className="prompt-box">{activeImage.prompt}</div></div>}
              {activeImage.context && <div className="image-detail-block"><strong>Performance Context</strong><p>{activeImage.context}</p></div>}
            </div>
          </div>
        </div>
      )}

      {activeVideo && (
        <div className="booking-layer" onClick={() => setActiveVideo(null)}>
          <div className="video-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close video-close" onClick={() => setActiveVideo(null)}>x</button>
            <iframe src={`https://drive.google.com/file/d/${activeVideo}/preview`} width="100%" height="100%" allow="autoplay" style={{ border: 'none', borderRadius: '16px' }} title="Video" />
          </div>
        </div>
      )}
    </main>
  );
}