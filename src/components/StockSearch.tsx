import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from "lucide-react";
import { StockQuote } from '@/services/stockApi';

interface StockSearchProps {
  onSearch: (query: string) => void;
  onSelectStock?: (ticker: string) => void;
  results?: StockQuote[];
  isLoading?: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({ 
  onSearch, 
  onSelectStock, 
  results = [],
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Call onSearch when debouncedQuery changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectStock = (ticker: string, name?: string) => {
    setSearchQuery(name ? `${name} (${ticker})` : ticker);
    if (onSelectStock) {
      onSelectStock(ticker);
    }
    setIsInputFocused(false);
  };

  const showDropdown = isInputFocused && searchQuery.length > 0;

  // Filter out any null or invalid results
  const validResults = results?.filter(result => 
    result && 
    typeof result.symbol === 'string' && 
    result.symbol.trim() !== ''
  ) || [];

  return (
    <div className="relative w-full max-w-lg">
      <div className="flex items-center border rounded-lg border-input shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <input
            type="text"
            placeholder="Search stocks (e.g. AAPL, TSLA)"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setIsInputFocused(true)}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
      
      {showDropdown && (
        <div className="absolute z-10 top-full mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : validResults.length === 0 ? (
            <div className="py-6 text-center text-sm">
              No stocks found matching "{searchQuery}".
            </div>
          ) : (
            <div className="p-1">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Results
              </div>
              {validResults.map((stock) => {
                const displayText = stock.name 
                  ? `${stock.name} (${stock.symbol})` 
                  : stock.symbol;
                
                return (
                  <div
                    key={stock.symbol}
                    className="px-2 py-3 cursor-pointer hover:bg-muted"
                    onClick={() => handleSelectStock(stock.symbol, stock.name)}
                  >
                    {displayText}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
