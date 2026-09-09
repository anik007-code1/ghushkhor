import { MapPin, ArrowRight } from 'lucide-react';
import { Story } from '../types.ts';
import { BANGLADESH_DIVISIONS } from '../data/bangladeshData.ts';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface DivisionsPageProps {
  stories: Story[];
  onNavigate: (path: string) => void;
}

export default function DivisionsPage({ stories = [], onNavigate }: DivisionsPageProps) {
  const storyList = Array.isArray(stories) ? stories : [];
  const published = storyList.filter((s) => s.status === 'PUBLISHED');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="বিভাগ ও জেলাভিত্তিক নাগরিক অভিজ্ঞতা সূচি | ঘুষখুর"
        description="বাংলাদেশের ৮টি প্রশাসনিক বিভাগ ও ৬৪টি জেলার জনসেবা অভিজ্ঞতা, নাগরিক প্রতিবেদন ও স্থানীয় অফিসের পর্যবেক্ষণ।"
        canonicalUrl="/divisions"
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'বিভাগ ও জেলাভিত্তিক সূচি', url: '/divisions' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mb-2">
          বিভাগ ও জেলাভিত্তিক নাগরিক অভিজ্ঞতা
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-3xl">
          বাংলাদেশের ৮টি প্রশাসনিক বিভাগের জেলাসমূহের সরকারি দপ্তর, হাসপাতাল, পৌরসভা ও স্থানীয় প্রশাসনের বাস্তব নাগরিক অভিজ্ঞতা পর্যবেক্ষণ করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BANGLADESH_DIVISIONS.map((div) => {
          const divStories = published.filter((s) => s.divisionSlug === div.slug);
          return (
            <div
              key={div.slug}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:border-red-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-700" />
                    <span>{div.name} বিভাগ</span>
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 text-stone-700 rounded-full">
                    {divStories.length}টি প্রকাশিত প্রতিবেদন
                  </span>
                </div>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {div.description}
                </p>

                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    আওতাধীন জেলাসমূহ:
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {div.districts.map((dist) => {
                      const hasStories = published.some((s) => s.districtSlug === dist.slug);
                      return (
                        <button
                          key={dist.slug}
                          type="button"
                          onClick={() => onNavigate(`/district/${dist.slug}`)}
                          className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                            hasStories
                              ? 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 font-medium'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {dist.name} {hasStories && '•'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => onNavigate(`/division/${div.slug}`)}
                  className="text-xs font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 group"
                >
                  <span>{div.name} বিভাগের বিস্তারিত দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
