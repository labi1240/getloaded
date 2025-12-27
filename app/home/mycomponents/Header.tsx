import React from 'react';
import { Search, Crosshair, Menu, Zap, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  showSearch?: boolean;
  onLogoClick?: () => void;
  onSearchSubmit?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ showSearch = true, onLogoClick, onSearchSubmit }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Section */}
          <div 
            className="flex items-center flex-shrink-0 gap-2 cursor-pointer group"
            onClick={onLogoClick}
          >
            <div className="bg-brand rounded-lg p-1.5 shadow-md shadow-brand/20 group-hover:shadow-brand/40 transition-shadow duration-300">
              <Crosshair className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
              Get<span className="text-brand">Loaded</span>
            </span>
          </div>

          {/* Search Feature - Conditional Render */}
          {showSearch ? (
            <div className="flex-1 max-w-2xl relative group animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand transition-colors" />
              </div>
              <input
                type="text"
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit?.(e.currentTarget.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand focus:border-brand sm:text-sm transition-all shadow-inner"
                placeholder="Search caliber, SKU, or brand..."
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white text-slate-500 border border-slate-200 shadow-sm">
                  ⌘K
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1" /> /* Spacer */
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-1 text-slate-600 hover:text-brand transition-colors text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Vetted Dealers</span>
            </button>
            <button className="hidden md:flex items-center gap-1 text-slate-600 hover:text-brand transition-colors text-sm font-medium">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Alerts</span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden md:block mx-1"></div>
            <button className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};