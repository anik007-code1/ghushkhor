import { MapPin, ArrowRight, Clock, Eye, ThumbsUp, Banknote } from 'lucide-react';
import { Story, SiteSettings } from '../types.ts';
import { getDivisionBySlug } from '../data/bangladeshData.ts';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';
import AdSlot from '../components/AdSlot.tsx';

interface DivisionDetailPageProps {
  slug: string;
  stories: Story[];
  settings?: SiteSettings;
  onNavigate: (path: string) => void;
}

export default function DivisionDetailPage({
  slug,
  stories,
  settings,
  onNavigate,
}: DivisionDetailPageProps) {
  const division = getDivisionBySlug(slug);

  if (!division) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <SEOHead
          title="বিভাগটি পাওয়া যায়নি | ঘুষখোর"
          description="অনুরোধকৃত বিভাগটি খুঁজে পাওয়া যায়নি।"
          noindex={true}
        />
        <h1 className="text-2xl font-bold font-serif mb-4">বিভাগটি খুঁজে পাওয়া যায়নি</h1>
        <button
          onClick={() => onNavigate('/divisions')}
          className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm"
        >
          সকল বিভাগ দেখুন
        </button>
      </div>
    );
  }

  const storyList = Array.isArray(stories) ? stories : [];
  const divStories = storyList.filter(
    (s) => s.divisionSlug === division.slug && s.status === 'PUBLISHED',
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title={`${division.name} বিভাগের নাগরিক অভিজ্ঞতা ও সেবা পর্যবেক্ষণ | ঘুষখোর`}
        description={division.description}
        canonicalUrl={`/division/${division.slug}`}
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'বিভাগ', url: '/divisions' },
          { name: `${division.name} বিভাগ`, url: `/division/${division.slug}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 mb-8 shadow-sm">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-md mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>প্রশাসনিক বিভাগ</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
          {division.name} বিভাগের নাগরিক অভিজ্ঞতা ও সেবা পরিস্থিতি
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
          {division.description}
        </p>

        {/* District Chips */}
        <div>
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            আওতাধীন জেলাসমূহের তালিকা:
          </h2>
          <div className="flex flex-wrap gap-2">
            {division.districts.map((dist) => {
              const count = stories.filter(
                (s) => s.districtSlug === dist.slug && s.status === 'PUBLISHED',
              ).length;
              return (
                <button
                  key={dist.slug}
                  type="button"
                  onClick={() => onNavigate(`/district/${dist.slug}`)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    count > 0
                      ? 'bg-red-50 text-red-900 border-red-200 hover:bg-red-100 font-semibold'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {dist.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AdSlot type="between-stories" settings={settings} />

      {/* Stories list */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
          {division.name} বিভাগের প্রকাশিত প্রতিবেদনসমূহ ({divStories.length})
        </h2>
        <button
          type="button"
          onClick={() => onNavigate('/write')}
          className="text-xs font-semibold text-red-700 hover:underline"
        >
          + এই বিভাগে নতুন অভিজ্ঞতা লিখুন
        </button>
      </div>

      {divStories.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200">
          <p className="text-sm text-stone-600 mb-4">
            {division.name} বিভাগে এখনো কোনো অভিজ্ঞতা প্রকাশিত হয়নি।
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/write')}
            className="px-4 py-2 bg-red-700 text-white rounded-lg text-xs font-semibold hover:bg-red-600"
          >
            প্রথম অভিজ্ঞতাটি আপনি লিখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {divStories.map((story) => (
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
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
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
                  সম্পূর্ণ পড়ুন
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
