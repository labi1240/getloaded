import React from 'react';
import { Product } from './types';
import { ExternalLink, Truck, ShieldAlert, Star, Box, PackageOpen } from 'lucide-react';

interface Props {
  listing: Product;
}

export const ProductCard: React.FC<Props> = ({ listing }) => {
  const isGreatDeal = listing.shippingScore >= 9 && listing.condition === 'New';
  const isReman = listing.condition === 'Reman';
  const isUsed = listing.condition === 'Used';

  return (
    <div className={`
      relative group flex flex-col sm:flex-row bg-white rounded-lg overflow-hidden border transition-all duration-200 shadow-sm
      ${isGreatDeal ? 'border-brand/50 ring-1 ring-brand/10 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}
    `}>

      {/* Accent Border for "Top Tier" items */}
      {isGreatDeal && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand hidden sm:block"></div>
      )}

      {/* Image Section */}
      <div className="sm:w-48 p-4 flex items-center justify-center bg-white flex-shrink-0 border-r border-slate-100/50 relative min-h-[160px] sm:min-h-0">
        <img
          src={listing.image}
          alt={listing.name}
          className="max-h-32 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isReman && (
          <div className="absolute top-2 left-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 z-10">
            <ShieldAlert className="h-3 w-3" /> RELOAD
          </div>
        )}
        {isUsed && (
          <div className="absolute top-2 left-2 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1 z-10">
            <PackageOpen className="h-3 w-3" /> USED
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col sm:flex-row gap-4 justify-between">

        {/* Main Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
              {listing.brand.toUpperCase()}
            </span>
            {listing.category === 'ammo' ? (
              <span className="text-xs text-slate-500 font-mono">
                {listing.grains}gr • {listing.casing} • {listing.roundCount} rnds
              </span>
            ) : listing.category === 'firearm' ? (
              <span className="text-xs text-slate-500 font-mono">
                {listing.caliber} • {listing.condition}
              </span>
            ) : (
              <span className="text-xs text-slate-500 font-mono">
                Part / Accessory
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 truncate pr-4 group-hover:text-brand transition-colors" title={listing.name}>
            {listing.name}
          </h3>

          <div className="flex items-center gap-4 text-sm mt-auto">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className={`font-semibold ${listing.retailerRating > 4.5 ? 'text-slate-900' : 'text-slate-500'}`}>
                {listing.retailer}
              </span>
              <div className="flex items-center text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                <Star className="h-3 w-3 mr-0.5 fill-current text-yellow-400" />
                {listing.retailerRating}
              </div>
            </div>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-slate-400 text-xs">Updated {listing.lastUpdated}</span>
          </div>
        </div>

        {/* Pricing & Action Section */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-1 pl-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0">

          {/* Price Display */}
          <div className="text-right">
            {listing.category === 'ammo' && listing.cpr ? (
              <>
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-xs text-slate-400 font-medium">$</span>
                  <span className={`text-2xl font-bold font-mono ${isGreatDeal ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {listing.cpr.toFixed(3)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/rd</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-mono">
                  ${listing.price.toFixed(2)} box
                </div>
              </>
            ) : (
              <>
                <div className="flex items-baseline justify-end gap-1">
                  <span className={`text-2xl font-bold font-mono ${isGreatDeal ? 'text-emerald-600' : 'text-slate-900'}`}>
                    ${listing.price.toFixed(2)}
                  </span>
                </div>
                {listing.category === 'firearm' && (
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">
                    + FFL Fees
                  </div>
                )}
              </>
            )}
          </div>

          {/* Shipping Indicator */}
          <div className={`
            flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold w-fit mt-2
            ${listing.shippingScore >= 8
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : listing.shippingScore >= 5
                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                : 'bg-rose-50 text-rose-600 border border-rose-100'}
          `}>
            <Truck className="h-3 w-3" />
            {listing.shippingText || `Score: ${listing.shippingScore}/10`}
          </div>

          <button className="hidden sm:flex mt-3 w-full items-center justify-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2">
            View Deal <ExternalLink className="h-3 w-3 opacity-60" />
          </button>
        </div>
      </div>

      {/* Mobile only button overlay */}
      <a href="#" className="absolute inset-0 sm:hidden z-10" aria-label="View deal"></a>
    </div>
  );
};