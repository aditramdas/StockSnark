import { StockQuote, NewsItem } from './stockApi';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface GeminiSatireResponse {
  reason: string;
  tweet: string;
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateOpenAISatire(
  quote: StockQuote,
  news: NewsItem[]
): Promise<GeminiSatireResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not set');
  }

  // Prepare news context
  const newsContext = news
    .slice(0, 3)
    .map(item => `Headline: ${item.headline}\nSummary: ${item.summary}`)
    .join('\n\n');

  const prompt = `You are a sarcastic financial commentator who loves to mock how analysts and media always find explanations for stock movements after they happen.
  Given the following stock data and recent news, generate a satirical reason for the stock's movement and a mock tweet.
  The tone should be humorous and sarcastic, mocking how analysts always find a way to explain any stock movement.
  
  Stock: ${quote.symbol}
  Price: $${quote.price}
  Change: ${quote.changePercent}%
  Previous Close: $${quote.previousClose}
  
  Recent News:
  ${newsContext}
  
  Generate a response in the following JSON format:
  {
    "reason": "Your satirical reason for the stock movement",
    "tweet": "A mock tweet about the situation"
  }
  
  Important guidelines:
  1. If there's earnings news and the stock moved opposite to what the earnings would suggest, mock how analysts always find a way to explain it (e.g., "Analysts expected 8% growth but only got 4%, so naturally the stock tanked")
  2. If there's no clear news, make up an absurd post-hoc explanation that sounds like something a real analyst would say
  3. The explanation should sound like something a real analyst would say, but be obviously ridiculous
  4. If the stock went up, mock how analysts always find a way to spin it as a positive, even if the news is bad
  5. If the stock went down, mock how analysts always find a way to spin it as a buying opportunity, even if the news is good
  6. Use specific numbers and percentages to make the satire more realistic and funny

  7. The reason and tweet should be a single sentence, no more than 100 characters
  8. the reason should be logical, and not completely absurd, or completely funny. it should be a mix of the two.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });
    // The SDK returns response.text
    let content = response.text;
    // Remove Markdown code block markers if present
    content = content.replace(/^```json\s*|^```\s*|```$/gim, '').trim();
    try {
      return JSON.parse(content) as GeminiSatireResponse;
    } catch (error) {
      console.error('Failed to parse Gemini response:', error, content);
      throw error;
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
} 