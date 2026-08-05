/* ───────────────────────────────────────────────
   Static site content.
   Everything here is safe to edit without touching component code.
─────────────────────────────────────────────── */

export const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDMjFftiGf4lMHQOXG7Z2AqAZz9oxEtCqsov2gh3KocXHBX40oJ3PSmSJJhtyYbAeI4PwOhe8d1_g7/pub?gid=315975212&single=true&output=csv";

export const VIDEO_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDMjFftiGf4lMHQOXG7Z2AqAZz9oxEtCqsov2gh3KocXHBX40oJ3PSmSJJhtyYbAeI4PwOhe8d1_g7/pub?gid=1855750606&single=true&output=csv";

export const CONTACT_EMAIL = "dexterchoi462@gmail.com";

export const stats = [
  { target: 10, suffix: "M+", label: "Views generated" },
  { target: 15, suffix: "+", label: "Brand partners" },
  { target: 48, prefix: "<", suffix: "h", label: "Avg. turnaround" },
];

/* Named clients pulled from real testimonials — social proof above the fold. */
export const clients = [
  "Paw Guardian",
  "Vizoya Rewards",
  "Backyard SmokeMaster",
  "Puppy Harbor",
  "Adirena",
];

export const services = [
  {
    n: "01",
    title: "UGC that bites",
    body: "Raw creator footage shaped into direct-response edits with stronger hooks, tighter pacing, captions, and product clarity.",
    tags: ["Hooks", "Captions", "Product proof"],
  },
  {
    n: "02",
    title: "Shorts with teeth",
    body: "YouTube Shorts and TikTok cuts built around rhythm, retention, and a first second that does not waste attention.",
    tags: ["Retention", "Pacing", "Sound"],
  },
  {
    n: "03",
    title: "Thumbnail pressure",
    body: "Frames, titles, and visual hierarchy designed to make the click feel obvious before the viewer starts thinking.",
    tags: ["CTR", "Title frames", "Still exports"],
  },
];

/* Software proficiency. In v1 these lived in a floating side rail that was
   display:none below 1540px — i.e. invisible to most visitors. */
export const toolkit = [
  ["Premiere Pro", "pr"],
  ["After Effects", "ae"],
  ["DaVinci Resolve", "resolve"],
  ["Photoshop", "ps"],
  ["CapCut", "capcut"],
  ["Illustrator", "ai"],
  ["Figma", "fig"],
  ["Higgsfield", "hig"],
];

export const process = [
  ["01", "Brief", "You send footage, references, audience notes, and what the video needs to make people do."],
  ["02", "Cut", "I build the hook, pacing, captions, sound, and visual emphasis around the strongest moments."],
  ["03", "Sharpen", "We review the first pass and tighten the edit instead of wandering through vague revisions."],
  ["04", "Ship", "Final files are exported for the platform, format, and campaign you are actually using."],
];

/* ⚠️ PLACEHOLDER PRICING — set your real numbers before launch.
   Listing a starting price filters out tire-kickers; the FAQ already
   references retainers and a 5-video minimum, so these mirror that. */
export const pricing = [
  {
    name: "Batch",
    price: "$450",
    unit: "/ 5 videos",
    blurb: "For creators testing short-form at volume.",
    features: ["5 edited shorts", "Hook + caption pass", "2 revision rounds", "48h turnaround"],
    cta: "Start a batch",
  },
  {
    name: "Retainer",
    price: "$1,800",
    unit: "/ month",
    blurb: "For brands scaling organic and paid social.",
    features: ["20 edited shorts", "Thumbnail frames included", "Priority 24h turnaround", "Direct Telegram line", "Monthly performance review"],
    cta: "Book a call",
    featured: true,
  },
  {
    name: "Custom",
    price: "Let's talk",
    unit: "",
    blurb: "Long-form, launches, or multi-brand volume.",
    features: ["Scoped to your campaign", "Dedicated turnaround SLA", "Team onboarding"],
    cta: "Get a quote",
  },
];

export const testimonials = [
  {
    name: "Zelie Pascal",
    role: "Founder @ Paw Guardian",
    metric: "2× CTR",
    quote:
      "Jeric took our raw UGC clips for the Denta Clean campaign and turned them into absolute weapons. The hooks were so sharp our CTR doubled on day one. He knows exactly how to pace pet ads to make people stop scrolling and buy.",
  },
  {
    name: "Vizoya Rewards",
    role: "YouTube Creator · 2.5M subs",
    metric: "2.5M subs",
    quote:
      "With 2.5 million subscribers, we can't afford dead air. OGRE handles our UGC ad cuts across multiple product lines, and the pacing is always ruthlessly efficient. He understands exactly how to keep the algorithm fed and retention graphs flat.",
  },
  {
    name: "Kenyatta Robinson",
    role: "Founder @ Backyard SmokeMaster BBQ",
    metric: "Record retention",
    quote:
      "I do long-form BBQ content, and keeping people engaged for 15 minutes is tough. Jeric cuts the fat. He knows exactly when to let the B-roll sizzle and when to push the tempo. My audience retention has never been higher since he took over the timeline.",
  },
];

export const faqs = [
  ["What is your pricing and engagement model?", "I work primarily on monthly retainers for brands scaling their organic reach, or batch-projects (minimum 5 videos) for creators. Custom quotes depend on footage complexity and volume."],
  ["What type of videos do you edit?", "UGC, Reels, TikToks, YouTube Shorts, talking-head clips, product demos, and thumbnail frames."],
  ["What's your turnaround time?", "Most short-form edits are ready in 24 to 48 hours, depending on footage and scope."],
  ["How do I send footage?", "Google Drive, Dropbox, or WeTransfer works. Keep the files organized and I can start faster."],
  ["How many revisions are included?", "Two focused revision rounds are included so the edit gets sharper without dragging."],
];

export const socials = [
  ["Facebook", "https://facebook.com/jeilauea"],
  ["Instagram", "https://instagram.com/jeilauea"],
  ["WhatsApp", "https://wa.me/09154330005"],
  ["LinkedIn", "https://www.linkedin.com/in/jeric-lauresta-15ab43315/"],
];

export const navSections = [
  ["work", "Work"],
  ["services", "Services"],
  ["process", "Process"],
  ["pricing", "Pricing"],
  ["about", "About"],
  ["faq", "FAQ"],
];
