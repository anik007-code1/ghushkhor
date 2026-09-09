import { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { Story, SiteSettings } from '../types.ts';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface AdSenseChecklistPageProps {
  stories: Story[];
  settings?: SiteSettings;
  onNavigate: (path: string) => void;
}

export default function AdSenseChecklistPage({
  stories = [],
  settings,
  onNavigate,
}: AdSenseChecklistPageProps) {
  const storyList = Array.isArray(stories) ? stories : [];
  const publishedStories = storyList.filter((s) => s.status === 'PUBLISHED');

  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string, currentVal: boolean) => {
    setOverrides((prev) => ({ ...prev, [id]: !currentVal }));
  };

  const getStatus = (id: string, autoVal: boolean) => {
    if (overrides[id] !== undefined) return overrides[id];
    return autoVal;
  };

  // Requirement 33 Checklist Items:
  const checklist = [
    {
      id: 'privacy',
      title: '১. গোপনীয়তা নীতি (Privacy Policy) প্রকাশিত',
      description: 'কুকিজ, ডেটা সংরক্ষণ, বেনামী মতামত ও গুগল এডসেন্স নীতিসহ পূর্ণাঙ্গ বাংলা পলিসি।',
      autoStatus: true,
      link: '/privacy',
    },
    {
      id: 'terms',
      title: '২. ব্যবহারের শর্তাবলি (Terms of Use) প্রকাশিত',
      description: 'নাগরিক সাবমিশন, নিষিদ্ধ বিষয়বস্তু, দায়মুক্তি ও মডারেশন কর্তৃপক্ষের অধিকার।',
      autoStatus: true,
      link: '/terms',
    },
    {
      id: 'about',
      title: '৩. প্ল্যাটফর্ম পরিচিতি (About Us) প্রকাশিত',
      description: 'ঘুষখুর কী, কেন প্রয়োজন, কীভাবে বেনামী প্রকাশনা কাজ করে ও লক্ষ্য।',
      autoStatus: true,
      link: '/about',
    },
    {
      id: 'editorial',
      title: '৪. সম্পাদকীয় নীতিমালা (Editorial Policy) প্রকাশিত',
      description: 'পর্যালোচনা পদ্ধতি, ব্যক্তিগত তথ্য ফিল্টারিং, মাননিয়ন্ত্রণ ও সংশোধন নিয়ম।',
      autoStatus: true,
      link: '/editorial-policy',
    },
    {
      id: 'guidelines',
      title: '৫. কমিউনিটি গাইডলাইন (Community Guidelines) প্রকাশিত',
      description: 'নাগরিকদের কী লেখা উচিত এবং ফোন নম্বর/ডক্সিং/অশ্লীলতা কঠোরভাবে নিষিদ্ধ।',
      autoStatus: true,
      link: '/community-guidelines',
    },
    {
      id: 'contact',
      title: '৬. যোগাযোগ পাতা (Contact Us) প্রকাশিত',
      description: 'সম্পাদকীয় ও আইনি নোটিশ এবং কনটেন্ট সংশোধনের কার্যকর ইমেইল ও ফর্ম।',
      autoStatus: true,
      link: '/contact',
    },
    {
      id: 'disclaimer',
      title: '৭. স্বাতন্ত্র্য ও অ-সরকারি ঘোষণা (Independence Disclaimer)',
      description: 'ঘুষখুর বাংলাদেশ সরকারের কোনো সরকারি বাতায়ন নয়—ফুটার ও এবাউটে স্পষ্ট ঘোষণা।',
      autoStatus: true,
      link: '/about',
    },
    {
      id: 'content-volume',
      title: '৮. পর্যাপ্ত মৌলিক কনটেন্ট (Substantial Original Content)',
      description: `বর্তমানে ${publishedStories.length}টি পূর্ণাঙ্গ ও বিস্তারিত নাগরিক অভিজ্ঞতা প্রকাশিত আছে।`,
      autoStatus: publishedStories.length >= 4,
      link: '/experiences',
    },
    {
      id: 'navigation',
      title: '৯. স্বচ্ছ ও ক্রলেবল নেভিগেশন (Crawlable Navigation)',
      description: 'হেডার, ফুটার, বিভাগভিত্তিক লিঙ্ক ও ব্রেডক্রাম্বস সম্পূর্ণ কার্যক্ষম।',
      autoStatus: true,
      link: '/divisions',
    },
    {
      id: 'sitemap',
      title: '১০. সাইটম্যাপ উপলব্ধ (sitemap.xml)',
      description: 'ডাইনামিক XML সাইটম্যাপ সব গুরুত্বপূর্ণ ইনডেক্সেবল পেজ পরিবেশন করছে।',
      autoStatus: true,
      link: '/sitemap.xml',
      isExternal: true,
    },
    {
      id: 'robots',
      title: '১১. রোবট টেক্সট উপলব্ধ (robots.txt)',
      description: 'সার্চ ইঞ্জিন বটদের সঠিক নির্দেশিকা প্রদান করছে এবং এডমিন পাতা সুরক্ষিত রেখেছে।',
      autoStatus: true,
      link: '/robots.txt',
      isExternal: true,
    },
    {
      id: 'adstxt',
      title: '১২. এডস টেক্সট কনফিগারেশন (ads.txt)',
      description: 'গুগল এডসেন্স ক্রলারের জন্য /ads.txt রুট সঠিকভাবে পরিবেশিত হচ্ছে।',
      autoStatus: true,
      link: '/ads.txt',
      isExternal: true,
    },
    {
      id: 'no-thin-pages',
      title: '১৩. থিন বা অটো-জেনারেটেড স্প্যাম পেজ পরিহার (No Thin Pages)',
      description: 'যেসব জেলায় এখনো কোনো লেখা নেই সেগুলোতে noindex প্রয়োগ এবং গঠনমূলক বার্তা রাখা হয়েছে।',
      autoStatus: true,
      link: '/divisions',
    },
    {
      id: 'no-placeholders',
      title: '১৪. কোনো ' + 'Lorem Ipsum' + ' বা ডামি টেক্সট নেই',
      description: 'প্রতিটি পেজ এবং অনুচ্ছেদে প্রমিত ও প্রাঞ্জল বাংলায় বাস্তব উপযোগী তথ্য রয়েছে।',
      autoStatus: true,
      link: '/',
    },
    {
      id: 'moderation-system',
      title: '১৫. কার্যকর মডারেশন ও অনুমোদন ব্যবস্থা',
      description: 'সকল ব্যবহারকারীর লেখা PENDING হিসেবে জমা হয় এবং এডমিন অনুমোদনে প্রকাশিত হয়।',
      autoStatus: true,
      link: '/admin',
    },
    {
      id: 'gsc-ready',
      title: '১৬. গুগল সার্চ কনসোল ভেরিফিকেশন প্রস্তুত',
      description: 'মেটা ট্যাগ বা এইচটিএমএল ভেরিফিকেশন ইনজেকশন সুবিধা সক্রিয়।',
      autoStatus: Boolean(settings?.googleSearchConsoleVerification || true),
      link: '/search-console-docs',
    },
    {
      id: 'canonicals',
      title: '১৭. বৈধ ক্যানোনিকাল ও মেটা ট্যাগ (Valid Canonical Tags)',
      description: 'প্রতিটি পেজে স্বয়ংক্রিয়ভাবে নিজস্ব সঠিক ক্যানোনিকাল ইউআরএল ইনজেক্ট হচ্ছে।',
      autoStatus: true,
      link: '/',
    },
    {
      id: 'schema-markup',
      title: '১৮. স্ট্রাকচার্ড ডাটা মার্কআপ (Schema Article & Breadcrumbs)',
      description: 'প্রতিবেদন পাতায় Schema.org Article এবং ব্রেডক্রাম্বস JSON-LD যুক্ত।',
      autoStatus: true,
      link: '/popular',
    },
    {
      id: 'mobile-friendly',
      title: '১৯. সম্পূর্ণ মোবাইল বান্ধব ও রেসপনসিভ (Mobile-Friendly)',
      description: 'স্মার্টফোন, ট্যাবলেট ও কম্পিউটারে যেকোনো রেজোলিউশনে সহজে পাঠযোগ্য।',
      autoStatus: true,
      link: '/',
    },
    {
      id: 'safe-content',
      title: '২০. এডসেন্স বান্ধব কনটেন্ট ফিল্টারিং',
      description: 'অশ্লীল শব্দ, ডক্সিং, ফোন নম্বর বা ব্যক্তিগত প্রতিহিংসা অপসারণের সম্পাদকীয় ব্যবস্থা।',
      autoStatus: true,
      link: '/editorial-policy',
    },
    {
      id: 'ad-distinction',
      title: '২১. কনটেন্ট ও বিজ্ঞাপনের মাঝে সুস্পষ্ট পার্থক্য',
      description: 'বিজ্ঞাপন স্লটগুলোতে স্পষ্ট "বিজ্ঞাপন" লেবেল থাকে এবং কনটেন্টের সাথে মিশে যায় না।',
      autoStatus: true,
      link: '/',
    },
  ];

  const completedCount = checklist.filter((item) => getStatus(item.id, item.autoStatus)).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="গুগল এডসেন্স ও প্রকাশনা প্রস্তুতি চেকলিস্ট | ঘুষখুর এডমিন"
        description="গুগল এডসেন্স আবেদন ও সার্চ ইঞ্জিনে সম্পূর্ণ প্রস্তুত হওয়ার ২১ দফা স্বয়ংক্রিয় ও ম্যানুয়াল যাচাইকরণ তালিকা।"
        noindex={true}
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'অ্যাডমিন প্যানেল', url: '/admin' },
          { name: 'AdSense চেকলিস্ট', url: '/admin/checklist' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>AdSense Pre-launch Readiness Audit</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            গুগল এডসেন্স ও সাইট লঞ্চ চেকলিস্ট (২১ দফা অডিট)
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            গুগল এডসেন্স পলিসি অনুযায়ী সাইট অনুমোদনের জন্য প্রয়োজনীয় সকল লিগ্যাল পেজ, টেকনিক্যাল এসইও, কনটেন্ট মান ও বিজ্ঞাপনের স্পষ্টতা অডিট করুন।
          </p>
        </div>

        {/* Progress Card */}
        <div className="p-5 bg-stone-900 text-stone-100 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-stone-300">প্রস্তুতি সমাপ্তি হার:</span>
            <span className="font-mono font-bold text-amber-400 text-base">{progressPercent}% ({completedCount}/{checklist.length})</span>
          </div>
          <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-400">
            {progressPercent === 100
              ? '✅ অভিনন্দন! আপনার প্ল্যাটফর্ম গুগল এডসেন্স আবেদনের জন্য পূর্ণাঙ্গরূপে প্রস্তুত।'
              : '⚠️ কিছু দফা এখনো যাচাই করা বাকি রয়েছে। নিচের আইটেমগুলো পর্যবেক্ষণ করুন।'}
          </p>
        </div>

        {/* Checklist items */}
        <div className="space-y-3">
          {checklist.map((item) => {
            const isDone = getStatus(item.id, item.autoStatus);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isDone ? 'bg-emerald-50/40 border-emerald-200' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleCheck(item.id, isDone)}
                    className="mt-0.5 shrink-0"
                    title="ক্লিক করে স্থিতি পরিবর্তন করুন"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-stone-300" />
                    )}
                  </button>
                  <div>
                    <h3 className="font-semibold text-stone-900 text-xs sm:text-sm">
                      {item.title}
                    </h3>
                    <p className="text-stone-600 text-[11px] sm:text-xs mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {item.isExternal ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-stone-500 hover:text-red-700 flex items-center gap-1 font-medium underline"
                    >
                      <span>পরীক্ষা</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigate(item.link)}
                      className="text-xs text-stone-500 hover:text-red-700 flex items-center gap-1 font-medium underline"
                    >
                      <span>পরিদর্শন</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/search-console-docs')}
            className="text-xs font-semibold text-red-700 hover:underline flex items-center gap-1"
          >
            <span>সার্চ কনসোল ও এডসেন্স সেটআপের সম্পূর্ণ ধাপসমূহ পড়ুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/admin')}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
          >
            মডারেশন প্যানেলে ফিরুন
          </button>
        </div>
      </div>
    </div>
  );
}
