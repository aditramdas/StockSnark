
import { MockStock } from '@/data/mockStocks';

const API_KEY = 'demo'; // Using Alpha Vantage's demo key for now
const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export const searchStocks = async (query: string): Promise<StockQuote[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (!data.bestMatches) {
      return [];
    }

    const quotes = await Promise.all(
      data.bestMatches.slice(0, 5).map(async (match: any) => {
        const quote = await getStockQuote(match['1. symbol']);
        return quote;
      })
    );

    return quotes.filter(quote => quote !== null);
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};

export const getStockQuote = async (symbol: string): Promise<StockQuote | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (!data['Global Quote']) {
      return null;
    }

    const quote = data['Global Quote'];
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
};

// Convert StockQuote to MockStock for UI display
export const mockToRealStock = (quote: StockQuote): MockStock => {
  return {
    id: quote.symbol,
    ticker: quote.symbol,
    name: quote.symbol, // Alpha Vantage demo API doesn't provide company names
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercent,
    sarcasticReason: "The market finally realized that stocks can go down too. Who knew?",
    newsHeadline: "Breaking: Numbers go down, investors surprised",
    mockTweet: "Can't believe I bought the dip and it kept dipping. #StockMarketLife",
    chartData: [quote.price, quote.price * 0.98, quote.price * 1.02, quote.price], // Simplified chart data
  };
};

// Convert MockStock array to StockQuote array for API compatibility
export const convertMockStocksToQuotes = (mockStocks: MockStock[]): StockQuote[] => {
  return mockStocks.map(stock => ({
    symbol: stock.ticker,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent
  }));
};
