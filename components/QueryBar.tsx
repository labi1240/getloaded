import React from 'react';
import { RiCloseLine, RiTerminalLine } from '@remixicon/react';

interface QueryBarProps {
  filters: any;
  onRemove: (key: string, value: string) => void;
  count: number;
}

const QueryBar: React.FC<QueryBarProps> = ({ filters, onRemove, count }) => {
  const activeFilters = Object.entries(filters).flatMap(([key, values]: [string, any]) => {
    if (key === 'inStock') {
      return values ? [{ key: 'Availability', val: 'In Stock' }] : [];
    }
    if (key === 'minPrice' && values !== null) {
      return [{ key: 'Min Price', val: `$${values}` }];
    }
    if (key === 'maxPrice' && values !== null) {
      return [{ key: 'Max Price', val: `$${values}` }];
    }
    if (Array.isArray(values)) {
      return values.map((val: string) => ({ key, val }));
    }
    return [];
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 font-mono text-[11px] bg-slate-100 p-3 rounded-xl border border-slate-200">
      <RiTerminalLine className="size-4 text-slate-400" />
      <span className="text-slate-400 font-bold uppercase mr-2 tracking-tighter">&gt; QUERY:</span>
      {activeFilters.map(({ key, val }) => (
        <span
          key={`${key}-${val}`}
          className="bg-white border border-slate-300 text-slate-700 px-2 py-1 rounded flex items-center gap-1.5 shadow-xs hover:border-slate-400 transition-all cursor-pointer group"
          onClick={() => onRemove(key, val)}
        >
          <span className="text-[9px] font-black text-slate-400">{key.toUpperCase()}=</span>
          <span className="font-bold">{val.toUpperCase()}</span>
          <RiCloseLine className="size-3 text-slate-300 group-hover:text-red-500" />
        </span>
      ))}
      <span className="ml-auto text-slate-400 italic">[{count} result(s)]</span>
    </div>
  );
};

export default QueryBar;