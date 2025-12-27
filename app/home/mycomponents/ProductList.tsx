import React from 'react';
import { ProductCard } from './ProductCard';
import { MOCK_LISTINGS } from '../constants';
import { ArrowUpDown } from 'lucide-react';

export const ProductList: React.FC = () => {
  return (
    <div className="flex-1 min-w-0">

      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
        <div className="text-sm text-slate-500">
          <span className="text-slate-900 font-bold">{MOCK_LISTINGS.length}</span> Assets Detected
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 uppercase font-bold hidden sm:block">Sort By:</span>
          <select className="bg-white text-slate-700 text-sm border border-slate-300 rounded-md py-1.5 pl-3 pr-8 focus:ring-brand focus:border-brand shadow-sm">
            <option>Cost Per Round (Low)</option>
            <option>Cost Per Round (High)</option>
            <option>Shipping Score (High)</option>
            <option>Retailer Rating</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {MOCK_LISTINGS.map(listing => (
          <ProductCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Pagination / Load More */}
      <div className="mt-8 flex justify-center">
        <button className="text-sm text-slate-500 hover:text-brand border-b border-dashed border-slate-300 hover:border-brand pb-0.5 transition-colors font-medium">
          Load more results
        </button>
      </div>
    </div>
  );
};