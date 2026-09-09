import { useState, useEffect, useMemo, type FormEvent } from 'react';
import {
  Shield,
  Check,
  X,
  Edit3,
  Trash2,
  Settings,
  MessageSquare,
  Flag,
  FileText,
  ExternalLink,
  Save,
  CheckCircle2,
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
  Search,
  Banknote,
  AlertCircle,
  RefreshCw,
  Clock,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { Story, Comment, ContentReport, SiteSettings } from '../types.ts';
import SEOHead from '../components/SEOHead.tsx';
import Breadcrumbs from '../components/Breadcrumbs.tsx';

interface AdminDashboardProps {
  stories: Story[];
  settings?: SiteSettings;
  onStoryUpdated: () => void;
  onSettingsUpdated: (newSettings: SiteSettings) => void;
  onNavigate: (path: string) => void;
}

export default function AdminDashboard({
  stories,
  settings: initialSettings,
  onStoryUpdated,
  onSettingsUpdated,
  onNavigate,
}: AdminDashboardProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('gk_admin_token'));
  });
  const [adminUser, setAdminUser] = useState<string>(() => {
    return localStorage.getItem('gk_admin_user') || 'Admin';
  });

  // Login form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard navigation & filters
  const [activeTab, setActiveTab] = useState<'stories' | 'comments' | 'reports' | 'settings' | 'security'>('stories');
  const [storyFilter, setStoryFilter] = useState<'ALL' | 'PENDING' | 'PUBLISHED' | 'REJECTED'>('PENDING');
  const [storySearchQuery, setStorySearchQuery] = useState('');

  // Story moderation & edit modal
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editBribeAmount, setEditBribeAmount] = useState<number | string>(0);
  const [editBribeDemandedBy, setEditBribeDemandedBy] = useState('');
  const [editTips, setEditTips] = useState('');

  // Data states
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Settings state
  const [adsEnabled, setAdsEnabled] = useState(initialSettings?.adsEnabled || false);
  const [publisherId, setPublisherId] = useState(initialSettings?.adsensePublisherId || '');
  const [autoAds, setAutoAds] = useState(initialSettings?.autoAdsEnabled || false);
  const [gscMeta, setGscMeta] = useState(initialSettings?.googleSearchConsoleVerification || '');
  const [adsTxt, setAdsTxt] = useState(
    initialSettings?.adsTxtContent || 'google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0'
  );
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Password update in security tab
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const adminToken = localStorage.getItem('gk_admin_token') || '';

  // Verify session on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('gk_admin_token');
    if (token) {
      fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setIsAuthenticated(true);
            if (data.user?.username) {
              setAdminUser(data.user.username);
              localStorage.setItem('gk_admin_user', data.user.username);
            }
          } else {
            // Token expired or invalid
            setIsAuthenticated(false);
            localStorage.removeItem('gk_admin_token');
          }
        })
        .catch(() => {
          // If server fails or offline, trust existing local storage for smooth UX
          setIsAuthenticated(true);
        });
    }
  }, []);

  // Fetch reports and comments when authenticated
  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (e) {}
  };

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/admin/comments', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
      fetchComments();
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    if (!cleanUser || !cleanPass) {
      setLoginError('ইউজারনেম এবং পাসওয়ার্ড উভয়ই পূরণ করুন।');
      return;
    }

    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const token = data.token;
        if (rememberMe && token) {
          localStorage.setItem('gk_admin_token', token);
          localStorage.setItem('gk_admin_user', data.user?.username || cleanUser);
        }
        setAdminUser(data.user?.username || cleanUser);
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError(data.error || 'ভুল ইউজারনেম বা পাসওয়ার্ড। সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setLoginError('সার্ভারে যোগাযোগ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    } catch (e) {}
    localStorage.removeItem('gk_admin_token');
    localStorage.removeItem('gk_admin_user');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Handle Story Status (Approve / Reject)
  const handleStatusChange = async (storyId: string, status: 'PUBLISHED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/stories/${storyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        onStoryUpdated();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Story Delete
  const handleDeleteStory = async (storyId: string, title: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${title}" স্থায়ীভাবে মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        onStoryUpdated();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Save Story Edit
  const handleSaveStoryEdit = async () => {
    if (!editingStory) return;
    try {
      const tipsArray = editTips
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/stories/${editingStory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          ...editingStory,
          title: editTitle,
          content: editContent,
          department: editDepartment || editingStory.department,
          district: editDistrict || editingStory.district,
          bribeAmount: editBribeAmount === '' ? 0 : Math.max(0, Number(editBribeAmount) || 0),
          bribeDemandedBy: editBribeDemandedBy,
          tipsForCitizens: tipsArray.length > 0 ? tipsArray : editingStory.tipsForCitizens,
        }),
      });
      if (res.ok) {
        setEditingStory(null);
        onStoryUpdated();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Moderate Comment
  const handleModerateComment = async (commentId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch(`/api/admin/comments/${commentId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchComments();
      }
    } catch (e) {}
  };

  // Resolve Report
  const handleResolveReport = async (reportId: string) => {
    try {
      await fetch(`/api/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchReports();
    } catch (e) {}
  };

  // Save Settings
  const handleSaveSettings = async () => {
    const updated = {
      ...(initialSettings || { siteName: 'ঘুষখুর', siteUrl: window.location.origin }),
      adsEnabled,
      adsensePublisherId: publisherId,
      autoAdsEnabled: autoAds,
      googleSearchConsoleVerification: gscMeta,
      adsTxtContent: adsTxt,
    } as SiteSettings;

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        onSettingsUpdated(updated);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (e) {}
  };

  // Change Password
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPass !== confirmPass) {
      setPassMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ মিলছে না।' });
      return;
    }
    if (newPass.length < 6) {
      setPassMsg({ type: 'error', text: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
      return;
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ currentPassword: currPass, newPassword: newPass }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPassMsg({ type: 'success', text: 'পাসওয়ার্ড সফলভাবে হালনাগাদ করা হয়েছে!' });
        setCurrPass('');
        setNewPass('');
        setConfirmPass('');
      } else {
        setPassMsg({ type: 'error', text: data.error || 'বর্তমান পাসওয়ার্ড সঠিক নয়।' });
      }
    } catch (err) {
      setPassMsg({ type: 'error', text: 'সার্ভারে সংযোগ দেওয়া যাচ্ছে না।' });
    }
  };

  // Metrics calculation
  const storyList = Array.isArray(stories) ? stories : [];
  const pendingCount = storyList.filter((s) => s.status === 'PENDING').length;
  const publishedCount = storyList.filter((s) => s.status === 'PUBLISHED').length;
  const rejectedCount = storyList.filter((s) => s.status === 'REJECTED').length;
  const totalBribe = storyList.reduce((acc, s) => acc + (Number(s.bribeAmount) || 0), 0);

  // Filtered stories based on status & search
  const filteredStories = useMemo(() => {
    let list = storyFilter === 'ALL' ? storyList : storyList.filter((s) => s.status === storyFilter);

    if (storySearchQuery.trim()) {
      const q = storySearchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.content.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          (s.officeName && s.officeName.toLowerCase().includes(q))
      );
    }
    return list;
  }, [storyList, storyFilter, storySearchQuery]);

  // -------------------------------------------------------------------------
  // RENDER: LOGIN PORTAL IF NOT AUTHENTICATED
  // -------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-stone-100">
        <SEOHead
          title="অ্যাডমিন লগইন | ঘুষখুর"
          description="ঘুষখুর সম্পাদকীয় ও প্রশাসন প্যানেল লগইন পোর্টাল।"
          noindex={true}
        />

        <div className="w-full max-w-md">
          {/* Logo & Portal Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-700 text-white font-serif text-3xl font-bold shadow-lg mb-3">
              ঘু
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              ঘুষখুর অ্যাডমিন পোর্টাল
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              সুরক্ষিত সম্পাদকীয় ও নাগরিক অভিজ্ঞতা মডারেশন কক্ষ
            </p>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-stone-200 text-stone-700">
              <Lock className="w-3 h-3 text-red-600" />
              <span>রুট: /admin</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-5">
            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">{loginError}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  ব্যবহারকারী নাম (Username)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="আপনার ইউজারনেম লিখুন"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  পাসওয়ার্ড (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700"
                    title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-stone-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-red-600 w-4 h-4"
                  />
                  <span>লগইন মনে রাখুন (Remember Me)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>যাচাই করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>অ্যাডমিন প্যানেলে প্রবেশ করুন</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="text-xs text-stone-500 hover:text-stone-800 underline transition-colors"
              >
                ← পাবলিক ওয়েবসাইটে ফিরে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // RENDER: AUTHENTICATED CUSTOM ADMIN DASHBOARD
  // -------------------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      <SEOHead
        title="মডারেশন ও অ্যাডমিন প্যানেল | ঘুষখুর"
        description="ঘুষখুর প্ল্যাটফর্মের নাগরিক কনটেন্ট মডারেশন, নিরাপত্তা ও সাইট কনফিগারেশন প্যানেল।"
        noindex={true}
      />

      <Breadcrumbs
        items={[
          { name: 'হোম', url: '/' },
          { name: 'কাস্টম অ্যাডমিন প্যানেল', url: '/admin' },
        ]}
        onNavigate={onNavigate}
      />

      {/* Top Administrative Header */}
      <div className="bg-stone-900 text-white p-5 sm:p-6 rounded-2xl border border-stone-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-700 text-white flex items-center justify-center font-bold text-xl shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  সম্পাদকীয় ও অ্যাডমিন ড্যাশবোর্ড
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  সেশন সক্রিয়
                </span>
              </div>
              <p className="text-stone-400 text-xs sm:text-sm mt-0.5">
                অ্যাডমিনিস্ট্রেটর:{' '}
                <strong className="text-amber-400 font-semibold">{adminUser}</strong> (প্রধান নিয়ন্ত্রক)
                • ইউআরএল: <code className="text-stone-300 font-mono text-xs">/admin</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 border border-stone-700"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>সাইট দেখুন</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/admin/checklist')}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>AdSense চেকলিস্ট</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700/70 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI / Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <div className="text-stone-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            মোট অভিজ্ঞতা
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono">
            {storyList.length.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">প্ল্যাটফর্মে জমাকৃত</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm bg-amber-50/20">
          <div className="text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>পেন্ডিং রিভিউ</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono">
            {pendingCount.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-amber-600/80 mt-1">অনুমোদনের অপেক্ষায়</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm bg-emerald-50/20">
          <div className="text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1">
            প্রকাশিত অভিজ্ঞতা
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {publishedCount.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-1">পাবলিকলি দৃশ্যমান</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm bg-red-50/20">
          <div className="text-red-800 text-[11px] font-bold uppercase tracking-wider mb-1">
            মোট দাবিকৃত ঘুষ
          </div>
          <div className="text-xl font-black text-red-700 font-mono truncate">
            ৳{totalBribe.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-red-600/80 mt-1">নাগরিকদের রেকর্ডভুক্ত</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-stone-600 text-[11px] font-bold uppercase tracking-wider mb-1">
            ইউজার রিপোর্ট
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono">
            {reports.filter((r) => r.status === 'PENDING').length.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">অনিষ্পন্ন অভিযোগ</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab('stories')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'stories'
              ? 'border-red-700 text-red-700 bg-red-50/40 rounded-t-lg'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>অভিজ্ঞতা মডারেশন ({pendingCount} অপেক্ষমাণ)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('comments');
            fetchComments();
          }}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'comments'
              ? 'border-red-700 text-red-700 bg-red-50/40 rounded-t-lg'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>মন্তব্য নিরীক্ষা ({comments.filter((c) => c.status === 'PENDING').length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('reports');
            fetchReports();
          }}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-red-700 text-red-700 bg-red-50/40 rounded-t-lg'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>ইউজার রিপোর্ট ({reports.filter((r) => r.status === 'PENDING').length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-red-700 text-red-700 bg-red-50/40 rounded-t-lg'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>AdSense ও সাইট কনফিগ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-red-700 text-red-700 bg-red-50/40 rounded-t-lg'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>নিরাপত্তা ও পাসওয়ার্ড</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAB 1: STORIES MODERATION */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'stories' && (
        <div className="space-y-4">
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-stone-200 shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['PENDING', 'PUBLISHED', 'REJECTED', 'ALL'] as const).map((status) => {
                const count =
                  status === 'PENDING'
                    ? pendingCount
                    : status === 'PUBLISHED'
                    ? publishedCount
                    : status === 'REJECTED'
                    ? rejectedCount
                    : storyList.length;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStoryFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      storyFilter === status
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <span>
                      {status === 'PENDING' && 'অপেক্ষমাণ'}
                      {status === 'PUBLISHED' && 'প্রকাশিত'}
                      {status === 'REJECTED' && 'প্রত্যাখ্যাত'}
                      {status === 'ALL' && 'সবগুলো'}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        storyFilter === status ? 'bg-stone-700 text-stone-100' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={storySearchQuery}
                onChange={(e) => setStorySearchQuery(e.target.value)}
                placeholder="অভিজ্ঞতা খুঁজুন..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Stories List */}
          <div className="space-y-3">
            {filteredStories.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-sm">
                এই ফিল্টারে কোনো অভিজ্ঞতা পাওয়া যায়নি।
              </div>
            ) : (
              filteredStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3 hover:border-stone-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          story.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : story.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {story.status === 'PUBLISHED' && 'অনুমোদিত ও প্রকাশিত'}
                        {story.status === 'PENDING' && 'মডারেশন অপেক্ষমাণ'}
                        {story.status === 'REJECTED' && 'প্রত্যাখ্যাত'}
                      </span>
                      <span className="text-xs font-semibold text-stone-800">
                        {story.department} • {story.district}
                      </span>
                      {story.officeName && (
                        <span className="text-xs text-stone-500">({story.officeName})</span>
                      )}
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {story.status !== 'PUBLISHED' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(story.id, 'PUBLISHED')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                          title="অনুমোদন করুন"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>অনুমোদন</span>
                        </button>
                      )}

                      {story.status !== 'REJECTED' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(story.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-800 border border-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="প্রত্যাখ্যান করুন"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>বাতিল</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setEditingStory(story);
                          setEditTitle(story.title);
                          setEditContent(story.content);
                          setEditDepartment(story.department);
                          setEditDistrict(story.district);
                          setEditBribeAmount(story.bribeAmount !== undefined ? story.bribeAmount : 0);
                          setEditBribeDemandedBy(story.bribeDemandedBy || '');
                          setEditTips((story.tipsForCitizens || []).join('\n'));
                        }}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium flex items-center gap-1 border border-stone-200 transition-colors cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>সম্পাদনা</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteStory(story.id, story.title)}
                        className="p-1.5 bg-stone-100 hover:bg-red-600 hover:text-white text-stone-500 rounded-lg text-xs transition-colors cursor-pointer"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {story.status === 'PUBLISHED' && (
                        <button
                          type="button"
                          onClick={() => onNavigate(`/story/${story.slug}`)}
                          className="px-2.5 py-1.5 text-red-700 hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>পাবলিক পেজ</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bribe Detail Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs py-2 px-3 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-stone-500" />
                      <span className="text-stone-600">ঘুষের পরিমাণ:</span>
                      <span
                        className={`font-mono font-bold ${
                          (story.bribeAmount || 0) === 0 ? 'text-emerald-700' : 'text-red-700'
                        }`}
                      >
                        {(story.bribeAmount || 0) === 0
                          ? '৳০ (ঘুষমুক্ত সেবা)'
                          : `৳${(story.bribeAmount || 0).toLocaleString('bn-BD')}`}
                      </span>
                    </div>
                    {story.bribeDemandedBy && (
                      <div className="text-stone-600">
                        দাবিকারী: <strong className="text-stone-800">{story.bribeDemandedBy}</strong>
                      </div>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-stone-900 text-base">
                    {story.title}
                  </h3>

                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-stone-50/60 p-3.5 rounded-xl border border-stone-200">
                    {story.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 2: COMMENTS MODERATION */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'comments' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-stone-900 text-lg">
              নাগরিক মন্তব্য মডারেশন ({comments.length})
            </h2>
            <button
              type="button"
              onClick={fetchComments}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>রিফ্রেশ</span>
            </button>
          </div>

          {comments.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs">কোনো মন্তব্য পাওয়া যায়নি।</div>
          ) : (
            <div className="space-y-3">
              {comments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        comm.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : comm.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {comm.status}
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">
                      {new Date(comm.date).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                  <p className="text-stone-800 leading-relaxed font-serif text-sm bg-white p-3 rounded-lg border border-stone-200">
                    {comm.content}
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    {comm.status !== 'APPROVED' && (
                      <button
                        type="button"
                        onClick={() => handleModerateComment(comm.id, 'APPROVE')}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>অনুমোদন</span>
                      </button>
                    )}
                    {comm.status !== 'REJECTED' && (
                      <button
                        type="button"
                        onClick={() => handleModerateComment(comm.id, 'REJECT')}
                        className="px-3 py-1 bg-stone-200 hover:bg-red-100 text-stone-700 hover:text-red-800 rounded text-xs font-semibold flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        <span>বাতিল</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 3: USER REPORTS */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-stone-900 text-lg">
              নাগরিকদের পাঠানো রিপোর্ট ও অভিযোগ ({reports.length})
            </h2>
            <button
              type="button"
              onClick={fetchReports}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>রিফ্রেশ</span>
            </button>
          </div>

          {reports.length === 0 ? (
            <p className="text-stone-500 text-xs italic p-4 text-center">কোনো অনিষ্পন্ন রিপোর্ট নেই।</p>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {rep.reason}
                    </span>
                    <span className="text-[11px] text-stone-500">{new Date(rep.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-stone-800">
                    <strong>অভিযুক্ত প্রতিবেদন:</strong> {rep.storyTitle}
                  </p>
                  <p className="text-xs text-stone-600 bg-white p-2.5 rounded border border-stone-200 leading-relaxed">
                    {rep.details}
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    {rep.status === 'PENDING' ? (
                      <button
                        type="button"
                        onClick={() => handleResolveReport(rep.id)}
                        className="px-3.5 py-1.5 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        মীমাংসিত ঘোষণা করুন
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        মীমাংসা সম্পন্ন
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 4: SETTINGS (ADSENSE & SEARCH CONSOLE) */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div>
            <h2 className="font-serif font-bold text-stone-900 text-lg mb-1">
              গুগল এডসেন্স ও সার্চ কনসোল কনফিগারেশন
            </h2>
            <p className="text-xs text-stone-500">
              বিজ্ঞাপন চালু বা বন্ধ, প্রকাশক আইডি এবং সাইট ভেরিফিকেশন কোড হালনাগাদ করুন
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            {/* Ads Toggle */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block text-sm">
                  গুগল এডসেন্স বিজ্ঞাপন সক্রিয় (Ads Enabled)
                </span>
                <span className="text-stone-500">অনুমোদনের আগ পর্যন্ত এটি বন্ধ (false) রাখা আদর্শ।</span>
              </div>
              <input
                type="checkbox"
                checked={adsEnabled}
                onChange={(e) => setAdsEnabled(e.target.checked)}
                className="w-5 h-5 rounded accent-red-600 cursor-pointer"
              />
            </div>

            {/* Publisher ID */}
            <div>
              <label htmlFor="pub-id" className="block font-semibold text-stone-700 mb-1">
                AdSense Publisher ID (যেমন: ca-pub-1234567890123456):
              </label>
              <input
                id="pub-id"
                type="text"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
              />
            </div>

            {/* Auto Ads */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-stone-900 block">অটো এডস স্ক্রিপ্ট (Auto Ads Script)</span>
                <span className="text-stone-500">গুগল এডসেন্স অটোমেটিক বিজ্ঞাপনের কোড লোড করুন</span>
              </div>
              <input
                type="checkbox"
                checked={autoAds}
                onChange={(e) => setAutoAds(e.target.checked)}
                className="w-4 h-4 accent-red-600 cursor-pointer"
              />
            </div>

            {/* GSC Meta */}
            <div>
              <label htmlFor="gsc-meta" className="block font-semibold text-stone-700 mb-1">
                গুগল সার্চ কনসোল মেটা ভেরিফিকেশন ট্যাগ (content value):
              </label>
              <input
                id="gsc-meta"
                type="text"
                value={gscMeta}
                onChange={(e) => setGscMeta(e.target.value)}
                placeholder="abcdef1234567890..."
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono text-[11px]"
              />
            </div>

            {/* ads.txt Editor */}
            <div>
              <label htmlFor="ads-txt-content" className="block font-semibold text-stone-700 mb-1">
                ads.txt কন্টেন্ট (যা /ads.txt রুটে পরিবেশিত হয়):
              </label>
              <textarea
                id="ads-txt-content"
                rows={3}
                value={adsTxt}
                onChange={(e) => setAdsTxt(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>সেটিংস সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 5: ADMIN SECURITY & CREDENTIALS */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin Profile Details */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  প্রধান অ্যাডমিন প্রোফাইল
                </h3>
                <p className="text-xs text-stone-500">অনুমোদিত কেন্দ্রীয় প্রশাসক অ্যাকাউন্ট</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="text-stone-500 font-semibold">ইউজারনেম (Username):</div>
                <div className="font-bold text-stone-900 text-sm font-mono">{adminUser}</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="text-stone-500 font-semibold">প্রশাসনিক ভূমিকা (Role):</div>
                <div className="font-bold text-red-700">Super Administrator (পূর্ণ নিয়ন্ত্রণ ও সম্পাদনা)</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="text-stone-500 font-semibold">অ্যাডমিন প্রবেশদ্বার ইউআরএল (Direct URL):</div>
                <div className="font-mono text-stone-800 text-[11px] bg-white p-2 rounded border border-stone-200 select-all">
                  {window.location.origin}/admin
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="text-stone-500 font-semibold">সেশন টোকেন স্ট্যাটাস:</div>
                <div className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>সক্রিয় এবং বিশ্বস্ত ব্রাউজার এনভায়রনমেন্ট</span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base">
                  পাসওয়ার্ড পরিবর্তন করুন
                </h3>
                <p className="text-xs text-stone-500">প্রশাসনিক পাসওয়ার্ড হালনাগাদ করার সুবিধা</p>
              </div>
            </div>

            {passMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-semibold ${
                  passMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {passMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">বর্তমান পাসওয়ার্ড:</label>
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড দিন"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">নতুন পাসওয়ার্ড:</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন:</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  পাসওয়ার্ড সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Story Editing Modal */}
      {editingStory && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                অভিজ্ঞতা সম্পাদনা (ব্যক্তিগত তথ্য পরিমার্জন)
              </h3>
              <button
                type="button"
                onClick={() => setEditingStory(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">শিরোনাম:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">দপ্তর / বিভাগ:</label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">জেলা:</label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">ঘুষের পরিমাণ (টাকা):</label>
                  <input
                    type="number"
                    min="0"
                    value={editBribeAmount}
                    onChange={(e) => setEditBribeAmount(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">দাবিকারী ব্যক্তি / সংস্থা:</label>
                  <input
                    type="text"
                    value={editBribeDemandedBy}
                    onChange={(e) => setEditBribeDemandedBy(e.target.value)}
                    placeholder="যেমন: দালাল বা মধ্যস্বত্বভোগী"
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  বিবরণ (যেকোনো ফোন নম্বর বা ব্যক্তিগত নাম পরিমার্জন করুন):
                </label>
                <textarea
                  rows={8}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg leading-relaxed text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  নাগরিকদের জন্য সতর্কতা ও পরামর্শ (প্রতি লাইনে একটি করে):
                </label>
                <textarea
                  rows={3}
                  value={editTips}
                  onChange={(e) => setEditTips(e.target.value)}
                  placeholder="পরামর্শ ১&#10;পরামর্শ ২"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setEditingStory(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveStoryEdit}
                className="px-5 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
