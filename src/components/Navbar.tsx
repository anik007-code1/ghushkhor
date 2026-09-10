import { useState, type FormEvent } from 'react';
import { PenLine, Menu, X, Search, MapPin, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onSearch?: (query: string) => void;
}

export default function Navbar({ currentPath, onNavigate, onSearch }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/experiences?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'হোম', path: '/' },
    { label: 'সকল অভিজ্ঞতা', path: '/experiences' },
    { label: 'জনপ্রিয় প্রতিবেদন', path: '/popular' },
    { label: 'বিভাগ ও জেলা', path: '/divisions' },
    { label: 'আমাদের সম্পর্কে', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      {/* Top micro-bar: Independent Platform Disclaimer */}
      <div className="bg-stone-950 px-4 py-1.5 text-[11px] text-stone-400 border-b border-stone-800/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>সম্পূর্ণ স্বাধীন, নির্দলীয় ও বেসরকারি নাগরিক তথ্য প্ল্যাটফর্ম (অফিসিয়াল কোনো সরকারি সাইট নয়)</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onNavigate('/editorial-policy')}
              className="hover:text-stone-200 transition-colors"
            >
              সম্পাদকীয় নীতিমালা
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('/community-guidelines')}
              className="hover:text-stone-200 transition-colors"
            >
              কমিউনিটি গাইডলাইন
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => onNavigate('/')}
            className="cursor-pointer flex items-center gap-3 group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-inner group-hover:bg-red-600 transition-colors">
              ঘু
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
                  ঘুষখোর
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400 border border-red-800/80 bg-red-950/60 px-1.5 py-0.5 rounded">
                  নাগরিক প্ল্যাটফর্ম
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                বাংলাদেশের নাগরিক সেবা অভিজ্ঞতা ও জবাবদিহিতা
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => onNavigate(link.path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-stone-800 text-red-400 font-semibold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
              aria-label="অনুসন্ধান করুন"
              title="অনুসন্ধান"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Write Experience Button */}
            <button
              type="button"
              onClick={() => onNavigate('/write')}
              className="flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm transition-all active:scale-95"
            >
              <PenLine className="w-4 h-4" />
              <span>অভিজ্ঞতা লিখুন</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="py-3 border-t border-stone-800 animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="অভিজ্ঞতা খুঁজুন (যেমন: পাসপোর্ট, ভূমি, বিদ্যুৎ, বিআরটিএ, জেলা)..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg px-4 py-2 text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-red-500"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                খুঁজুন
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-t border-stone-800 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => {
                onNavigate(link.path);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-stone-200 hover:bg-stone-800 hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-stone-800/80 space-y-1 text-xs text-stone-400">
            <button
              onClick={() => {
                onNavigate('/editorial-policy');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1.5 px-3 hover:text-stone-200"
            >
              সম্পাদকীয় নীতিমালা
            </button>
            <button
              onClick={() => {
                onNavigate('/community-guidelines');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1.5 px-3 hover:text-stone-200"
            >
              কমিউনিটি গাইডলাইন
            </button>
            <button
              onClick={() => {
                onNavigate('/privacy');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1.5 px-3 hover:text-stone-200"
            >
              গোপনীয়তা নীতি
            </button>
            <button
              onClick={() => {
                onNavigate('/terms');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-1.5 px-3 hover:text-stone-200"
            >
              ব্যবহারের শর্তাবলি
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
