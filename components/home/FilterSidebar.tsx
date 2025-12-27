import React from 'react';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import { POPULAR_CALIBERS } from './constants';

export const FilterSidebar: React.FC = () => {
  return (
    <div className="w-full lg:w-64 flex-shrink-0 space-y-8">

      {/* Parameters Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Parameters</span>
        </div>
        <button className="text-xs text-brand hover:text-brand-dark flex items-center gap-1 uppercase tracking-wider font-bold">
          <RefreshCw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Safety Filter */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Quality Control
        </h3>
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input type="checkbox" className="peer h-4 w-4 rounded border-slate-300 bg-white text-brand focus:ring-brand" defaultChecked />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 group-hover:text-brand transition-colors">Factory New Only</span>
            <span className="text-xs text-slate-500">Excludes remanufactured ammo</span>
          </div>
        </label>
      </div>

      {/* Caliber Filter */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Caliber
        </h3>
        <div className="space-y-1">
          {POPULAR_CALIBERS.map((cal) => (
            <label key={cal} className="flex items-center justify-between group cursor-pointer p-2 rounded-md hover:bg-slate-100 transition-colors -mx-2">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 bg-white text-brand focus:ring-brand" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 font-medium">{cal}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">100+</span>
            </label>
          ))}
        </div>
      </div>

      {/* Shipping Score Filter */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Shipping Score
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between text-sm text-slate-600">
            <span>Minimum Score</span>
            <span className="font-mono text-brand font-bold">8+</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            defaultValue="8"
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
          />
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Casing Material */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Casing
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Brass', 'Steel', 'Aluminum', 'Nickel'].map(type => (
            <button key={type} className="px-3 py-1 rounded-full border border-slate-200 bg-white text-xs text-slate-600 hover:border-brand hover:text-brand font-medium transition-colors shadow-sm">
              {type}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};