import { useState, type FormEvent } from 'react';
import { PenLine, ShieldAlert, CheckCircle2, AlertCircle, Info, Plus, Trash2, Banknote, UserX, Building2 } from 'lucide-react';
import { BANGLADESH_DIVISIONS } from '../data/bangladeshData.ts';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface WritePageProps {
  onNavigate: (path: string) => void;
}

export default function WritePage({ onNavigate }: WritePageProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [divisionSlug, setDivisionSlug] = useState('dhaka');
  const [districtSlug, setDistrictSlug] = useState('dhaka');
  const [department, setDepartment] = useState('ভূমি প্রশাসন (Land Office)');
  const [officeName, setOfficeName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [bribeAmount, setBribeAmount] = useState<string>('');
  const [bribeDemandedBy, setBribeDemandedBy] = useState<string>('দালাল বা মধ্যস্বত্বভোগী');
  const [customBribeDemandedBy, setCustomBribeDemandedBy] = useState<string>('');
  const [tips, setTips] = useState<string[]>(['']);
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const currentDiv = BANGLADESH_DIVISIONS.find((d) => d.slug === divisionSlug) || BANGLADESH_DIVISIONS[0];
  const currentDist = currentDiv.districts.find((d) => d.slug === districtSlug) || currentDiv.districts[0];

  const handleDivChange = (slug: string) => {
    setDivisionSlug(slug);
    const div = BANGLADESH_DIVISIONS.find((d) => d.slug === slug);
    if (div && div.districts.length > 0) {
      setDistrictSlug(div.districts[0].slug);
    }
  };

  const handleAddTip = () => {
    if (tips.length < 5) setTips([...tips, '']);
  };

  const handleRemoveTip = (index: number) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const handleTipChange = (index: number, val: string) => {
    const updated = [...tips];
    updated[index] = val;
    setTips(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('শিরোনাম ও বিস্তারিত অভিজ্ঞতার বিবরণ পূরণ করা আবশ্যক।');
      return;
    }

    if (!agreedGuidelines) {
      setError('কমিউনিটি নীতিমালা ও নির্দেশিকা মানার স্বীকৃতি দেওয়া আবশ্যক।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/stories/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          department,
          departmentSlug: department.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          division: currentDiv.name,
          divisionSlug: currentDiv.slug,
          district: currentDist?.name || 'ঢাকা',
          districtSlug: currentDist?.slug || 'dhaka',
          officeName,
          serviceName,
          bribeAmount: bribeAmount === '' ? 0 : Math.max(0, Number(bribeAmount) || 0),
          bribeDemandedBy: bribeDemandedBy === 'অন্যান্য' ? (customBribeDemandedBy.trim() || 'অন্যান্য') : bribeDemandedBy,
          tipsForCitizens: tips.filter((t) => t.trim().length > 0),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'লেখাটি জমা দেওয়া যায়নি।');
      }
    } catch (err) {
      setError('সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="আপনার নাগরিক অভিজ্ঞতা লিখুন | ঘুষখুর"
        description="সরকারি দপ্তর ও নাগরিক সেবা গ্রহণের বাস্তব অভিজ্ঞতা বেনামে প্রকাশ করুন এবং সহ-নাগরিকদের দিকনির্দেশনা দিন।"
        canonicalUrl="/write"
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'অভিজ্ঞতা লিখুন', url: '/write' },
        ]}
        onNavigate={onNavigate}
      />

      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
          আপনার অভিজ্ঞতা জানান
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          আপনার লেখাটি সম্পূর্ণ বেনামে সংরক্ষিত ও প্রকাশিত হবে। আপনার অভিজ্ঞতা অন্য একজন নাগরিককে সতর্ক করবে এবং সেবাগ্রহণে সহায়ক হবে।
        </p>
      </div>

      {submitted ? (
        <div className="bg-white p-8 rounded-2xl border border-emerald-200 text-center shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
            আপনার অভিজ্ঞতাটি সফলভাবে জমা হয়েছে!
          </h2>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-600 max-w-lg mx-auto mb-6 leading-relaxed text-left">
            <p className="font-semibold text-stone-800 mb-1">
              পরবর্তী ধাপ (সম্পাদকীয় পর্যালোচনা):
            </p>
            <p>
              ঘুষখুর প্ল্যাটফর্মের দায়িত্বশীল সম্পাদকীয় দল আপনার লেখাটি যাচাই করবে। ব্যক্তিগত আক্রমণ, ফোন নম্বর বা জাতীয় পরিচয়পত্রের মতো সংবেদনশীল তথ্য না থাকলে এটি শীঘ্রই প্রকাশিত হবে।
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/experiences')}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              অন্যান্য অভিজ্ঞতা পড়ুন
            </button>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setTitle('');
                setContent('');
                setBribeAmount('');
                setBribeDemandedBy('দালাল বা মধ্যস্বত্বভোগী');
                setCustomBribeDemandedBy('');
                setTips(['']);
              }}
              className="px-4 py-2 bg-stone-100 text-stone-700 border border-stone-300 rounded-lg text-xs font-semibold hover:bg-stone-200 transition-colors"
            >
              আরেকটি অভিজ্ঞতা লিখুন
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          {/* Important Rules Warning Box */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>লেখা জমার পূর্বশর্ত ও সতর্কতা:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-800 pl-1">
              <li>কোনো ব্যক্তির ব্যক্তিগত ফোন নম্বর, এনআইডি নম্বর বা বাড়ির ঠিকানা প্রকাশ করবেন না।</li>
              <li>অশ্লীল ভাষা, অন্ধ গালিগালাজ বা ভিত্তিহীন ব্যক্তিগত কুৎসা সম্পূর্ণ নিষিদ্ধ।</li>
              <li>কী সমস্যা হয়েছে এবং ভবিষ্যতে নাগরিকরা কীভাবে নিরাপদে সেবা পেতে পারেন তা লিখুন।</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="story-title" className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              অভিজ্ঞতার শিরোনাম <span className="text-red-600">*</span>
            </label>
            <input
              id="story-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: মিরপুর বিআরটিএ অফিসে ড্রাইভিং লাইসেন্স পরীক্ষার অভিজ্ঞতা"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Department and Division/District */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="dept-select" className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                দপ্তর বা সেবার খাত <span className="text-red-600">*</span>
              </label>
              <select
                id="dept-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-red-500"
              >
                <option value="ভূমি প্রশাসন (Land Office)">ভূমি প্রশাসন (Land Office)</option>
                <option value="পাসপোর্ট ও ইমিগ্রেশন">পাসপোর্ট ও ইমিগ্রেশন</option>
                <option value="বিআরটিএ (BRTA)">বিআরটিএ (BRTA)</option>
                <option value="বিদ্যুৎ ও জ্বালানি">বিদ্যুৎ ও জ্বালানি</option>
                <option value="স্বাস্থ্য সেবা ও হাসপাতাল">স্বাস্থ্য সেবা ও হাসপাতাল</option>
                <option value="পৌরসভা ও সিটি কর্পোরেশন">পৌরসভা ও সিটি কর্পোরেশন</option>
                <option value="জাতীয় পরিচয়পত্র ও নির্বাচন কমিশন">জাতীয় পরিচয়পত্র (NID)</option>
                <option value="অন্যান্য সরকারি সেবা">অন্যান্য সরকারি সেবা</option>
              </select>
            </div>

            <div>
              <label htmlFor="div-select" className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                বিভাগ <span className="text-red-600">*</span>
              </label>
              <select
                id="div-select"
                value={divisionSlug}
                onChange={(e) => handleDivChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-red-500"
              >
                {BANGLADESH_DIVISIONS.map((div) => (
                  <option key={div.slug} value={div.slug}>
                    {div.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dist-select" className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                জেলা <span className="text-red-600">*</span>
              </label>
              <select
                id="dist-select"
                value={districtSlug}
                onChange={(e) => setDistrictSlug(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-red-500"
              >
                {currentDiv.districts.map((dist) => (
                  <option key={dist.slug} value={dist.slug}>
                    {dist.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Office Name & Specific Service Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="office-name" className="block text-xs font-semibold text-stone-700 mb-1">
                নির্দিষ্ট অফিস বা শাখার নাম (ঐচ্ছিক):
              </label>
              <input
                id="office-name"
                type="text"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                placeholder="যেমন: সাভার উপজেলা ভূমি অফিস"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="service-name" className="block text-xs font-semibold text-stone-700 mb-1">
                সেবার নাম (ঐচ্ছিক):
              </label>
              <input
                id="service-name"
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="যেমন: ই-নামজারি বা নতুন মিটার সংযোগ"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Bribe Information Section - Core Mission */}
          <div className="p-5 bg-gradient-to-br from-red-50 via-white to-amber-50 border border-red-200 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center shrink-0 text-red-700">
                <Banknote className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-red-950">
                    ঘুষ বা অনৈতিক অর্থের পরিমাণ ও তথ্য
                  </h3>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                    সবচেয়ে গুরুত্বপূর্ণ
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  সরকারি অফিসে আপনাকে কত টাকা দিতে বাধ্য করা হয়েছিল বা কত টাকা দাবি করা হয়েছিল? আপনার এই নির্ভুল তথ্যের ভিত্তিতে বাংলাদেশের জেলা ও বিভাগভিত্তিক ঘুষের সূচক ও গ্রাফ তৈরি হবে।
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Bribe Amount */}
              <div>
                <label htmlFor="bribe-amount" className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  ঘুষের পরিমাণ (টাকায়) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 font-bold text-sm">
                    ৳
                  </div>
                  <input
                    id="bribe-amount"
                    type="number"
                    min="0"
                    step="1"
                    value={bribeAmount}
                    onChange={(e) => setBribeAmount(e.target.value)}
                    placeholder="যেমন: ৩২৫০ বা ৫০০০ (ঘুষ না দিলে ০ লিখুন)"
                    className="w-full pl-8 pr-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-red-500 font-mono font-bold"
                    required
                  />
                </div>
                {/* Quick preset helper buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    { label: '৳০ (দেইনি)', value: '0' },
                    { label: '৳৫০০', value: '500' },
                    { label: '৳১,০০০', value: '1000' },
                    { label: '৳২,০০০', value: '2000' },
                    { label: '৳৫,০০০', value: '5000' },
                    { label: '৳১০,০০০', value: '10000' },
                  ].map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setBribeAmount(preset.value)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                        bribeAmount === preset.value
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  আপনার ইচ্ছামতো যেকোনো সঠিক টাকার পরিমাণ (যেমন: ১,২৫০ বা ৩,৭০০) এখানে স্বাধীনভাবে টাইপ করতে পারেন। ঘুষ না দিয়ে থাকলে '০' লিখুন।
                </p>
              </div>

              {/* Who Demanded Bribe */}
              <div>
                <label htmlFor="bribe-demanded-by" className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
                  কে বা কারা ঘুষ চেয়েছিল / নিয়েছিল? <span className="text-red-600">*</span>
                </label>
                <select
                  id="bribe-demanded-by"
                  value={bribeDemandedBy}
                  onChange={(e) => setBribeDemandedBy(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-red-500"
                >
                  <option value="দালাল বা মধ্যস্বত্বভোগী">দালাল বা মধ্যস্বত্বভোগী</option>
                  <option value="অফিস সহকারী / কেরানী / পেশকার">অফিস সহকারী / কেরানী / পেশকার</option>
                  <option value="দায়িত্বপ্রাপ্ত সরকারি কর্মকর্তা">দায়িত্বপ্রাপ্ত সরকারি কর্মকর্তা</option>
                  <option value="মাঠ পরিদর্শক / সার্ভেয়ার / লাইনম্যান">মাঠ পরিদর্শক / সার্ভেয়ার / লাইনম্যান</option>
                  <option value="আনসার / গেটম্যান / পিয়ন">আনসার / গেটম্যান / পিয়ন</option>
                  <option value="কেউ চায়নি (ঘুষমুক্ত সৎ সেবা)">কেউ চায়নি (ঘুষমুক্ত সৎ সেবা)</option>
                  <option value="অন্যান্য">অন্যান্য (নির্দিষ্ট করে লিখুন)</option>
                </select>

                {bribeDemandedBy === 'অন্যান্য' && (
                  <input
                    type="text"
                    value={customBribeDemandedBy}
                    onChange={(e) => setCustomBribeDemandedBy(e.target.value)}
                    placeholder="কারা চেয়েছিল সংক্ষেপে লিখুন..."
                    className="w-full mt-2 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                )}
                <p className="text-[11px] text-stone-500 mt-1">
                  কোন স্তরের ব্যক্তি অনৈতিক অর্থ দাবি করেছিলেন তা নির্বাচন করুন।
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="story-content" className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              অভিজ্ঞতার বিস্তারিত বিবরণ <span className="text-red-600">*</span>
            </label>
            <textarea
              id="story-content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="আপনি কোন কাজে গিয়েছিলেন? প্রক্রিয়াটি কেমন ছিল? কী ধরনের নিয়ম বা পরিস্থিতির মুখোমুখি হতে হয়েছে? কোনো মধ্যস্বত্বভোগী উপস্থিত ছিল কি না? শেষ পর্যন্ত সমাধান হয়েছে কি না? বিস্তারিত লিখুন..."
              className="w-full p-3.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-red-500 leading-relaxed font-normal"
              required
            />
          </div>

          {/* Tips for other citizens */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                অন্যান্য নাগরিকদের জন্য পরামর্শ (ঐচ্ছিক):
              </label>
              {tips.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddTip}
                  className="text-xs text-red-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>পরামর্শ যোগ করুন</span>
                </button>
              )}
            </div>
            <div className="space-y-2">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tip}
                    onChange={(e) => handleTipChange(idx, e.target.value)}
                    placeholder={`পরামর্শ #${idx + 1} (যেমন: শুনানির দিন প্রয়োজনীয় সব মূল কাগজ সঙ্গে রাখুন)`}
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-red-500"
                  />
                  {tips.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTip(idx)}
                      className="p-2 text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Agreement */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-700 leading-relaxed">
              <input
                type="checkbox"
                checked={agreedGuidelines}
                onChange={(e) => setAgreedGuidelines(e.target.checked)}
                className="mt-0.5 rounded accent-red-600 w-4 h-4 cursor-pointer"
                required
              />
              <span>
                আমি নিশ্চিত করছি যে প্রদত্ত অভিজ্ঞতাটি সত্যনিষ্ঠ এবং এতে কোনো ব্যক্তির ব্যক্তিগত গোপনীয়তা লঙ্ঘন বা অশ্লীল বক্তব্য নেই। আমি{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/community-guidelines')}
                  className="text-red-700 underline font-semibold"
                >
                  কমিউনিটি গাইডলাইন
                </button>{' '}
                ও সম্পাদকীয় নীতি মেনে চলছি।
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[11px] text-stone-500">
              * লেখা পর্যালোচনার পর এডমিন অনুমোদনে প্রকাশিত হবে।
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-red-700 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'জমা হচ্ছে...' : 'পর্যালোচনার জন্য জমা দিন'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
