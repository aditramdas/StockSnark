import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { StockDetails } from '@/services/stockApi';

interface StockCardProps {
  stock: StockDetails;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  // Strengthen the check for chart data
  const chartData = stock.chartData;
  const hasChartData = Array.isArray(chartData) && chartData.length > 1;
  const chartWidth = 100;
  const chartHeight = 40;
  let maxValue = 1, minValue = 0, range = 1;

  // Only calculate min/max/range if chartData is valid
  if (hasChartData) {
    // chartData is confirmed Array<number> here
    maxValue = Math.max(...chartData);
    minValue = Math.min(...chartData);
    range = maxValue - minValue;
    if (range === 0) range = 1;
  }
  
  const createPath = () => {
    // Ensure chartData is valid before mapping
    if (!hasChartData || !Array.isArray(chartData)) return "";
    const points = chartData.map((value, index) => {
      const x = (index / (chartData.length - 1)) * chartWidth;
      const y = chartHeight - ((value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const createArea = () => {
    // Ensure chartData is valid before mapping
    if (!hasChartData || !Array.isArray(chartData)) return "";
    const points = chartData.map((value, index) => {
      const x = (index / (chartData.length - 1)) * chartWidth;
      const y = chartHeight - ((value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`;
  };

  // Determine badge variant and icon based on changePercent
  const changePercent = stock.changePercent || 0;
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;
  // Map our desired state to available Badge variants
  const badgeVariant: "default" | "destructive" | "secondary" | "outline" = 
    isPositive ? "default" : // Use default variant for positive
    isNegative ? "destructive" : 
    "secondary"; // Use secondary for zero change
  const ChangeIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  // Define text color based on change
  const changeColor = isPositive ? "text-finance-green" : isNegative ? "text-finance-red" : "text-muted-foreground";
  // Define badge specific color override for positive case if needed
  const badgeColorClass = isPositive ? "bg-green-700 text-white border-transparent" : ""; // Example: Green background for positive badge

  return (
    <Card className="w-full bg-finance-terminal border-muted mb-6 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center">
              {stock.symbol}
              <Badge variant={badgeVariant} className={`ml-2 ${isNegative ? 'animate-decline' : isPositive ? 'animate-rise' : ''} ${badgeColorClass}`}>
                <ChangeIcon className="h-3 w-3 mr-1" />
                {changePercent.toFixed(2)}%
              </Badge>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {stock.name || stock.symbol}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">${stock.price.toFixed(2)}</p>
            <p className={`${changeColor} font-medium`}>
              {isPositive ? '+' : ''}{stock.change.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {hasChartData ? (
          <div className="mb-4 mt-2">
            <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-12">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <path d={createArea()} fill="url(#chartGradient)" />
              <path d={createPath()} fill="none" stroke={isPositive ? "#22c55e" : "#ef4444"} strokeWidth="2" />
            </svg>
          </div>
        ) : (
          <div className="h-12 w-full flex items-center justify-center text-muted-foreground text-sm mb-4 mt-2">
            (Chart data not available)
          </div>
        )}
        <div className="space-y-4">
          <div>
            <h3 className="text-finance-highlight font-bold text-lg mb-1">Why It {isPositive ? 'Soared' : isNegative ? 'Tanked' : 'Did Nothing'}:</h3>
            <p className="text-finance-text">{stock.sarcasticReason}</p>
          </div>
          <div>
            <h3 className="text-finance-highlight font-bold mb-1">The "News":</h3>
            <p className="italic text-muted-foreground">"{stock.newsHeadline}"</p>
            {/* Add safety check for latestNews array and its first element */}
            {Array.isArray(stock.latestNews) && stock.latestNews.length > 0 && stock.latestNews[0]?.url && (
                 <a href={stock.latestNews[0].url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline ml-2">(Read More)</a>
            )}
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
