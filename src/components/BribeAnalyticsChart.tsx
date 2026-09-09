import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Banknote,
  ArrowUpDown,
  Building2,
  MapPin,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Story } from '../types.ts';

interface BribeAnalyticsChartProps {
  stories: Story[];
  onNavigate?: (path: string) => void;
}

type TabType = 'divisions' | 'districts' | 'departments';

export default function BribeAnalyticsChart({ stories, onNavigate }: BribeAnalyticsChartProps) {
  const [activeTab, setActiveTab] = useState<TabType>('divisions');
  const [sortAscending, setSortAscending] = useState<boolean>(true); // Default: Lowest bribe first as requested

  // Filter only published stories and ensure safe array
  const publishedStories = useMemo(() => {
    if (!Array.isArray(stories)) return [];
    return stories.filter((s) => s.status === 'PUBLISHED');
  }, [stories]);

  // Division Aggregations
  const divisionData = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; totalBribe: number; count: number; zeroCount: number }>();

    publishedStories.forEach((story) => {
      const divName = story.division || 'অন্যান্য';
      const divSlug = story.divisionSlug || 'other';
      const amount = Number(story.bribeAmount) >= 0 ? Number(story.bribeAmount) : 0;

      const current = map.get(divName) || {
        name: divName,
        slug: divSlug,
        totalBribe: 0,
        count: 0,
        zeroCount: 0,
      };

      current.totalBribe += amount;
      current.count += 1;
      if (amount === 0) current.zeroCount += 1;
      map.set(divName, current);
    });

    const list = Array.from(map.values()).map((d) => ({
      ...d,
      avgBribe: Math.round(d.totalBribe / (d.count || 1)),
    }));

    return list.sort((a, b) =>
      sortAscending ? a.totalBribe - b.totalBribe : b.totalBribe - a.totalBribe
    );
  }, [publishedStories, sortAscending]);

  // District Aggregations
  const districtData = useMemo(() => {
    const map = new Map<string, { name: string; division: string; slug: string; totalBribe: number; count: number; zeroCount: number }>();

    publishedStories.forEach((story) => {
      const distName = story.district || 'অজ্ঞাত জেলা';
      const amount = Number(story.bribeAmount) >= 0 ? Number(story.bribeAmount) : 0;

      const current = map.get(distName) || {
        name: distName,
        division: story.division || '',
        slug: story.districtSlug || 'district',
        totalBribe: 0,
        count: 0,
        zeroCount: 0,
      };

      current.totalBribe += amount;
      current.count += 1;
      if (amount === 0) current.zeroCount += 1;
      map.set(distName, current);
    });

    const list = Array.from(map.values()).map((d) => ({
      ...d,
      avgBribe: Math.round(d.totalBribe / (d.count || 1)),
    }));

    return list.sort((a, b) =>
      sortAscending ? a.totalBribe - b.totalBribe : b.totalBribe - a.totalBribe
    );
  }, [publishedStories, sortAscending]);

  // Department Aggregations
  const departmentData = useMemo(() => {
    const map = new Map<string, { name: string; totalBribe: number; count: number }>();

    publishedStories.forEach((story) => {
      const deptName = story.department || 'অন্যান্য';
      const amount = Number(story.bribeAmount) >= 0 ? Number(story.bribeAmount) : 0;

      const current = map.get(deptName) || {
        name: deptName,
        totalBribe: 0,
        count: 0,
      };

      current.totalBribe += amount;
      current.count += 1;
      map.set(deptName, current);
    });

    const list = Array.from(map.values()).map((d) => ({
      ...d,
      avgBribe: Math.round(d.totalBribe / (d.count || 1)),
    }));

    return list.sort((a, b) =>
      sortAscending ? a.totalBribe - b.totalBribe : b.totalBribe - a.totalBribe
    );
  }, [publishedStories, sortAscending]);

  // Global Key Insights
  const totalReportedBribe = useMemo(() => {
    return publishedStories.reduce((sum, s) => sum + (Number(s.bribeAmount) || 0), 0);
  }, [publishedStories]);

  // Lowest Bribe Division
  const lowestDivision = useMemo(() => {
    if (divisionData.length === 0) return null;
    const sorted = [...divisionData].sort((a, b) => a.totalBribe - b.totalBribe);
    return sorted[0];
  }, [divisionData]);

  // Lowest Bribe District
  const lowestDistrict = useMemo(() => {
    if (districtData.length === 0) return null;
    const sorted = [...districtData].sort((a, b) => a.totalBribe - b.totalBribe);
    return sorted[0];
  }, [districtData]);

  // Current active chart dataset
  const activeDataset = useMemo(() => {
    if (activeTab === 'divisions') return divisionData;
    if (activeTab === 'districts') return districtData.slice(0, 10); // Show top 10 for clean visual
    return departmentData;
  }, [activeTab, divisionData, districtData, departmentData]);

  // Color generator based on total bribe (Green/Emerald for lowest, Amber for mid, Red for high)
  const getBarColor = (val: number, minVal: number, maxVal: number) => {
    if (val === 0) return '#10b981'; // Emerald/Green (zero bribe)
    if (maxVal === minVal) return '#f59e0b';
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    if (ratio <= 0.25) return '#10b981'; // Low bribe - good/transparent
    if (ratio <= 0.6) return '#f59e0b'; // Medium bribe - warning
    return '#ef4444'; // High bribe - danger
  };

  const minBribeInActive = useMemo(() => {
    if (activeDataset.length === 0) return 0;
    return Math.min(...activeDataset.map((d) => d.totalBribe));
  }, [activeDataset]);

  const maxBribeInActive = useMemo(() => {
    if (activeDataset.length === 0) return 1;
    return Math.max(...activeDataset.map((d) => d.totalBribe));
  }, [activeDataset]);

  const formatTk = (num: number) => `৳${num.toLocaleString('bn-BD')}`;

  return (
    <section id="bribe-analytics" className="my-8 sm:my-10 bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">
              নাগরিক নজরদারি ও স্বচ্ছতা সূচক
            </span>
            <span className="text-xs text-stone-400 font-medium">লাইভ ডাটা অ্যানালিটিক্স</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            বিভাগ ও জেলাভিত্তিক ঘুষের পরিসংখ্যান ও তুলনামূলক গ্রাফ
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            সরকারি কার্যালয়ে সাধারণ নাগরিকরা কী পরিমাণ অনৈতিক অর্থ ও ঘুষের সম্মুখীন হন তার সরাসরি চিত্র। নিচের গ্রাফে দেখা যাবে <strong>কোন বিভাগ ও জেলায় মোট ঘুষের দাবি সবচেয়ে কম বা বেশি</strong>।
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('/write')}
            className="self-start md:self-auto shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Banknote className="w-4 h-4" />
            <span>ঘুষের তথ্য যোগ করুন</span>
          </button>
        )}
      </div>

      {/* Key Insight Metric Cards (Highlighting Lowest Bribe Areas as Requested) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
        {/* Lowest Division */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              সবচেয়ে কম মোট ঘুষের বিভাগ
            </span>
          </div>
          <div className="text-lg sm:text-xl font-black text-emerald-950 mt-1">
            {lowestDivision ? `${lowestDivision.name} বিভাগ` : 'তথ্য নেই'}
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-0.5">
            মোট ঘুষ: <span className="font-bold font-mono">{lowestDivision ? formatTk(lowestDivision.totalBribe) : '৳০'}</span>
            {lowestDivision && lowestDivision.zeroCount > 0 && ` (${lowestDivision.zeroCount}টি ঘুষমুক্ত সেবা)`}
          </p>
        </div>

        {/* Lowest District */}
        <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200">
          <div className="flex items-center justify-between text-teal-800 text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              সবচেয়ে কম ঘুষের জেলা
            </span>
          </div>
          <div className="text-lg sm:text-xl font-black text-teal-950 mt-1 truncate">
            {lowestDistrict ? `${lowestDistrict.name} জেলা` : 'তথ্য নেই'}
          </div>
          <p className="text-xs text-teal-700 font-medium mt-0.5">
            মোট ঘুষ: <span className="font-bold font-mono">{lowestDistrict ? formatTk(lowestDistrict.totalBribe) : '৳০'}</span>
            {lowestDistrict && lowestDistrict.totalBribe === 0 ? ' (সম্পূর্ণ ঘুষমুক্ত রেকর্ড)' : ''}
          </p>
        </div>

        {/* Total Bribe across Bangladesh */}
        <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200">
          <div className="flex items-center justify-between text-red-800 text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              মোট রিপোর্টকৃত ঘুষ
            </span>
          </div>
          <div className="text-lg sm:text-xl font-black text-red-950 mt-1 font-mono">
            {formatTk(totalReportedBribe)}
          </div>
          <p className="text-xs text-red-700 font-medium mt-0.5">
            নাগরিকদের বাধ্য করা অর্থ
          </p>
        </div>

        {/* Total Stories */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center justify-between text-stone-700 text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-stone-500" />
              মোট নাগরিক অভিযোগ
            </span>
          </div>
          <div className="text-lg sm:text-xl font-black text-stone-900 mt-1">
            {publishedStories.length.toLocaleString('bn-BD')} টি
          </div>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            যাচাইকৃত অভিজ্ঞতা থেকে সংগৃহীত
          </p>
        </div>
      </div>

      {/* Control Tabs and Sort Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-2 rounded-2xl border border-stone-200 mb-6">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('divisions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'divisions'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            <span>বিভাগভিত্তিক ঘুষ</span>
          </button>
          <button
            onClick={() => setActiveTab('districts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'districts'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            <span>জেলাভিত্তিক তুলনা</span>
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'departments'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-stone-500" />
            <span>দপ্তরভিত্তিক হিসাব</span>
          </button>
        </div>

        {/* Sort order toggle: Lowest first vs Highest first */}
        <button
          onClick={() => setSortAscending(!sortAscending)}
          className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
          title="ক্রমানুসার পরিবর্তন করুন"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
          <span>
            {sortAscending ? 'সর্বনিম্ন ঘুষ আগে (স্বচ্ছতা)' : 'সর্বোচ্চ ঘুষ আগে (ঝুঁকি)'}
          </span>
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80 pt-2 pb-4">
        {activeDataset.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activeDataset}
              margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickFormatter={(value) => `৳${value}`}
              />
              <Tooltip
                cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const isLowest = data.totalBribe === minBribeInActive;
                    return (
                      <div className="bg-stone-900 text-white text-xs rounded-xl p-3 shadow-xl border border-stone-800 space-y-1 z-50 min-w-44">
                        <div className="font-bold text-sm text-stone-100 flex items-center justify-between gap-2">
                          <span>{data.name}</span>
                          {isLowest && (
                            <span className="px-1.5 py-0.5 bg-emerald-500/30 text-emerald-300 rounded text-[10px] font-bold">
                              সবচেয়ে কম ঘুষ
                            </span>
                          )}
                        </div>
                        {data.division && (
                          <div className="text-[11px] text-stone-400">
                            বিভাগ: {data.division}
                          </div>
                        )}
                        <div className="text-amber-400 font-bold font-mono text-sm pt-1">
                          মোট দাবিকৃত ঘুষ: {formatTk(data.totalBribe)}
                        </div>
                        <div className="text-stone-300 text-[11px]">
                          গড় ঘুষ: <span className="font-mono">{formatTk(data.avgBribe || 0)}</span>
                        </div>
                        <div className="text-stone-400 text-[11px]">
                          অভিযোগ সংখ্যা: {data.count} টি {data.zeroCount > 0 ? `(${data.zeroCount}টি ঘুষমুক্ত)` : ''}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="totalBribe" radius={[6, 6, 0, 0]}>
                {activeDataset.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.totalBribe, minBribeInActive, maxBribeInActive)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-stone-500">
            কোনো ডাটা পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* Legend & Explanatory Guidance */}
      <div className="mt-2 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-600">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-stone-700">কালার নির্দেশক:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>সবচেয়ে কম ঘুষ / ঘুষমুক্ত (স্বচ্ছ)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>মাঝারি ঘুষের ঝুঁকি</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span>উচ্চ ঘুষের ঝুঁকি</span>
          </span>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>নাগরিকদের দাখিলকৃত সত্য অভিজ্ঞতার ভিত্তিতে স্বয়ংক্রিয়ভাবে হিসাবকৃত।</span>
        </div>
      </div>

      {/* District / Division Quick Ranked Pills */}
      <div className="mt-5 p-4 bg-stone-50 rounded-2xl border border-stone-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            {activeTab === 'divisions'
              ? 'বিভাগভিত্তিক ঘুষের সংক্ষিপ্ত তালিকা (কম থেকে বেশি)'
              : activeTab === 'districts'
              ? 'জেলাভিত্তিক ঘুষের সংক্ষিপ্ত তালিকা (কম থেকে বেশি)'
              : 'দপ্তরভিত্তিক ঘুষের সংক্ষিপ্ত তালিকা'}
          </h4>
          <span className="text-[11px] text-stone-500">
            ক্লিক করে অভিজ্ঞতা পড়ুন
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {activeDataset.map((item, idx) => {
            const isTopLowest = idx === 0 && sortAscending;
            return (
              <div
                key={item.name}
                className={`p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isTopLowest
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-white border-stone-200 text-stone-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold truncate">{item.name}</span>
                  {isTopLowest && (
                    <span className="px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] font-extrabold rounded">
                      সবচেয়ে কম
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between mt-1 pt-1 border-t border-stone-100">
                  <span className="text-[11px] font-bold font-mono text-stone-900">
                    {formatTk(item.totalBribe)}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {item.count} টি ঘটনা
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
