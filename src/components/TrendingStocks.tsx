
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { MockStock } from '@/data/mockStocks';

interface TrendingStocksProps {
  stocks: MockStock[];
  onSelectStock: (stockId: string) => void;
}

const TrendingStocks: React.FC<TrendingStocksProps> = ({ stocks, onSelectStock }) => {
  // Sort stocks by percentage change (most negative first)
  const sortedStocks = [...stocks].sort((a, b) => a.changePercent - b.changePercent);
  
  return (
    <Card className="w-full bg-finance-terminal border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center text-white">
          <TrendingDown className="h-5 w-5 mr-2 text-finance-red" />
          Trending Disasters
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-muted">
          {sortedStocks.map(stock => (
            <li 
              key={stock.id} 
              className="p-3 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => onSelectStock(stock.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">{stock.ticker}</p>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-finance-red font-bold">{stock.changePercent.toFixed(2)}%</p>
                  <p className="text-sm text-finance-red">${stock.change.toFixed(2)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TrendingStocks;
