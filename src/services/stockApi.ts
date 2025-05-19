import type { MockStock } from '@/data/mockStocks';
import { generateOpenAISatire } from './gemini';

// Read API keys from environment variables (Vite specific)
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

// TODO: Replace with your actual API keys and move to environment variables

// const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query'; // Keep for searchStocks
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export interface StockQuote {
  symbol: string;
  price: number; // Finnhub: c (Current price)
  change: number; // Finnhub: d (Change)
  changePercent: number; // Finnhub: dp (Percent change)
  name?: string; 
  open?: number; // Finnhub: o (Open price of the day)
  high?: number; // Finnhub: h (High price of the day)
  low?: number; // Finnhub: l (Low price of the day)
  previousClose?: number; // Finnhub: pc (Previous close price)
}

// Interface for Finnhub News item
export interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

// Interface for combined stock details including generated satire
export interface StockDetails extends StockQuote {
  id: string; // Add ID, can be same as symbol
  sarcasticReason: string;
  newsHeadline: string; // Use the most relevant fetched headline or a generated one
  mockTweet: string;
  latestNews: NewsItem[]; // Store fetched news
  chartData?: number[]; // Make chartData optional for now, fetch later if needed
}

// --- Alpha Vantage Functions ---

// Keep searchStocks using Alpha Vantage for now, could be replaced later
export const searchStocks = async (query: string): Promise<StockQuote[]> => {
  console.log('[searchStocks] Starting search with query:', query);
  console.log('[searchStocks] API Key present:', !!ALPHA_VANTAGE_API_KEY);
  
  if (!query || !ALPHA_VANTAGE_API_KEY) {
    console.log('[searchStocks] Missing query or API key:', { query, hasKey: !!ALPHA_VANTAGE_API_KEY });
    return [];
  }
  
  try {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    console.log('[searchStocks] Making API request to:', url);
    
    const response = await fetch(url);
    console.log('[searchStocks] Response status:', response.status);
    
    const data = await response.json();
    console.log('[searchStocks] Raw API response:', JSON.stringify(data, null, 2));
    
    // Refined check: ensure bestMatches exists and is a non-empty array
    if (!data || !Array.isArray(data.bestMatches) || data.bestMatches.length === 0) {
      console.log('[searchStocks] No best matches found or invalid format for:', query, data?.bestMatches);
      return [];
    }

    console.log('[searchStocks] Found matches:', JSON.stringify(data.bestMatches, null, 2));
    
    // Fetch quotes for all matches using the *new* getStockQuote
    const quotes = await Promise.all(
      data.bestMatches.map(async (match: any) => {
        console.log('[searchStocks] Processing match:', JSON.stringify(match, null, 2));
        const symbol = match?.['1. symbol'];
        const name = match?.['2. name'];
        
        if (!symbol) {
          console.warn('[searchStocks] Skipping match due to missing symbol:', match);
          return null;
        }

        console.log('[searchStocks] Fetching quote for symbol:', symbol);
        const quote = await getStockQuote(symbol);
        console.log('[searchStocks] Got quote for symbol:', symbol, JSON.stringify(quote, null, 2));
        
        if (quote) {
          quote.name = name;
        }
        return quote;
      })
    );

    // Filter out nulls
    console.log('[searchStocks] Raw quotes before filtering:', JSON.stringify(quotes, null, 2));
    const validQuotes = quotes.filter((quote): quote is StockQuote => quote !== null);
    console.log('[searchStocks] Filtered valid quotes:', JSON.stringify(validQuotes, null, 2));
    return validQuotes;
  } catch (error) {
    console.error('[searchStocks] Error searching stocks:', error);
    return [];
  }
};

// --- Finnhub Functions ---

