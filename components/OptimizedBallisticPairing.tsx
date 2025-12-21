import Link from 'next/link';
import React from 'react';
import { Product } from '../types';
import { RiCheckboxCircleFill } from '@remixicon/react';

interface OptimizedBallisticPairingProps {
    pairedProduct: Product;
}

const OptimizedBallisticPairing: React.FC<OptimizedBallisticPairingProps> = ({ pairedProduct }) => {
    if (!pairedProduct) return null;

    // Calculate best price or use a representative price
    const bestOffer = pairedProduct.offers && pairedProduct.offers.length > 0
        ? pairedProduct.offers.sort((a, b) => a.price - b.price)[0]
        : null;

    const price = bestOffer ? bestOffer.price : 0;

    // Determine link URL based on product kind
    // Note: The product kind is natively uppercase in DB but routes might be lowercase conventions
    // Checking app structure: /ammo/[slug] and /firearms/[slug]
    const baseUrl = pairedProduct.kind === 'AMMO' ? '/ammo' : '/firearms';
    const productUrl = `${baseUrl}/${pairedProduct.slug}`;

    return (
        <div className="bg-linear-to-r from-blue-50/50 to-indigo-50/50 rounded-3xl p-1.5 shadow-sm border border-blue-100/50 mb-12 relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-3xl" />

            <div className="flex flex-col md:flex-row items-center gap-8 p-6 md:p-8">

                {/* Product Image */}
                <Link href={productUrl} className="size-24 bg-white rounded-xl shadow-sm border border-blue-100 p-2 flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                    <img
                        src={pairedProduct.image}
                        alt={pairedProduct.title}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                </Link>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2 font-mono">
                        Optimized Ballistic Pairing
                    </div>
                    <Link href={productUrl} className="block group-hover:text-blue-700 transition-colors">
                        <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                            {pairedProduct.title}
                        </h3>
                    </Link>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-white border border-blue-100 text-slate-400 font-mono">
                            [CYCLE RELIABILITY: VERIFIED]
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest bg-white border border-blue-100 text-slate-400 font-mono">
                            [COST EFFICIENCY: HIGH]
                        </span>
                    </div>
                </div>

                {/* Action */}
                <div className="flex flex-col items-end gap-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-mono mb-1">
                        [MARKET_PRICE]
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono tracking-tight mb-4">
                        ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <Link href={productUrl}>
                        <button className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ring-1 ring-slate-200 transition-all font-mono active:scale-95 cursor-pointer">
                            Analyze Asset
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default OptimizedBallisticPairing;
