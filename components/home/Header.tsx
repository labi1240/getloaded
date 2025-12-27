"use client"
import React from 'react';
import { Search, Crosshair, Menu, Zap, ShieldCheck, ShoppingCart, User } from 'lucide-react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  showSearch?: boolean;
  onLogoClick?: () => void;
  onSearchSubmit?: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ showSearch = true, onLogoClick, onSearchSubmit }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 border-b border-slate-200 shadow-sm backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo Section */}
          <div className="flex items-center shrink-0 gap-6">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={onLogoClick}
            >
              <div className="bg-linear-to-br from-brand-600 to-brand-700 rounded-lg p-1.5 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/30 group-hover:scale-105 transition-all duration-300 ring-1 ring-white/20">
                <Crosshair className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
                <Link href="/">Ammo<span className="text-brand-600">Metric</span></Link>
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/firearms"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/')
                  ? 'text-brand-700 bg-brand-50/80 shadow-sm shadow-brand-100 ring-1 ring-brand-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
              >
                Firearms
              </Link>
              <Link
                href="/ammo"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/ammo')
                  ? 'text-brand-700 bg-brand-50/80 shadow-sm shadow-brand-100 ring-1 ring-brand-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
              >
                Ammo
              </Link>
            </nav>
          </div>

          {/* Search Feature - Conditional Render */}
          {showSearch ? (
            <div className="hidden sm:block flex-1 max-w-2xl relative group animate-in fade-in zoom-in-95 duration-300 px-4">
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within/input:text-brand-600 transition-colors" />
                </div>
                <input
                  type="text"
                  onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit?.(e.currentTarget.value)}
                  className="block w-full pl-10 pr-12 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-slate-300"
                  placeholder="Search caliber, SKU, or brand..."
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                  <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400 border border-slate-200 bg-white">
                    ⌘K
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Simple Title for Home View (optional, or just spacer) */
            <div className="flex-1" />
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Vetted Badge (Desktop) */}
            <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-600 hover:text-brand-700 hover:bg-brand-50 transition-all duration-200 text-sm font-medium border border-transparent hover:border-brand-100">
              <ShieldCheck className="h-4 w-4 text-brand-600" />
              <span>Vetted</span>
            </button>

            {/* Alerts (Desktop) */}
            <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-all duration-200 text-sm font-medium border border-transparent hover:border-amber-100">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Deals</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden md:block mx-1"></div>

            {/* Icons Group */}
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative group">
                {/* <ShoppingCart className="h-5 w-5" /> */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white"></span>
              </button>

              <button className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                <User className="h-5 w-5" />
              </button>

              <button className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none ml-1">
                <Menu className="h-6 w-6" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};