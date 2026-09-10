import { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Eye, ThumbsUp, ArrowRight, Filter, ChevronLeft, ChevronRight, Banknote } from 'lucide-react';
import { Story, SiteSettings } from '../types.ts';
import { BANGLADESH_DIVISIONS, ALL_DISTRICTS } from '../data/bangladeshData.ts';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';
import AdSlot from '../components/AdSlot.tsx';

interface ExperiencesPageProps {
  stories: Story[];
  settings?: SiteSettings;
  searchParams: URLSearchParams;
  onNavigate: (path: string) => void;
}

export default function ExperiencesPage({
  stories,
  settings,
  searchParams,
  onNavigate,
}: ExperiencesPageProps) {
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const initialSearch = searchParams.get('search') || '';
  const initialDiv = searchParams.get('division') || '';
  const initialDept = searchParams.get('department') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedDiv, setSelectedDiv] = useState(initialDiv);
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [sortBy, setSortBy] = useState<'newest' | 'bribe_asc' | 'bribe_desc'>('newest');

  const ITEMS_PER_PAGE = 6;

  // Filter published stories
  const filtered = useMemo(() => {
    const storyList = Array.isArray(stories) ? stories : [];
    let list = storyList.filter((s) => s.status === 'PUBLISHED');

    if (selectedDiv) {
      list = list.filter((s) => s.divisionSlug === selectedDiv);
    }
    if (selectedDept) {
      list = list.filter((s) => s.departmentSlug === selectedDept);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.content.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q),
      );
    }

    if (sortBy === 'bribe_asc') {
      list = [...list].sort((a, b) => (Number(a.bribeAmount) || 0) - (Number(b.bribeAmount) || 0));
    } else if (sortBy === 'bribe_desc') {
      list = [...list].sort((a, b) => (Number(b.bribeAmount) || 0) - (Number(a.bribeAmount) || 0));
    } else {
      list = [...list].sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
    }

    return list;
  }, [stories, selectedDiv, selectedDept, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedStories = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const hasActiveFilters = Boolean(search || selectedDiv || selectedDept);

  // Requirement 20: Filter combinations use noindex to avoid crawl traps, standard page pagination is indexed
  const isNoIndex = Boolean(search.trim());
  const canonicalUrl = currentPage > 1 ? `/experiences?page=${currentPage}` : '/experiences';

  const departments = [
    { label: 'সকল দপ্তর', value: '' },
    { label: 'ভূমি প্রশাসন', value: 'land-office' },
    { label: 'পাসপোর্ট ও ইমিগ্রেশন', value: 'passport' },
    { label: 'বিআরটিএ (BRTA)', value: 'brta' },
    { label: 'বিদ্যুৎ ও জ্বালানি', value: 'power-electricity' },
    { label: 'স্বাস্থ্য সেবা', value: 'health' },
    { label: 'স্থানীয় সরকার ও পৌরসভা', value: 'local-government' },
  ];

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', String(newPage));
    if (search) params.set('search', search);
    if (selectedDiv) params.set('division', selectedDiv);
    if (selectedDept) params.set('department', selectedDept);

    const qs = params.toString();
    onNavigate(`/experiences${qs ? `?${qs}` : ''}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title={
          currentPage > 1
            ? `নাগরিক অভিজ্ঞতাসমূহ - পৃষ্ঠা ${currentPage} | ঘুষখোর`
            : 'সকল নাগরিক অভিজ্ঞতা ও সরকারি সেবা পর্যালোচনা | ঘুষখোর'
        }
        description="বাংলাদেশের বিভিন্ন সরকারি কার্যালয়ে সেবা গ্রহণের বাস্তব অভিজ্ঞতা, মধ্যস্বত্বভোগী পরিহারের উপায় ও পরামর্শ।"
        canonicalUrl={canonicalUrl}
        noindex={isNoIndex}
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'সকল নাগরিক অভিজ্ঞতা', url: '/experiences' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mb-2">
          সকল নাগরিক অভিজ্ঞতা
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-3xl">
          বাংলাদেশের বিভিন্ন উপজেলা ও জেলা পর্যায়ের সরকারি দপ্তরের সেবাগ্রহীতাদের বাস্তব অভিজ্ঞতা ও নাগরিকদের সরাসরি পরামর্শ।
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 mb-8 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="অভিজ্ঞতা খুঁজুন (বিষয়, দপ্তর, জেলা)..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Division Selector */}
          <div className="w-full md:w-48">
            <select
              value={selectedDiv}
              onChange={(e) => setSelectedDiv(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="">সকল বিভাগ</option>
              {BANGLADESH_DIVISIONS.map((div) => (
                <option key={div.slug} value={div.slug}>
                  {div.name} বিভাগ
                </option>
              ))}
            </select>
          </div>

          {/* Department Selector */}
          <div className="w-full md:w-56">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2 px-3 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Bribe/Date Selector */}
          <div className="w-full md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
            >
              <option value="newest">সর্বশেষ অভিজ্ঞতা</option>
              <option value="bribe_asc">কম ঘুষের ঘটনা আগে</option>
              <option value="bribe_desc">বেশি ঘুষের ঘটনা আগে</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
            <span>
              ফিল্টার অনুযায়ী মোট <strong>{filtered.length}</strong>টি প্রতিবেদন পাওয়া গেছে
            </span>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedDiv('');
                setSelectedDept('');
                onNavigate('/experiences');
              }}
              className="text-red-700 hover:underline font-medium"
            >
              ফিল্টার মুছে ফেলুন
            </button>
          </div>
        )}
      </div>

      {/* Stories Listing */}
      {paginatedStories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <p className="text-base text-stone-600 font-medium mb-3">
            আপনার অনুসন্ধানের সাথে মিল রেখে কোনো প্রকাশিত অভিজ্ঞতা পাওয়া যায়নি।
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/write')}
            className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            প্রথম অভিজ্ঞতাটি আপনি লিখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {paginatedStories.map((story) => (
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
                    {story.district}, {story.division}
                  </span>
                </div>

                <h2 className="font-serif font-bold text-lg text-stone-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug mb-2">
                  {story.title}
                </h2>

                {/* Bribe Amount Indicator */}
                <div className="flex items-center justify-between gap-2 mb-3 py-1.5 px-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs">
                  <span className="text-stone-500 text-[11px] font-medium flex items-center gap-1">
                    <Banknote className="w-3.5 h-3.5 text-stone-400" />
                    ঘুষের পরিমাণ:
                  </span>
                  <span className={`font-mono font-bold text-xs ${
                    (story.bribeAmount || 0) === 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {(story.bribeAmount || 0) === 0
                      ? '৳০ (ঘুষমুক্ত সেবা)'
                      : `৳${(story.bribeAmount || 0).toLocaleString('bn-BD')}`}
                  </span>
                </div>

                <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                  {story.content}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(story.datePublished).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {story.helpfulCount}
                  </span>
                </div>
                <span className="text-red-700 font-semibold group-hover:underline flex items-center gap-1">
                  সম্পূর্ণ পড়ুন
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Mid-listing policy-compliant Ad Slot */}
      <AdSlot type="between-stories" settings={settings} />

      {/* Pagination Controls (Requirement 19) */}
      {totalPages > 1 && (
        <nav aria-label="অভিজ্ঞতা তালিকা পেজিনেশন" className="flex items-center justify-center gap-2 my-8">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>পূর্ববর্তী</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePageChange(p)}
                className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === p
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
          >
            <span>পরবর্তী</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
