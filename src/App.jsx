import { useCallback, useEffect, useState } from "react";
import "./App.css";

import Nav, { OgreMark } from "./components/Nav";
import Hero from "./components/Hero";
import Cursor from "./components/Cursor";
import Sparks from "./components/Sparks";
import BookingForm from "./components/BookingForm";
import { ImageWork, VideoWork } from "./components/Work";
import { About, ClosingCta, Faq, Footer, Pricing, Process, Reviews, Services } from "./components/Sections";
import { Modal } from "./components/ui";

import { SHEET_CSV_URL, VIDEO_SHEET_CSV_URL } from "./data";
import { buildImagePortfolio, buildVideoPortfolio, useGoogleSheet } from "./lib/sheets";

/* Intro plays once per browser session, not on every navigation. */
const INTRO_KEY = "ogre:intro-seen";

export default function App() {
  const [intro, setIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return sessionStorage.getItem(INTRO_KEY) !== "1";
  });
  /* Holds the tier the visitor clicked, so the booking modal can name the plan
     they picked instead of showing an identical generic form for all three. */
  const [booking, setBooking] = useState(null);

  const videos = useGoogleSheet(VIDEO_SHEET_CSV_URL, buildVideoPortfolio);
  const images = useGoogleSheet(SHEET_CSV_URL, buildImagePortfolio);

  const dismissIntro = useCallback(() => {
    setIntro(false);
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode — intro simply replays */
    }
  }, []);

  useEffect(() => {
    if (!intro) return;
    const t = setTimeout(dismissIntro, 1500);
    return () => clearTimeout(t);
  }, [intro, dismissIntro]);

  useEffect(() => {
    document.body.classList.toggle("is-intro", intro);
    return () => document.body.classList.remove("is-intro");
  }, [intro]);

  const go = useCallback((id) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 92;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }, []);

  /* Called bare from nav/hero/CTA, or with a pricing tier from the price cards. */
  const openBooking = useCallback((tier) => setBooking(tier?.name ? tier : { name: "" }), []);

  return (
    <>
      <div className="ambient" aria-hidden="true">
        <span className="ambient-glow ambient-glow--a" />
        <span className="ambient-glow ambient-glow--b" />
        <Sparks />
        <span className="ambient-grain" />
      </div>

      <Cursor />

      {intro && (
        <div className="intro" onClick={dismissIntro}>
          <OgreMark className="intro-mark" />
        </div>
      )}

      <a className="skip-link" href="#work">
        Skip to work
      </a>

      <Nav onBook={openBooking} onGo={go} />

      <main className="page">
        <Hero onBook={openBooking} onGo={go} />
        <VideoWork items={videos.data} status={videos.status} />
        <ImageWork items={images.data} status={images.status} />
        <Services />
        <Process />
        <Pricing onBook={openBooking} />
        <Reviews />
        <About />
        <Faq />
        <ClosingCta onBook={openBooking} />
      </main>

      <Footer onGo={go} />

      <Modal
        open={!!booking}
        onClose={() => setBooking(null)}
        className="modal--booking"
        label={booking?.name ? `Book the ${booking.name} plan` : "Book OGRE"}
      >
        <div className="booking-head">
          <span className="kicker">{booking?.name ? `${booking.name} plan` : "Book OGRE"}</span>
          <h3>{booking?.name ? `Lock in ${booking.name}.` : "Feed the brief."}</h3>
          {booking?.price && (
            <p className="booking-sub">
              <strong>{booking.price}</strong>
              {booking.unit} — {booking.blurb}
            </p>
          )}
        </div>
        <BookingForm tier={booking?.name ? booking : null} onDone={() => setBooking(null)} />
      </Modal>
    </>
  );
}
