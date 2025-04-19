import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import StockSearch from '@/components/StockSearch';
import StockCard from '@/components/StockCard';
import TrendingStocks from '@/components/TrendingStocks';
import { mockStocks } from '@/data/mockStocks';
import { Frown, Loader2 } from 'lucide-react';
import { searchStocks, convertMockStocksToQuotes, StockQuote } from '@/services/stockApi';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['stocks', searchQuery],
    queryFn: () => searchStocks(searchQuery),
    enabled: searchQuery.length > 0,
    initialData: convertMockStocksToQuotes(mockStocks),
  });
  
  const selectedStock = selectedStockId 
    ? mockStocks.find(stock => stock.ticker === (selectedStockId)) 
    : mockStocks[0];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectStock = (stockId: string) => {
    setSelectedStockId(stockId);
  };

  return (
    <div className="min-h-screen bg-finance-dark">
      <header className="bg-finance-terminal border-b border-muted py-6 px-4 md:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                <span className="text-finance-red">Stock</span><span className="text-finance-highlight">Snark</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Where investments go to die, and we mock their demise
              </p>
            </div>
            <StockSearch onSearch={handleSearch} />
          </div>
        </div>
      </header>
      
      <main className="container max-w-7xl mx-auto py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 bg-finance-terminal rounded-lg border border-muted p-6">
                <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Loading stocks...</h3>
              </div>
            ) : selectedStock ? (
              <StockCard stock={selectedStock} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-finance-terminal rounded-lg border border-muted p-6 text-center">
                <Frown className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No stocks found</h3>
                <p className="text-muted-foreground">
                  Even our sarcasm has limits. Try another search term.
                </p>
              </div>
            )}
            
            <div className="mt-6">
              <h2 className="text-xl font-bold text-white mb-4">Financial Disclaimers (That You'll Ignore Anyway)</h2>
              <div className="bg-finance-terminal border border-muted rounded-lg p-6">
                <p className="text-muted-foreground text-sm">
                  This site is <span className="text-finance-highlight font-bold">100% satire</span>. If you're taking financial advice from a website called StockSnark, you probably deserve whatever happens to your portfolio. None of the information here is real financial analysis, and if you can't tell the difference between actual investment research and jokes about CEOs posting memes, please close your brokerage account immediately.
                </p>
                <p className="text-muted-foreground text-sm mt-4">
                  Remember: The stock market is just astrology for people who wear Patagonia vests.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <TrendingStocks 
              stocks={mockStocks} 
              onSelectStock={handleSelectStock} 
            />
            
            <div className="mt-6 bg-finance-terminal border border-muted rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-2">Market Wisdom</h3>
              <blockquote className="border-l-4 border-finance-highlight pl-4 italic text-muted-foreground">
                "The stock market is a device for transferring money from the impatient to the patient, and from the patient to whatever billionaire is tweeting nonsense this week."
              </blockquote>
              <p className="text-right text-sm text-muted-foreground mt-2">— Warren Buffett (Probably Not)</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-finance-terminal border-t border-muted py-6 px-4 md:px-6 mt-12">
        <div className="container max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            StockSnark: Making you feel better about your poor investment choices since 2025.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
