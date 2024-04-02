export interface Stock {
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  dividendYield: number;
  dividendGrowthYears: number;
  divGrowth5y: number;
  divGrowth3y: number;
  payoutRatio: number;
  fcfPayoutRatio: number;
}
