import { Shield, FileText, CheckCircle2, Lock, HelpCircle, ExternalLink, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 mt-16 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-stone-800">
          {/* Col 1 & 2: Platform Identity & Disclaimer */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-red-700 text-white flex items-center justify-center font-bold text-lg">
                ঘু
              </div>
              <span className="font-serif text-2xl font-bold text-white">ঘুষখুর</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              বাংলাদেশের নাগরিকদের সেবা গ্রহণ ও প্রশাসনিক অভিজ্ঞতার দায়িত্বশীল ও উন্মুক্ত আর্কাইভ। নাগরিকদের সচেতনতা বৃদ্ধি ও স্বচ্ছতা প্রতিষ্ঠাই আমাদের মূল লক্ষ্য।
            </p>
            <div className="p-3 bg-stone-950/80 rounded-lg border border-stone-800 text-xs text-stone-400 leading-relaxed">
              <span className="font-semibold text-amber-400 block mb-1">
                ⚠️ স্বাতন্ত্র্য ও স্বাধীনতা ঘোষণা:
              </span>
              ঘুষখুর কোনো সরকারি সংস্থা বা বাংলাদেশ সরকারের অফিশিয়াল ওয়েবসাইট নয়। এটি সম্পূর্ণ স্বাধীন ও নাগরিক-চালিত একটি তথ্য ও পর্যবেক্ষণমূলক প্রকাশনা প্ল্যাটফর্ম।
            </div>
          </div>

          {/* Col 3: গুরুত্বপূর্ণ ও নীতি পাতা (Requirement 32) */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 tracking-wide uppercase">
              নীতিমালা ও নির্দেশিকা
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/editorial-policy')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  সম্পাদকীয় নীতিমালা
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/community-guidelines')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  কমিউনিটি গাইডলাইন
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/privacy')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  গোপনীয়তা নীতি
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  ব্যবহারের শর্তাবলি
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/report-content')}
                  className="hover:text-red-400 hover:underline transition-colors"
                >
                  কনটেন্ট রিপোর্ট / অভিযোগ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: প্ল্যাটফর্ম ও সেবা */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 tracking-wide uppercase">
              প্ল্যাটফর্ম
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  ঘুষখুর সম্পর্কে
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/experiences')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  সকল নাগরিক অভিজ্ঞতা
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/popular')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  জনপ্রিয় প্রতিবেদন
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/divisions')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  বিভাগ ও জেলাভিত্তিক সূচি
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white hover:underline transition-colors"
                >
                  যোগাযোগ ও তথ্য সংশোধন
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: এসইও, এডসেন্স ও টেকনিক্যাল */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 tracking-wide uppercase">
              এসইও ও প্রশাসন
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/search-console-docs')}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1"
                >
                  <span>সার্চ কনসোল ও এডসেন্স গাইড</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/admin/checklist')}
                  className="hover:text-amber-400 hover:underline transition-colors flex items-center gap-1"
                >
                  <span>AdSense প্রকাশনা চেকলিস্ট</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/admin')}
                  className="text-amber-400 hover:text-amber-300 hover:underline transition-colors flex items-center gap-1 font-semibold"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>কাস্টম অ্যাডমিন প্যানেল (/admin)</span>
                </button>
              </li>
              <li className="pt-2 border-t border-stone-800">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-white hover:underline flex items-center gap-1"
                >
                  <span>sitemap.xml</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-white hover:underline flex items-center gap-1"
                >
                  <span>robots.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="/ads.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-white hover:underline flex items-center gap-1"
                >
                  <span>ads.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and language info */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} ঘুষখুর। সর্বস্বত্ব সংরক্ষিত। জনস্বার্থে প্রকাশিত নাগরিক ফোরাম।</p>
          <div className="flex items-center gap-2 text-stone-400">
            <Globe className="w-3.5 h-3.5" />
            <span>ভাষা: বাংলা (বাংলা বর্ণমালা ও প্রমিত বানানরীতি)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
