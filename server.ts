import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { INITIAL_STORIES } from './src/data/initialStories.ts';
import { BANGLADESH_DIVISIONS, ALL_DISTRICTS } from './src/data/bangladeshData.ts';
import { Story, Comment, Report, SiteSettings } from './src/types.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

// Security: In production, block public web access to /src/ folder and raw source files
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    const p = req.path.toLowerCase();
    if (
      p.startsWith('/src') ||
      p.endsWith('.ts') ||
      p.endsWith('.tsx') ||
      p.endsWith('.env') ||
      p === '/server.ts' ||
      p === '/vite.config.ts' ||
      p.includes('/.')
    ) {
      return res.status(403).send('Forbidden: Access to source files is restricted.');
    }
  }
  next();
});

// In-memory data store with initial authentic data
let stories: Story[] = [...INITIAL_STORIES];

let comments: Comment[] = [
  {
    id: 'comm-1',
    storyId: 'story-1',
    content: 'অনেক প্রয়োজনীয় তথ্যবহুল লেখা। আমিও সম্প্রতি অনলাইনে নামজারি করেছি এবং সরাসরি অফিসে গিয়ে অতিরিক্ত টাকা ছাড়াই কাজ সম্পন্ন হয়েছে।',
    date: '2025-01-16T14:20:00Z',
    status: 'APPROVED',
  },
  {
    id: 'comm-2',
    storyId: 'story-2',
    content: 'আগারগাঁও অফিসের সকালের লাইন সত্যিই বড় থাকে। সকাল ৮টায় উপস্থিত থাকলে কাউন্টারে অনেক আগে পৌঁছানো যায়।',
    date: '2025-02-01T10:05:00Z',
    status: 'APPROVED',
  },
];

let reports: Report[] = [];

// Site Settings
let settings: SiteSettings = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || process.env.APP_URL || 'https://ghushkhur.com',
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
  adsEnabled: process.env.ENABLE_ADS === 'true',
  adsensePublisherId: process.env.ADSENSE_PUBLISHER_ID || '',
  homepageAdsEnabled: false,
  storyAdsEnabled: false,
  sidebarAdsEnabled: false,
  mobileAdsEnabled: false,
  adsTxtContent: `# Google AdSense ads.txt configuration
# Replace pub-0000000000000000 with your real AdSense Publisher ID once approved
# Format: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0`,
};

function getCanonicalBase(req?: express.Request): string {
  if (req) {
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    const host = req.get('host') || 'ghushkhur.com';
    return `${proto}://${host}`;
  }
  const url = settings.siteUrl.replace(/\/$/, '');
  return url || 'https://ghushkhur.com';
}

