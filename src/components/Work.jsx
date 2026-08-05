import { useMemo, useState } from "react";
import { CardSkeleton, Modal, Reveal, SectionHead } from "./ui";
import { driveImage, drivePreview } from "../lib/sheets";
import { useMediaQuery } from "../lib/hooks";

const PAGE = 9;

/* Phones get a plain swipeable row instead of the auto-scrolling marquee:
   nothing moves on its own, and the layout toggle is hidden. */
const MOBILE_QUERY = "(max-width: 900px)";

function PlayGlyph() {
  return (
    <span className="play-badge" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M8 5.5v13l11-6.5z" />
      </svg>
    </span>
  );
}

/** Empty/failed state — never leave a portfolio silently blank. */
function DataNotice({ status, onRetry }) {
  if (status === "error")
    return (
      <div className="notice">
        <strong>The reel library didn't load.</strong>
        <p>Google Sheets may be rate-limiting. The work is still there — try again in a moment.</p>
        <button className="btn btn--ghost btn--sm" onClick={onRetry}>
          <span className="btn-label">Reload</span>
        </button>
      </div>
    );
  return (
    <div className="notice">
      <strong>No pieces published yet.</strong>
      <p>Add rows to the portfolio sheet and they appear here automatically.</p>
    </div>
  );
}

