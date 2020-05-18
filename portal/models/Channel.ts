export interface IChannel {
  id: number;
  channelType: number;
  days: number;
  description: string;
  logo: string;
  name: string;
  price: number;
  statistics: {
    estimatedClicks: number;
    rating: number;
    visitorsPerDay: number[];
  };
  quantity?: number;
  suggestionScore?: any;
}