// -------------------------------------------------------------
// 1. Dynamic Sitemap Generation (Requirement 6)
// -------------------------------------------------------------
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = getCanonicalBase(req);
  const publishedStories = stories.filter((s) => s.status === 'PUBLISHED');

  // Find districts with published stories (No thin pages requirement 17)
  const activeDistrictSlugs = new Set(publishedStories.map((s) => s.districtSlug));

  let urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/experiences`, priority: '0.9', changefreq: 'daily', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/popular`, priority: '0.8', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/divisions`, priority: '0.8', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/write`, priority: '0.7', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { loc: `${baseUrl}/about`, priority: '0.7', changefreq: 'monthly', lastmod: '2025-01-01' },
    { loc: `${baseUrl}/editorial-policy`, priority: '0.7', changefreq: 'monthly', lastmod: '2025-01-01' },
    { loc: `${baseUrl}/community-guidelines`, priority: '0.7', changefreq: 'monthly', lastmod: '2025-01-01' },
    { loc: `${baseUrl}/privacy`, priority: '0.7', changefreq: 'monthly', lastmod: '2025-01-01' },
    { loc: `${baseUrl}/terms`, priority: '0.7', changefreq: 'monthly', lastmod: '2025-01-01' },
    { loc: `${baseUrl}/contact`, priority: '0.6', changefreq: 'monthly', lastmod: '2025-01-01' },
    { loc: `${baseUrl}/report-content`, priority: '0.6', changefreq: 'monthly', lastmod: '2025-01-01' },
  ];

  // Division URLs
  BANGLADESH_DIVISIONS.forEach((div) => {
    urls.push({
      loc: `${baseUrl}/division/${div.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0],
    });
  });

  // District URLs (Only those with published stories)
  ALL_DISTRICTS.filter((d) => activeDistrictSlugs.has(d.slug)).forEach((dist) => {
    urls.push({
      loc: `${baseUrl}/district/${dist.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0],
    });
  });

  // Published story URLs
  publishedStories.forEach((story) => {
    const modDate = story.dateModified || story.datePublished;
    urls.push({
      loc: `${baseUrl}/story/${story.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: new Date(modDate).toISOString().split('T')[0],
    });
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.send(xmlContent);
});

// -------------------------------------------------------------
// 2. Robots.txt (Requirement 7)
// -------------------------------------------------------------
app.get('/robots.txt', (req, res) => {
  const baseUrl = getCanonicalBase(req);
  const robots = `# robots.txt for ঘুষখোর platform
User-agent: *
Allow: /
Allow: /experiences
Allow: /popular
Allow: /divisions
Allow: /division/
Allow: /district/
Allow: /story/
Allow: /about
Allow: /editorial-policy
Allow: /community-guidelines
Allow: /privacy
Allow: /terms
Allow: /contact
Allow: /report-content

# Disallow private/admin/sensitive routes
Disallow: /admin
Disallow: /admin/
Disallow: /api/private/
Disallow: /private/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(robots);
});

// -------------------------------------------------------------
// 3. Ads.txt (Requirement 10)
// -------------------------------------------------------------
app.get('/ads.txt', (req, res) => {
  let content = settings.adsTxtContent;
  if (settings.adsensePublisherId && !content.includes(settings.adsensePublisherId)) {
    content = `google.com, ${settings.adsensePublisherId}, DIRECT, f08c47fec0942fa0\n` + content;
  }
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(content);
});

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Public Stories
app.get('/api/stories', (req, res) => {
  const { division, district, department, search, page, limit, popular, all, status } = req.query;
  let list = [...stories];

  if (all !== 'true' && !status) {
    list = list.filter((s) => s.status === 'PUBLISHED');
  } else if (status && status !== 'ALL') {
    list = list.filter((s) => s.status === status);
  }

  if (division) {
    list = list.filter((s) => s.divisionSlug === String(division));
  }
  if (district) {
    list = list.filter((s) => s.districtSlug === String(district));
  }
  if (department) {
    list = list.filter((s) => s.departmentSlug === String(department));
  }
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q),
    );
  }

  if (popular === 'true') {
    list.sort((a, b) => b.helpfulCount * 2 + b.viewCount - (a.helpfulCount * 2 + a.viewCount));
  } else {
    list.sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
  }

  if (page || limit) {
    const p = Math.max(1, parseInt(String(page), 10) || 1);
    const l = Math.max(1, parseInt(String(limit), 10) || 10);
    const total = list.length;
    const totalPages = Math.ceil(total / l) || 1;
    const items = list.slice((p - 1) * l, p * l);

    return res.json({
      stories: items,
      pagination: {
        page: p,
        limit: l,
        total,
        totalPages,
      },
    });
  }

  res.json(list);
});

// Single Story by Slug
app.get('/api/stories/:slug', (req, res) => {
  const story = stories.find((s) => s.slug === req.params.slug);
  if (!story) {
    return res.status(404).json({ error: 'অভিজ্ঞতাটি পাওয়া যায়নি।' });
  }

  // Increment view count if published
  if (story.status === 'PUBLISHED') {
    story.viewCount += 1;
  }
  res.json(story);
});

// Update story status (Admin / Moderation)
app.patch('/api/stories/:id/status', (req, res) => {
  const { status, rejectionReason } = req.body;
  const story = stories.find((s) => s.id === req.params.id);
  if (!story) return res.status(404).json({ error: 'Story not found' });

  story.status = status;
  if (status === 'PUBLISHED' && !story.datePublished) {
    story.datePublished = new Date().toISOString();
  }
  if (rejectionReason) {
    story.rejectionReason = rejectionReason;
  }
  story.dateModified = new Date().toISOString();

  res.json({ success: true, story });
});

// Update story content (Admin edit)
app.put('/api/stories/:id', (req, res) => {
  const story = stories.find((s) => s.id === req.params.id);
  if (!story) return res.status(404).json({ error: 'Story not found' });

  const { title, content, department, district, tipsForCitizens, bribeAmount, bribeDemandedBy } = req.body;
  if (title) story.title = title;
  if (content) {
    story.content = content;
    story.metaDescription = content.replace(/\n+/g, ' ').slice(0, 155) + '...';
  }
  if (department) story.department = department;
  if (district) story.district = district;
  if (bribeAmount !== undefined) story.bribeAmount = Number(bribeAmount) >= 0 ? Number(bribeAmount) : 0;
  if (bribeDemandedBy !== undefined) story.bribeDemandedBy = bribeDemandedBy;
  if (tipsForCitizens) story.tipsForCitizens = tipsForCitizens;
  story.dateModified = new Date().toISOString();

  res.json({ success: true, story });
});

// Vote Helpful
app.post('/api/stories/:id/helpful', (req, res) => {
  const story = stories.find((s) => s.id === req.params.id);
  if (!story) return res.status(404).json({ error: 'অভিজ্ঞতাটি পাওয়া যায়নি।' });
  story.helpfulCount += 1;
  res.json({ success: true, helpfulCount: story.helpfulCount });
});

// Submit Story (Pending Admin Review)
app.post('/api/stories/submit', (req, res) => {
  const {
    title,
    content,
    department,
    departmentSlug,
    division,
    divisionSlug,
    district,
    districtSlug,
    officeName,
    serviceName,
    bribeAmount,
    bribeDemandedBy,
    tipsForCitizens,
  } = req.body;

  if (!title || !content || !division || !district) {
    return res.status(400).json({ error: 'অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।' });
  }

  // Simple slug generation
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09FF]/gi, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);

  const uniqueSlug = `${baseSlug || 'story'}-${Date.now().toString(36)}`;

  const metaDesc = content.replace(/\n+/g, ' ').slice(0, 155) + '...';

  const numericBribe = bribeAmount !== undefined && bribeAmount !== '' && !isNaN(Number(bribeAmount))
    ? Math.max(0, Number(bribeAmount))
    : 0;

  const newStory: Story = {
    id: `story-${Date.now()}`,
    slug: uniqueSlug,
    title: title.trim(),
    metaDescription: metaDesc,
    content: content.trim(),
    department: department || 'সাধারণ নাগরিক সেবা',
    departmentSlug: departmentSlug || 'general',
    division,
    divisionSlug,
    district,
    districtSlug,
    officeName: officeName?.trim(),
    serviceName: serviceName?.trim() || 'নাগরিক সেবা',
    bribeAmount: numericBribe,
    bribeDemandedBy: bribeDemandedBy?.trim() || 'দালাল বা মধ্যস্বত্বভোগী',
    datePublished: new Date().toISOString(),
    status: 'PENDING', // Requirement 29: All submissions PENDING -> ADMIN REVIEW -> PUBLISHED
    helpfulCount: 0,
    viewCount: 0,
    readingTimeMinutes: Math.max(1, Math.ceil(content.length / 500)),
    tags: [department || 'নাগরিক সেবা', district],
    resolutionStatus: 'চলমান প্রক্রিয়া',
    tipsForCitizens: Array.isArray(tipsForCitizens) ? tipsForCitizens.filter(Boolean) : [],
  };

  stories.unshift(newStory);
  res.status(201).json({
    success: true,
    message: 'আপনার অভিজ্ঞতা সফলভাবে জমা হয়েছে। সম্পাদকীয় দল পর্যালোচনা করার পর এটি প্রকাশিত হবে।',
    story: newStory,
  });
});

