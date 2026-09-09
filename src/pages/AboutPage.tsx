import { Shield, CheckCircle2, Users, FileCheck, EyeOff, AlertTriangle } from 'lucide-react';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="ঘুষখুর সম্পর্কে - লক্ষ্য, উদ্দেশ্য ও স্বাধীনতা ঘোষণা | ঘুষখুর"
        description="ঘুষখুর কী, কেন এটি প্রতিষ্ঠিত এবং কীভাবে নাগরিক অভিজ্ঞতার স্বচ্ছ, নিরপেক্ষ ও দায়িত্বশীল প্রকাশ নিশ্চিত করা হয়।"
        canonicalUrl="/about"
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'ঘুষখুর সম্পর্কে', url: '/about' },
        ]}
        onNavigate={onNavigate}
      />

      <article className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-md mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>নাগরিক প্ল্যাটফর্ম পরিচিতি</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            ঘুষখুর সম্পর্কে
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            বাংলাদেশের সাধারণ নাগরিকদের প্রশাসনিক অভিজ্ঞতা বিনিময়, জনসেবায় স্বচ্ছতা তৈরি এবং নাগরিকদের মাঝে সচেতনতা বৃদ্ধির লক্ষ্যে প্রতিষ্ঠিত একটি উন্মুক্ত ও নিরপেক্ষ প্ল্যাটফর্ম।
          </p>
        </div>

        {/* Independent Platform Disclaimer (Critical Requirement 13) */}
        <div className="p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>গুরুত্বপূর্ণ ঘোষণা (স্বাতন্ত্র্য ও অ-সরকারি অবস্থান):</span>
          </div>
          <p className="leading-relaxed">
            ‘ঘুষখুর’ (GhushKhur) কোনো সরকারি দপ্তর, অধিদপ্তর, মন্ত্রণালয় বা বাংলাদেশ সরকারের অফিশিয়াল কোনো সেবা বাতায়ন নয়। এটি সম্পূর্ণ স্বাধীন, অরাজনৈতিক ও বেসরকারি নাগরিক ফোরাম। কোনো দাপ্তরিক সেবার জন্য অনুগ্রহ করে সংশ্লিষ্ট সরকারি দপ্তরের অফিশিয়াল ওয়েবসাইটে সরাসরি যোগাযোগ করুন।
          </p>
        </div>

        {/* 1. What is GhushKhur? */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ১. ঘুষখুর কী?
          </h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            ‘ঘুষখুর’ হলো একটি নাগরিক সেবা পর্যালোচনা ও অভিজ্ঞতা সংরক্ষণের প্ল্যাটফর্ম। একজন সাধারণ নাগরিক যখন ভূমি অফিস, পাসপোর্ট অফিস, বিআরটিএ, বিদ্যুৎ সংযোগ, আদালত কিংবা সরকারি হাসপাতালে সেবা নিতে যান, তখন তিনি যেসব বাস্তব চ্যালেঞ্জ, নিয়মাবলি ও অভিজ্ঞতার মুখোমুখি হন—সেসব তথ্য দায়িত্বশীলভাবে সবার মাঝে তুলে ধরাই এই প্ল্যাটফর্মের কাজ।
          </p>
        </section>

        {/* 2. Why does it exist? */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ২. এটি কেন প্রয়োজন?
          </h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            সরকারি বিভিন্ন সেবা ডিজিটালাইজড হলেও সাধারণ নাগরিকদের বড় একটি অংশ সঠিক প্রক্রিয়া ও প্রয়োজনীয় কাগজপত্র সম্পর্কে অবগত নন। এর ফলে অনেক ক্ষেত্রে মধ্যস্বত্বভোগী বা দালালদের দৌরাত্ম্য তৈরি হয় এবং নাগরিকরা হয়রানির শিকার হন। ঘুষখুর প্ল্যাটফর্মের মাধ্যমে:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-stone-700 pl-2">
            <li>সচেতন নাগরিকরা তাদের বাস্তব অভিজ্ঞতার আলোকে অন্যদের সঠিক দিকনির্দেশনা দিতে পারেন।</li>
            <li>কোন অফিসে কোন প্রক্রিয়া কার্যকর এবং কোথায় মধ্যস্বত্বভোগীদের ফাঁদ রয়েছে তা স্পষ্ট হয়।</li>
            <li>নাগরিক মতামত একত্র করে জনসেবা আরও সহজ ও দুর্নীতিমুক্ত করার দাবি জোরদার হয়।</li>
          </ul>
        </section>

        {/* 3. How does anonymous publishing work? */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-red-700" />
            <span>৩. বেনামী প্রকাশনা ও নাগরিক নিরাপত্তা কীভাবে নিশ্চিত হয়?</span>
          </h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            আমরা নাগরিকের ব্যক্তিস্বার্থ ও নিরাপত্তা অত্যন্ত গুরুত্বের সাথে দেখি। কোনো নাগরিক যেন হয়রানি বা প্রতিশোধের শিকার না হন, সেজন্য এই প্ল্যাটফর্মে কারো নাম, জাতীয় পরিচয়পত্র, ইমেইল বা ফোন নম্বর প্রকাশ করা হয় না। প্রতিটি লেখা সম্পূর্ণ বেনামে নাগরিক অবদান হিসেবে সংগৃহীত হয়।
          </p>
        </section>

        {/* 4. Submissions & Moderation Process */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-700" />
            <span>৪. লেখা পর্যালোচনা ও মডারেশনের ভূমিকা</span>
          </h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            বেনামী হওয়ার সুযোগে যেন কোনো অসত্য তথ্য, ব্যক্তিগত কুৎসা বা বিদ্বেষ ছড়ানো না হয়, সে কারণে আমাদের তিন স্তরের মডারেশন নীতি কার্যকর রয়েছে:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 text-xs block mb-1">১. জমা নেওয়া (Pending)</span>
              <p className="text-[11px] text-stone-600">নাগরিকের লেখা জমা হওয়ার পর তা মডারেশন কিউতে প্রবেশ করে। সরাসরি প্রকাশিত হয় না।</p>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 text-xs block mb-1">২. সম্পাদকীয় নিরীক্ষা</span>
              <p className="text-[11px] text-stone-600">ব্যক্তিগত আক্রমণ, ফোন নম্বর বা তথ্যহীন কুৎসা বাদ দিয়ে গঠনমূলক ভাষা নিশ্চিত করা হয়।</p>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 text-xs block mb-1">৩. প্রকাশ (Published)</span>
              <p className="text-[11px] text-stone-600">কেবলমাত্র মানসম্মত ও নীতিসম্মত অভিজ্ঞতা পাবলিকলি পড়া ও সার্চ ইঞ্জিনে দৃশ্যমান হয়।</p>
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/editorial-policy')}
            className="text-xs font-semibold text-red-700 hover:underline"
          >
            আমাদের পূর্ণাঙ্গ সম্পাদকীয় নীতিমালা পড়ুন →
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/write')}
            className="px-4 py-2 bg-red-700 text-white rounded-lg text-xs font-semibold hover:bg-red-600"
          >
            আপনার অভিজ্ঞতা জানান
          </button>
        </div>
      </article>
    </div>
  );
}
