'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGlobal } from './GlobalProvider';
import { getProductsByIds } from '@/lib/actions';
import { Product } from '../types';
import {
  RiArrowLeftLine,
  RiScales3Line,
  RiExternalLinkLine,
  RiVerifiedBadgeFill,
  RiDeleteBin7Line
} from '@remixicon/react';

const CompareView: React.FC = () => {
  const { compareIds, setCompareIds } = useGlobal();
  const router = useRouter();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCompareProducts = async () => {
      if (compareIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getProductsByIds(compareIds);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch compare products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompareProducts();
  }, [compareIds]);

  const getBestOffer = (p: Product) => {
    return [...p.offers].sort((a, b) => {
      if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
      if (p.kind === 'AMMO' && a.cpr !== undefined && b.cpr !== undefined) return a.cpr - b.cpr;
      return a.price - b.price;
    })[0];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 flex justify-center text-slate-400">
        <span className="animate-pulse">Loading comparison...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <RiScales3Line className="size-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Your comparison list is empty</h2>
        <p className="text-slate-500 mt-2">Add some firearms or ammunition to compare them side-by-side.</p>
        <button onClick={() => router.push('/')} className="mt-6 text-brand-600 font-bold hover:underline">
          &larr; Browse Products
        </button>
      </div>
    );
  }

  // Find overall winners
  const lowestPrice = Math.min(...products.map(p => getBestOffer(p).price));
  const lowestCpr = Math.min(...products.map(p => getBestOffer(p).cpr || Infinity));

  const Row = ({ label, getter }: { label: string, getter: (p: Product) => React.ReactNode }) => (
    <tr className="group">
      <td className="py-4 pr-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/30">
        {label}
      </td>
      {products.map(p => (
        <td key={p.id} className="py-4 px-6 text-sm font-medium text-slate-900 border-b border-slate-100 tabular-nums">
          {getter(p)}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium">
          <RiArrowLeftLine className="size-5" /> Back
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Product Comparison</h1>
          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold uppercase">{products.length} Products</span>
        </div>
        <button
          onClick={() => setCompareIds([])}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-bold"
        >
          <RiDeleteBin7Line className="size-4" /> Clear
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-48 bg-slate-50/50"></th>
                {products.map(p => {
                  const offer = getBestOffer(p);
                  const isWinner = p.kind === 'AMMO' ? offer.cpr === lowestCpr : offer.price === lowestPrice;
                  return (
                    <th key={p.id} className={`p-6 min-w-[300px] border-b-2 ${isWinner ? 'border-brand-500 bg-brand-50/20' : 'border-slate-100'}`}>
                      <div className="flex flex-col items-center text-center">
                        <div className="h-48 w-full mb-6 flex items-center justify-center p-4 bg-white rounded-xl border border-slate-100/50">
                          <img
                            src={p.image}
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.jpg';
                              e.currentTarget.onerror = null;
                            }}
                            className="max-h-full max-w-full object-contain mix-blend-multiply"
                            alt=""
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{p.brand.name}</span>
                        <h3 className="text-base font-bold text-slate-900 leading-tight h-10 overflow-hidden mb-4">{p.title}</h3>

                        <div className="mb-4">
                          <div className="text-3xl font-black text-slate-900 tabular-nums">${offer.price.toFixed(2)}</div>
                          {p.kind === 'AMMO' && (
                            <div className="text-brand-600 font-bold text-sm tracking-tight">
                              ${offer.cpr?.toFixed(2)}/rd
                            </div>
                          )}
                        </div>

                        {isWinner && (
                          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-brand-100 text-brand-700 text-[10px] font-bold uppercase tracking-wider rounded-full ring-1 ring-brand-200">
                            <RiVerifiedBadgeFill className="size-3" />
                            Value Winner
                          </div>
                        )}

                        <button
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
                        >
                          View Deal <RiExternalLinkLine className="size-4" />
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <Row label="Caliber" getter={p => p.caliber || 'N/A'} />
              <Row label="Grain" getter={p => p.grain ? `${p.grain} gr` : 'N/A'} />
              <Row label="Barrel / Capacity" getter={p => p.kind === 'FIREARM' ? `${p.barrelLength || 'N/A'} / ${p.capacity || 'N/A'}` : 'N/A'} />
              <Row label="Velocity" getter={p => p.velocity ? `${p.velocity} fps` : 'N/A'} />
              <Row label="Casing" getter={p => p.casing || 'N/A'} />
              <Row label="Market Status" getter={p => {
                const offer = getBestOffer(p);
                return offer.inStock ?
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">● In Stock</span> :
                  <span className="text-slate-400 font-bold italic">Out of Stock</span>
              }} />
              <Row label="Top Retailer" getter={p => getBestOffer(p).retailer.name} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareView;