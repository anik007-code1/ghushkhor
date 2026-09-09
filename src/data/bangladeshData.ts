import { Division, District } from '../types.ts';

export const BANGLADESH_DIVISIONS: Division[] = [
  {
    name: 'ঢাকা',
    slug: 'dhaka',
    description: 'ঢাকা বিভাগের ১৩টি জেলার বিভিন্ন সরকারি ও স্বায়ত্তশাসিত সেবামূলক প্রতিষ্ঠানের নাগরিক অভিজ্ঞতা।',
    districts: [
      { name: 'ঢাকা', slug: 'dhaka', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'গাজীপুর', slug: 'gazipur', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'নারায়ণগঞ্জ', slug: 'narayanganj', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'মুন্সীগঞ্জ', slug: 'munshiganj', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'নরসিংদী', slug: 'narsingdi', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'মানিকগঞ্জ', slug: 'manikganj', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'টাঙ্গাইল', slug: 'tangail', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'কিশোরগঞ্জ', slug: 'kishoreganj', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'ফরিদপুর', slug: 'faridpur', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'মাদারীপুর', slug: 'madaripur', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'শরীয়তপুর', slug: 'shariatpur', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'রাজবাড়ী', slug: 'rajbari', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
      { name: 'গোপালগঞ্জ', slug: 'gopalganj', divisionSlug: 'dhaka', divisionName: 'ঢাকা' },
    ],
  },
  {
    name: 'চট্টগ্রাম',
    slug: 'chattogram',
    description: 'চট্টগ্রাম বিভাগের বন্দর নগরী ও পাহাড়ি জেলাগুলোর নাগরিক সেবার অভিজ্ঞতা।',
    districts: [
      { name: 'চট্টগ্রাম', slug: 'chattogram', divisionSlug: 'chattogram', divisionName: 'চট্টগ্রাম' },
      { name: 'কক্সবাজার', slug: 'coxs-bazar', divisionSlug: 'chattogram', divisionName: 'চট্টগ্রাম' },
      { name: 'কুমিল্লা', slug: 'cumilla', divisionSlug: 'chattogram', divisionName: 'চট্টগ্রাম' },
      { name: 'ব্রাহ্মণবাড়িয়া', slug: 'brahmanbaria', divisionSlug: 'chattogram', divisionName: 'চট্টগ্রাম' },
      { name: 'চাঁদপুর', slug: 'chandpur', divisionSlug: 'chattogram', divisionName: 'চট্টগ্রাম' },
      { name: 'নোয়াখালী', slug: 'noakhali', divisionSlug: 'chattogram', divisionName: 'চট্টগ্রাম' },
      { name: 'ফেনী', slug: 'feni', divisionSlug: 'chattogram', divisionName: 'চট্টগ্রাম' },
      { name: 'লক্ষ্মীপুর', slug: 'lakshmipur', divisionSlug: 'chattogram', divisionName: 'চট্টগ্রাম' },
      { name: 'রাঙ্গামাটি', slug: 'rangamati', divisionSlug: 'chattogram', divisionName: 'চট্টগ্রাম' },
      { name: 'বান্দরবান', slug: 'bandarban', divisionSlug: 'chattogram', divisionName: 'চট্টগ্রাম' },
      { name: 'খাগড়াছড়ি', slug: 'khagrachhari', divisionSlug: 'chattogram', divisionName: 'চট্টগ্রাম' },
    ],
  },
  {
    name: 'রাজশাহী',
    slug: 'rajshahi',
    description: 'উত্তরবঙ্গের বরেন্দ্র অঞ্চলের জেলাসমূহের প্রশাসনিক ও নাগরিক সেবা অভিজ্ঞতা।',
    districts: [
      { name: 'রাজশাহী', slug: 'rajshahi', divisionSlug: 'rajshahi', divisionName: 'রাজশাহী' },
      { name: 'বগুড়া', slug: 'bogra', divisionSlug: 'rajshahi', divisionName: 'রাজশাহী' },
      { name: 'পাবনা', slug: 'pabna', divisionSlug: 'rajshahi', divisionName: 'রাজশাহী' },
      { name: 'সিরাজগঞ্জ', slug: 'sirajganj', divisionSlug: 'rajshahi', divisionName: 'রাজশাহী' },
      { name: 'নওগাঁ', slug: 'naogaon', divisionSlug: 'rajshahi', divisionName: 'রাজশাহী' },
      { name: 'নাটোর', slug: 'natore', divisionSlug: 'rajshahi', divisionName: 'রাজশাহী' },
      { name: 'চাঁপাইনবাবগঞ্জ', slug: 'chapainawabganj', divisionSlug: 'rajshahi', divisionName: 'রাজশাহী' },
      { name: 'জয়পুরহাট', slug: 'joypurhat', divisionSlug: 'rajshahi', divisionName: 'রাজশাহী' },
    ],
  },
  {
    name: 'খুলনা',
    slug: 'khulna',
    description: 'দক্ষিণ-পশ্চিমাঞ্চল ও উপকূলীয় জেলাসমূহের সরকারি সেবাদানকারী কার্যালয়ের অভিজ্ঞতা।',
    districts: [
      { name: 'খুলনা', slug: 'khulna', divisionSlug: 'khulna', divisionName: 'খুলনা' },
      { name: 'যশোর', slug: 'jashore', divisionSlug: 'khulna', divisionName: 'খুলনা' },
      { name: 'সাতক্ষীরা', slug: 'satkhira', divisionSlug: 'khulna', divisionName: 'খুলনা' },
      { name: 'বাগেরহাট', slug: 'bagerhat', divisionSlug: 'khulna', divisionName: 'খুলনা' },
      { name: 'কুষ্টিয়া', slug: 'kushtia', divisionSlug: 'khulna', divisionName: 'খুলনা' },
      { name: 'ঝিনাইদহ', slug: 'jhenaidah', divisionSlug: 'khulna', divisionName: 'খুলনা' },
      { name: 'চুয়াডাঙ্গা', slug: 'chuadanga', divisionSlug: 'khulna', divisionName: 'খুলনা' },
      { name: 'মেহেরপুর', slug: 'meherpur', divisionSlug: 'khulna', divisionName: 'খুলনা' },
      { name: 'মাগুরা', slug: 'magura', divisionSlug: 'khulna', divisionName: 'খুলনা' },
      { name: 'নড়াইল', slug: 'narail', divisionSlug: 'khulna', divisionName: 'খুলনা' },
    ],
  },
  {
    name: 'বরিশাল',
    slug: 'barishal',
    description: 'দক্ষিণাঞ্চলের নদীমাতৃক জেলাসমূহের স্বাস্থ্য, শিক্ষা ও ভূমি সেবা অভিজ্ঞতা।',
    districts: [
      { name: 'বরিশাল', slug: 'barishal', divisionSlug: 'barishal', divisionName: 'বরিশাল' },
      { name: 'পটুয়াখালী', slug: 'patuakhali', divisionSlug: 'barishal', divisionName: 'বরিশাল' },
      { name: 'ভোলা', slug: 'bhola', divisionSlug: 'barishal', divisionName: 'বরিশাল' },
      { name: 'পিরোজপুর', slug: 'pirojpur', divisionSlug: 'barishal', divisionName: 'বরিশাল' },
      { name: 'বরগুনা', slug: 'barguna', divisionSlug: 'barishal', divisionName: 'বরিশাল' },
      { name: 'ঝালকাঠি', slug: 'jhalokati', divisionSlug: 'barishal', divisionName: 'বরিশাল' },
    ],
  },
  {
    name: 'সিলেট',
    slug: 'sylhet',
    description: 'প্রবাসী অধ্যুষিত উত্তর-পূর্বাঞ্চলের জেলাগুলোর পাসপোর্ট, ভূমি ও প্রবাসবান্ধব সেবা অভিজ্ঞতা।',
    districts: [
      { name: 'সিলেট', slug: 'sylhet', divisionSlug: 'sylhet', divisionName: 'সিলেট' },
      { name: 'মৌলভীবাজার', slug: 'moulvibazar', divisionSlug: 'sylhet', divisionName: 'সিলেট' },
      { name: 'হবিগঞ্জ', slug: 'habiganj', divisionSlug: 'sylhet', divisionName: 'সিলেট' },
      { name: 'সুনামগঞ্জ', slug: 'sunamganj', divisionSlug: 'sylhet', divisionName: 'সিলেট' },
    ],
  },
  {
    name: 'রংপুর',
    slug: 'rangpur',
    description: 'উত্তরবঙ্গের রংপুর বিভাগের বিভিন্ন জেলা ও উপজেলা পর্যায়ের সরকারি সেবা অভিজ্ঞতা।',
    districts: [
      { name: 'রংপুর', slug: 'rangpur', divisionSlug: 'rangpur', divisionName: 'রংপুর' },
      { name: 'দিনাজপুর', slug: 'dinajpur', divisionSlug: 'rangpur', divisionName: 'রংপুর' },
      { name: 'গাইবান্ধা', slug: 'gaibandha', divisionSlug: 'rangpur', divisionName: 'রংপুর' },
      { name: 'কুড়িগ্রাম', slug: 'kurigram', divisionSlug: 'rangpur', divisionName: 'রংপুর' },
      { name: 'নীলফামারী', slug: 'nilphamari', divisionSlug: 'rangpur', divisionName: 'রংপুর' },
      { name: 'লালমনিরহাট', slug: 'lalmonirhat', divisionSlug: 'rangpur', divisionName: 'রংপুর' },
      { name: 'ঠাকুরগাঁও', slug: 'thakurgaon', divisionSlug: 'rangpur', divisionName: 'রংপুর' },
      { name: 'পঞ্চগড়', slug: 'panchagarh', divisionSlug: 'rangpur', divisionName: 'রংপুর' },
    ],
  },
  {
    name: 'ময়মনসিংহ',
    slug: 'mymensingh',
    description: 'ময়মনসিংহ বিভাগের জেলাসমূহের জনসেবা অভিজ্ঞতা ও পর্যবেক্ষণ।',
    districts: [
      { name: 'ময়মনসিংহ', slug: 'mymensingh', divisionSlug: 'mymensingh', divisionName: 'ময়মনসিংহ' },
      { name: 'জামালপুর', slug: 'jamalpur', divisionSlug: 'mymensingh', divisionName: 'ময়মনসিংহ' },
      { name: 'নেত্রকোণা', slug: 'netrokona', divisionSlug: 'mymensingh', divisionName: 'ময়মনসিংহ' },
      { name: 'শেরপুর', slug: 'sherpur', divisionSlug: 'mymensingh', divisionName: 'ময়মনসিংহ' },
    ],
  },
];

export const ALL_DISTRICTS: District[] = BANGLADESH_DIVISIONS.flatMap((div) => div.districts);

export function getDivisionBySlug(slug: string): Division | undefined {
  return BANGLADESH_DIVISIONS.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
}

export function getDistrictBySlug(slug: string): District | undefined {
  return ALL_DISTRICTS.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
}
