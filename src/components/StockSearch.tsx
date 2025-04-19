
import React, { useState } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search } from "lucide-react";

interface StockSearchProps {
  onSearch: (query: string) => void;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSearch }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full max-w-lg">
      <Command className="rounded-lg border border-input shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="Search stocks (e.g. AAPL, TSLA)"
            value={searchQuery}
            onValueChange={handleSearch}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        {searchQuery.length > 0 && (
          <CommandList>
            <CommandEmpty>No stocks found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem
                onSelect={() => {
                  handleSearch('AAPL');
                  setOpen(false);
                }}
              >
                Apple Inc. (AAPL)
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  handleSearch('MSFT');
                  setOpen(false);
                }}
              >
                Microsoft Corporation (MSFT)
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  handleSearch('GOOGL');
                  setOpen(false);
                }}
              >
                Alphabet Inc. (GOOGL)
              </CommandItem>
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default StockSearch;
