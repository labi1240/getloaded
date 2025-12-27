import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from './types';
import { ArrowUpDown } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="flex-1 min-w-0 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">

      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
        <div className="text-sm text-slate-500">
          <span className="text-slate-900 font-bold">{products.length}</span> Assets Detected
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
        {products.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No products found matching your criteria.
          </div>
        ) : (
          products.map(listing => (
            <ProductCard key={listing.id} listing={listing} />
          ))
        )}
      </div>

      {/* Pagination / Load More */}
      {products.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button className="text-sm text-slate-500 hover:text-brand border-b border-dashed border-slate-300 hover:border-brand pb-0.5 transition-colors font-medium">
            Load more results
          </button>
        </div>
      )}
    </div>
  );
};