
export interface MockStock {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sarcasticReason: string;
  newsHeadline: string;
  mockTweet: string;
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
    sarcasticReason: "Apparently, releasing the exact same phone with a slightly better camera for the 12th year in a row isn't the innovation shareholders were hoping for. Who knew?",
    newsHeadline: "Apple's iPhone 16 launch met with 'meh' from consumers and critics alike",
    mockTweet: "Just spent $1,200 on a new iPhone and can't tell it apart from my old one. Maybe the real innovation is Apple's ability to keep making me do this. #AppleFail",
    chartData: [180, 181, 179, 178, 176, 177, 175, 173, 172.62]
  },
  {
    id: "2",
    ticker: "NFLX",
    name: "Netflix Inc.",
    price: 408.73,
    change: -42.19,
    changePercent: -9.35,
    sarcasticReason: "Turns out cancelling every show with a loyal fanbase and raising prices during a cost-of-living crisis wasn't the brilliant strategy executives thought it was. Shocking!",
    newsHeadline: "Netflix reports first subscriber loss in North America since 2011",
    mockTweet: "Netflix just cancelled my favorite show and raised my subscription price in the same week. It's like they're TRYING to make me pirate content again. #NetflixExodus",
    chartData: [460, 455, 450, 445, 435, 425, 415, 410, 408.73]
  },
  {
    id: "3",
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: 176.75,
    change: -18.32,
    changePercent: -9.39,
    sarcasticReason: "Investors finally realized that a CEO who spends more time posting memes than running his companies might not be the business genius they thought. Who could've predicted this?",
    newsHeadline: "Tesla misses delivery targets as Musk focuses on social media acquisition",
    mockTweet: "Bought a Tesla and now I wake up every morning worried about what its CEO tweeted overnight and how much of my investment it just cost me. #ElonEffect",
    chartData: [195, 194, 190, 188, 185, 183, 180, 178, 176.75]
  },
  {
    id: "4",
    ticker: "META",
    name: "Meta Platforms Inc.",
    price: 324.16,
    change: -16.35,
    changePercent: -4.80,
    sarcasticReason: "Turns out spending billions on a virtual world that looks like a 2008 Wii game wasn't the future of technology. If only someone had warned them!",
    newsHeadline: "Meta's Reality Labs division posts $4.5B loss as Metaverse adoption lags",
    mockTweet: "Zuckerberg spent $10 billion to make avatars without legs in a virtual world nobody wants to visit. And I thought MY spending habits were bad. #MetaverseFlop",
    chartData: [345, 342, 340, 338, 335, 330, 328, 326, 324.16]
  },
  {
    id: "5",
    ticker: "GME",
    name: "GameStop Corp.",
    price: 14.37,
    change: -3.21,
    changePercent: -18.26,
    sarcasticReason: "Turns out a brick-and-mortar store selling physical copies of games in a digital download world wasn't actually saved by reddit memes. Who would have thought?",
    newsHeadline: "GameStop reports 10th consecutive quarterly loss as 'meme stock' momentum fades",
    mockTweet: "Diamond hands turned to dust. Turns out HODLing a fundamentally broken business model wasn't the get-rich-quick scheme Reddit promised. #GameStopLoss",
    chartData: [18, 17.5, 17.2, 16.8, 16.2, 15.7, 15.2, 14.8, 14.37]
  },
  {
    id: "6",
    ticker: "MSFT",
    name: "Microsoft Corporation",
    price: 415.32,
    change: -7.89,
    changePercent: -1.87,
    sarcasticReason: "Investors suddenly remembered that Windows updates still crash computers after 35 years of development. Revolutionary!",
    newsHeadline: "Microsoft's new AI assistant accidentally insults CEO during demo",
    mockTweet: "My Windows PC just spent 2 hours updating only to blue screen. Maybe Microsoft should spend less on AI and more on actually working software. #WindowsFail",
    chartData: [425, 423, 420, 418, 417, 416, 414, 415, 415.32]
  },
  {
    id: "7",
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: 172.98,
    change: -5.32,
    changePercent: -2.99,
    sarcasticReason: "Turns out launching 17 messaging apps and killing every single one wasn't a sustainable business strategy. Who knew?",
    newsHeadline: "Google shutters another product with millions of users, surprising absolutely no one",
    mockTweet: "Google just killed another product I relied on. At this point, getting attached to Google products is like adopting pets from a serial killer. #GoogleGraveyard",
    chartData: [180, 178, 177, 176, 175, 174, 173, 172.5, 172.98]
  }
];
