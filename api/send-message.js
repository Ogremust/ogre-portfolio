export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, link, brief } = req.body;

    // 2. Access the environment variables safely on the server side
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({ error: 'Server configuration error: Missing tokens.' });
    }

    // 3. Format the text payload
    const text = `📬 New Brief from OGRE!\n\n👤 Name: ${name}\n📧 Email: ${email}\n🔗 Footage Link: ${link}\n🎬 Brief: ${brief}`;

    // 4. Send the request from this backend environment to Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send message via Telegram');
    }

    return res.status(200).json({ success: true, message: 'Notification sent successfully!' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}