import { useState, useEffect, useMemo } from 'react';
import { Story, SiteSettings } from './types.ts';
import { INITIAL_STORIES } from './data/initialStories.ts';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import CookieConsent from './components/CookieConsent.tsx';

// Pages
import HomePage from './pages/HomePage.tsx';
import ExperiencesPage from './pages/ExperiencesPage.tsx';
import PopularPage from './pages/PopularPage.tsx';
import DivisionsPage from './pages/DivisionsPage.tsx';
import DivisionDetailPage from './pages/DivisionDetailPage.tsx';
import DistrictDetailPage from './pages/DistrictDetailPage.tsx';
import StoryDetailPage from './pages/StoryDetailPage.tsx';
import WritePage from './pages/WritePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import EditorialPolicyPage from './pages/EditorialPolicyPage.tsx';
import CommunityGuidelinesPage from './pages/CommunityGuidelinesPage.tsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.tsx';
import TermsPage from './pages/TermsPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import ReportContentPage from './pages/ReportContentPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdSenseChecklistPage from './pages/AdSenseChecklistPage.tsx';
import SearchConsoleDocsPage from './pages/SearchConsoleDocsPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchString, setSearchString] = useState(window.location.search);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [settings, setSettings] = useState<SiteSettings | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchString(window.location.search);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    const [pathname, search] = path.split('?');
    setCurrentPath(pathname || '/');
    setSearchString(search ? `?${search}` : '');
    window.scrollTo(0, 0);
  };

  // Fetch initial stories and settings
  const fetchStories = async () => {
    try {
      const res = await fetch('/api/stories?all=true');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setStories(data);
        } else if (data && Array.isArray(data.stories)) {
          setStories(data.stories);
        }
      }
    } catch (e) {
      console.error('Error fetching stories:', e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    Promise.all([fetchStories(), fetchSettings()]).finally(() => setLoading(false));
  }, []);

  const searchParams = useMemo(() => new URLSearchParams(searchString), [searchString]);

  // Route matching
  const renderRoute = () => {
    // Exact paths
    if (currentPath === '/' || currentPath === '') {
      return <HomePage stories={stories} settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/experiences') {
      return (
        <ExperiencesPage
          stories={stories}
          settings={settings}
          searchParams={searchParams}
          onNavigate={navigate}
        />
      );
    }
    if (currentPath === '/popular') {
      return <PopularPage stories={stories} settings={settings} onNavigate={navigate} />;
    }
    if (currentPath === '/divisions') {
      return <DivisionsPage stories={stories} onNavigate={navigate} />;
    }
    if (currentPath === '/write') {
      return <WritePage onNavigate={navigate} />;
    }
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (currentPath === '/editorial-policy') {
      return <EditorialPolicyPage onNavigate={navigate} />;
    }
    if (currentPath === '/community-guidelines') {
      return <CommunityGuidelinesPage onNavigate={navigate} />;
    }
    if (currentPath === '/privacy') {
      return <PrivacyPolicyPage onNavigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }
    if (currentPath === '/report-content') {
      return <ReportContentPage onNavigate={navigate} />;
    }
    if (currentPath === '/admin') {
      return (
        <AdminDashboard
          stories={stories}
          settings={settings}
          onStoryUpdated={fetchStories}
          onSettingsUpdated={setSettings}
          onNavigate={navigate}
        />
      );
    }
    if (currentPath === '/admin/checklist') {
      return (
        <AdSenseChecklistPage
          stories={stories}
          settings={settings}
          onNavigate={navigate}
        />
      );
    }
    if (currentPath === '/search-console-docs') {
      return <SearchConsoleDocsPage onNavigate={navigate} />;
    }

    // Dynamic paths: /story/:slug
    if (currentPath.startsWith('/story/')) {
      const slug = currentPath.replace('/story/', '').replace(/\/$/, '');
      return (
        <StoryDetailPage
          slug={slug}
          stories={stories}
          settings={settings}
          onNavigate={navigate}
        />
      );
    }

    // Dynamic paths: /division/:slug
    if (currentPath.startsWith('/division/')) {
      const slug = currentPath.replace('/division/', '').replace(/\/$/, '');
      return (
        <DivisionDetailPage
          slug={slug}
          stories={stories}
          settings={settings}
          onNavigate={navigate}
        />
      );
    }

    // Dynamic paths: /district/:slug
    if (currentPath.startsWith('/district/')) {
      const slug = currentPath.replace('/district/', '').replace(/\/$/, '');
      return (
        <DistrictDetailPage
          slug={slug}
          stories={stories}
          settings={settings}
          onNavigate={navigate}
        />
      );
    }

    // Fallback 404
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-red-100 selection:text-red-900">
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-1">
        {renderRoute()}
      </main>

      <Footer onNavigate={navigate} />
      <CookieConsent onOpenPrivacy={() => navigate('/privacy')} />
    </div>
  );
}
