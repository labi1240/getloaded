export interface Product {
  id: string;
  slug?: string;
  name: string;
  price: number;
  retailer: string;
  retailerRating: number; // 1-5
  image: string;
  lastUpdated: string;
  shippingScore: number; // 1-10
  shippingText?: string; // e.g. "Free Shipping > $200"
  isSponsored?: boolean;
  brand: string;
  condition: 'New' | 'Used' | 'Reman' | 'Factory Seconds';
  category: 'ammo' | 'firearm' | 'part';

  // Ammo Specific Fields (Optional)
  caliber?: string;
  grains?: number;
  roundCount?: number;
  cpr?: number; // Cost Per Round
  casing?: 'Brass' | 'Steel' | 'Aluminum' | 'Nickel';
}

export interface FilterState {
  calibers: string[];
  brands: string[];
  hideReman: boolean;
  minShippingScore: number;
}