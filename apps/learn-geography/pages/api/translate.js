/**
 * Google Translate API Proxy
 * 
 * Proxies translation requests to Google Cloud Translation API.
 * Keeps the API key server-side for security.
 * 
 * POST /api/translate
 * Body: { texts: string[], targetLang: string }
 * Response: { translated: string[] }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { texts, targetLang } = req.body;

  if (!Array.isArray(texts) || !targetLang) {
    return res.status(400).json({ error: 'texts (array) and targetLang are required.' });
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    console.warn('GOOGLE_TRANSLATE_API_KEY not set - returning original texts');
    return res.status(200).json({ translated: texts });
  }

  try {
    const translated = await Promise.all(
      texts.map(async (text) => {
        if (!text || !text.trim() || targetLang === 'en') {
          return text;
        }

        const response = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              q: text,
              target: targetLang,
              format: 'text',
            }),
          }
        );

        if (!response.ok) {
          console.error(`Google Translate API error: ${response.status}`);
          return text; // Fall back to original text on error
        }

        const data = await response.json();
        return data.data.translations[0].translatedText || text;
      })
    );

    return res.status(200).json({ translated });
  } catch (err) {
    console.error('Google Translate error:', err);
    // Return original texts on error - graceful degradation
    return res.status(200).json({ translated: texts });
  }
}
