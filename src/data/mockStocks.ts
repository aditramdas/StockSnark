export interface MockStock {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  chartData: number[];
}

export const mockStocks: MockStock[] = [
  {
    id: "1",
    ticker: "AAPL", // Fixed the typo from APPL to AAPL
    name: "Apple Inc.",
    price: 172.62,
    change: -5.48,
    changePercent: -3.08,
    chartData: [180, 181, 179, 178, 176, 177, 175, 173, 172.62]
  },
  {
    id: "2",
    ticker: "NFLX",
    name: "Netflix Inc.",
    price: 408.73,
    change: -42.19,
    changePercent: -9.35,
    chartData: [460, 455, 450, 445, 435, 425, 415, 410, 408.73]
  },
  {
    id: "3",
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: 176.75,
    change: -18.32,
    changePercent: -9.39,
    chartData: [195, 194, 190, 188, 185, 183, 180, 178, 176.75]
  },
  {
    id: "4",
    ticker: "META",
    name: "Meta Platforms Inc.",
    price: 324.16,
    change: -16.35,
    changePercent: -4.80,
    chartData: [345, 342, 340, 338, 335, 330, 328, 326, 324.16]
  },
  {
    id: "5",
    ticker: "GME",
    name: "GameStop Corp.",
    price: 14.37,
    change: -3.21,
    changePercent: -18.26,
    chartData: [18, 17.5, 17.2, 16.8, 16.2, 15.7, 15.2, 14.8, 14.37]
  },
  {
    id: "6",
    ticker: "MSFT",
    name: "Microsoft Corporation",
    price: 415.32,
    change: -7.89,
    changePercent: -1.87,
    chartData: [425, 423, 420, 418, 417, 416, 414, 415, 415.32]
  },
  {
    id: "7",
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: 172.98,
    change: -5.32,
    changePercent: -2.99,
    chartData: [180, 178, 177, 176, 175, 174, 173, 172.5, 172.98]
  }
];
