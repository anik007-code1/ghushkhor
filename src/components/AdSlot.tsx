import { SiteSettings } from '../types.ts';

interface AdSlotProps {
  type: 'homepage' | 'story-top' | 'story-middle' | 'story-bottom' | 'sidebar' | 'between-stories';
  settings?: SiteSettings;
  className?: string;
}

export default function AdSlot({ type, settings, className = '' }: AdSlotProps) {
  // Check if ads are enabled globally and for this specific placement
  const isGlobalEnabled = settings?.adsEnabled ?? false;
  const pubId = settings?.adsensePublisherId;

  let isSlotEnabled = false;
  let slotTitle = 'বিজ্ঞাপন স্থান';
  let heightClass = 'h-24 md:h-28';

  switch (type) {
    case 'homepage':
      isSlotEnabled = isGlobalEnabled && (settings?.homepageAdsEnabled ?? false);
      slotTitle = 'হোমপেজ বিজ্ঞাপন (Responsive Leaderboard)';
      heightClass = 'min-h-[90px] md:min-h-[100px]';
      break;
    case 'story-top':
      isSlotEnabled = isGlobalEnabled && (settings?.storyAdsEnabled ?? false);
      slotTitle = 'প্রতিবেদন শীর্ষ বিজ্ঞাপন';
      heightClass = 'min-h-[90px]';
      break;
    case 'story-middle':
      isSlotEnabled = isGlobalEnabled && (settings?.storyAdsEnabled ?? false);
      slotTitle = 'প্রতিবেদন মধ্যবর্তী বিজ্ঞাপন';
      heightClass = 'min-h-[120px]';
      break;
    case 'story-bottom':
      isSlotEnabled = isGlobalEnabled && (settings?.storyAdsEnabled ?? false);
      slotTitle = 'প্রতিবেদন সমাপ্তি বিজ্ঞাপন';
      heightClass = 'min-h-[100px]';
      break;
    case 'sidebar':
      isSlotEnabled = isGlobalEnabled && (settings?.sidebarAdsEnabled ?? false);
      slotTitle = 'সাইডবার বিজ্ঞাপন (300x250 Medium Rectangle)';
      heightClass = 'min-h-[250px]';
      break;
    case 'between-stories':
      isSlotEnabled = isGlobalEnabled && (settings?.homepageAdsEnabled ?? false);
      slotTitle = 'ফিড বিজ্ঞাপন';
      heightClass = 'min-h-[90px]';
      break;
  }

  // If ads are fully enabled with publisher ID, render the actual AdSense container
  if (isSlotEnabled && pubId) {
    return (
      <div
        className={`w-full my-6 flex flex-col items-center bg-stone-100/90 rounded-lg p-2.5 border border-stone-300/80 ${className}`}
        aria-label="বিজ্ঞাপন"
      >
        <span className="text-[11px] font-medium tracking-wider text-stone-500 uppercase mb-1.5 select-none">
          বিজ্ঞাপন / ADVERTISEMENT
        </span>
        <div className="w-full overflow-hidden flex justify-center items-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', textAlign: 'center' }}
            data-ad-client={pubId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    );
  }

  // If ads are disabled (as per AdSense pre-launch readiness requirement 30),
  // show a clean placeholder indicating the compliant reserved slot
  return (
    <div
      className={`w-full my-5 bg-stone-100/60 border border-dashed border-stone-300 rounded-lg p-3 flex flex-col items-center justify-center text-center transition-opacity hover:border-stone-400 ${heightClass} ${className}`}
      aria-label="সংরক্ষিত বিজ্ঞাপন স্থান"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-semibold tracking-wider text-stone-500 uppercase px-1.5 py-0.5 bg-stone-200/80 rounded">
          বিজ্ঞাপন স্লট (AdSense Ready)
        </span>
      </div>
      <p className="text-xs text-stone-600 font-medium">
        {slotTitle}
      </p>
      <p className="text-[11px] text-stone-500 mt-0.5">
        গুগল এডসেন্স অনুমোদনের পূর্বে বিজ্ঞাপন নিষ্ক্রিয় রাখা হয়েছে
      </p>
    </div>
  );
}
