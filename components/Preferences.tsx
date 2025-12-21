'use client';

import React from 'react';
import { useGlobal } from './GlobalProvider';

const Preferences: React.FC = () => {
  const { blockedRetailers, toggleBlockRetailer, allRetailers } = useGlobal();

  // Determine which retailers are NOT currently blocked to show in a "Quick Block" list (simulation)
  const activeRetailers = allRetailers.filter(r => !blockedRetailers.includes(r.name)).slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">

        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-slate-900">Preferences</h3>
            <p className="mt-1 text-sm text-slate-500">
              Customize your feed by hiding retailers or brands you prefer not to do business with.
            </p>
          </div>

          <nav className="mt-6 space-y-1">
            <a href="#" className="bg-slate-100 text-slate-900 group rounded-md px-3 py-2 flex items-center text-sm font-medium border-l-4 border-brand-500">
              <span className="truncate">Blocked Retailers</span>
            </a>
            <a href="#" className="text-slate-600 hover:bg-slate-50 hover:text-slate-900 group rounded-md px-3 py-2 flex items-center text-sm font-medium border-l-4 border-transparent">
              <span className="truncate">Price Alerts</span>
            </a>
            <a href="#" className="text-slate-600 hover:bg-slate-50 hover:text-slate-900 group rounded-md px-3 py-2 flex items-center text-sm font-medium border-l-4 border-transparent">
              <span className="truncate">Notifications</span>
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="mt-5 md:mt-0 md:col-span-2">

          <div className="shadow sm:rounded-md sm:overflow-hidden bg-white">
            <div className="px-4 py-5 space-y-6 sm:p-6">

              {/* Blocked Retailers Section */}
              <div>
                <h4 className="text-base font-medium text-slate-900">Blocked Retailers</h4>
                <p className="text-sm text-slate-500 mb-4">
                  Offers from these retailers will be hidden from your search results.
                </p>

                {/* The Blocked List - Using "Pill Tags" as per Refactoring UI */}
                <div className="min-h-[60px] p-4 bg-slate-50 rounded-md border border-slate-200 border-dashed">
                  {blockedRetailers.length === 0 ? (
                    <span className="text-sm text-slate-400 italic">No retailers blocked yet.</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {blockedRetailers.map((retailer) => (
                        <span
                          key={retailer}
                          className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-slate-200 text-slate-700 hover:bg-red-100 hover:text-red-700 transition-colors group cursor-pointer"
                          onClick={() => toggleBlockRetailer(retailer)}
                          title="Click to unblock"
                        >
                          {retailer}
                          <button
                            type="button"
                            className="shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-slate-500 hover:bg-red-200 hover:text-red-500 focus:outline-none focus:bg-red-500 focus:text-white"
                          >
                            <span className="sr-only">Remove {retailer}</span>
                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                              <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Simulation of adding to block list */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-sm font-medium text-slate-900 mb-3">Quick Block (Recent Retailers)</h4>
                <div className="space-y-2">
                  {activeRetailers.map((r) => (
                    <div key={r.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{r.name}</span>
                      <button
                        onClick={() => toggleBlockRetailer(r.name)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium hover:underline"
                      >
                        Block
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
