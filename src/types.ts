export type SubmissionStatus = 'PUBLISHED' | 'PENDING' | 'REJECTED' | 'ARCHIVED';

export type ResolutionStatus = 'সমাধান হয়েছে' | 'অমীমাংসিত' | 'হতাশাজনক' | 'চলমান প্রক্রিয়া';

export interface Story {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  content: string;
  department: string;
  departmentSlug: string;
  division: string;
  divisionSlug: string;
  district: string;
  districtSlug: string;
  officeName?: string;
  serviceName: string;
  bribeAmount?: number; // ঘুষের পরিমাণ (টাকায়, ০ হলে দাবি সত্ত্বেও প্রত্যাখ্যান বা পরিশোধ ছাড়া)
  bribeDemandedBy?: string; // কে ঘুষ চেয়েছিল (দালাল, কর্মচারী, কর্মকর্তা, ইত্যাদি)
  incidentDate?: string;
  datePublished: string;
  dateModified?: string;
  status: SubmissionStatus;
  rejectionReason?: string;
  helpfulCount: number;
  viewCount: number;
  readingTimeMinutes: number;
  tags: string[];
  resolutionStatus: ResolutionStatus;
  tipsForCitizens: string[];
}

export interface Comment {
  id: string;
  storyId: string;
  content: string;
  date: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface Report {
  id: string;
  storyId: string;
  storyTitle: string;
  reason: string;
  details: string;
  date: string;
  status: 'PENDING' | 'RESOLVED';
}

export interface District {
  name: string;
  slug: string;
  divisionSlug: string;
  divisionName: string;
  description?: string;
}

export interface Division {
  name: string;
  slug: string;
  districts: District[];
  description: string;
}

export interface SiteSettings {
  siteName?: string;
  siteUrl: string;
  googleSiteVerification: string;
  googleSearchConsoleVerification?: string;
  adsEnabled: boolean;
  adsensePublisherId: string;
  autoAdsEnabled?: boolean;
  homepageAdsEnabled: boolean;
  storyAdsEnabled: boolean;
  sidebarAdsEnabled: boolean;
  mobileAdsEnabled: boolean;
  adsTxtContent: string;
}

export type ContentReport = Report;

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: 'policy' | 'technical' | 'content' | 'adsense';
  checked: boolean;
  description: string;
  link?: string;
}
