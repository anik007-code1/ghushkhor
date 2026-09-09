import { MapPin, ArrowRight, Clock, ThumbsUp, AlertCircle, PenLine, Banknote } from 'lucide-react';
import { Story, SiteSettings } from '../types.ts';
import { getDistrictBySlug } from '../data/bangladeshData.ts';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';
import AdSlot from '../components/AdSlot.tsx';

interface DistrictDetailPageProps {
  slug: string;
  stories: Story[];
  settings?: SiteSettings;
  onNavigate: (path: string) => void;
}

export default function DistrictDetailPage({
  slug,
  stories,
  settings,
  onNavigate,
}: DistrictDetailPageProps) {
  const district = getDistrictBySlug(slug);

  if (!district) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <SEOHead
          title="জেলাটি পাওয়া যায়নি | ঘুষখুর"
          description="অনুরোধকৃত জেলাটি খুঁজে পাওয়া যায়নি।"
          noindex={true}
        />
        <h1 className="text-2xl font-bold font-serif mb-4">জেলাটি খুঁজে পাওয়া যায়নি</h1>
        <button
          onClick={() => onNavigate('/divisions')}
          className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm"
        >
          বিভাগ ও জেলা তালিকায় ফিরুন
        </button>
      </div>
    );
  }

  const storyList = Array.isArray(stories) ? stories : [];
  const distStories = storyList.filter(
    (s) => s.districtSlug === district.slug && s.status === 'PUBLISHED',
  );

  const hasContent = distStories.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title={`${district.name} জেলার সরকারি সেবা অভিজ্ঞতা ও নাগরিক পর্যবেক্ষণ | ঘুষখুর`}
        description={`${district.name} জেলার ভূমি অফিস, পাসপোর্ট, বিআরটিএ, বিদ্যুৎ ও স্বাস্থ্য সেবা সংক্রান্ত নাগরিকদের বাস্তব অভিজ্ঞতা ও সতর্কতা।`}
        canonicalUrl={`/district/${district.slug}`}
        noindex={!hasContent} // Requirement 17 & 27: Thin pages with no stories must not be indexed
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'বিভাগ', url: '/divisions' },
          { name: `${district.divisionName} বিভাগ`, url: `/division/${district.divisionSlug}` },
          { name: `${district.name} জেলা`, url: `/district/${district.slug}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 mb-8 shadow-sm">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-md mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{district.divisionName} বিভাগ • জেলা পর্যায়</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
          {district.name} জেলার জনসেবা অভিজ্ঞতা ও নাগরিক রিপোর্ট
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-3xl">
          {district.name} জেলার বিভিন্ন সরকারি কার্যালয়, হাসপাতাল ও স্থানীয় সংস্থার নাগরিক সেবার মান, মধ্যস্বত্বভোগী পরিহারের উপায় এবং নাগরিকদের বাস্তব পরামর্শ।
        </p>
      </div>

      <AdSlot type="between-stories" settings={settings} />

      {/* Stories List */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
          {district.name} জেলার প্রকাশিত প্রতিবেদন ({distStories.length})
        </h2>
        <button
          type="button"
          onClick={() => onNavigate('/write')}
          className="text-xs font-semibold text-red-700 hover:underline flex items-center gap-1"
        >
          <PenLine className="w-3.5 h-3.5" />
          <span>এই জেলার জন্য লিখুন</span>
        </button>
      </div>

      {!hasContent ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300">
          <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-stone-800 text-lg mb-2">
            {district.name} জেলা থেকে এখনো কোনো অভিজ্ঞতা প্রকাশিত হয়নি
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
            আপনি কি {district.name} জেলার কোনো সরকারি অফিসে সেবা গ্রহণ করেছেন? আপনার বাস্তব অভিজ্ঞতা শেয়ার করে সহ-নাগরিকদের সচেতন করুন।
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/write')}
            className="px-5 py-2.5 bg-red-700 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            প্রথম অভিজ্ঞতাটি জমা দিন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {distStories.map((story) => (
            <article
              key={story.id}
              onClick={() => onNavigate(`/story/${story.slug}`)}
              className="bg-white rounded-xl border border-stone-200 hover:border-red-400 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5">
                  <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 font-semibold rounded">
                    {story.department}
                  </span>
                  <span className="text-emerald-700 font-medium">
                    {story.resolutionStatus}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug mb-2">
                  {story.title}
                </h3>

                {/* Bribe Amount Badge */}
                <div className="flex items-center justify-between gap-2 mb-3 py-1.5 px-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs">
                  <span className="text-stone-500 text-[11px] font-medium flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-stone-400" />
                    ঘুষের পরিমাণ:
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

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(story.datePublished).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                </span>
                <span className="text-red-700 font-semibold group-hover:underline flex items-center gap-1">
                  বিস্তারিত পড়ুন
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
