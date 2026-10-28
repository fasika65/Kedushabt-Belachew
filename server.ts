import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Daily Devotional & Spiritual Reflection API
app.post('/api/devotional/reflection', async (req, res) => {
  try {
    const {
      saintOrFeast,
      ethiopianDateStr,
      gregorianDateStr,
      gospelBook,
      gospelKeyVerse,
      misbakAmharic,
      fastingPeriod,
    } = req.body;

    const ai = getAiClient();

    if (!ai) {
      // Graceful response when API key is not configured
      return res.json({
        success: false,
        isFallback: true,
        message: 'GEMINI_API_KEY is not configured. Using pre-compiled patristic reflections.',
      });
    }

    const prompt = `You are a reverent scholar of the Ethiopian Orthodox Tewahedo Church (የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ሊቅ).
Generate a deep, uplifting, and authentic spiritual reflection (መንፈሳዊ ተመስጦና ትንታኔ) for today's liturgical celebration.

Context:
- Liturgical Day / Saint / Feast: ${saintOrFeast || 'Daily Commemoration'}
- Ethiopian Date: ${ethiopianDateStr || 'Today'}
- Gregorian Date: ${gregorianDateStr || 'Today'}
- Gospel Passage & Key Verse: ${gospelBook || 'Holy Gospel'} - ${gospelKeyVerse || ''}
- Misbak (Psalms): ${misbakAmharic || ''}
- Fasting Status: ${fastingPeriod || 'Regular day / Wednesday or Friday fast'}

Please provide the response in high-quality Amharic (and a brief English summary) with the following structure:
1. **የዕለቱ ዋና መንፈሳዊ ጭብጥ (Spiritual Theme)**: 1-2 powerful sentences.
2. **የወንጌሉና የስንክሳሩ ትንታኔ (Theological & Patristic Contemplation)**: 2 short, deep paragraphs explaining how the day's Gospel and Saint's life apply to daily Christian living, repentance, prayer, and love.
3. **የአበው ምክር (Wisdom of the Church Fathers)**: A short quote or teaching reminiscent of St. Yared, St. John Chrysostom, St. Ephrem the Syrian, or Abba Giorgis of Ghasicha.
4. **የዕለቱ ጸሎትና ውሳኔ (Daily Prayer Resolution)**: A 2-sentence prayer of commitment and thanksgiving.

Keep the tone deeply spiritual, warm, theological, respectful of Tewahedo tradition, and inspiring.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    const reflectionText = response.text || '';

    return res.json({
      success: true,
      reflection: reflectionText,
      modelUsed: 'gemini-3.7-flash',
    });
  } catch (error: any) {
    console.error('Error generating devotional reflection:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate devotional reflection',
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ethiopian Orthodox Calendar server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
