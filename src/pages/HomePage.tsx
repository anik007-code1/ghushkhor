import { useState } from 'react';
import { Shield, BookOpen, TrendingUp, MapPin, ArrowRight, CheckCircle2, Clock, Eye, ThumbsUp, AlertCircle, FileText, ChevronRight, Banknote } from 'lucide-react';
import { Story, SiteSettings } from '../types.ts';
import { BANGLADESH_DIVISIONS } from '../data/bangladeshData.ts';
import SEOHead from '../components/SEOHead.tsx';
import AdSlot from '../components/AdSlot.tsx';
import BribeAnalyticsChart from '../components/BribeAnalyticsChart.tsx';

interface HomePageProps {
  stories: Story[];
  settings?: SiteSettings;
  onNavigate: (path: string) => void;
}

export default function HomePage({ stories = [], settings, onNavigate }: HomePageProps) {
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const storyList = Array.isArray(stories) ? stories : [];
  const published = storyList.filter((s) => s.status === 'PUBLISHED');
  const popularStories = [...published].sort((a, b) => (b.helpfulCount * 2 + b.viewCount) - (a.helpfulCount * 2 + a.viewCount)).slice(0, 4);

  const departments = [
    { label: 'সকল সেবা', value: 'all' },
    { label: 'ভূমি অফিস', value: 'land-office' },
    { label: 'পাসপোর্ট', value: 'passport' },
    { label: 'বিআরটিএ', value: 'brta' },
    { label: 'বিদ্যুৎ', value: 'power-electricity' },
    { label: 'স্বাস্থ্য সেবা', value: 'health' },
    { label: 'স্থানীয় সরকার', value: 'local-government' },
  ];

  const filteredStories = selectedDept === 'all'
    ? published.slice(0, 6)
    : published.filter((s) => s.departmentSlug === selectedDept).slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="ঘুষখোর - নাগরিক অভিজ্ঞতা, জনসেবা পর্যবেক্ষণ ও জবাবদিহিতা প্ল্যাটফর্ম"
        description="বাংলাদেশের বিভিন্ন সরকারি ও জনসেবামূলক দপ্তরের বাস্তব নাগরিক অভিজ্ঞতা, পরামর্শ এবং প্রশাসনিক স্বচ্ছতা বিষয়ক নিরপেক্ষ প্ল্যাটফর্ম।"
        canonicalUrl="/"
      />

      {/* Hero / Platform Overview Banner */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 text-stone-100 rounded-2xl p-6 sm:p-10 shadow-lg border border-stone-800 mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-800/60 rounded-full text-red-300 text-xs font-semibold mb-4">
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>দায়িত্বশীল নাগরিক পর্যবেক্ষণ ও স্বচ্ছতা</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            নাগরিকের বাস্তব অভিজ্ঞতা,<br />
            <span className="text-red-400">জনসেবায় জবাবদিহিতা</span>
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            ভূমি অফিস, পাসপোর্ট, বিআরটিএ, বিদ্যুৎ বা সরকারি হাসপাতাল—নাগরিক হিসেবে আপনার সেবা গ্রহণের সত্যনিষ্ঠ অভিজ্ঞতা অন্য নাগরিককে পথ দেখায় এবং প্রশাসনে জবাবদিহিতার দাবিকে জোরদার করে।
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/write')}
              className="bg-red-700 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all"
            >
              আপনার অভিজ্ঞতা জানান
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/experiences')}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-medium px-5 py-2.5 rounded-lg border border-stone-700 transition-all"
            >
              সকল প্রতিবেদন পড়ুন
            </button>
          </div>
        </div>
      </section>

      {/* Policy-compliant Ad Slot */}
      <AdSlot type="homepage" settings={settings} />

      {/* Bribe Analytics & Comparison Graph Section (Requirement: Graph of lowest/highest bribes by district/division) */}
      <BribeAnalyticsChart stories={stories} onNavigate={onNavigate} />

      {/* Quick Division Navigator (Requirement 21: Internal Linking) */}
      <section className="my-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              বিভাগভিত্তিক অভিজ্ঞতা
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              বাংলাদেশের ৮টি প্রশাসনিক বিভাগের স্থানীয় নাগরিক পর্যবেক্ষণ
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/divisions')}
            className="text-xs sm:text-sm text-red-700 hover:text-red-800 font-semibold flex items-center gap-1 hover:underline"
          >
            <span>সব বিভাগ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BANGLADESH_DIVISIONS.map((div) => {
            const count = published.filter((s) => s.divisionSlug === div.slug).length;
            return (
              <button
                key={div.slug}
                type="button"
                onClick={() => onNavigate(`/division/${div.slug}`)}
                className="text-left p-3.5 bg-white rounded-xl border border-stone-200 hover:border-red-400 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 group-hover:text-red-700 text-base">
                    {div.name}
                  </span>
                  <MapPin className="w-4 h-4 text-stone-400 group-hover:text-red-600 transition-colors" />
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {count > 0 ? `${count}টি অভিজ্ঞতা` : 'জেলাসমূহ দেখুন'}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Department Filter Tabs */}
      <section className="my-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {departments.map((dept) => (
            <button
              key={dept.value}
              type="button"
              onClick={() => setSelectedDept(dept.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                selectedDept === dept.value
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>
      </section>

      {/* Latest Stories Grid */}
      <section className="my-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
              সাম্প্রতিক নাগরিক অভিজ্ঞতা
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              সম্পাদকীয় দল কর্তৃক যাচাই ও পর্যালোচিত সত্যনিষ্ঠ প্রতিবেদন
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/experiences')}
            className="text-xs sm:text-sm text-red-700 hover:text-red-800 font-semibold flex items-center gap-1 hover:underline"
          >
            <span>সবগুলো পড়ুন ({published.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <article
              key={story.id}
              onClick={() => onNavigate(`/story/${story.slug}`)}
              className="bg-white rounded-xl border border-stone-200 hover:border-red-400/80 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5">
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 font-medium rounded">
                    {story.department}
                  </span>
                  <span className="flex items-center gap-1 text-stone-500">
                    <MapPin className="w-3 h-3" />
                    {story.district}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug mb-2">
                  {story.title}
                </h3>

                {/* Bribe Amount Badge */}
                <div className="flex items-center justify-between gap-2 mb-3 py-1.5 px-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs">
                  <span className="text-stone-500 text-[11px] font-medium flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-stone-400" />
                    ঘুষের দাবি:
                  </span>
                  <span className={`font-mono font-bold text-xs ${
                    (story.bribeAmount || 0) === 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {(story.bribeAmount || 0) === 0
                      ? '৳০ (ঘুষমুক্ত)'
                      : `৳${(story.bribeAmount || 0).toLocaleString('bn-BD')}`}
                  </span>
                </div>

                <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                  {story.content}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(story.datePublished).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {story.viewCount}
                  </span>
                </div>
                <span className="text-red-700 font-medium group-hover:underline flex items-center gap-0.5">
                  বিস্তারিত পড়ুন
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Popular Stories Spotlight (Requirement 21) */}
      <section className="my-12 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200">
        <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2">
          <TrendingUp className="w-4 h-4" />
          <span>নাগরিকদের কাছে সর্বাধিক সহায়ক প্রতিবেদন</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif mb-6">
          জনপ্রিয় পরামর্শ ও অভিজ্ঞতা
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularStories.map((story, idx) => (
            <div
              key={story.id}
              onClick={() => onNavigate(`/story/${story.slug}`)}
              className="p-4 rounded-xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50 transition-all cursor-pointer flex items-start gap-3 group"
            >
              <span className="text-2xl font-bold font-serif text-stone-300 group-hover:text-red-600 shrink-0">
                0{idx + 1}
              </span>
              <div>
                <span className="text-[11px] font-semibold text-stone-500 block mb-1">
                  {story.department} • {story.district}
                </span>
                <h4 className="font-serif font-bold text-stone-900 group-hover:text-red-700 text-sm sm:text-base leading-snug">
                  {story.title}
                </h4>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ThumbsUp className="w-3 h-3" /> {story.helpfulCount} জন উপকৃত হয়েছেন
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Transparency & Moderation Card */}
      <section className="my-10 p-6 bg-stone-100 rounded-xl border border-stone-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
              কীভাবে আপনার অভিজ্ঞতা প্রকাশ করবেন?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              ঘুষখোর প্ল্যাটফর্মে সকল নাগরিক লেখা বেনামে বা ছদ্মনামে প্রকাশিত হয়। ব্যক্তিগত আক্রোশ, ফোন নম্বর বা জাতীয় পরিচয়পত্র প্রকাশ সম্পূর্ণ নিষিদ্ধ। প্রতিটি লেখা সম্পাদকীয় দল পর্যালোচনা করে প্রকাশ করে।
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/editorial-policy')}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg"
            >
              সম্পাদকীয় নীতিমালা
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/write')}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-600 rounded-lg shadow-sm"
            >
              অভিজ্ঞতা জমা দিন
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
