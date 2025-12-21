import React from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_PRODUCTS } from '../constants';
import { RiCloseLine, RiScales3Line, RiDeleteBin7Line } from '@remixicon/react';

interface CompareTrayProps {
  compareIds: string[];
  setCompareIds: (ids: string[]) => void;
}

const CompareTray: React.FC<CompareTrayProps> = ({ compareIds, setCompareIds }) => {
  const router = useRouter();

  if (compareIds.length === 0) return null;

  const selectedProducts = compareIds.map(id => MOCK_PRODUCTS.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-3 flex items-center gap-4 text-white">
        <div className="flex -space-x-3 overflow-hidden p-1">
          {selectedProducts.map((p) => (
            <div key={p!.id} className="relative group">
              <div className="h-12 w-12 rounded-lg bg-white p-1 ring-2 ring-slate-900 overflow-hidden shadow-xs">
                <img src={p!.image} className="h-full w-full object-contain" alt="" />
              </div>
              <button
                onClick={() => setCompareIds(compareIds.filter(id => id !== p!.id))}
                className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <RiCloseLine className="size-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex-1">
          <p className="text-sm font-bold">{compareIds.length} items selected</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Compare Matrix</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareIds([])}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Clear All"
          >
            <RiDeleteBin7Line className="size-5" />
          </button>
          <button
            onClick={() => router.push('/compare')}
            className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand-900/20 transition-all active:scale-95"
          >
            <RiScales3Line className="size-4" />
            Compare Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareTray;