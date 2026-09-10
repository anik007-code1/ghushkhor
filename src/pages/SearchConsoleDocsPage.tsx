import { BookOpen, CheckCircle2, Globe, Shield, Search, DollarSign, FileCode, AlertCircle, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface SearchConsoleDocsPageProps {
  onNavigate: (path: string) => void;
}

export default function SearchConsoleDocsPage({ onNavigate }: SearchConsoleDocsPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="গুগল সার্চ কনসোল ও এডসেন্স সেটআপ নির্দেশিকা | ঘুষখোর গাইড"
        description="কাস্টম ডোমেন, গুগল সার্চ কনসোল ভেরিফিকেশন, সাইটম্যাপ সাবমিশন, ads.txt এবং গুগল এডসেন্স অনুমোদনের পূর্ণাঙ্গ নির্দেশিকা।"
        canonicalUrl="/search-console-docs"
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'সার্চ কনসোল ও এডসেন্স গাইড', url: '/search-console-docs' },
        ]}
        onNavigate={onNavigate}
      />

      <article className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-md mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>প্রশাসনিক পরিচালনা ম্যানুয়াল</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            গুগল সার্চ কনসোল ও এডসেন্স নির্দেশিকা
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            ঘুষখোর প্ল্যাটফর্মটিকে সার্চ ইঞ্জিনে শীর্ষ অবস্থানে নিয়ে যাওয়া এবং সফলভাবে গুগল এডসেন্স অনুমোদনের জন্য ধাপে ধাপে নির্দেশিকা।
          </p>
        </div>

        {/* Phase 1: Custom Domain & HTTPS */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Globe className="w-5 h-5 text-red-700" />
            <span>ধাপ ১: কাস্টম ডোমেন ও এসএসএল (HTTPS) সংযোগ</span>
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 space-y-2 leading-relaxed">
            <p>
              গুগল এডসেন্স অনুমোদনের জন্য একটি মানসম্মত টপ-লেভেল ডোমেন (যেমন: <code>.org</code>, <code>.com</code>, <code>.net</code> বা <code>.com.bd</code>) এবং বাধ্যতামূলকভাবে সক্রিয় <strong>HTTPS (SSL)</strong> সার্টিফিকেট প্রয়োজন।
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-2">
              <li>আপনার ডোমেন রেজিস্ট্রার (যেমন: Namecheap, Cloudflare) থেকে DNS এ-রেকর্ড (A Record) দিয়ে সাইটের আইপিতে পয়েন্ট করুন।</li>
              <li>নিশ্চিত করুন যে <code>http://</code> ট্রাফিক স্বয়ংক্রিয়ভাবে <code>https://</code>-এ রিডাইরেক্ট হচ্ছে।</li>
            </ol>
          </div>
        </section>

        {/* Phase 2: Google Search Console */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Search className="w-5 h-5 text-emerald-700" />
            <span>ধাপ ২: গুগল সার্চ কনসোলে প্রপার্টি যুক্ত ও ভেরিফিকেশন</span>
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 space-y-2 leading-relaxed">
            <p>
              গুগলে দ্রুত ইনডেক্সিং এবং সার্চ অ্যানালিটিক্স দেখতে <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-red-700 underline font-semibold">Google Search Console</a>-এ প্রপার্টি খুলুন:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 text-xs block mb-1">পদ্ধতি ১: এইচটিএমএল মেটা ট্যাগ (প্রস্তাবিত)</span>
                <p className="text-[11px] text-stone-600">
                  Search Console থেকে মেটা ট্যাগের কোড কপি করে সাইটের অ্যাডমিন প্যানেলে (সাইট কনফিগারেশন সেকশন) পেস্ট করুন। সার্ভার তা স্বয়ংক্রিয়ভাবে হেড সেকশনে যুক্ত করবে।
                </p>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 text-xs block mb-1">পদ্ধতি ২: ডিএনএস টিএক্সটি রেকর্ড (DNS TXT)</span>
                <p className="text-[11px] text-stone-600">
                  আপনার ডোমেনের DNS ম্যানেজমেন্টে গিয়ে গুগলের দেওয়া ভেরিফিকেশন TXT রেকর্ড যোগ করুন।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3: Submit Sitemap */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <FileCode className="w-5 h-5 text-blue-700" />
            <span>ধাপ ৩: সাইটম্যাপ সাবমিশন (sitemap.xml)</span>
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 space-y-2 leading-relaxed">
            <p>
              সাইট ভেরিফাই হওয়ার পর সার্চ কনসোলের বাম পাশের মেনু থেকে <strong>Sitemaps</strong> অপশনে যান।
            </p>
            <p className="p-3 bg-stone-100 rounded-lg font-mono text-xs">
              ইউআরএল বক্সে লিখুন: <code>sitemap.xml</code> এবং সাবমিট বাটনে ক্লিক করুন।
            </p>
            <p className="text-xs text-stone-500">
              আমাদের প্ল্যাটফর্ম স্বয়ংক্রিয়ভাবে নতুন অনুমোদিত অভিজ্ঞতা ও বিভাগীয় পেজগুলো রিয়েল-টাইমে এই সাইটম্যাপে যুক্ত করে।
            </p>
          </div>
        </section>

        {/* Phase 4: Google AdSense Setup & Approval */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <DollarSign className="w-5 h-5 text-amber-700" />
            <span>ধাপ ৪: গুগল এডসেন্স আবেদন ও অনুমোদন কৌশল</span>
          </h2>
          <div className="text-xs sm:text-sm text-stone-700 space-y-3 leading-relaxed">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-950">
              <span className="font-bold block text-sm">রিজেকশন (Low Value Content) এড়াতে করণীয়:</span>
              <ul className="list-disc list-inside space-y-1 text-amber-900 pl-1">
                <li>আবেদনের পূর্বে নিশ্চিত করুন অন্তত ১৫-২০টি বিস্তারিত ও মানসম্মত অভিজ্ঞতা প্রকাশিত হয়েছে।</li>
                <li>গোপনীয়তা নীতি, ব্যবহারের শর্তাবলি, এবাউট এবং যোগাযোগ পাতা সম্পূর্ণ কার্যকর রাখুন।</li>
                <li>কোনো ফাঁকা বা ডামি কনটেন্ট রাখবেন না (আমাদের প্ল্যাটফর্ম স্বয়ংক্রিয়ভাবে শূন্য পাতায় noindex যুক্ত করে)।</li>
              </ul>
            </div>

            <p>
              গুগল এডসেন্সে সাইট যোগ করার পর প্রাপ্ত <strong>Publisher ID</strong> (যেমন: <code>pub-XXXXXXXXXXXXXXXX</code>) এডমিন প্যানেলের সেটিংস ট্যাবে ইনপুট দিন এবং <code>ads.txt</code> চেক করুন।
            </p>
          </div>
        </section>

        {/* Phase 5: ads.txt verification */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Shield className="w-5 h-5 text-stone-700" />
            <span>ধাপ ৫: ads.txt যাচাইকরণ</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            এডসেন্স চালু হলে আপনার সাইটের রুটে <code>/ads.txt</code> সঠিকভাবে দৃশ্যমান হতে হবে। আপনার ব্রাউজারে <a href="/ads.txt" target="_blank" rel="noopener noreferrer" className="text-red-700 underline font-semibold">/ads.txt</a> ওপেন করে নিশ্চিত করুন যে সেখানে আপনার পাবলিশার আইডি সঠিক রয়েছে।
          </p>
        </section>

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            <span>মূল পাতায় ফিরে যান</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </article>
    </div>
  );
}
