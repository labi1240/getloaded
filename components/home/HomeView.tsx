import React from 'react';
import Link from 'next/link';
import { Target, Package, ChevronRight, Gift, Crosshair, Award, Settings, Shield, Zap } from 'lucide-react';
import { HomeSearch } from './HomeSearch';
import { ImageWithFallback } from '../ImageWithFallback'; // Adjusted path assuming HomeView is in components/home/
import { Product } from './types';

interface HomeViewProps {
  topBrands?: Array<{ name: string; domain: string | null; logo: string | null; count: number }>;
  topRetailers?: Array<{ name: string; domain: string | null; logo: string | null; count: number; rating: number }>;
  topHandgunCalibers?: Array<{ name: string; slug: string; count: number }>;
  topRifleCalibers?: Array<{ name: string; slug: string; count: number }>;
  topRimfireCalibers?: Array<{ name: string; slug: string; count: number }>;
  topShotgunCalibers?: Array<{ name: string; slug: string; count: number }>;
  // Real Data Previews
  featuredHandgunAmmo?: Product[];
  featuredRifleAmmo?: Product[];
  featuredRimfireAmmo?: Product[];
  featuredShotgunAmmo?: Product[];
  featuredHandgunFirearms?: Product[];
  featuredRifleFirearms?: Product[];
  featuredShotgunFirearms?: Product[];
  featuredAccessories?: Product[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  topBrands = [],
  topRetailers = [],
  topHandgunCalibers = [],
  topRifleCalibers = [],
  topRimfireCalibers = [],
  topShotgunCalibers = [],
  featuredHandgunAmmo = [],
  featuredRifleAmmo = [],
  featuredRimfireAmmo = [],
  featuredShotgunAmmo = [],
  featuredHandgunFirearms = [],
  featuredRifleFirearms = [],
  featuredShotgunFirearms = [],
  featuredAccessories = []
}) => {

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-slate-50">

      {/* Hero / Search Section */}
      <section className="bg-white border-b border-slate-100 pt-20 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center relative overflow-hidden">

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-brand-50/50 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-50/50 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl w-full relative z-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Find <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-600 to-brand-500">In-Stock</span><br className="hidden sm:block" /> Guns & Ammo Instantly
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop overpaying. Compare live inventory from 100+ vetted retailers. Scan barcodes or search to find the best deals in seconds.
          </p>

          {/* Main Search Component - Client Side */}
          <React.Suspense>
            <HomeSearch />
          </React.Suspense>

          {/* Quick Stat (optional flair) */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Live pricing from 100+ retailers updated seconds ago
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
                      {topHandgunCalibers.slice(0, 8).map(cal => (
                        <li key={cal.slug}>
                          <Link href={`/ammo/${cal.slug}`} className="flex items-center text-xs font-medium text-slate-600 hover:text-brand transition-colors">
                            <ChevronRight className="h-3 w-3 mr-1 text-slate-400" /> {cal.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/60 border-t border-blue-100 p-4 mt-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Best Sellers</div>
                    <div className="space-y-3">
                      {featuredHandgunAmmo.map(item => (
                        <Link key={item.id} href={`/ammo/${item.slug || item.id}`} className="flex items-center gap-3 group cursor-pointer">
                          <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center p-1 shrink-0">
                            <img src={item.image} className="max-w-full max-h-full" alt={item.name} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                            <div className="text-xs text-slate-500 font-mono">${item.cpr?.toFixed(2)}/rd</div>
                          </div>
                        </Link>
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
                      {topRifleCalibers.slice(0, 8).map(cal => (
                        <li key={cal.slug}>
                          <Link href={`/ammo/${cal.slug}`} className="flex items-center text-xs font-medium text-slate-600 hover:text-brand transition-colors">
                            <ChevronRight className="h-3 w-3 mr-1 text-slate-400" /> {cal.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/60 border-t border-blue-100 p-4 mt-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Trending Now</div>
                    <div className="space-y-3">
                      {featuredRifleAmmo.map(item => (
                        <Link key={item.id} href={`/ammo/${item.slug || item.id}`} className="flex items-center gap-3 group cursor-pointer">
                          <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center p-1 shrink-0">
                            <img src={item.image} className="max-w-full max-h-full" alt={item.name} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                            <div className="text-xs text-slate-500 font-mono">${item.cpr?.toFixed(2)}/rd</div>
                          </div>
                        </Link>
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
                      {topRimfireCalibers.slice(0, 8).map(cal => (
                        <li key={cal.slug}>
                          <Link href={`/ammo/${cal.slug}`} className="flex items-center text-xs font-medium text-slate-600 hover:text-brand transition-colors">
                            <ChevronRight className="h-3 w-3 mr-1 text-slate-400" /> {cal.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/60 border-t border-slate-200 p-4 mt-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Popular Plinking</div>
                    <div className="space-y-3">
                      {featuredRimfireAmmo.map(item => (
                        <Link key={item.id} href={`/ammo/${item.slug || item.id}`} className="flex items-center gap-3 group cursor-pointer">
                          <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center p-1 shrink-0">
                            <img src={item.image} className="max-w-full max-h-full" alt={item.name} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                            <div className="text-xs text-slate-500 font-mono">${item.cpr?.toFixed(2)}/rd</div>
                          </div>
                        </Link>
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
                      {topShotgunCalibers.slice(0, 8).map(cal => (
                        <li key={cal.slug}>
                          <Link href={`/ammo/${cal.slug}`} className="flex items-center text-xs font-medium text-slate-600 hover:text-brand transition-colors">
                            <ChevronRight className="h-3 w-3 mr-1 text-slate-400" /> {cal.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/60 border-t border-slate-200 p-4 mt-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Loads</div>
                    <div className="space-y-3">
                      {featuredShotgunAmmo.map(item => (
                        <Link key={item.id} href={`/ammo/${item.slug || item.id}`} className="flex items-center gap-3 group cursor-pointer">
                          <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center p-1 shrink-0">
                            <img src={item.image} className="max-w-full max-h-full" alt={item.name} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                            <div className="text-xs text-slate-500 font-mono">${item.cpr?.toFixed(2)}/rd</div>
                          </div>
                        </Link>
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
                    {featuredHandgunFirearms.map(item => (
                      <Link key={item.id} href={`/firearms/${item.slug || item.id}`} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-slate-50 rounded border border-slate-100 flex items-center justify-center p-1 shrink-0">
                          <img src={item.image} className="max-w-full max-h-full" alt={item.name} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                          <div className="text-xs text-slate-500 font-mono">${item.price.toLocaleString()}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/firearms/handgun" className="flex items-center justify-center w-full mt-4 py-2 text-sm text-brand font-medium border border-brand/20 rounded-lg hover:bg-brand/5 transition-colors">
                    View All Handguns
                  </Link>
                </div>

                {/* Rifles */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Rifles</h3>
                  <div className="space-y-3">
                    {featuredRifleFirearms.map(item => (
                      <Link key={item.id} href={`/firearms/${item.slug || item.id}`} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-slate-50 rounded border border-slate-100 flex items-center justify-center p-1 shrink-0">
                          <img src={item.image} className="max-w-full max-h-full" alt={item.name} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                          <div className="text-xs text-slate-500 font-mono">${item.price.toLocaleString()}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/firearms/rifle" className="flex items-center justify-center w-full mt-4 py-2 text-sm text-brand font-medium border border-brand/20 rounded-lg hover:bg-brand/5 transition-colors">
                    View All Rifles
                  </Link>
                </div>

                {/* Shotguns */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Shotguns</h3>
                  <div className="space-y-3">
                    {featuredShotgunFirearms.map(item => (
                      <Link key={item.id} href={`/firearms/${item.slug || item.id}`} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-slate-50 rounded border border-slate-100 flex items-center justify-center p-1 shrink-0">
                          <img src={item.image} className="max-w-full max-h-full" alt={item.name} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-900 truncate group-hover:text-brand">{item.name}</div>
                          <div className="text-xs text-slate-500 font-mono">${item.price.toLocaleString()}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link href="/firearms/shotgun" className="flex items-center justify-center w-full mt-4 py-2 text-sm text-brand font-medium border border-brand/20 rounded-lg hover:bg-brand/5 transition-colors">
                    View All Shotguns
                  </Link>
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
                    <Link href="/?q=Magazines" className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium hover:border-brand hover:text-brand transition-colors">Magazines</Link>
                    <Link href="/?q=Optics" className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium hover:border-brand hover:text-brand transition-colors">Optics</Link>
                    <Link href="/?q=Triggers" className="px-3 py-1 bg-white border border-slate-300 rounded text-sm font-medium hover:border-brand hover:text-brand transition-colors">Triggers</Link>
                  </div>
                </div>
                <div className="w-full md:w-1/3 space-y-2">
                  {featuredAccessories.map(item => (
                    <Link key={item.id} href={`/product/${item.slug || item.id}`} className="flex items-center gap-3 bg-white p-2 rounded border border-slate-200">
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <img src={item.image} className="max-w-full max-h-full" alt={item.name} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{item.name}</div>
                        <div className="text-xs text-slate-500 font-mono">${item.price.toFixed(2)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Brands Section */}
            {topBrands.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Award className="h-6 w-6 text-brand" /> Popular Brands
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {topBrands.map((brand) => (
                    <Link
                      key={brand.name}
                      href={`/?q=${encodeURIComponent(brand.name)}`}
                      className="group relative flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-brand/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="h-12 w-full flex items-center justify-center mb-2">
                        <ImageWithFallback
                          src={brand.logo || `https://logo.clearbit.com/${brand.domain || brand.name.replace(/\s+/g, '').toLowerCase() + '.com'}?size=128`}
                          fallbackSrc={'https://placehold.co/100x50?text=' + brand.name.charAt(0)}
                          alt={brand.name}
                          className="max-h-full max-w-full object-contain opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500 group-hover:text-brand">{brand.count}+ Products</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Top Retailers Section */}
            {topRetailers.length > 0 && (
              <div className="space-y-6 pt-8 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-brand" /> Trusted Retailers
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {topRetailers.map((retailer) => (
                    <Link
                      key={retailer.name}
                      href={`/ammo?retailers=${encodeURIComponent(retailer.name)}`}
                      className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-brand hover:shadow-md transition-all group"
                    >
                      <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center p-2 border border-slate-100 group-hover:border-brand/20">
                        <ImageWithFallback
                          src={retailer.logo || `https://logo.clearbit.com/${retailer.domain || retailer.name.replace(/\s+/g, '').toLowerCase() + '.com'}?size=64`}
                          alt={retailer.name}
                          className="max-w-full max-h-full object-contain"
                          fallbackSrc="" // If empty, our component logic handles it or we can pass a specific placeholder
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate group-hover:text-brand">{retailer.name}</div>
                        <div className="text-xs text-slate-500">{retailer.count.toLocaleString()} Active Offers</div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-3 h-3 ${i < Math.round(retailer.rating || 5) ? 'fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

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