
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";
import { MockStock } from '@/data/mockStocks';

interface StockCardProps {
  stock: MockStock;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  // Create SVG path for chart
  const chartWidth = 100;
  const chartHeight = 40;
  const maxValue = Math.max(...stock.chartData);
  const minValue = Math.min(...stock.chartData);
  const range = maxValue - minValue;
  
  const createPath = () => {
    const points = stock.chartData.map((value, index) => {
      const x = (index / (stock.chartData.length - 1)) * chartWidth;
      const y = chartHeight - ((value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const createArea = () => {
    const points = stock.chartData.map((value, index) => {
      const x = (index / (stock.chartData.length - 1)) * chartWidth;
      const y = chartHeight - ((value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;
  };

  return (
    <Card className="w-full bg-finance-terminal border-muted mb-6 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              {stock.ticker}
              <Badge variant="destructive" className="ml-2 animate-decline">
                <TrendingDown className="h-3 w-3 mr-1" />
                {stock.changePercent.toFixed(2)}%
              </Badge>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {stock.name}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">${stock.price.toFixed(2)}</p>
            <p className="text-finance-red font-medium">
              ${stock.change.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-4 mt-2">
          <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-12">
            <path d={createArea()} className="chart-area" />
            <path d={createPath()} className="chart-line" />
          </svg>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-finance-highlight font-bold text-lg mb-1">Why It Tanked:</h3>
            <p className="text-finance-text">{stock.sarcasticReason}</p>
          </div>
          <div>
            <h3 className="text-finance-highlight font-bold mb-1">The "News":</h3>
            <p className="italic text-muted-foreground">"{stock.newsHeadline}"</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary p-4 border-t border-muted">
        <div className="w-full">
          <h3 className="text-finance-highlight font-bold mb-1 text-sm">Social Sentiment:</h3>
          <div className="bg-finance-dark p-3 rounded-md">
            <p className="text-finance-text text-sm">"{stock.mockTweet}"</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StockCard;