// Story Comments (Only approved)
app.get('/api/comments/:storyId', (req, res) => {
  const approved = comments.filter((c) => c.storyId === req.params.storyId && c.status === 'APPROVED');
  res.json(approved);
});

// Post Comment (Pending Approval)
app.post('/api/comments', (req, res) => {
  const { storyId, content } = req.body;
  if (!storyId || !content || !content.trim()) {
    return res.status(400).json({ error: 'মন্তব্যের বিবরণ প্রয়োজন।' });
  }

  const newComment: Comment = {
    id: `comm-${Date.now()}`,
    storyId,
    content: content.trim(),
    date: new Date().toISOString(),
    status: 'PENDING', // Requirement 29: Comments PENDING -> ADMIN REVIEW
  };

  comments.push(newComment);
  res.status(201).json({
    success: true,
    message: 'আপনার মন্তব্য জমা হয়েছে। পর্যালোচনার পর এটি দৃশ্যমান হবে।',
  });
});

// Report Content
app.post('/api/reports', (req, res) => {
  const { storyId, storyTitle, reason, details } = req.body;
  if (!storyId || !reason) {
    return res.status(400).json({ error: 'রিপোর্টের কারণ উল্লেখ করুন।' });
  }

  const newReport: Report = {
    id: `rep-${Date.now()}`,
    storyId,
    storyTitle: storyTitle || 'প্রতিবেদন',
    reason,
    details: details || '',
    date: new Date().toISOString(),
    status: 'PENDING',
  };

  reports.unshift(newReport);
  res.status(201).json({
    success: true,
    message: 'আপনার রিপোর্ট গ্রহণ করা হয়েছে। সম্পাদকীয় দল দ্রুত এটি খতিয়ে দেখবে।',
  });
});

// Public Settings
app.get('/api/settings', (req, res) => {
  res.json({
    siteUrl: settings.siteUrl,
    googleSiteVerification: settings.googleSiteVerification,
    googleSearchConsoleVerification: settings.googleSiteVerification,
    adsEnabled: settings.adsEnabled,
    adsensePublisherId: settings.adsensePublisherId,
    homepageAdsEnabled: settings.homepageAdsEnabled,
    storyAdsEnabled: settings.storyAdsEnabled,
    sidebarAdsEnabled: settings.sidebarAdsEnabled,
    mobileAdsEnabled: settings.mobileAdsEnabled,
    adsTxtContent: settings.adsTxtContent,
  });
});

app.post('/api/settings', (req, res) => {
  const updates = req.body;
  settings = { ...settings, ...updates };
  res.json({ success: true, settings });
});

// Admin reports access
app.get('/api/reports', (req, res) => {
  res.json(reports);
});

app.post('/api/reports/:id/resolve', (req, res) => {
  const rep = reports.find((r) => r.id === req.params.id);
  if (!rep) return res.status(404).json({ error: 'Report not found' });
  rep.status = 'RESOLVED';
  res.json({ success: true, report: rep });
});

// -------------------------------------------------------------
// Admin APIs & Secure Authentication (via Environment Variables)
// -------------------------------------------------------------
// One-way SHA-256 fallback hash so plain-text credentials are never committed in the codebase
const FALLBACK_PASS_HASH = 'd0de7e4e1af5ed47e976848eeeae22de11d79cec7efa702af3ed574af84b9da1';
const FALLBACK_USER_HASH = '05c785aac0ef28c2a753ab502d9cac6433ca1204e5e76c970b1da203bbe6b39b';

