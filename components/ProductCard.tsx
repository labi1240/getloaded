import Link from 'next/link';
import React, { useMemo } from 'react';
import { Product } from '../types';
import {
  RiExternalLinkLine,
  RiScales3Line,
  RiShareLine,
  RiFlagLine,
  RiTimerLine,
  RiFlashlightLine
} from '@remixicon/react';

interface ProductCardProps {
  firearm: Product;
  isComparing?: boolean;
  onToggleCompare?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ firearm, isComparing, onToggleCompare }) => {

  // Stable random time based on ID
  const updatedTime = useMemo(() => {
    if (!firearm?.id) return 30;
    const hash = firearm.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 86) + 5; // 5 to 90 minutes
  }, [firearm?.id]);

  const sortedOffers = useMemo(() => {
    if (!firearm?.offers) return [];
    return [...firearm.offers].sort((a, b) => {
      if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
      return a.price - b.price;
    });
  }, [firearm?.offers]);

  const bestOffer = sortedOffers.length > 0 ? sortedOffers[0] : null;
  const offerCount = firearm?.offers?.length || 0;

  if (!firearm || !bestOffer) return null;

  const basePath = firearm.kind === 'FIREARM' ? '/firearms' : '/ammo';
  const productUrl = `${basePath}/${firearm.slug}`;

  return (
    <Link
      href={productUrl}
      className={`bg-white rounded-xl shadow-xs border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row cursor-pointer group/card relative block ${isComparing ? 'ring-2 ring-brand-500 border-brand-500' : ''}`}
    >
      {/* Image Section */}
      <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-slate-50 flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-slate-100 shrink-0">
        <img
          src={firearm.image}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.jpg';
            e.currentTarget.onerror = null; // Prevent infinite loop
          }}
          alt={firearm.title}
          className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover/card:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleCompare?.();
          }}
          className={`absolute top-3 left-3 p-1.5 rounded-lg transition-all shadow-xs z-10 ${isComparing
            ? 'bg-brand-600 text-white'
            : 'bg-white text-slate-400 hover:text-brand-600'
            }`}
          title="Add to Compare"
        >
          <RiScales3Line className="size-4" />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{firearm.brand.name}</span>
            <span className="text-slate-300 text-xs">•</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600">
              <RiFlashlightLine className="size-3" />
              {offerCount} Offers
            </div>
            <span className="text-slate-300 text-xs">•</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <RiTimerLine className="size-3" />
              Updated {updatedTime}m ago
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover/card:text-brand-700 transition-colors">
              {firearm.title}
            </h3>
            {bestOffer.inStock ? (
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 text-brand-700 uppercase">
                In Stock
              </span>
            ) : (
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase">
                Out of Stock
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-slate-500">
            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold">{firearm.caliber || '9mm'}</span>
            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold">{firearm.barrelLength || '4.0"'} BBL</span>
            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold">{firearm.capacity || '15'} Rds</span>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
          <div className="flex flex-col">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              Sold by <span className={`font-bold ${bestOffer.inStock ? 'text-slate-700' : 'text-slate-400'}`}>{bestOffer.retailer.name}</span>
              {bestOffer.freeShipping && (
                <span className="text-emerald-400 text-[10px] animate-pulse" title="Free Shipping Verified">●</span>
              )}
            </div>

            <div className="text-[10px] uppercase tracking-tight font-bold font-mono mt-1">
              {bestOffer.freeShipping ? (
                <span
                  className="text-emerald-500 cursor-help decoration-dotted underline-offset-2"
                  title={bestOffer.shippingNote || "Free Shipping Verified"}
                >
                  [FREE_SHIP]
                </span>
              ) : bestOffer.shippingCost > 0 ? (
                <span
                  className="text-slate-400 cursor-help decoration-dotted underline-offset-2"
                  title={bestOffer.shippingNote || "Check retailer site for details"}
                >
                  [+ ${bestOffer.shippingCost} LOGISTICS]
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className={`text-2xl font-black tabular-nums leading-none mb-3 ${bestOffer.inStock ? 'text-slate-900' : 'text-slate-400'}`}>
              ${bestOffer.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <button
              disabled={!bestOffer.inStock}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`w-full sm:w-32 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${!bestOffer.inStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
            >
              {bestOffer.inStock ? 'View Deal' : 'Sold Out'}
              {bestOffer.inStock && <RiExternalLinkLine className="size-3.5" />}
            </button>

            <div className="flex items-center gap-4 mt-2 px-1">
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
                <RiShareLine className="size-3.5" /> Share
              </button>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors">
                <RiFlagLine className="size-3.5" /> Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;