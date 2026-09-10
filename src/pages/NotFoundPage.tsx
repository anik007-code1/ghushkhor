import { FileQuestion, Home, BookOpen, MapPin, Search } from 'lucide-react';
import SEOHead from '../components/SEOHead.tsx';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export default function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <SEOHead
        title="৪০৪ - পাতাটি খুঁজে পাওয়া যায়নি | ঘুষখোর"
        description="অনুরোধকৃত ওয়েব পাতাটি খুঁজে পাওয়া যায়নি।"
        noindex={true}
      />

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
          <FileQuestion className="w-9 h-9" />
        </div>

        <span className="text-xs font-bold text-red-700 uppercase tracking-widest block mb-1">
          ত্রুটি ৪০৪ (404 Not Found)
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
          অনুরোধকৃত পাতাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
          আপনি যে ঠিকানাটি খুঁজছেন তা হয়তো সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ রয়েছে।
        </p>

        {/* Helpful navigation buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>হোমপেজে ফিরুন</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/experiences')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold border border-stone-300 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>সকল অভিজ্ঞতা</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/divisions')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold border border-stone-300 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>বিভাগ ও জেলা সূচি</span>
          </button>
        </div>
      </div>
    </div>
  );
}
