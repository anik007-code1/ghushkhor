import { Shield, Lock, Eye, Cookie, FileText, CheckCircle2 } from 'lucide-react';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
}

export default function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="গোপনীয়তা নীতি (Privacy Policy) | ঘুষখুর"
        description="ঘুষখুর প্ল্যাটফর্মে ব্যবহারকারীর তথ্য সুরক্ষা, বেনামী ডেটা ব্যবস্থাপনা, কুকিজ এবং গুগল এডসেন্স বিজ্ঞাপন সংক্রান্ত পূর্ণাঙ্গ নীতি।"
        canonicalUrl="/privacy"
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'গোপনীয়তা নীতি', url: '/privacy' },
        ]}
        onNavigate={onNavigate}
      />

      <article className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-md mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>আইনি ও নিরাপত্তা তথ্য</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            গোপনীয়তা নীতি (Privacy Policy)
          </h1>
          <p className="text-stone-500 text-xs">সর্বশেষ হালনাগাদ: জানুয়ারি ২০২৬</p>
        </div>

        <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
          ‘ঘুষখুর’ (GhushKhur) প্ল্যাটফর্ম সাধারণ নাগরিকদের ব্যক্তিগত গোপনীয়তার সর্বোচ্চ সম্মান বজায় রাখতে প্রতিশ্রুতিবদ্ধ। এই নীতিমালাটি স্পষ্ট করে যে আমরা কীভাবে আপনার তথ্য পরিচালনা করি, কোন তথ্যগুলো আমরা কখনোই সংগ্রহ করি না এবং কীভাবে তৃতীয় পক্ষের সেবা ও বিজ্ঞাপন ব্যবহৃত হয়।
        </p>

        {/* 1. What we do NOT collect */}
        <section className="p-4 sm:p-5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
          <h2 className="font-bold text-emerald-950 text-sm sm:text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>১. আমরা যেসব তথ্য ইচ্ছাকৃতভাবে সংগ্রহ বা দাবি করি না:</span>
          </h2>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
            নাগরিক অভিজ্ঞতার স্বাধীনতা অক্ষুণ্ণ রাখতে আমরা কোনো ব্যবহারকারীর কাছ থেকে জাতীয় পরিচয়পত্র (NID), পাসপোর্ট নম্বর, ব্যক্তিগত বাড়ির ঠিকানা, ব্যাংক অ্যাকাউন্ট বা পাসওয়ার্ড জাতীয় সংবেদনশীল ব্যক্তিগত তথ্য (PII) দাবি করি না। অভিজ্ঞতা লেখার সময় ব্যবহারকারীকে কোনো একাউন্ট বা ফোন নম্বর দিতে হয় না।
          </p>
        </section>

        {/* 2. What we collect */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ২. যেসব তথ্য সংগৃহীত হতে পারে:
          </h2>
          <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-stone-700 pl-2">
            <li><strong>ব্যবহারকারীর পেশকৃত অভিজ্ঞতা ও মন্তব্য:</strong> আপনি স্বেচ্ছায় যে সেবা সংক্রান্ত গল্প, অফিসের নাম বা নাগরিক টিপস জমা দিচ্ছেন, তা জনস্বার্থে পর্যালোচনার পর প্রদর্শনের জন্য সংরক্ষিত হয়।</li>
            <li><strong>প্রযুক্তিগত লগ ডেটা:</strong> ওয়েবসাইটটির সঠিক কার্যকারিতা ও নিরাপত্তার স্বার্থে স্ট্যান্ডার্ড ওয়েব সার্ভার লগিংয়ের আওতায় ব্রাউজারের ধরণ, অপারেটিং সিস্টেম এবং পেজ রিকোয়েস্টের সময় সাময়িকভাবে লগ হতে পারে।</li>
            <li><strong>বেনামী ভোট ও প্রতিক্রিয়া:</strong> ‘সহায়ক ছিল’ ভোটের ক্ষেত্রে একাধিক ক্লিক প্রতিরোধে ব্রাউজারের লোকাল স্টোরেজ (Local Storage) ব্যবহৃত হয়, যাতে কোনো ব্যক্তিগত তথ্য থাকে না।</li>
          </ul>
        </section>

        {/* 3. Cookies and Tracking */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-amber-700" />
            <span>৩. কুকিজ (Cookies) ও ব্যবহারকারীর পছন্দসমূহ</span>
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            কুকিজ হলো ছোট টেক্সট ফাইল যা আপনার ব্রাউজারে সংরক্ষিত হয়। আমরা ব্যবহারকারীর থিম পছন্দ, কুকি সম্মতি ব্যানার অবস্থা মনে রাখতে এবং সামগ্রিক সাইট পারফরম্যান্স ট্র্যাক করতে স্ট্যান্ডার্ড কুকিজ ব্যবহার করতে পারি। আপনি আপনার ব্রাউজার সেটিংস থেকে যেকোনো সময় কুকিজ নিষ্ক্রিয় বা মুছে ফেলতে পারেন।
          </p>
        </section>

        {/* 4. Google AdSense & Third Party Advertising */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ৪. গুগল এডসেন্স ও তৃতীয় পক্ষের বিজ্ঞাপন (Google AdSense)
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            এই প্ল্যাটফর্ম পরিচালন ব্যয় নির্বাহের জন্য আমরা গুগল এডসেন্স (Google AdSense) সহ অন্যান্য স্বনামধন্য বিজ্ঞাপন নেটওয়ার্ক ব্যবহার করতে পারি।
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-stone-700 pl-2">
            <li>গুগল সহ তৃতীয় পক্ষের বিজ্ঞাপনদাতারা এই ওয়েবসাইট বা অন্যান্য ওয়েবসাইটে ব্যবহারকারীর পূর্ববর্তী ভিজিটের ওপর ভিত্তি করে বিজ্ঞাপন প্রদর্শন করতে কুকিজ (যেমন DoubleClick cookie) ব্যবহার করতে পারে।</li>
            <li>ব্যবহারকারীরা গুগলের <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-red-700 underline font-medium">বিজ্ঞাপন সেটিংস (Ads Settings)</a>-এ গিয়ে ব্যক্তিগতকৃত বিজ্ঞাপন থেকে নিজেদের বাদ (Opt-out) রাখতে পারেন।</li>
            <li>আমরা কোনো অবস্থাতেই বিজ্ঞাপনদাতাদের সাথে ব্যবহারকারীর ব্যক্তিগত পরিচয়যোগ্য কোনো তথ্য শেয়ার করি না।</li>
          </ul>
        </section>

        {/* 5. Data Retention */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ৫. তথ্য ধারণ ও মুছে ফেলার নীতিমালা (Data Retention)
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            প্রকাশিত প্রতিবেদনগুলো জনস্বার্থে দীর্ঘমেয়াদে সংরক্ষিত থাকে। তবে কোনো প্রতিবেদন বা মন্তব্যে অনাকাঙ্ক্ষিত কোনো তথ্য উঠে এলে আবেদন সাপেক্ষে তা স্থায়ীভাবে সম্পাদনা বা মুছে ফেলার অনুরোধ করা যাবে।
          </p>
        </section>

        {/* 6. Contact */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ৬. গোপনীয়তা সংক্রান্ত যোগাযোগ
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            আমাদের গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন, দ্বিধা বা ডেটা সংক্রান্ত কোনো আপত্তি থাকলে অনুগ্রহ করে আমাদের <button type="button" onClick={() => onNavigate('/contact')} className="text-red-700 underline font-semibold">যোগাযোগ পাতার</button> মাধ্যমে বা সরাসরি ইমেইলে অবহিত করুন।
          </p>
        </section>
      </article>
    </div>
  );
}