// NEW getStockQuote using Finnhub
export const getStockQuote = async (symbol: string): Promise<StockQuote | null> => {
  if (!symbol || !FINNHUB_API_KEY) {
    console.warn('[getStockQuote] API key not set or symbol missing:', { symbol, hasKey: !!FINNHUB_API_KEY });
    return null;
  }

  try {
    console.log('[getStockQuote] Fetching quote for symbol:', symbol);
    const response = await fetch(
      `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    if (!response.ok) {
      console.error('[getStockQuote] API error:', response.status, response.statusText);
      throw new Error(`[Finnhub] API error for quote ${symbol}: ${response.status} ${response.statusText}`);
    }
    const quoteData = await response.json();
    console.log('[getStockQuote] Raw quote data:', quoteData);

    // Check if Finnhub returned meaningful data (current price is often 0 if no data)
    if (!quoteData || quoteData.c === 0 && quoteData.pc === 0) {
      console.warn('[getStockQuote] No quote data found or invalid data for:', symbol, quoteData);
      return null;
    }

    // Map Finnhub fields (c, d, dp, o, h, l, pc) to our StockQuote interface
    const quote: StockQuote = {
      symbol: symbol,
      price: quoteData.c,
      change: quoteData.d,
      changePercent: quoteData.dp,
      open: quoteData.o,
      high: quoteData.h,
      low: quoteData.l,
      previousClose: quoteData.pc,
    };
    console.log('[getStockQuote] Mapped quote:', quote);
    return quote;

  } catch (error) {
    console.error('[getStockQuote] Error fetching stock quote for', symbol, ':', error);
    return null;
  }
};

export const getCompanyNews = async (symbol: string): Promise<NewsItem[]> => {
  // Check if the environment variable is set and not empty
  if (!symbol || !FINNHUB_API_KEY) {
      console.warn('[Finnhub] API key not set or symbol missing. Skipping news fetch.');
      return [];
  }

  // Get today's date and 2 days ago in YYYY-MM-DD format
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 4);
  
  const toDate = today.toISOString().split('T')[0];
  const fromDate = twoDaysAgo.toISOString().split('T')[0];

  try {
    console.log(`[getCompanyNews] Fetching news for ${symbol} from ${fromDate} to ${toDate}`);
    const response = await fetch(
      `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${FINNHUB_API_KEY}`
    );
    if (!response.ok) {
        throw new Error(`[Finnhub] API error for news ${symbol}: ${response.status} ${response.statusText}`);
    }
    const data: NewsItem[] = await response.json();
    // Finnhub might return non-array on error or empty results
    const validNews = Array.isArray(data) ? data : [];
    console.log(`[getCompanyNews] Found ${validNews.length} news items for ${symbol}`);
    return validNews.slice(0, 5); // Limit to 5 news items
  } catch (error) {
    console.error('[Finnhub] Error fetching company news for', symbol, ':', error);
    return [];
  }
};

// --- Satire Generation ---

// Updated satire generation with OpenAI integration
export const generateSatire = async (quote: StockQuote, news: NewsItem[]): Promise<Pick<StockDetails, 'sarcasticReason' | 'newsHeadline' | 'mockTweet'>> => {
  try {
    // Get AI-generated satire
    const aiSatire = await generateOpenAISatire(quote, news);
    
    // Use the most relevant news headline
    const earningsNews = news.find(item => 
      item.headline.toLowerCase().includes('earnings') || 
      item.headline.toLowerCase().includes('quarterly') ||
      item.headline.toLowerCase().includes('profit')
    );
    
    const marketNews = news.find(item => 
      item.headline.toLowerCase().includes('market') || 
      item.headline.toLowerCase().includes('stock') ||
      item.headline.toLowerCase().includes('price')
    );

    // Select the most relevant headline
    let headline = '';
    if (earningsNews) {
      headline = earningsNews.headline;
    } else if (marketNews) {
      headline = marketNews.headline;
    } else if (news.length > 0) {
      headline = news[0].headline;
    } else {
      headline = `${quote.symbol} stock ${quote.changePercent > 0 ? 'rises' : 'falls'} ${Math.abs(quote.changePercent).toFixed(2)}%. More at 11.`;
    }

    return {
      sarcasticReason: aiSatire.reason,
      newsHeadline: headline,
      mockTweet: aiSatire.tweet,
    };
  } catch (error) {
    console.error('[generateSatire] Error:', error);
    // Fallback to basic satire if AI generation fails
    return {
      sarcasticReason: `Stock ${quote.symbol} moved ${quote.changePercent > 0 ? 'up' : 'down'} ${Math.abs(quote.changePercent).toFixed(2)}%.`,
      newsHeadline: news.length > 0 ? news[0].headline : `${quote.symbol} stock exists, more at 11.`,
      mockTweet: `Just saw ${quote.symbol}'s price. My portfolio is ${quote.changePercent > 0 ? '🚀' : '😭'}. #Stonks`
    };
  }
};


