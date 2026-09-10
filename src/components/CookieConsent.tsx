import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react';

export default function CookieConsent({ onOpenPrivacy }: { onOpenPrivacy?: () => void }) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [adConsent, setAdConsent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gk_cookie_consent');
    if (!saved) {
      // Delay showing banner slightly for smooth UX
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'gk_cookie_consent',
      JSON.stringify({
        necessary: true,
        analytics: true,
        advertising: true,
        date: new Date().toISOString(),
      }),
    );
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem(
      'gk_cookie_consent',
      JSON.stringify({
        necessary: true,
        analytics: false,
        advertising: false,
        date: new Date().toISOString(),
      }),
    );
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem(
      'gk_cookie_consent',
      JSON.stringify({
        necessary: true,
        analytics: analyticsConsent,
        advertising: adConsent,
        date: new Date().toISOString(),
      }),
    );
    setShowSettings(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="কুকি ও গোপনীয়তা সম্মতি"
      className="fixed bottom-3 left-3 right-3 md:left-6 md:right-auto md:max-w-md z-50 bg-stone-900 text-stone-100 p-4 md:p-5 rounded-xl shadow-2xl border border-stone-800 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      {!showSettings ? (
        <div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-stone-800 rounded-lg text-amber-400 shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                কুকি ও গোপনীয়তা নীতিমালা
              </h2>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                ঘুষখোর প্ল্যাটফর্ম নাগরিক ভোট, সেশন সিকিউরিটি ও প্ল্যাটফর্ম বিশ্লেষণের জন্য কুকি এবং লোকাল স্টোরেজ ব্যবহার করে। ভবিষ্যতে বিজ্ঞাপন চালু হলে গুগল এডসেন্স কুকি প্রয়োগ হতে পারে।
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="text-xs text-stone-400 hover:text-white underline"
            >
              গোপনীয়তা নীতি পড়ুন
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="px-2.5 py-1.5 text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-md transition-colors"
              >
                পছন্দমতো বাছাই
              </button>
              <button
                type="button"
                onClick={handleAcceptNecessary}
                className="px-2.5 py-1.5 text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-md transition-colors"
              >
                শুধুমাত্র আবশ্যক
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-600 rounded-md transition-colors"
              >
                সব গ্রহণ করুন
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              কুকি সেটিংস কাস্টমাইজেশন
            </h2>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 mt-3 text-xs text-stone-300">
            <div className="flex items-center justify-between p-2 bg-stone-800/60 rounded">
              <div>
                <p className="font-medium text-white">আবশ্যকীয় কুকি (Essential)</p>
                <p className="text-[11px] text-stone-400">সিকিউরিটি ও নাগরিক ভোট সেশন সংরক্ষণে আবশ্যক।</p>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-950/60 rounded">
                বাধ্যতামূলক
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-stone-800/60 rounded">
              <div>
                <p className="font-medium text-white">অ্যানালিটিক্স কুকি (Analytics)</p>
                <p className="text-[11px] text-stone-400">সাইট লোডিং পারফরম্যান্স ও পেজভিউ উন্নয়নে।</p>
              </div>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="rounded accent-red-600 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2 bg-stone-800/60 rounded">
              <div>
                <p className="font-medium text-white">বিজ্ঞাপন ও এডসেন্স কুকি (AdSense)</p>
                <p className="text-[11px] text-stone-400">ভবিষ্যতে ব্যক্তিগতকৃত প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শনের জন্য।</p>
              </div>
              <input
                type="checkbox"
                checked={adConsent}
                onChange={(e) => setAdConsent(e.target.checked)}
                className="rounded accent-red-600 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
            >
              ফিরে যান
            </button>
            <button
              type="button"
              onClick={handleSaveCustom}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-600 rounded-md transition-colors"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
