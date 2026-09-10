import { TrendingUp, ThumbsUp, Eye, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Story, SiteSettings } from '../types.ts';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';
import AdSlot from '../components/AdSlot.tsx';

interface PopularPageProps {
  stories: Story[];
  settings?: SiteSettings;
  onNavigate: (path: string) => void;
}

export default function PopularPage({ stories = [], settings, onNavigate }: PopularPageProps) {
  const storyList = Array.isArray(stories) ? stories : [];
  const published = storyList.filter((s) => s.status === 'PUBLISHED');
  const sorted = [...published].sort(
    (a, b) => b.helpfulCount * 3 + b.viewCount - (a.helpfulCount * 3 + a.viewCount),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="জনপ্রিয় নাগরিক অভিজ্ঞতা ও গুরুত্বপূর্ণ পর্যবেক্ষণ | ঘুষখোর"
        description="পাঠক ও নাগরিকদের ভোটে সর্বাধিক সহায়ক ও সচেতনতামূলক সরকারি সেবা অভিজ্ঞতা ও পরামর্শের সংকলন।"
        canonicalUrl="/popular"
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'জনপ্রিয় প্রতিবেদন', url: '/popular' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
          <span>নাগরিক মূল্যায়ন ও পাঠক প্রিয়তা</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mb-2">
          সর্বাধিক সহায়ক নাগরিক অভিজ্ঞতা
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-3xl">
          যেসব প্রতিবেদন সাধারণ নাগরিকদের সেবাপ্রাপ্তি ও মধ্যস্বত্বভোগী পরিহার করতে সবচেয়ে বেশি দিকনির্দেশনা প্রদান করেছে।
        </p>
      </div>

      <AdSlot type="between-stories" settings={settings} />

      <div className="space-y-4">
        {sorted.map((story, index) => (
          <article
            key={story.id}
            onClick={() => onNavigate(`/story/${story.slug}`)}
            className="bg-white rounded-2xl border border-stone-200 hover:border-red-400 hover:shadow-md transition-all p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-300 group-hover:text-red-600 shrink-0 w-10">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-1.5">
                  <span className="px-2 py-0.5 bg-stone-100 font-semibold text-stone-700 rounded">
                    {story.department}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {story.district}, {story.division}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">
                    {story.resolutionStatus}
                  </span>
                </div>

                <h2 className="font-serif font-bold text-lg sm:text-xl text-stone-900 group-hover:text-red-700 transition-colors leading-snug">
                  {story.title}
                </h2>

                <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 mt-1.5 leading-relaxed">
                  {story.content}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 text-xs text-stone-500 shrink-0 gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {story.helpfulCount} জন উপকৃত
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-stone-400" />
                  {story.viewCount}
                </span>
              </div>
              <span className="text-red-700 font-semibold group-hover:underline flex items-center gap-1">
                পড়ুন <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
