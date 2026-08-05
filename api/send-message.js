/* Telegram notification for booking briefs.
 *
 * Requires two environment variables on the host (Vercel → Settings →
 * Environment Variables):
 *   TELEGRAM_BOT_TOKEN  — from @BotFather
 *   TELEGRAM_CHAT_ID    — your own chat id, from @userinfobot
 */

const TELEGRAM_MAX = 4096;

/** Trim + cap a field so one pasted essay can't blow the 4096-char limit. */
const clean = (value, max) => {
  const s = typeof value === "string" ? value.trim() : "";
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    const name = clean(body.name, 120);
    const email = clean(body.email, 160);
    const link = clean(body.link, 500);
    const brief = clean(body.brief, 2500);

    // Which pricing tier the enquiry came from, if any.
    const plan = clean(body.plan, 40);
    const planPrice = clean(body.planPrice, 40);
    const planUnit = clean(body.planUnit, 40);

    if (!name || !email || !link || !brief) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("send-message: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set");
      return res.status(500).json({ error: "Server configuration error." });
    }

    // Headline names the tier so the plan is obvious from the notification preview.
    const heading = plan ? `📬 NEW ${plan.toUpperCase()} ENQUIRY` : "📬 NEW BRIEF — OGRE";

    const planLine = plan
      ? `📦 Plan: ${plan}${planPrice ? ` — ${planPrice}${planUnit ? ` ${planUnit}` : ""}` : ""}`
      : "📦 Plan: Not specified (general enquiry)";

    const stamp = new Date().toISOString().replace("T", " ").slice(0, 16);

    let text = [
      heading,
      "",
      planLine,
      `👤 Name: ${name}`,
      `📧 Email: ${email}`,
      `🔗 Footage: ${link}`,
      "",
      "🎬 Brief:",
      brief,
      "",
      `🕘 ${stamp} UTC`,
    ].join("\n");

    if (text.length > TELEGRAM_MAX) text = `${text.slice(0, TELEGRAM_MAX - 1)}…`;

    // No parse_mode: this is plain text. HTML mode makes Telegram reject any
    // brief containing <, > or & (e.g. "budget <$500") with a 400.
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "<unreadable>");
      console.error("Telegram sendMessage failed:", response.status, detail);
      throw new Error("Failed to send message via Telegram");
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("send-message handler error:", error);
    return res.status(500).json({ error: "Failed to send message." });
  }
}
