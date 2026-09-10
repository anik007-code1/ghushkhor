import { FileText, ShieldAlert, Scale, AlertCircle } from 'lucide-react';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export default function TermsPage({ onNavigate }: TermsPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <SEOHead
        title="ব্যবহারের শর্তাবলি (Terms of Use) | ঘুষখোর"
        description="ঘুষখোর ওয়েবসাইট ব্যবহারের সার্বিক আইনি শর্তাবলি, কপিরাইট, দায়মুক্তি এবং প্রকাশনার শর্তসমূহ।"
        canonicalUrl="/terms"
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'ব্যবহারের শর্তাবলি', url: '/terms' },
        ]}
        onNavigate={onNavigate}
      />

      <article className="bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-700 rounded-md mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>আইনি চুক্তি ও নীতিমালা</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            ব্যবহারের শর্তাবলি (Terms of Use)
          </h1>
          <p className="text-stone-500 text-xs">সর্বশেষ সংশোধিত: জানুয়ারি ২০২৬</p>
        </div>

        <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
          ‘ঘুষখোর’ ওয়েবসাইটে প্রবেশ এবং ব্যবহারের মাধ্যমে আপনি এই শর্তাবলি মেনে চলার পূর্ণ সম্মতি জ্ঞাপন করছেন। যদি আপনি এই শর্তাবলির কোনো অংশের সাথে একমত না হন, তবে দয়া করে এই সাইটটি ব্যবহার করা থেকে বিরত থাকুন।
        </p>

        {/* 1. Submissions */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ১. নাগরিক কনটেন্ট জমা দেওয়ার নিয়ম (User Submissions)
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            ব্যবহারকারী যখন কোনো অভিজ্ঞতা বা মন্তব্য জমা দেন, তখন তিনি নিশ্চিত করেন যে তথ্যটি সত্য, তার প্রত্যক্ষ অভিজ্ঞতাপ্রসূত এবং তা কোনো তৃতীয় পক্ষের আইনগত অধিকার বা সম্মানহানি করে না। জমা দেওয়া লেখার বৌদ্ধিক স্বত্ব প্রকাশ ও জনস্বার্থে প্রচারের জন্য ঘুষখোর প্ল্যাটফর্মকে চিরস্থায়ী, রয়্যালটি-মুক্ত লাইসেন্স প্রদান করা হয়।
          </p>
        </section>

        {/* 2. Prohibited conduct */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ২. নিষিদ্ধ কার্যকলাপ ও বিষয়বস্তু (Prohibited Conduct)
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            নিম্নলিখিত কার্যকলাপ ও কনটেন্ট ওয়েবসাইটে জমা দেওয়া সম্পূর্ণ নিষিদ্ধ:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-stone-700 pl-2">
            <li>কারো ব্যক্তিগত ফোন নম্বর, ছবি, এনআইডি বা ব্যক্তিগত পরিবারের তথ্য প্রকাশ করা (Doxxing)।</li>
            <li>উদ্দেশ্যপ্রণোদিত মানহানি, ব্ল্যাকমেইল বা কাল্পনিক মিথ্যা গল্প তৈরি করা।</li>
            <li>হিংসা, সন্ত্রাসবাদ, ধর্মীয় বিদ্বেষ বা রাষ্ট্রবিরোধী অসাংবিধানিক তৎপরতা ছড়ানো।</li>
            <li>সাইটের প্রযুক্তিগত নিরাপত্তায় অনুপ্রবেশের চেষ্টা বা ক্ষতিকর কোড ছড়ানো।</li>
          </ul>
        </section>

        {/* 3. Moderation & Removal rights */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ৩. মডারেশন ও প্রশাসনিক চূড়ান্ত সিদ্ধান্ত (Moderation Authority)
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            প্ল্যাটফর্মের সম্পাদকীয় কর্তৃপক্ষের কাছে যে কোনো জমা পড়া বা প্রকাশিত লেখা আংশিক সম্পাদনা, পরিমার্জন, সাময়িক স্থগিত বা স্থায়ীভাবে মুছে ফেলার একচ্ছত্র অধিকার সংরক্ষিত রয়েছে। সম্পাদকীয় সিদ্ধান্তই এ ক্ষেত্রে চূড়ান্ত বলে গণ্য হবে।
          </p>
        </section>

        {/* 4. Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ৪. দায়ের সীমাবদ্ধতা ও ডিসক্লেইমার (Limitation of Liability)
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            ঘুষখোর ওয়েবসাইটে প্রকাশিত মতামত ও অভিজ্ঞতা ব্যবহারকারীদের ব্যক্তিগত অভিব্যক্তি। সাইট কর্তৃপক্ষ কোনো প্রকাশিত লেখার শতভাগ বাস্তব নির্ভুলতার আইনি দায়িত্ব বহন করে না। এই প্ল্যাটফর্মের তথ্যের ওপর ভিত্তি করে গৃহীত কোনো আইনি বা আর্থিক সিদ্ধান্তের দায় সংশ্লিষ্ট ব্যবহারকারীর।
          </p>
        </section>

        {/* 5. Service Changes */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
            ৫. শর্তাবলির পরিবর্তন ও নোটিশ
          </h2>
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
            কর্তৃপক্ষ প্রয়োজনবোধে যেকোনো সময় এই ব্যবহারের শর্তাবলিতে পরিবর্তন বা পরিবর্ধন আনতে পারে। পরিবর্তিত শর্তাবলি এই পাতায় প্রকাশের মুহূর্ত থেকে কার্যকর হবে।
          </p>
        </section>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-500">শর্তাবলি সম্পর্কে প্রশ্ন রয়েছে?</span>
          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="text-red-700 font-semibold hover:underline"
          >
            আমাদের সাথে যোগাযোগ করুন →
          </button>
        </div>
      </article>
    </div>
  );
}
