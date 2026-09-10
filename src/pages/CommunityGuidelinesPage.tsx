import { CheckCircle2, XCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface CommunityGuidelinesPageProps {
  onNavigate: (path: string) => void;
}

export default function CommunityGuidelinesPage({ onNavigate }: CommunityGuidelinesPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="কমিউনিটি গাইডলাইন - দায়িত্বশীল নাগরিক প্রকাশের নীতিমালা | ঘুষখোর"
        description="ঘুষখোর প্ল্যাটফর্মে জনসেবার অভিজ্ঞতা প্রকাশের নিয়মাবলি: কী লিখবেন এবং কোন বিষয়গুলো কঠোরভাবে নিষিদ্ধ।"
        canonicalUrl="/community-guidelines"
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'কমিউনিটি গাইডলাইন', url: '/community-guidelines' },
        ]}
        onNavigate={onNavigate}
      />

      <article className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-md mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>নাগরিক আচরণবিধি</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            কমিউনিটি গাইডলাইন
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            একটি সুস্থ, বিশ্বাসযোগ্য ও দায়িত্বশীল নাগরিক ফোরাম গড়ে তুলতে সকল লেখক ও পাঠকের জন্য এই নির্দেশিকা মেনে চলা বাধ্যতামূলক।
          </p>
        </div>

        {/* Encouraged vs Prohibited Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What to write */}
          <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-base font-serif">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>আমরা যা উৎসাহিত করি (DO):</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-950">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>বাস্তব অভিজ্ঞতা:</strong> আপনি নিজে সেবা নিতে গিয়ে যা প্রত্যক্ষ করেছেন কেবল সেই ঘটনাগুলো সত্যনিষ্ঠভাবে তুলে ধরুন।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>স্পষ্ট ও পরিচ্ছন্ন বর্ণনা:</strong> কোন অফিসে গিয়েছিলেন, কোন সেবার জন্য আবেদন করেছিলেন এবং কত দিন লেগেছে তা সুনির্দিষ্টভাবে লিখুন।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>সচেতনতামূলক পরামর্শ:</strong> অন্য নাগরিকদের জন্য কী কী কাগজপত্র সাথে রাখা জরুরি এবং কীভাবে দালাল এড়ানো সম্ভব সে বিষয়ে পরামর্শ দিন।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>মর্যাদাপূর্ণ ভাষা:</strong> তিক্ত অভিজ্ঞতা থাকলেও শালীন, প্রমিত ও গঠনমূলক শব্দ ব্যবহার করুন।</span>
              </li>
            </ul>
          </div>

          {/* What is prohibited */}
          <div className="p-5 bg-red-50/60 border border-red-200 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-950 font-bold text-base font-serif">
              <XCircle className="w-5 h-5 text-red-700" />
              <span>যা কঠোরভাবে নিষিদ্ধ (DON'T):</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-red-950">
              <li className="flex items-start gap-2">
                <span className="text-red-700 font-bold">✕</span>
                <span><strong>ব্যক্তিগত তথ্য (Doxxing):</strong> কোনো ব্যক্তির ফোন নম্বর, জাতীয় পরিচয়পত্র (NID) নম্বর, বাসার ঠিকানা বা ব্যাংকিং তথ্য লেখা যাবে না।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-700 font-bold">✕</span>
                <span><strong>হুমকি ও বিদ্বেষমূলক বক্তব্য:</strong> কাউকে শারীরিক ক্ষতিসাধন করার হুমকি, জাত-ধর্ম-বর্ণ নিয়ে কটূক্তি সম্পূর্ণ নিষিদ্ধ।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-700 font-bold">✕</span>
                <span><strong>মিথ্যা ও বিভ্রান্তিকর গুজব:</strong> যাচাইবিহীন কল্পকাহিনী বা উদ্দেশ্যপ্রণোদিত অপপ্রচার প্রচার করা যাবে না।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-700 font-bold">✕</span>
                <span><strong>স্প্যাম ও বিজ্ঞাপন:</strong> কোনো বাণিজ্যিক লিংক, পাসওয়ার্ড, হ্যাকিং টুলস বা প্রতারণামূলক প্রচার নিষিদ্ধ।</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action on violation */}
        <section className="p-5 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-2">
          <h2 className="font-bold text-stone-900 text-sm">নীতিমালা লঙ্ঘনের পরিণতি:</h2>
          <p className="leading-relaxed">
            কোনো জমা পড়া লেখায় উপরোক্ত নিষিদ্ধ উপাদানের উপস্থিতি পাওয়া গেলে সম্পাদকীয় দল তাৎক্ষণিকভাবে তা বাতিল করবে। বারবার ইচ্ছাকৃতভাবে স্প্যামিং বা সাইবার নিরাপত্তা ব্যাহত করার চেষ্টা করা হলে সংশ্লিষ্ট আইপি থেকে সাবমিশন ব্লক করা হতে পারে।
          </p>
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate('/write')}
            className="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            গাইডলাইন মেনে অভিজ্ঞতা লিখুন
          </button>
        </div>
      </article>
    </div>
  );
}
