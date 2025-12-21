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

interface AmmoCardProps {
  product: Product;
  isComparing?: boolean;
  onToggleCompare?: () => void;
}

const AmmoCard: React.FC<AmmoCardProps> = ({ product, isComparing, onToggleCompare }) => {

  const updatedTime = useMemo(() => {
    if (!product?.id) return 30;
    const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 86) + 5; // 5 to 90 minutes
  }, [product?.id]);

  const sortedOffers = useMemo(() => {
    if (!product?.offers) return [];
    return [...product.offers].sort((a, b) => {
      if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
      if (a.cpr && b.cpr) return a.cpr - b.cpr;
      return a.price - b.price;
    });
  }, [product?.offers]);

  const bestOffer = sortedOffers.length > 0 ? sortedOffers[0] : null;

  if (!product || !bestOffer) return null;
  const isInStock = bestOffer.inStock;
  // if (!isInStock) console.log(`[AmmoCard] Product ${product.id} Sold Out. Best Offer:`, bestOffer.inStock, typeof bestOffer.inStock);

  return (
    <Link
      href={`/ammo/${product.slug}`}
      className={`
        bg-white rounded-xl shadow-xs border border-slate-200 
        hover:shadow-md transition-all duration-200 
        flex flex-col sm:flex-row items-stretch overflow-hidden cursor-pointer block
        ${isInStock ? 'border-l-4 border-l-brand-500' : 'border-l-4 border-l-slate-300'}
        ${isComparing ? 'ring-2 ring-brand-500' : ''}
      `}
    >
      <div className="relative w-full sm:w-32 bg-slate-50 flex items-center justify-center p-3 border-b sm:border-b-0 sm:border-r border-slate-100 shrink-0">
        <img
          src={product.image}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.jpg';
            e.currentTarget.onerror = null; // Prevent infinite loop
          }}
          alt={product.title}
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain mix-blend-multiply opacity-90 transition-opacity"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleCompare?.();
          }}
          className={`absolute top-2 left-2 p-1 rounded-md transition-all shadow-xs z-10 ${isComparing
            ? 'bg-brand-600 text-white'
            : 'bg-white text-slate-400 hover:text-brand-600'
            }`}
          title="Compare"
        >
          <RiScales3Line className="size-3.5" />
        </button>
      </div>

      <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{product.brand.name}</span>
            <span className="text-slate-300 text-xs">•</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600">
              <RiFlashlightLine className="size-3" />
              {product.offers.length} Offers
            </div>
            <span className="text-slate-300 text-xs">•</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <RiTimerLine className="size-3" />
              Updated {updatedTime}m ago
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 leading-tight pr-2">
              {product.title}
            </h3>
            {!isInStock && (
              <span className="shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-tight">(Sold Out)</span>
            )}
          </div>

          <div className="mt-2 flex items-center gap-3 text-xs font-medium text-slate-500">
            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">{product.caliber}</span>
            <span className="text-slate-300">•</span>
            <span>{product.grain}gr</span>
            <span className="text-slate-300">•</span>
            <span>{product.casing}</span>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center min-w-[140px] border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
          <div className="flex flex-col items-end">
            <div className="flex items-baseline">
              <span className={`text-xl font-bold tracking-tight tabular-nums ${isInStock ? 'text-brand-600' : 'text-slate-400'}`}>
                ${bestOffer.cpr?.toFixed(2)}
              </span>
              <span className="ml-1 text-[10px] font-bold uppercase text-slate-400">/ rd</span>
            </div>

            <div className="flex gap-2 text-[10px] font-mono mt-0.5">
              {bestOffer.roundCount && (
                <span className="text-zinc-500">[BOX: {bestOffer.roundCount}]</span>
              )}
              {bestOffer.freeShipping && (
                <span
                  className="text-emerald-400 font-medium tracking-tight cursor-help decoration-dotted underline-offset-2"
                  title={bestOffer.shippingNote || "Free Shipping Verified"}
                >
                  [FREE_SHIP]
                </span>
              )}
              {!bestOffer.freeShipping && bestOffer.shippingCost > 0 && (
                <span
                  className="text-zinc-500 cursor-help decoration-dotted underline-offset-2"
                  title={bestOffer.shippingNote || "Check retailer site for details"}
                >
                  [+${bestOffer.shippingCost} SHP]
                </span>
              )}
            </div>

            <div className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-1.5">
              <span>{bestOffer.retailer.name}</span>
              {bestOffer.freeShipping && (
                <span className="text-emerald-400 text-[10px] animate-pulse" title="Free Shipping Verified">●</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end mt-3">
            <button
              disabled={!isInStock}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!isInStock
                ? 'bg-slate-100 text-slate-400'
                : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
            >
              View Deal
            </button>

            <div className="flex items-center gap-3 mt-2 px-1">
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
                <RiShareLine className="size-3" /> Share
              </button>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors">
                <RiFlagLine className="size-3.5" /> Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AmmoCard;