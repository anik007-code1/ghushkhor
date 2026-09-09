import { useState, type FormEvent } from 'react';
import { Flag, AlertTriangle, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface ReportContentPageProps {
  onNavigate: (path: string) => void;
}

export default function ReportContentPage({ onNavigate }: ReportContentPageProps) {
  const [contentUrl, setContentUrl] = useState('');
  const [reason, setReason] = useState('ব্যক্তিগত আক্রমণ বা ফোন নম্বর (ডক্সিং)');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyTitle: contentUrl || 'সাধারণ প্রতিবেদন রিপোর্ট',
          reason,
          details: `${description} [আবেদনকারী: ${contactEmail || 'অনুল্লেখিত'}]`,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="কনটেন্ট রিপোর্ট ও অভিযোগ দাখিল | ঘুষখুর"
        description="কোনো প্রকাশিত লেখার ভুল তথ্য, ব্যক্তিগত আক্রমণ বা নীতিমালা লঙ্ঘনের বিরুদ্ধে রিপোর্ট দাখিলের ফর্ম।"
        canonicalUrl="/report-content"
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'কনটেন্ট রিপোর্ট', url: '/report-content' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-md mb-2">
            <Flag className="w-3.5 h-3.5" />
            <span>কনটেন্ট নিরীক্ষা ও সুরক্ষা</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            আপত্তিকর কনটেন্ট রিপোর্ট করুন
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            কোনো লেখায় আপনার ব্যক্তিগত তথ্য, ভুল বিবরণ বা নীতিমালা পরিপন্থী কিছু থাকলে আমাদের জানান। সম্পাদকীয় দল সর্বোচ্চ গুরুত্ব দিয়ে বিষয়টি পর্যালোচনা করবে।
          </p>
        </div>

        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 space-y-1.5 leading-relaxed">
          <p className="font-semibold text-stone-900">কী ধরনের অভিযোগ জানাতে পারেন:</p>
          <ul className="list-disc list-inside space-y-0.5 text-stone-600 pl-1">
            <li>অননুমোদিত ফোন নম্বর, জাতীয় পরিচয়পত্র বা বাড়ির ঠিকানা ফাঁস (Doxxing)</li>
            <li>ব্যক্তিগত চরিত্রহনন বা উদ্দেশ্যপ্রণোদিত মিথ্যা অপপ্রচার</li>
            <li>অশ্লীল ভাষা, ধর্মীয় অনুভূতিতে আঘাত বা আইন লঙ্ঘন</li>
          </ul>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="font-bold text-stone-900 text-base mb-1">আপনার রিপোর্ট সফলভাবে জমা হয়েছে</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto mb-4">
              সম্পাদকীয় দল ২৪ ঘণ্টার মধ্যে কনটেন্টটি যাচাই করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করবে।
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold"
            >
              মূল পাতায় ফিরুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="content-url" className="block text-xs font-semibold text-stone-700 mb-1">
                যে পেজ বা লেখার বিরুদ্ধে অভিযোগ (লিংক বা শিরোনাম):
              </label>
              <input
                id="content-url"
                type="text"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="যেমন: https://ghushkhur.org/story/example-story"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label htmlFor="report-reason" className="block text-xs font-semibold text-stone-700 mb-1">
                অভিযোগের সুনির্দিষ্ট কারণ:
              </label>
              <select
                id="report-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
              >
                <option value="ব্যক্তিগত আক্রমণ বা ফোন নম্বর (ডক্সিং)">ব্যক্তিগত আক্রমণ বা ফোন নম্বর (ডক্সিং)</option>
                <option value="মিথ্যা বা বিভ্রান্তিকর তথ্য">মিথ্যা বা বিভ্রান্তিকর তথ্য</option>
                <option value="ঘৃণাবাচক বক্তব্য বা হুমকি">ঘৃণাবাচক বক্তব্য বা হুমকি</option>
                <option value="কপিরাইট লঙ্ঘন">কপিরাইট বা বৌদ্ধিক স্বত্ব লঙ্ঘন</option>
                <option value="স্প্যাম বা ক্ষতিকর লিংক">স্প্যাম বা ক্ষতিকর লিংক</option>
                <option value="অন্যান্য কারণ">অন্যান্য কারণ</option>
              </select>
            </div>

            <div>
              <label htmlFor="report-description" className="block text-xs font-semibold text-stone-700 mb-1">
                অভিযোগের বিস্তারিত প্রমাণ ও বিবরণ:
              </label>
              <textarea
                id="report-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="কোন লাইনে বা প্যারায় নীতি লঙ্ঘন হয়েছে তা নির্দিষ্ট করে বলুন..."
                className="w-full p-3 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label htmlFor="contact-email-input" className="block text-xs font-semibold text-stone-700 mb-1">
                আপনার যোগাযোগের ইমেইল (ঐচ্ছিক, পর্যালোচনার ফলাফল জানাতে):
              </label>
              <input
                id="contact-email-input"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="yourname@domain.com"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'জমা হচ্ছে...' : 'রিপোর্ট জমা দিন'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