// --- Combined Details Function ---

export const getStockDetails = async (symbol: string): Promise<StockDetails | null> => {
  console.log(`[getStockDetails] Fetching details for: ${symbol}`); // Log start
  try {
    // Fetch quote (now from Finnhub) and news in parallel
    console.log(`[getStockDetails] Fetching quote and news for: ${symbol}`);
    const [quote, news] = await Promise.all([
      getStockQuote(symbol),
      getCompanyNews(symbol)
    ]);
    console.log(`[getStockDetails] Fetched quote for ${symbol}:`, quote);
    console.log(`[getStockDetails] Fetched news for ${symbol}:`, news?.length);

    if (!quote) {
      // Error already logged within getStockQuote
      console.error(`[getStockDetails] Quote fetch failed for ${symbol}. Returning null.`);
      return null; // Cannot proceed without quote data
    }

    // Generate satire based on quote and news
    console.log(`[getStockDetails] Generating satire for ${symbol}`);
    const satire = await generateSatire(quote, news);

    // Combine all info - Explicitly check quote.price for chartData generation
    const placeholderChartData = typeof quote.price === 'number' && isFinite(quote.price)
      ? [quote.price, quote.price * 1.01, quote.price * 0.98, quote.price * 1.02, quote.price * 0.99]
      : undefined;
      
    const details: StockDetails = {
      ...quote,
      id: quote.symbol, // Use symbol as ID
      sarcasticReason: satire.sarcasticReason,
      newsHeadline: satire.newsHeadline,
      mockTweet: satire.mockTweet,
      latestNews: news,
      chartData: placeholderChartData, // Assign potentially undefined chartData
    };
    console.log(`[getStockDetails] Initial details object created for ${symbol}`);

    // Attempt to enrich with company name if quote doesn't have it
    if (!details.name) {
        console.log(`[getStockDetails] Attempting to enrich name for ${symbol} via searchStocks`);
        const searchResult = await searchStocks(symbol); // Still uses AlphaVantage search
        if (searchResult.length > 0 && searchResult[0].symbol === symbol && searchResult[0].name) {
            details.name = searchResult[0].name;
            console.log(`[getStockDetails] Enriched name for ${symbol}: ${details.name}`);
        } else {
            console.warn(`[getStockDetails] Could not enrich name for ${symbol}. Falling back to symbol.`);
            details.name = symbol; // Fallback to symbol if name not found
        }
    }

    console.log(`[getStockDetails] Successfully assembled details for ${symbol}:`, details);
    return details;
  } catch (error) {
    // Catch any unexpected errors during detail assembly
    console.error(`[getStockDetails] Unexpected error assembling details for ${symbol}:`, error);
    return null; // Return null on unexpected errors too
  }
};


// --- Utility Functions (Keep or modify as needed) ---

// Convert MockStock array to StockQuote array (Potentially less useful now)
export const convertMockStocksToQuotes = (mockStocks: MockStock[]): StockQuote[] => {
  return mockStocks.map(stock => ({
    symbol: stock.ticker,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    name: stock.name,
  }));
};

// Note: mockToRealStock function is removed as its purpose (converting quote to MockStock)
// is superseded by the new StockDetails flow.

// Ensure MockStock interface is defined if still used elsewhere (e.g. TrendingStocks)
// If MockStock is only used for initial data, it might be simplified or removed later.
// For now, assuming it might still be needed for TrendingStocks prop type:
export type { MockStock }; // Re-export if needed by other components
