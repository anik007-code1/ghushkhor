import { BookOpen, CheckCircle2, XCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface EditorialPolicyPageProps {
  onNavigate: (path: string) => void;
}

export default function EditorialPolicyPage({ onNavigate }: EditorialPolicyPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="সম্পাদকীয় নীতিমালা ও পর্যালোচনা পদ্ধতি | ঘুষখুর"
        description="ঘুষখুর প্ল্যাটফর্মে নাগরিক লেখার পর্যালোচনা পদ্ধতি, ব্যক্তিগত তথ্য অপসারণ, মাননিয়ন্ত্রণ এবং সংশোধনী নীতিমালা।"
        canonicalUrl="/editorial-policy"
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'সম্পাদকীয় নীতিমালা', url: '/editorial-policy' },
        ]}
        onNavigate={onNavigate}
      />

      <article className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-md mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>প্রকাশনা মানদণ্ড ও নীতি</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            সম্পাদকীয় নীতিমালা
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            সরকারি ও স্বায়ত্তশাসিত দপ্তরে সেবাগ্রহীতাদের জমা দেওয়া অভিজ্ঞতা কীভাবে নিরীক্ষা, পরিমার্জন এবং প্রকাশ করা হয় তার বিস্তারিত দিকনির্দেশনা।
          </p>
        </div>

        {/* 1. Review process */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ১. লেখা পর্যালোচনা পদ্ধতি (Submission Review)
          </h2>
          <p className="text-stone-700 text-sm leading-relaxed">
            কোনো নাগরিক অভিজ্ঞতা জমা দেওয়ার পর তা স্বয়ংক্রিয়ভাবে সরাসরি ওয়েবসাইটে প্রদর্শিত হয় না। প্রতিটি জমা পড়া লেখা আমাদের সম্পাদকীয় দলের ‘পেন্ডিং রিভিউ’ কিউতে যুক্ত হয়। সম্পাদকীয় দল নিম্নলিখিত বিষয়গুলো যাচাই করে:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-stone-700 pl-2">
            <li>লেখাটি কোনো বাস্তবিক নাগরিক সেবা বা সরকারি দপ্তরের অভিজ্ঞতার ওপর ভিত্তি করে রচিত কি না।</li>
            <li>এতে অন্যান্য নাগরিকদের জন্য শিক্ষণীয় ও বাস্তব দিকনির্দেশনামূলক উপাদান রয়েছে কি না।</li>
            <li>কোনো প্রকার অন্ধ গালাগালি, বিদ্বেষপূর্ণ বক্তব্য বা ভিত্তিহীন ষড়যন্ত্রতত্ত্ব রয়েছে কি না।</li>
          </ul>
        </section>

        {/* 2. Editing submissions */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ২. লেখা পরিমার্জনের কারণ (Editing & Sanitization)
          </h2>
          <p className="text-stone-700 text-sm leading-relaxed">
            মূল অভিজ্ঞতা ও বক্তব্যের অর্থ অপরিবর্তিত রেখে সম্পাদকীয় দল নিম্নলিখিত কারণে লেখায় পরিমার্জন বা ফিল্টারিং করতে পারে:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-stone-700 pl-2">
            <li><strong>ব্যক্তিগত তথ্য অপসারণ:</strong> কোনো সরকারি কর্মকর্তা বা নাগরিকের ব্যক্তিগত ফোন নম্বর, ব্যক্তিগত বাড়ির ঠিকানা, জাতীয় পরিচয়পত্র নম্বর বা পারিবারিক তথ্য থাকলে তা সম্পূর্ণ মুছে ফেলা হয়।</li>
            <li><strong>বানান ও ব্যাকরণগত স্পষ্টতা:</strong> প্রমিত বাংলা বানানরীতি ও বাক্য গঠন স্পষ্ট করতে প্রয়োজনীয় সম্পাদনা করা হতে পারে।</li>
            <li><strong>অশ্লীল শব্দ পরিহার:</strong> রাগের বশবর্তী হয়ে ব্যবহৃত কোনো অশালীন বা অননুমোদিত শব্দ বাদ দেওয়া হয়।</li>
          </ul>
        </section>

        {/* 3. Rejection reasons */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ৩. লেখা প্রত্যাখ্যানের কারণ (Rejection Criteria)
          </h2>
          <p className="text-stone-700 text-sm leading-relaxed">
            সম্পাদকীয় দল একটি লেখা সরাসরি প্রত্যাখ্যান (Reject) করতে পারে যদি:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-900">
              <span className="font-bold block mb-1">অপ্রাসঙ্গিক বা কাল্পনিক গল্প</span>
              বাস্তব নাগরিক সেবা বহির্ভূত কোনো রাজনৈতিক প্রোপাগান্ডা বা কাল্পনিক গল্প।
            </div>
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-900">
              <span className="font-bold block mb-1">ব্যক্তিগত আক্রোশ ও ব্ল্যাকমেইলিং</span>
              কোনো ব্যক্তির বিরুদ্ধে ব্যক্তিগত স্বার্থ হাসিলের উদ্দেশ্যে ভিত্তিহীন আক্রমণ।
            </div>
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-900">
              <span className="font-bold block mb-1">স্প্যাম বা বাণিজ্যিক বিজ্ঞাপন</span>
              কোনো বাণিজ্যিক দালাল চক্র, ভুয়া সার্ভিস বা পণ্য প্রচারের চেষ্টা।
            </div>
            <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-900">
              <span className="font-bold block mb-1">আইন পরিপন্থী বা ক্ষতিকর কনটেন্ট</span>
              দেশের প্রচলিত আইন অবমাননা বা ধর্মীয় অনুভূতির অবমাননামূলক কনটেন্ট।
            </div>
          </div>
        </section>

        {/* 4. Handling allegations & Defamation */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ৪. অভিযোগ ও মানহানির দাবি মোকাবিলা (Handling Allegations)
          </h2>
          <p className="text-stone-700 text-sm leading-relaxed">
            ঘুষখুর কোনো বিচারিক আদালত নয়। আমাদের উদ্দেশ্য কোনো নির্দিষ্ট ব্যক্তিকে প্রকাশ্যে আক্রমণ করা নয়, বরং নাগরিক সেবার প্রক্রিয়াগত ভোগান্তি ও করণীয় তুলে ধরা। তাই সুনির্দিষ্ট কোনো ব্যক্তির নামযুক্ত একতরফা অভিযোগকে অগ্রাধিকার না দিয়ে দপ্তরের সামগ্রিক ব্যবস্থাপনা ও সিস্টেমের ত্রুটিকে ফোকাস করা হয়।
          </p>
        </section>

        {/* 5. Corrections & Removal */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ৫. তথ্য সংশোধন ও অপসারণ নীতি (Corrections & Takedowns)
          </h2>
          <p className="text-stone-700 text-sm leading-relaxed">
            কোনো প্রকাশিত লেখায় ভুল তথ্য বা সংবেদনশীল কিছু থাকলে যে কেউ ‘রিপোর্ট’ বাটনের মাধ্যমে বা আমাদের যোগাযোগ পাতার মাধ্যমে আপত্তি জানাতে পারেন। সম্পাদকীয় দল যুক্তিযুক্ত প্রমাণের ভিত্তিতে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে তথ্য সংশোধন অথবা বিতর্কিত কনটেন্ট সরিয়ে নেওয়ার ব্যবস্থা নেয়।
          </p>
        </section>

        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-stone-600">কোনো প্রকাশিত লেখা নিয়ে আপনার আপত্তি বা পরামর্শ আছে?</span>
          <button
            type="button"
            onClick={() => onNavigate('/report-content')}
            className="px-4 py-2 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-600"
          >
            রিপোর্ট বা সংশোধনের আবেদন করুন
          </button>
        </div>
      </article>
    </div>
  );
}
