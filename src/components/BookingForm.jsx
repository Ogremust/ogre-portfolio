import { useState } from "react";

const EMPTY = { name: "", email: "", link: "", brief: "" };

export default function BookingForm({ onDone, plan }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");

    try {
      /* Prefix the brief with the chosen plan so the Telegram message says
         which tier the enquiry came from. */
      const payload = plan ? { ...form, brief: `[${plan} plan] ${form.brief}` } : form;
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || "Failed to send message");

      setStatus("sent");
      setForm(EMPTY);
      setTimeout(() => {
        setStatus("idle");
        onDone?.();
      }, 2200);
    } catch (err) {
      console.error("Form submission error:", err);
      setStatus("idle");
      setError("Something went wrong. Email me directly and I'll pick it up.");
    }
  };

  return (
    <form className="booking-form" onSubmit={submit}>
      <label className="field">
        <span>Name / brand</span>
        <input required value={form.name} onChange={set("name")} placeholder="Paw Guardian" autoComplete="organization" />
      </label>

      <label className="field">
        <span>Email</span>
        <input required type="email" value={form.email} onChange={set("email")} placeholder="you@brand.com" autoComplete="email" />
      </label>

      <label className="field field--wide">
        <span>Footage link</span>
        <input required value={form.link} onChange={set("link")} placeholder="Drive / Dropbox / WeTransfer" inputMode="url" />
      </label>

      <label className="field field--wide">
        <span>What are we cutting?</span>
        <textarea
          required
          rows={4}
          value={form.brief}
          onChange={set("brief")}
          placeholder="Platform, audience, how many videos, and what the edit needs to make people do."
        />
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button className="btn btn--solid booking-submit" type="submit" disabled={status === "sending"}>
        <span className="btn-label">
          {status === "idle" ? "Send the brief" : status === "sending" ? "Sending…" : "Brief sent ✓"}
        </span>
      </button>

      <p className="form-note">Usually answered same day. No pitch decks, no runaround.</p>
    </form>
  );
}
