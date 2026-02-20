/**
 * Sarvam API Translation Proxy
 * 
 * Proxies translation requests to Sarvam AI API.
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

  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    // Return original texts if API key is not configured
    return res.status(200).json({ translated: texts });
  }

  try {
    const translated = await Promise.all(
      texts.map(async (text) => {
        if (!text || !text.trim() || targetLang === 'en-IN') {
          return text;
        }
        const response = await fetch('https://api.sarvam.ai/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': apiKey,
          },
          body: JSON.stringify({
            input: text,
            source_language_code: 'en-IN',
            target_language_code: targetLang,
            speaker_gender: 'Male',
            mode: 'formal',
            model: 'mayura:v1',
            enable_preprocessing: false,
          }),
        });

        if (!response.ok) {
          return text; // Fall back to original text on error
        }

        const data = await response.json();
        return data.translated_text || text;
      })
    );

    return res.status(200).json({ translated });
  } catch (err) {
    console.error('Sarvam translation error:', err);
    // Return original texts on error - graceful degradation
    return res.status(200).json({ translated: texts });
  }
}
