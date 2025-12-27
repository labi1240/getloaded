import React, { useState } from 'react';
import { Search, ScanBarcode, ArrowRight, Zap, Target, Package, ChevronRight, Gift, Crosshair, Award, Settings, Shield } from 'lucide-react';
import { BarcodeScanner } from './BarcodeScanner';
import { MOCK_LISTINGS } from '../constants';
import { Product } from '../types';

interface HomePageProps {
  onSearch: (term: string) => void;
}

const POPULAR_BRANDS = [
  { name: 'Federal Premium', domain: 'federalpremium.com' },
  { name: 'CCI Ammunition', domain: 'cci-ammunition.com' },
  { name: 'Hornady', domain: 'hornady.com' },
  { name: 'Winchester', domain: 'winchester.com' },
  { name: 'Remington', domain: 'remington.com' },
  { name: 'PMC Ammo', domain: 'pmcammo.com' },
  { name: 'Fiocchi', domain: 'fiocchiusa.com' },
  { name: 'Sig Sauer', domain: 'sigsauer.com' },
];

export const HomePage: React.FC<HomePageProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleScan = (code: string) => {
    setSearchTerm(code);
    setIsScannerOpen(false);
    onSearch(code);
  };

  // Helper to get top items for a category
  const getPreviewItems = (category: string, subCategory: string): Product[] => {
    if (category === 'ammo') {
      if (subCategory === 'Handgun') return MOCK_LISTINGS.filter(i => i.category === 'ammo' && (i.caliber?.includes('9mm') || i.caliber?.includes('45'))).slice(0, 3);
      if (subCategory === 'Rifle') return MOCK_LISTINGS.filter(i => i.category === 'ammo' && (i.caliber?.includes('5.56') || i.caliber?.includes('7.62'))).slice(0, 3);
      if (subCategory === 'Rimfire') return MOCK_LISTINGS.filter(i => i.category === 'ammo' && i.caliber?.includes('.22')).slice(0, 3);
      if (subCategory === 'Shotgun') return MOCK_LISTINGS.filter(i => i.category === 'ammo' && i.caliber?.includes('12 Gauge')).slice(0, 3);
    }
    if (category === 'firearm') {
      if (subCategory === 'Handgun') return MOCK_LISTINGS.filter(i => i.category === 'firearm' && (i.name.includes('Sig') || i.name.includes('Glock'))).slice(0, 3);
      if (subCategory === 'Rifle') return MOCK_LISTINGS.filter(i => i.category === 'firearm' && (i.name.includes('Daniel') || i.name.includes('Ruger'))).slice(0, 3);
      if (subCategory === 'Shotgun') return MOCK_LISTINGS.filter(i => i.category === 'firearm' && i.name.includes('Mossberg')).slice(0, 3);
    }
    if (category === 'part') {
      return MOCK_LISTINGS.filter(i => i.category === 'part').slice(0, 3);
    }
    return [];
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50">

      {isScannerOpen && (
        <BarcodeScanner onScan={handleScan} onClose={() => setIsScannerOpen(false)} />
      )}

      {/* Hero / Search Section */}
      <section className="bg-white border-b border-slate-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Find <span className="text-brand">In-Stock</span> Guns & Ammo
          </h1>
          <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
            Scan UPCs, compare prices across 100+ vetted retailers, and never overpay again.
          </p>

          {/* Main Search Component */}
          <div className="relative max-w-2xl mx-auto group z-10">
            <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-200 shadow-xl p-2 group-focus-within:border-brand transition-colors">
              <div className="pl-4 pr-2">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none text-lg text-slate-900 placeholder-slate-400 focus:ring-0 px-2 py-2"
                placeholder="Search 9mm, Glock 19, or 'Federal HST'..."
                autoFocus
              />

              {/* Barcode Scanner Button */}
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors mr-2 font-medium"
                title="Scan Barcode"
              >
                <ScanBarcode className="h-5 w-5 text-slate-600" />
                <span className="text-sm hidden sm:inline">Scan</span>
              </button>

              <button
                onClick={handleSearch}
                className="bg-brand hover:bg-brand-dark text-white p-3 rounded-lg transition-colors shadow-lg shadow-brand/20"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Categories & Brands */}
          <div className="lg:col-span-2 space-y-12">

            {/* AMMUNITION CATEGORIES */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Target className="h-6 w-6 text-brand" /> Shop Ammunition
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Handgun Ammo */}
                <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-0 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  <div className="p-6 pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-900">Handgun</h3>
                      <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    <ul className="grid grid-cols-2 gap-2 mb-6">
                      {['9mm Luger', '45 ACP', '380 Auto', '10mm', '38 Spl', '357 Mag', '40 S&W', '5.7x28'].map(cal => (
                        <li key={cal}>
                          <button onClick={() => onSearch(cal)} className="flex items-center text-xs font-medium text-slate-600 hover:text-brand transition-colors">
                            <ChevronRight className="h-3 w-3 mr-1 text-slate-400" /> {cal}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/60 border-t border-blue-100 p-4 mt-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Best Sellers</div>
                    <div className="space-y-3">
                      {getPreviewItems('ammo', 'Handgun').map(item => (
                        <div key={item.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => onSearch(item.name)}>
                          <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center p-1 flex-shrink-0">
                            <img src={item.image} className="max-w-full max-h-full" alt="" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                            <div className="text-xs text-slate-500 font-mono">${item.cpr?.toFixed(2)}/rd</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rifle Ammo */}
                <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-0 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  <div className="p-6 pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-900">Rifle</h3>
                      <Crosshair className="h-5 w-5 text-blue-400" />
                    </div>
                    <ul className="grid grid-cols-2 gap-2 mb-6">
                      {['5.56 NATO', '223 Rem', '308 Win', '7.62x39', '300 Blk', '6.5 Creed', '30-06', '45-70'].map(cal => (
                        <li key={cal}>
                          <button onClick={() => onSearch(cal)} className="flex items-center text-xs font-medium text-slate-600 hover:text-brand transition-colors">
                            <ChevronRight className="h-3 w-3 mr-1 text-slate-400" /> {cal}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/60 border-t border-blue-100 p-4 mt-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Trending Now</div>
                    <div className="space-y-3">
                      {getPreviewItems('ammo', 'Rifle').map(item => (
                        <div key={item.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => onSearch(item.name)}>
                          <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center p-1 flex-shrink-0">
                            <img src={item.image} className="max-w-full max-h-full" alt="" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                            <div className="text-xs text-slate-500 font-mono">${item.cpr?.toFixed(2)}/rd</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rimfire Ammo */}
                <div className="bg-slate-100 rounded-xl border border-slate-200 p-0 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  <div className="p-6 pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-900">Rimfire</h3>
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                    <ul className="grid grid-cols-2 gap-2 mb-6">
                      {['22 LR', '22 WMR', '17 HMR', '22 Short', '22 Long'].map(cal => (
                        <li key={cal}>
                          <button onClick={() => onSearch(cal)} className="flex items-center text-xs font-medium text-slate-600 hover:text-brand transition-colors">
                            <ChevronRight className="h-3 w-3 mr-1 text-slate-400" /> {cal}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/60 border-t border-slate-200 p-4 mt-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular Plinking</div>
                    <div className="space-y-3">
                      {getPreviewItems('ammo', 'Rimfire').map(item => (
                        <div key={item.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => onSearch(item.name)}>
                          <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center p-1 flex-shrink-0">
                            <img src={item.image} className="max-w-full max-h-full" alt="" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                            <div className="text-xs text-slate-500 font-mono">${item.cpr?.toFixed(2)}/rd</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Shotgun Ammo */}
                <div className="bg-slate-100 rounded-xl border border-slate-200 p-0 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  <div className="p-6 pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-900">Shotgun</h3>
                      <Target className="h-5 w-5 text-slate-400" />
                    </div>
                    <ul className="grid grid-cols-2 gap-2 mb-6">
                      {['12 Gauge', '20 Gauge', '410 Bore', '16 Gauge', '28 Gauge'].map(cal => (
                        <li key={cal}>
                          <button onClick={() => onSearch(cal)} className="flex items-center text-xs font-medium text-slate-600 hover:text-brand transition-colors">
                            <ChevronRight className="h-3 w-3 mr-1 text-slate-400" /> {cal}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/60 border-t border-slate-200 p-4 mt-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Loads</div>
                    <div className="space-y-3">
                      {getPreviewItems('ammo', 'Shotgun').map(item => (
                        <div key={item.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => onSearch(item.name)}>
                          <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center p-1 flex-shrink-0">
                            <img src={item.image} className="max-w-full max-h-full" alt="" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                            <div className="text-xs text-slate-500 font-mono">${item.cpr?.toFixed(2)}/rd</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* FIREARM CATEGORIES */}
            <div className="space-y-6 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Shield className="h-6 w-6 text-brand" /> Browse Firearms
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Handguns */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Handguns</h3>
                  <div className="space-y-3">
                    {getPreviewItems('firearm', 'Handgun').map(item => (
                      <div key={item.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => onSearch(item.name)}>
                        <div className="w-10 h-10 bg-slate-50 rounded border border-slate-100 flex items-center justify-center p-1 flex-shrink-0">
                          <img src={item.image} className="max-w-full max-h-full" alt="" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                          <div className="text-xs text-slate-500 font-mono">${item.price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => onSearch('Handguns')} className="w-full mt-4 py-2 text-sm text-brand font-medium border border-brand/20 rounded-lg hover:bg-brand/5 transition-colors">
                    View All Handguns
                  </button>
                </div>

                {/* Rifles */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Rifles</h3>
                  <div className="space-y-3">
                    {getPreviewItems('firearm', 'Rifle').map(item => (
                      <div key={item.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => onSearch(item.name)}>
                        <div className="w-10 h-10 bg-slate-50 rounded border border-slate-100 flex items-center justify-center p-1 flex-shrink-0">
                          <img src={item.image} className="max-w-full max-h-full" alt="" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                          <div className="text-xs text-slate-500 font-mono">${item.price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => onSearch('Rifles')} className="w-full mt-4 py-2 text-sm text-brand font-medium border border-brand/20 rounded-lg hover:bg-brand/5 transition-colors">
                    View All Rifles
                  </button>
                </div>

                {/* Shotguns */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Shotguns</h3>
                  <div className="space-y-3">
                    {getPreviewItems('firearm', 'Shotgun').map(item => (
                      <div key={item.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => onSearch(item.name)}>
                        <div className="w-10 h-10 bg-slate-50 rounded border border-slate-100 flex items-center justify-center p-1 flex-shrink-0">
                          <img src={item.image} className="max-w-full max-h-full" alt="" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                          <div className="text-xs text-slate-500 font-mono">${item.price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => onSearch('Shotguns')} className="w-full mt-4 py-2 text-sm text-brand font-medium border border-brand/20 rounded-lg hover:bg-brand/5 transition-colors">
                    View All Shotguns
                  </button>
                </div>

              </div>
            </div>

            {/* PARTS & GEAR */}
            <div className="space-y-6 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="h-6 w-6 text-brand" /> Parts & Gear
              </h2>
              <div className="bg-slate-100 rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900">Magazines, Optics, and Triggers</h3>
                  <p className="text-sm text-slate-600">Find the best prices on PMAGs, Holosun optics, Geissele triggers, and more from our network of retailers.</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => onSearch('Magazines')} className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium hover:border-brand hover:text-brand transition-colors">Magazines</button>
                    <button onClick={() => onSearch('Optics')} className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium hover:border-brand hover:text-brand transition-colors">Optics</button>
                    <button onClick={() => onSearch('Triggers')} className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium hover:border-brand hover:text-brand transition-colors">Triggers</button>
                  </div>
                </div>
                <div className="w-full md:w-1/3 space-y-2">
                  {getPreviewItems('part', 'any').map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-white p-2 rounded border border-slate-200" onClick={() => onSearch(item.name)}>
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <img src={item.image} className="max-w-full max-h-full" alt="" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{item.name}</div>
                        <div className="text-xs text-slate-500 font-mono">${item.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Brands Section */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-6 w-6 text-brand" /> Popular Brands
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {POPULAR_BRANDS.map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => onSearch(brand.name)}
                    className="group relative flex items-center justify-center h-24 bg-white border border-slate-200 rounded-xl hover:border-brand/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6"
                  >
                    <img
                      src={`https://logo.clearbit.com/${brand.domain}?size=128`}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                    <span className="sr-only">{brand.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Deals & Codes */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-blue-600 rounded-t-xl p-4 flex items-center justify-center gap-2">
                <Gift className="h-5 w-5 text-white" />
                <h3 className="text-white font-bold text-lg">Latest Deals & Codes</h3>
              </div>
              <div className="bg-white border-x border-b border-slate-200 rounded-b-xl p-0 overflow-hidden shadow-sm">

                {/* Deal Item 1 */}
                <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-brand transition-colors">
                    True Shot Ammo: Sitewide FREE SHIPPING
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    No minimum order size. No code necessary - free shipping will be applied in the cart!
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded border border-green-200">ACTIVE</span>
                    <span className="text-[10px] text-slate-400">2 hours ago</span>
                  </div>
                </div>

                {/* Deal Item 2 */}
                <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-brand transition-colors">
                    Ammunition Depot: 6% Off Everything
                  </h4>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500">Code:</span>
                    <span className="text-xs font-mono font-bold bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200 dashed">6PGIFT</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Or free shipping on orders over $249.
                  </p>
                </div>

                {/* Deal Item 3 */}
                <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-brand transition-colors">
                    Ammo Stop: Military Grade Bulk Deals
                  </h4>
                  <p className="text-xs text-slate-500">
                    Unbeatable prices on 5.56 green tip. Limited time offer.
                  </p>
                </div>

                {/* Deal Item 4 */}
                <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-brand transition-colors">
                    Grab Gun: $15.99 Flat Rate Shipping
                  </h4>
                  <p className="text-xs text-slate-500">
                    Take advantage of flat rate shipping on all ammo orders today.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 text-center">
                  <button className="text-xs font-bold text-brand hover:underline">View All 15 Active Codes</button>
                </div>
              </div>

              {/* Promo Banner */}
              <div className="mt-6 bg-linear-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-center text-white shadow-lg">
                <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <h3 className="font-bold text-lg mb-1">Get Daily Alerts</h3>
                <p className="text-sm text-slate-300 mb-4">Never miss a price drop on your favorite calibers.</p>
                <button className="w-full py-2 bg-brand hover:bg-brand-dark rounded-lg text-sm font-bold transition-colors">
                  Subscribe Free
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};