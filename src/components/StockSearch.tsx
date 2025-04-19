
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface StockSearchProps {
  onSearch: (query: string) => void;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg items-center space-x-2">
      <Input
        type="text"
        placeholder="Search for a stock (e.g. APPL, TSLA)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-finance-terminal border-finance-terminal text-finance-text"
      />
      <Button type="submit" variant="secondary" className="bg-finance-terminal hover:bg-muted">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default StockSearch;
