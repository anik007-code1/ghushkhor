import { useState, useEffect, type FormEvent } from 'react';
import { MapPin, Clock, Eye, ThumbsUp, Calendar, AlertTriangle, CheckCircle2, MessageSquare, Share2, ArrowRight, ShieldCheck, Flag, Banknote } from 'lucide-react';
import { Story, Comment, SiteSettings } from '../types.ts';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';
import AdSlot from '../components/AdSlot.tsx';

interface StoryDetailPageProps {
  slug: string;
  stories: Story[];
  settings?: SiteSettings;
  onNavigate: (path: string) => void;
}

export default function StoryDetailPage({ slug, stories = [], settings, onNavigate }: StoryDetailPageProps) {
  const storyList = Array.isArray(stories) ? stories : [];
  const foundInMemory = storyList.find((s) => s.slug === slug);
  const [fetchedStory, setFetchedStory] = useState<Story | null>(null);

  const story = foundInMemory || fetchedStory;

  const [helpfulCount, setHelpfulCount] = useState<number>(story?.helpfulCount || 0);
  const [hasVotedHelpful, setHasVotedHelpful] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentSubmittedMessage, setCommentSubmittedMessage] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('ব্যক্তিগত আক্রমণ বা ফোন নম্বর');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!foundInMemory && slug) {
      fetch(`/api/stories/${slug}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.id) setFetchedStory(data);
        })
        .catch(() => {});
    }
  }, [slug, foundInMemory]);

  useEffect(() => {
    if (!story) return;
    setHelpfulCount(story.helpfulCount);

    // Check localStorage if already voted
    const voted = localStorage.getItem(`gk_vote_${story.id}`);
    if (voted) setHasVotedHelpful(true);

    // Fetch approved comments
    fetch(`/api/comments/${story.id}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setComments(data))
      .catch(() => {});
  }, [story]);

  // Inject Schema.org Article Structured Data (Requirement 4)
  useEffect(() => {
    if (!story || story.status !== 'PUBLISHED') return;

    const origin = window.location.origin;
    const canonicalUrl = `${origin}/story/${story.slug}`;

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: story.title,
      description: story.metaDescription,
      datePublished: story.datePublished,
      dateModified: story.dateModified || story.datePublished,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'ঘুষখোর',
        url: origin,
      },
      author: {
        '@type': 'Organization',
        name: 'নাগরিক অবদানকারী (ঘুষখোর সম্পাদকীয় পর্যালোচিত)',
      },
      articleSection: story.department,
      inLanguage: 'bn',
    };

    const scriptId = 'schema-article-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(articleSchema);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [story]);

  if (!story || story.status !== 'PUBLISHED') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <SEOHead
          title="অভিজ্ঞতাটি পাওয়া যায়নি | ঘুষখোর"
          description="অনুরোধকৃত প্রতিবেদনটি পাওয়া যায়নি বা এখনো প্রকাশিত হয়নি।"
          noindex={true}
        />
        <div className="p-8 bg-white rounded-2xl border border-stone-200">
          <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            এই অভিজ্ঞতাটি পাওয়া যায়নি বা এখনো পর্যালোচনায় রয়েছে
          </h1>
          <p className="text-stone-600 text-sm mb-6">
            প্রতিবেদনটি হয়তো অপসারণ করা হয়েছে অথবা এটি এখনো সম্পাদকীয় দলের অনুমোদনের অপেক্ষায় রয়েছে।
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/experiences')}
            className="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            অন্যান্য অভিজ্ঞতা পড়ুন
          </button>
        </div>
      </div>
    );
  }

  const handleHelpfulClick = async () => {
    if (hasVotedHelpful) return;
    setHasVotedHelpful(true);
    setHelpfulCount((prev) => prev + 1);
    localStorage.setItem(`gk_vote_${story.id}`, 'true');

    try {
      await fetch(`/api/stories/${story.id}/helpful`, { method: 'POST' });
    } catch (e) {
      // Silently fall back
    }
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || commentSubmitting) return;

    setCommentSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId: story.id,
          content: newComment.trim(),
        }),
      });
      if (res.ok) {
        setNewComment('');
        setCommentSubmittedMessage('আপনার মন্তব্য সফলভাবে জমা হয়েছে। সম্পাদকীয় পর্যালোচনার পর এটি দৃশ্যমান হবে।');
      }
    } catch (err) {
      setCommentSubmittedMessage('মন্তব্য জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleReportSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId: story.id,
          storyTitle: story.title,
          reason: reportReason,
          details: reportDetails,
        }),
      });
      setReportSubmitted(true);
    } catch (err) {
      setReportSubmitted(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Related stories (Requirement 21)
  const relatedStories = story
    ? storyList
        .filter((s) => s.id !== story.id && s.status === 'PUBLISHED' && (s.departmentSlug === story.departmentSlug || s.divisionSlug === story.divisionSlug))
        .slice(0, 3)
    : [];

  // Split content into paragraphs for middle ad injection (Requirement 9)
  const paragraphs = story.content.split('\n\n').filter(Boolean);
  const midPoint = Math.ceil(paragraphs.length / 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title={`${story.title} | ঘুষখোর`}
        description={story.metaDescription}
        canonicalUrl={`/story/${story.slug}`}
        ogType="article"
        publishedTime={story.datePublished}
        modifiedTime={story.dateModified || story.datePublished}
      />

      {/* Breadcrumbs (Requirement 5) */}
      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'বিভাগ', url: '/divisions' },
          { name: story.division, url: `/division/${story.divisionSlug}` },
          { name: 'জেলা', url: `/division/${story.divisionSlug}` },
          { name: story.district, url: `/district/${story.districtSlug}` },
          { name: story.title, url: `/story/${story.slug}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* Story Page Top Ad Slot (Requirement 9) */}
      <AdSlot type="story-top" settings={settings} />

      <article className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-sm mb-10">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-red-50 text-red-800 font-semibold text-xs rounded-md border border-red-200">
            {story.department}
          </span>
          <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs rounded-md font-medium flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            <button
              type="button"
              onClick={() => onNavigate(`/district/${story.districtSlug}`)}
              className="hover:underline hover:text-red-700"
            >
              {story.district}
            </button>
            ,{' '}
            <button
              type="button"
              onClick={() => onNavigate(`/division/${story.divisionSlug}`)}
              className="hover:underline hover:text-red-700"
            >
              {story.division} বিভাগ
            </button>
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs rounded-md font-medium">
            অবস্থা: {story.resolutionStatus}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-950 leading-tight mb-5">
          {story.title}
        </h1>

        {/* Office & Service specifics */}
        {(story.officeName || story.serviceName) && (
          <div className="bg-stone-50 border-l-4 border-stone-400 p-3.5 rounded-r-lg text-xs sm:text-sm text-stone-700 mb-6 space-y-1">
            {story.officeName && (
              <p>
                <strong>সংশ্লিষ্ট কার্যালয়:</strong> {story.officeName}
              </p>
            )}
            {story.serviceName && (
              <p>
                <strong>সেবার ধরণ:</strong> {story.serviceName}
              </p>
            )}
          </div>
        )}

        {/* Story Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 py-3 border-y border-stone-100 gap-3 mb-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-stone-400" />
              প্রকাশ: {new Date(story.datePublished).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {story.dateModified && (
              <span className="hidden sm:inline text-stone-400">
                (হালনাগাদ: {new Date(story.dateModified).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })})
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-stone-400" />
              পড়ার সময়: {story.readingTimeMinutes} মিনিট
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-stone-600 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
              title="লিংক কপি করুন"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="text-stone-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              title="রিপোর্ট করুন"
            >
              <Flag className="w-4 h-4" />
              <span className="hidden sm:inline">রিপোর্ট</span>
            </button>
          </div>
        </div>

        {/* Bribe Detail Highlight Banner */}
        <div className={`mb-8 p-4 sm:p-5 rounded-2xl border ${
          (story.bribeAmount || 0) === 0
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : 'bg-red-50/80 border-red-200 text-red-950'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                (story.bribeAmount || 0) === 0
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                  : 'bg-red-100 text-red-700 border-red-300'
              }`}>
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                  {(story.bribeAmount || 0) === 0 ? 'ঘুষমুক্ত ও স্বচ্ছ সেবা' : 'ঘুষ বা অনৈতিক অর্থের দাবি'}
                </div>
                <div className="text-xl sm:text-2xl font-black font-mono">
                  {(story.bribeAmount || 0) === 0
                    ? '৳০ (কোনো ঘুষ দিতে হয়নি)'
                    : `৳${(story.bribeAmount || 0).toLocaleString('bn-BD')}`}
                </div>
              </div>
            </div>

            {story.bribeDemandedBy && (
              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-current/10">
                <div className="text-[11px] font-semibold opacity-75">দাবিকারী বা মধ্যস্বত্বভোগী:</div>
                <div className="text-xs sm:text-sm font-bold mt-0.5">{story.bribeDemandedBy}</div>
              </div>
            )}
          </div>
        </div>

        {/* Story Content Narrative */}
        <div className="prose prose-stone max-w-none text-stone-800 text-base sm:text-lg leading-relaxed space-y-5">
          {paragraphs.slice(0, midPoint).map((para, i) => (
            <p key={i} className="leading-relaxed whitespace-pre-line font-normal">
              {para}
            </p>
          ))}

          {/* Story Middle Ad Slot (Requirement 9) */}
          <AdSlot type="story-middle" settings={settings} />

          {paragraphs.slice(midPoint).map((para, i) => (
            <p key={`post-${i}`} className="leading-relaxed whitespace-pre-line font-normal">
              {para}
            </p>
          ))}
        </div>

        {/* Citizen Tips & Learnings Box */}
        {story.tipsForCitizens && story.tipsForCitizens.length > 0 && (
          <div className="mt-10 p-5 sm:p-6 bg-amber-50/70 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base mb-3 font-serif">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <span>সাধারণ নাগরিকদের জন্য সচেতনতামূলক পরামর্শ:</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-800 list-disc list-inside">
              {story.tipsForCitizens.map((tip, idx) => (
                <li key={idx} className="leading-relaxed pl-1">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-8 pt-6 border-t border-stone-100">
            {story.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Helpful Reaction Button */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-stone-600">
            এই অভিজ্ঞতাটি কি আপনার জন্য তথ্যবহুল বা শিক্ষণীয় ছিল?
          </div>
          <button
            type="button"
            onClick={handleHelpfulClick}
            disabled={hasVotedHelpful}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              hasVotedHelpful
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-red-700 hover:bg-red-600 text-white active:scale-95'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{hasVotedHelpful ? 'ধন্যবাদ! মতামত গৃহীত' : 'হ্যাঁ, সহায়ক ছিল'} ({helpfulCount})</span>
          </button>
        </div>
      </article>

      {/* Story Page Bottom Ad Slot (Requirement 9) */}
      <AdSlot type="story-bottom" settings={settings} />

      {/* Internal Linking: Related Stories (Requirement 21) */}
      {relatedStories.length > 0 && (
        <section className="my-12">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-4">
            একই বিভাগ বা দপ্তরের অন্যান্য অভিজ্ঞতা
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedStories.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onNavigate(`/story/${rel.slug}`)}
                className="bg-white p-4 rounded-xl border border-stone-200 hover:border-red-400 transition-all cursor-pointer group"
              >
                <span className="text-[11px] font-semibold text-stone-500 block mb-1">
                  {rel.department} • {rel.district}
                </span>
                <h3 className="font-serif font-bold text-stone-900 group-hover:text-red-700 text-sm line-clamp-2 leading-snug">
                  {rel.title}
                </h3>
                <span className="text-xs text-red-700 font-medium mt-3 inline-flex items-center gap-1 group-hover:underline">
                  পড়ুন <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comments Section (Requirement 29: Moderated Comments) */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-stone-600" />
            <span>নাগরিক মন্তব্য ({comments.length})</span>
          </h2>
          <span className="text-xs text-stone-500">
            *সকল মন্তব্য মডারেশনের পর প্রকাশিত হয়
          </span>
        </div>

        {/* Existing Comments */}
        {comments.length > 0 ? (
          <div className="space-y-4 mb-8">
            {comments.map((comm) => (
              <div key={comm.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                  <span className="font-semibold text-stone-700">বেনামী নাগরিক</span>
                  <span>{new Date(comm.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}</span>
                </div>
                <p className="text-stone-800 text-sm leading-relaxed">{comm.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 mb-6 italic">
            এখনো কোনো অনুমোদিত মন্তব্য নেই। শালীন ও গঠনমূলক ভাষায় আপনার অভিজ্ঞতা বা পরামর্শ যোগ করুন।
          </p>
        )}

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-3">
          <label htmlFor="comment-box" className="block text-xs font-semibold text-stone-700">
            গঠনমূলক মন্তব্য লিখুন (ব্যক্তিগত আক্রমণ ও ফোন নম্বর বর্জন করুন):
          </label>
          <textarea
            id="comment-box"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="আপনার প্রাসঙ্গিক পরামর্শ বা অভিজ্ঞতা লিখুন..."
            className="w-full p-3 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-red-500"
            required
          />

          {commentSubmittedMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium">
              {commentSubmittedMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={commentSubmitting || !newComment.trim()}
            className="px-5 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {commentSubmitting ? 'জমা হচ্ছে...' : 'মন্তব্য পাঠান (পর্যালোচনার জন্য)'}
          </button>
        </form>
      </section>

      {/* Report Content Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-lg flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-600" />
                <span>কনটেন্ট রিপোর্ট করুন</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            {!reportSubmitted ? (
              <form onSubmit={handleReportSubmit} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    রিপোর্টের কারণ:
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="ব্যক্তিগত আক্রমণ বা ফোন নম্বর">ব্যক্তিগত আক্রমণ বা ফোন নম্বর (ডক্সিং)</option>
                    <option value="মিথ্যা বা বিভ্রান্তিকর তথ্য">মিথ্যা বা বিভ্রান্তিকর তথ্য</option>
                    <option value="ঘৃণাবাচক বক্তব্য বা হুমকি">ঘৃণাবাচক বক্তব্য বা হুমকি</option>
                    <option value="স্প্যাম বা বাণিজ্যিক বিজ্ঞাপন">স্প্যাম বা বাণিজ্যিক বিজ্ঞাপন</option>
                    <option value="অন্যান্য নীতি লঙ্ঘন">অন্যান্য নীতি লঙ্ঘন</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    বিস্তারিত বিবরণ (ঐচ্ছিক):
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="কোথায় ত্রুটি রয়েছে বা কোন তথ্যটি নীতিমালার পরিপন্থী তা উল্লেখ করুন..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg"
                  >
                    রিপোর্ট জমা দিন
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="font-semibold text-stone-900 text-sm">আপনার রিপোর্ট গ্রহণ করা হয়েছে।</p>
                <p className="text-stone-500 text-xs mt-1">সম্পাদকীয় দল দ্রুত বিষয়টি খতিয়ে দেখবে।</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportSubmitted(false);
                  }}
                  className="mt-4 px-4 py-2 bg-stone-800 text-white rounded-lg text-xs"
                >
                  বন্ধ করুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
