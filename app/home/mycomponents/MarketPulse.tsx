import React from 'react';
import { TRENDING_METRICS } from '../constants';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export const MarketPulse: React.FC = () => {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Ammunition Ledger
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time technical aggregate across 104 verified manufacturers.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            {TRENDING_METRICS.map((metric, idx) => (
              <div key={idx} className="flex flex-col bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {metric.label}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-mono font-bold text-slate-900">
                    {metric.value}
                  </span>
                  {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-emerald-600" />}
                  {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-rose-600" />}
                  {metric.trend === 'flat' && <Minus className="h-4 w-4 text-slate-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};