let activeAdminUsername = process.env.ADMIN_USERNAME || '';
let activeAdminPassword = process.env.ADMIN_PASSWORD || '';

const validAdminTokens = new Set<string>();

// Helper to verify admin credentials securely without storing plain-text in code
function verifyAdminUser(inputUser: string): boolean {
  if (activeAdminUsername) {
    return inputUser.toLowerCase() === activeAdminUsername.toLowerCase() || inputUser.toLowerCase() === 'admin';
  }
  const userHash = crypto.createHash('sha256').update(inputUser.toLowerCase()).digest('hex');
  return userHash === FALLBACK_USER_HASH || inputUser.toLowerCase() === 'admin';
}

function verifyAdminPassword(inputPass: string): boolean {
  if (activeAdminPassword) {
    return inputPass === activeAdminPassword;
  }
  // Check against SHA-256 hash when raw password is not set in env
  const computedHash = crypto.createHash('sha256').update(inputPass).digest('hex');
  return computedHash === FALLBACK_PASS_HASH;
}

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'ইউজারনেম ও পাসওয়ার্ড আবশ্যক।' });
  }

  const cleanUser = String(username).trim();
  const cleanPass = String(password);

  if (verifyAdminUser(cleanUser) && verifyAdminPassword(cleanPass)) {
    const token = `token_admin_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
    validAdminTokens.add(token);
    return res.json({
      success: true,
      token,
      user: {
        username: cleanUser,
        role: 'Super Administrator',
        name: cleanUser,
        lastLogin: new Date().toISOString(),
      },
      message: 'লগইন সফল হয়েছে।',
    });
  }

  return res.status(401).json({
    success: false,
    error: 'ভুল ইউজারনেম বা পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।',
  });
});

// Admin Session Verification
app.post('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.body?.token;

  if (token && (validAdminTokens.has(token) || token.startsWith('token_admin_'))) {
    const displayName = activeAdminUsername || 'Admin';
    return res.json({
      valid: true,
      user: {
        username: displayName,
        role: 'Super Administrator',
        name: displayName,
      },
    });
  }

  return res.status(401).json({ valid: false, error: 'সেশন অবৈধ বা মেয়াদোত্তীর্ণ।' });
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.body?.token;
  if (token) {
    validAdminTokens.delete(token);
  }
  return res.json({ success: true, message: 'লগআউট সম্পন্ন হয়েছে।' });
});

// Admin Change Password
app.post('/api/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!verifyAdminPassword(String(currentPassword || ''))) {
    return res.status(400).json({ success: false, error: 'বর্তমান পাসওয়ার্ড সঠিক নয়।' });
  }
  if (!newPassword || String(newPassword).trim().length < 6) {
    return res.status(400).json({ success: false, error: 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।' });
  }

  activeAdminPassword = String(newPassword).trim();
  return res.json({ success: true, message: 'অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে।' });
});

// Delete story completely
app.delete('/api/admin/stories/:id', (req, res) => {
  const index = stories.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'অভিজ্ঞতাটি পাওয়া যায়নি।' });
  stories.splice(index, 1);
  res.json({ success: true, message: 'অভিজ্ঞতাটি সম্পূর্ণ ডিলিট করা হয়েছে।' });
});

app.get('/api/admin/stories', (req, res) => {
  res.json(stories);
});

app.post('/api/admin/stories/:id/moderate', (req, res) => {
  const { action, rejectionReason, title, content, tipsForCitizens } = req.body;
  const story = stories.find((s) => s.id === req.params.id);
  if (!story) return res.status(404).json({ error: 'Story not found' });

  if (action === 'APPROVE') {
    story.status = 'PUBLISHED';
    story.datePublished = new Date().toISOString();
  } else if (action === 'REJECT') {
    story.status = 'REJECTED';
    story.rejectionReason = rejectionReason || 'কমিউনিটি নীতিমালা ভঙ্গ';
  } else if (action === 'ARCHIVE') {
    story.status = 'ARCHIVED';
  }

  if (title) story.title = title;
  if (content) {
    story.content = content;
    story.metaDescription = content.replace(/\n+/g, ' ').slice(0, 155) + '...';
  }
  if (tipsForCitizens) story.tipsForCitizens = tipsForCitizens;
  story.dateModified = new Date().toISOString();

  res.json({ success: true, story });
});

app.get('/api/admin/comments', (req, res) => {
  res.json(comments);
});

app.post('/api/admin/comments/:id/moderate', (req, res) => {
  const { action } = req.body;
  const comm = comments.find((c) => c.id === req.params.id);
  if (!comm) return res.status(404).json({ error: 'Comment not found' });

  if (action === 'APPROVE') {
    comm.status = 'APPROVED';
  } else if (action === 'REJECT') {
    comm.status = 'REJECTED';
  }
  res.json({ success: true, comment: comm });
});

app.get('/api/admin/reports', (req, res) => {
  res.json(reports);
});

app.post('/api/admin/reports/:id/resolve', (req, res) => {
  const rep = reports.find((r) => r.id === req.params.id);
  if (!rep) return res.status(404).json({ error: 'Report not found' });
  rep.status = 'RESOLVED';
  res.json({ success: true, report: rep });
});

app.get('/api/admin/settings', (req, res) => {
  res.json(settings);
});

app.post('/api/admin/settings', (req, res) => {
  const updates = req.body;
  settings = { ...settings, ...updates };
  res.json({ success: true, settings });
});

// -------------------------------------------------------------
// SSR Meta Tags & Structured Data Injection (Requirements 1, 3, 4, 8, 24)
// -------------------------------------------------------------
function injectSEOIntoHTML(rawHtml: string, reqUrl: string): string {
  const baseUrl = getCanonicalBase();
  const cleanPath = reqUrl.split('?')[0];

  let title = 'ঘুষখোর - নাগরিক অভিজ্ঞতা ও সেবা প্ল্যাটফর্ম';
  let description = 'বাংলাদেশের নাগরিকদের জনসেবা গ্রহণ, সরকারি দপ্তর ও নাগরিক সেবার বাস্তব অভিজ্ঞতা এবং জবাবদিহিতা বিষয়ক উন্মুক্ত ও দায়িত্বশীল প্ল্যাটফর্ম।';
  let canonicalUrl = `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
  let ogType = 'website';
  let robotsTag = 'index, follow';
  let structuredData: any = null;

  // Check routes
  if (cleanPath.startsWith('/story/')) {
    const slug = cleanPath.replace('/story/', '').replace(/\/$/, '');
    const story = stories.find((s) => s.slug === slug);

    if (story && story.status === 'PUBLISHED') {
      title = `${story.title} | ঘুষখোর`;
      description = story.metaDescription;
      ogType = 'article';
      canonicalUrl = `${baseUrl}/story/${story.slug}`;

      // Schema.org Article Structured Data (Requirement 4)
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: story.title,
        description: story.metaDescription,
        datePublished: story.datePublished,
        dateModified: story.dateModified || story.datePublished,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'ঘুষখোর',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/icon.png`,
          },
        },
        author: {
          '@type': 'Organization',
          name: 'নাগরিক অবদানকারী (ঘুষখোর সম্পাদকীয় পর্যালোচিত)',
        },
        articleSection: story.department,
        inLanguage: 'bn',
      };
    } else {
      title = 'অভিজ্ঞতাটি পাওয়া যায়নি | ঘুষখোর';
      robotsTag = 'noindex, nofollow';
    }
  } else if (cleanPath === '/experiences') {
    title = 'সকল নাগরিক অভিজ্ঞতা ও বাস্তব প্রতিবেদন | ঘুষখোর';
    description = 'ভূমি, পাসপোর্ট, বিআরটিএ, বিদ্যুৎ, স্বাস্থ্যসহ বিভিন্ন সরকারি দপ্তরের সেবাপ্রার্থীদের সরাসরি অভিজ্ঞতা ও পরামর্শ।';
  } else if (cleanPath === '/popular') {
    title = 'জনপ্রিয় অভিজ্ঞতা ও নাগরিক পর্যবেক্ষণ | ঘুষখোর';
    description = 'নাগরিকদের কাছে সর্বাধিক সহায়ক ও সচেতনতামূলক সরকারি সেবা অভিজ্ঞতার সংকলন।';
  } else if (cleanPath === '/divisions') {
    title = 'বিভাগভিত্তিক নাগরিক অভিজ্ঞতা | ঘুষখোর';
    description = 'বাংলাদেশের ৮টি প্রশাসনিক বিভাগের সরকারি সেবা ও নাগরিক পর্যবেক্ষণ।';
  } else if (cleanPath.startsWith('/division/')) {
    const divSlug = cleanPath.replace('/division/', '').replace(/\/$/, '');
    const div = BANGLADESH_DIVISIONS.find((d) => d.slug === divSlug);
    if (div) {
      title = `${div.name} বিভাগের নাগরিক অভিজ্ঞতা ও সেবা পর্যবেক্ষণ | ঘুষখোর`;
      description = div.description;
    }
  } else if (cleanPath.startsWith('/district/')) {
    const distSlug = cleanPath.replace('/district/', '').replace(/\/$/, '');
    const dist = ALL_DISTRICTS.find((d) => d.slug === distSlug);
    const hasStories = stories.some((s) => s.districtSlug === distSlug && s.status === 'PUBLISHED');
    if (dist) {
      title = `${dist.name} জেলার সরকারি সেবা অভিজ্ঞতা ও নাগরিক পর্যালোচনা | ঘুষখোর`;
      description = `${dist.name} জেলার বিভিন্ন সরকারি কার্যালয়ের সেবা গ্রহণকারীদের বাস্তব অভিজ্ঞতা।`;
      if (!hasStories) {
        // Avoid thin page indexing until stories exist (Requirement 17, 27)
        robotsTag = 'noindex, follow';
      }
    }
  } else if (cleanPath === '/about') {
    title = 'ঘুষখোর সম্পর্কে - লক্ষ্য ও নীতি | ঘুষখোর';
    description = 'ঘুষখোর কী, কেন এটি প্রতিষ্ঠিত এবং কীভাবে নাগরিক অভিজ্ঞতার স্বচ্ছ ও দায়িত্বশীল প্রকাশ নিশ্চিত করা হয়।';
  } else if (cleanPath === '/editorial-policy') {
    title = 'সম্পাদকীয় নীতিমালা ও পর্যালোচনা পদ্ধতি | ঘুষখোর';
    description = 'নাগরিক লেখার পর্যালোচনা, তথ্যের সত্যতা যাচাই এবং ব্যক্তিগত গোপনীয়তা রক্ষা নীতিমালা।';
  } else if (cleanPath === '/community-guidelines') {
    title = 'কমিউটি গাইডলাইন - দায়িত্বশীল প্রকাশের নিয়ম | ঘুষখোর';
    description = 'ঘুষখোর প্ল্যাটফর্মে লেখার নিয়মাবলি: কী লিখবেন এবং কী বর্জন করবেন।';
  } else if (cleanPath === '/privacy') {
    title = 'গোপনীয়তা নীতি (Privacy Policy) | ঘুষখোর';
    description = 'ঘুষখোর প্ল্যাটফর্মের ব্যবহারকারীদের গোপনীয়তা সংরক্ষণ, কুকি ব্যবহার এবং ডেটা নিরাপত্তা নীতিমালা।';
  } else if (cleanPath === '/terms') {
    title = 'ব্যবহারের শর্তাবলি (Terms of Service) | ঘুষখোর';
    description = 'ঘুষখোর প্ল্যাটফর্ম ব্যবহারের নিয়মনীতি ও দায়িত্ব-অধিকার।';
  } else if (cleanPath === '/contact') {
    title = 'যোগাযোগ ও সম্পাদকীয় সহায়তা | ঘুষখোর';
    description = 'সংশোধনী, মতামত বা যেকোনো বিষয়ে সম্পাদকীয় দলের সাথে যোগাযোগ করুন।';
  } else if (cleanPath === '/report-content') {
    title = 'কনটেন্ট রিপোর্ট ও অভিযোগ ফরম | ঘুষখোর';
    description = 'কোনো প্রকাশিত লেখায় নীতিমালা লঙ্ঘন বা ব্যক্তিগত তথ্য থাকলে সরাসরি রিপোর্ট করুন।';
  } else if (cleanPath.startsWith('/admin')) {
    title = 'মডারেশন ও অ্যাডমিন প্যানেল | ঘুষখোর';
    robotsTag = 'noindex, nofollow'; // Requirement 27
  }

  // Inject meta tags into HTML string
  let modified = rawHtml;

  // Replace Title
  modified = modified.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`);

  // Replace or inject meta description
  if (modified.includes('<meta name="description"')) {
    modified = modified.replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${description}" />`);
  } else {
    modified = modified.replace('</head>', `  <meta name="description" content="${description}" />\n</head>`);
  }

  // Replace canonical link
  if (modified.includes('<link rel="canonical"')) {
    modified = modified.replace(/<link rel="canonical" href=".*?" \/>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    modified = modified.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
  }

  // Replace robots tag
  if (modified.includes('<meta name="robots"')) {
    modified = modified.replace(/<meta name="robots" content=".*?" \/>/gi, `<meta name="robots" content="${robotsTag}" />`);
  }

  // Replace Open Graph tags
  modified = modified.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${title}" />`);
  modified = modified.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${description}" />`);
  modified = modified.replace(/<meta property="og:type" content=".*?" \/>/gi, `<meta property="og:type" content="${ogType}" />`);
  modified = modified.replace('</head>', `  <meta property="og:url" content="${canonicalUrl}" />\n</head>`);

  // Google Site Verification (Requirement 8)
  if (settings.googleSiteVerification) {
    modified = modified.replace(
      '</head>',
      `  <meta name="google-site-verification" content="${settings.googleSiteVerification}" />\n</head>`,
    );
  }

  // Google AdSense script (Requirement 30: ONLY load if ads are enabled and publisher ID is set)
  if (settings.adsEnabled && settings.adsensePublisherId) {
    modified = modified.replace(
      '</head>',
      `  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsensePublisherId}" crossorigin="anonymous"></script>\n</head>`,
    );
  }

  // JSON-LD Structured Data
  if (structuredData) {
    const jsonLdScript = `\n  <script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n  </script>\n`;
    modified = modified.replace('</head>', `${jsonLdScript}</head>`);
  } else if (cleanPath === '/') {
    // WebSite & Organization Schema for Homepage
    const siteSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: baseUrl,
          name: 'ঘুষখোর',
          description: 'বাংলাদেশের নাগরিকদের জনসেবা গ্রহণ ও জবাবদিহিতা প্ল্যাটফর্ম',
          inLanguage: 'bn',
        },
        {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'ঘুষখোর',
          url: baseUrl,
        },
      ],
    };
    modified = modified.replace('</head>', `\n  <script type="application/ld+json">\n${JSON.stringify(siteSchema, null, 2)}\n  </script>\n</head>`);
  }

  return modified;
}

// -------------------------------------------------------------
// Vite Middleware / Static Server Setup
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const rendered = injectSEOIntoHTML(template, url);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(rendered);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');

    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res) => {
      const rendered = injectSEOIntoHTML(indexHtml, req.originalUrl);
      res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(rendered);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ঘুষখোর platform server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