/** One reel tile, shared by the carousel, the swipe row and the grid. */
function ReelCard({ item, onOpen }) {
  const sub = item.client || item.platform;
  return (
    <button className="reel-card" onClick={() => onOpen(item)}>
      <span className="reel-frame">
        <img
          src={driveImage(item.id, 640)}
          alt={item.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <span className="reel-scrim" aria-hidden="true" />
        <PlayGlyph />
        {/* Clip label, bottom-left over the scrim where contrast is guaranteed.
            Carries the piece's own name — the category is on the filter chips. */}
        <span className="reel-tag">
          <span className="reel-tag-bar" aria-hidden="true" />
          <span className="reel-tag-name">{item.title}</span>
        </span>
        {item.metric && <span className="reel-metric">{item.metric}</span>}
      </span>
      {sub && (
        <span className="reel-meta">
          <span>{sub}</span>
        </span>
      )}
    </button>
  );
}

export function VideoWork({ items, status }) {
  const [filter, setFilter] = useState("All");
  const [shown, setShown] = useState(PAGE);
  const [active, setActive] = useState(null);
  const [view, setView] = useState("carousel");
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const mode = isMobile ? "swipe" : view;

  const categories = useMemo(
    () => ["All", ...new Set(items.map((i) => i.category).filter(Boolean))],
    [items]
  );
  const filtered = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.category === filter)),
    [items, filter]
  );
  const visible = filtered.slice(0, shown);

  const pick = (next) => {
    setFilter(next);
    setShown(PAGE);
  };

  /* The marquee needs enough tiles to fill two seamless copies. */
  const riverItems = useMemo(() => {
    if (!filtered.length) return [];
    const out = [...filtered];
    while (out.length < 8) out.push(...filtered);
    return out;
  }, [filtered]);

  return (
    <section className="section" id="work">
      <SectionHead
        kicker="Selected work"
        title="Cuts that bite."
        lede="Real client edits across UGC, Shorts and TikTok. Tap any piece to watch it full-size."
      />

      <Reveal className="work-controls" variant="lift">
        {categories.length > 2 && (
          <div className="filters" role="tablist" aria-label="Filter work by category">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={filter === c}
                className={`filter${filter === c ? " is-active" : ""}`}
                onClick={() => pick(c)}
              >
                {c}
                {c !== "All" && (
                  <span className="filter-count">{items.filter((i) => i.category === c).length}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {!isMobile && (
          <div className="view-toggle" role="group" aria-label="Layout">
            {[
              ["carousel", "Reel"],
              ["grid", "Grid"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={`view-btn${view === id ? " is-active" : ""}`}
                aria-pressed={view === id}
                onClick={() => setView(id)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </Reveal>

      {status === "loading" && (
        <div className="reel-grid">
          <CardSkeleton count={6} className="skeleton--reel" />
        </div>
      )}

      {status === "ready" && mode === "swipe" && (
        <div className="swipe-row" role="list" aria-label="Work">
          {filtered.map((item, i) => (
            <div role="listitem" key={`${item.id}-${i}`}>
              <ReelCard item={item} onOpen={setActive} />
            </div>
          ))}
        </div>
      )}

      {status === "ready" && mode === "carousel" && (
        <div className="reel-river" aria-label="Work carousel">
          <div className="reel-river-track">
            {[0, 1].map((copy) => (
              <div className="reel-river-group" key={copy} aria-hidden={copy === 1}>
                {riverItems.map((item, i) => (
                  <ReelCard key={`${copy}-${item.id}-${i}`} item={item} onOpen={setActive} />
                ))}
              </div>
            ))}
          </div>
          <p className="river-hint">Hover to pause · click to watch</p>
        </div>
      )}

      {status === "ready" && mode === "grid" && (
        <div className="reel-grid">
          {visible.map((item, i) => (
            <Reveal key={`${item.id}-${i}`} delay={(i % 3) * 70} variant="flare">
              <ReelCard item={item} onOpen={setActive} />
            </Reveal>
          ))}
        </div>
      )}

      {(status === "error" || status === "empty") && (
        <DataNotice status={status} onRetry={() => window.location.reload()} />
      )}

      {status === "ready" && mode === "grid" && shown < filtered.length && (
        <Reveal className="more-wrap" variant="lift">
          <button className="btn btn--ghost" onClick={() => setShown((s) => s + PAGE)}>
            <span className="btn-label">Load more ({filtered.length - shown} left)</span>
          </button>
        </Reveal>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} className="modal--video" label={active?.title}>
        {active && (
          <div className="video-frame">
            <iframe src={drivePreview(active.id)} allow="autoplay" title={active.title} />
          </div>
        )}
      </Modal>
    </section>
  );
}

/** One static-creative tile, shared by the carousel and the grid. */
function FrameCard({ item, onOpen }) {
  return (
    <button className="frame-card" onClick={() => onOpen(item)}>
      <span className="frame-img">
        <img
          src={driveImage(item.id, 640)}
          alt={item.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <span className="frame-view">View breakdown</span>
      </span>
      <span className="frame-meta">
        <span className="frame-stage">{item.stage}</span>
        <strong>{item.title}</strong>
      </span>
    </button>
  );
}

export function ImageWork({ items, status }) {
  const [active, setActive] = useState(null);
  const [view, setView] = useState("carousel");
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const mode = isMobile ? "swipe" : view;

  const riverItems = useMemo(() => {
    if (!items.length) return [];
    const out = [...items];
    while (out.length < 8) out.push(...items);
    return out;
  }, [items]);

  if (status === "error" || status === "empty") return null;

  return (
    <section className="section section--alt" id="frames">
      <SectionHead
        kicker="Static creative"
        title="Frames with teeth."
        lede="Direct-response concepts mapped to awareness stage — each one opens with the prompt and the reasoning behind it."
      />

      {!isMobile && (
      <Reveal className="work-controls work-controls--end" variant="lift">
        <div className="view-toggle" role="group" aria-label="Layout">
          {[
            ["carousel", "Reel"],
            ["grid", "Grid"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={`view-btn${view === id ? " is-active" : ""}`}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </Reveal>
      )}

      {status === "loading" && (
        <div className="frame-grid">
          <CardSkeleton count={4} className="skeleton--frame" />
        </div>
      )}

      {status === "ready" && mode === "swipe" && (
        <div className="swipe-row swipe-row--frames" role="list" aria-label="Static creative">
          {items.map((item, i) => (
            <div role="listitem" key={`${item.id}-${i}`}>
              <FrameCard item={item} onOpen={setActive} />
            </div>
          ))}
        </div>
      )}

      {status === "ready" && mode === "carousel" && (
        <div className="reel-river frame-river" aria-label="Static creative carousel">
          <div className="reel-river-track">
            {[0, 1].map((copy) => (
              <div className="reel-river-group" key={copy} aria-hidden={copy === 1}>
                {riverItems.map((item, i) => (
                  <FrameCard key={`${copy}-${item.id}-${i}`} item={item} onOpen={setActive} />
                ))}
              </div>
            ))}
          </div>
          <p className="river-hint">Hover to pause · click for the breakdown</p>
        </div>
      )}

      {status === "ready" && mode === "grid" && (
        <div className="frame-grid">
          {items.map((item, i) => (
            <Reveal key={`${item.id}-${i}`} delay={(i % 4) * 70} variant="flare">
              <FrameCard item={item} onOpen={setActive} />
            </Reveal>
          ))}
        </div>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} className="modal--frame" label={active?.title}>
        {active && (
          <>
            <div className="frame-modal-art">
              {/* Low-res blurred fill so the portrait artwork doesn't sit in a
                  bare black letterbox once the modal stacks. */}
              <span
                className="frame-modal-bg"
                aria-hidden="true"
                style={{ backgroundImage: `url(${driveImage(active.id, 200)})` }}
              />
              <img
                src={driveImage(active.id, 1400)}
                alt={active.title}
                referrerPolicy="no-referrer"
                decoding="async"
              />
            </div>
            <div className="frame-modal-copy">
              <span className="kicker">{active.stage}</span>
              <h3>{active.title}</h3>
              {active.prompt && (
                <div className="detail-block">
                  <strong>Prompt</strong>
                  <div className="prompt-box">{active.prompt}</div>
                </div>
              )}
              {active.context && (
                <div className="detail-block">
                  <strong>Why it works</strong>
                  <p>{active.context}</p>
                </div>
              )}
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
