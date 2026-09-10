import { useState, type FormEvent } from 'react';
import { Mail, MessageSquare, AlertCircle, CheckCircle2, Shield, Send, Building } from 'lucide-react';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('সাধারণ অনুসন্ধান');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="যোগাযোগ ও সম্পাদকীয় সহায়তা | ঘুষখোর"
        description="ঘুষখোর প্ল্যাটফর্মের সম্পাদকীয় দল, তথ্য সংশোধন, কপিরাইট নোটিশ ও বিজ্ঞাপন সংক্রান্ত যোগাযোগের মাধ্যম।"
        canonicalUrl="/contact"
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'যোগাযোগ', url: '/contact' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-md mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>নাগরিক ও সম্পাদকীয় যোগাযোগ</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            যোগাযোগ ও অনুসন্ধান
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            কোনো তথ্যের সংশোধন, গোপনীয়তা সংক্রান্ত বিষয়, বিজ্ঞাপন বা সাধারণ যেকোনো বিষয়ে আমাদের সম্পাদকীয় দলের সাথে যোগাযোগ করতে পারেন।
          </p>
        </div>

        {/* Contact Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 text-xs block mb-1">সম্পাদকীয় ও সংশোধন</span>
            <p className="text-[11px] text-stone-600 mb-2">প্রকাশিত লেখার তথ্য সংশোধন বা অপসারন সংক্রান্ত আবেদন।</p>
            <span className="text-xs font-medium text-red-700 block">editorial@ghushkhur.org</span>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 text-xs block mb-1">আইনি ও গোপনীয়তা</span>
            <p className="text-[11px] text-stone-600 mb-2">কপিরাইট, ডেটা প্রটেকশন বা আইনি নোটিশের জন্য।</p>
            <span className="text-xs font-medium text-red-700 block">legal@ghushkhur.org</span>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <span className="font-bold text-stone-900 text-xs block mb-1">বিজ্ঞাপন ও অংশীদারিত্ব</span>
            <p className="text-[11px] text-stone-600 mb-2">এডসেন্স বা স্পনসরড জনসচেতনতামূলক ক্যাম্পেইন।</p>
            <span className="text-xs font-medium text-red-700 block">ads@ghushkhur.org</span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="pt-4 border-t border-stone-100">
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">
            বার্তা পাঠান
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-stone-900 text-base mb-1">আপনার বার্তা সফলভাবে গৃহীত হয়েছে!</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                আমাদের সংশ্লিষ্ট প্রতিনিধি আপনার প্রদত্ত ইমেইলে দ্রুততম সময়ে (সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে) সাড়া দেবে।
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-semibold"
              >
                আরেকটি বার্তা পাঠান
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-stone-700 mb-1">
                    আপনার নাম (ঐচ্ছিক):
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="নাম লিখুন"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-stone-700 mb-1">
                    ইমেইল ঠিকানা <span className="text-red-600">*</span>:
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-stone-700 mb-1">
                  বিষয়:
                </label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
                >
                  <option value="সাধারণ অনুসন্ধান">সাধারণ অনুসন্ধান (General Inquiry)</option>
                  <option value="তথ্য সংশোধন বা অপসারণ">তথ্য সংশোধন বা অপসারণ (Content Correction / Removal)</option>
                  <option value="গোপনীয়তা ও ডেটা বিষয়">গোপনীয়তা ও ডেটা সুরক্ষা (Privacy Concerns)</option>
                  <option value="কপিরাইট / আইনি নোটিশ">কপিরাইট / আইনি নোটিশ (Legal / DMCA)</option>
                  <option value="বিজ্ঞাপন ও পার্টনারশিপ">বিজ্ঞাপন সংক্রান্ত যোগাযোগ (Advertising Inquiry)</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-stone-700 mb-1">
                  আপনার বার্তা / বিস্তারিত বিবরণ <span className="text-red-600">*</span>:
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার বক্তব্য সুনির্দিষ্টভাবে তুলে ধরুন..."
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
