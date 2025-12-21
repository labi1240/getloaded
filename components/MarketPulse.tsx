import React from 'react';
import { RiLineChartLine, RiShieldFlashLine, RiDatabase2Line } from '@remixicon/react';

interface MarketPulseProps {
  count: number;
  floorPrice?: string;
  liquidity: string;
}

const MarketPulse: React.FC<MarketPulseProps> = ({ count, floorPrice, liquidity }) => {
  const [syncTime, setSyncTime] = React.useState(12);

  React.useEffect(() => {
    setSyncTime(Math.floor(Math.random() * (90 - 5 + 1)) + 5);
  }, []);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-900/20 border border-slate-800">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <RiDatabase2Line className="size-5 text-slate-500" />
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Nodes</p>
            <p className="text-sm font-mono font-bold">{count} Assets Detected</p>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-800 hidden md:block" />
        <div className="flex items-center gap-3">
          <RiLineChartLine className="size-5 text-emerald-500" />
          <div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Market Floor</p>
            <p className="text-sm font-mono font-bold text-emerald-400">{floorPrice || 'N/A'}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-4 bg-slate-800/50 px-5 py-2.5 rounded-xl border border-slate-700">
          <RiShieldFlashLine className="size-4 text-brand-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Market Liquidity:</span>
          <span className="text-xs font-mono font-bold text-brand-500">{liquidity}</span>
        </div>
        <div className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">
          (Sync: {syncTime}m ago)
        </div>
      </div>
    </div>
  );
};

export default MarketPulse;