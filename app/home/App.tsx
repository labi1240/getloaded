"use client"
import React, { useState } from 'react';
import { Header } from './mycomponents/Header';
import { MarketPulse } from './mycomponents/MarketPulse';
import { FilterSidebar } from './mycomponents/FilterSidebar';
import { ProductList } from './mycomponents/ProductList';
import { HomePage } from './mycomponents/HomePage';
import { ChevronRight } from 'lucide-react';

type ViewState = 'home' | 'listings';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [activeTab, setActiveTab] = useState<'ammo' | 'firearms'>('ammo');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    setCurrentView('listings');
  };

  const resetToHome = () => {
    setSearchQuery('');
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand selection:text-white">
      <Header
        showSearch={currentView === 'listings'}
        onLogoClick={resetToHome}
        onSearchSubmit={handleSearch}
      />

      {currentView === 'listings' && <MarketPulse />}

      {currentView === 'home' ? (
        <HomePage onSearch={handleSearch} />
      ) : (
        /* Listings View */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Breadcrumbs / Search Context */}
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <span className="hover:text-brand cursor-pointer font-medium" onClick={resetToHome}>Home</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-900 font-semibold">Results for "{searchQuery}"</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 mb-8 border-b border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ammo')}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ammo' ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Ammunition
            </button>
            <button
              onClick={() => setActiveTab('firearms')}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'firearms' ? 'border-brand text-brand' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Firearms
            </button>
            <button className="pb-4 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap">
              Magazines
            </button>
            <button className="pb-4 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 whitespace-nowrap">
              Reloading
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <FilterSidebar />
            <ProductList />
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-slate-500">
            <div>
              <span className="font-bold text-slate-900 block mb-4">GetLoaded</span>
              <p>The ultimate aggregator for ammunition and firearms. We do not sell items directly. We maintain the ledger.</p>
            </div>
            <div>
              <span className="font-bold text-slate-900 block mb-4">Community</span>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-brand">Report Scam Site</a></li>
                <li><a href="#" className="hover:text-brand">Retailer Application</a></li>
                <li><a href="#" className="hover:text-brand">API Access</a></li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-slate-900 block mb-4">Legal</span>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-brand">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand">Terms of Service</a></li>
                <li><a href="#" className="hover:text-brand">Affiliate Disclosure</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
            &copy; 2025 GetLoaded. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;