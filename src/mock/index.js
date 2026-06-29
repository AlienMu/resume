/**
 * Frontend mock layer (for the open-source demo).
 *
 * Goal: let the project run standalone without a backend, for showcasing.
 * How it works: short-circuits before axios issues the real request (see
 * /@/lib/axios.js) and returns the already-unwrapped business data — the same
 * shape the response interceptor produces via `Promise.resolve(res.data)`, so
 * no business code needs to change.
 *
 * Switch: enabled when the env var VITE_APP_USE_MOCK === 'true'.
 *
 * Data source: src/mock/data/*.json. Company names, candidate names and
 * contact details are all synthetic.
 */
import dictionaries from './data/dictionaries.json';
import jobs from './data/jobs.json';
import jobDetails from './data/job-details.json';
import resumes from './data/resumes.json';
import siteConfig from './data/site-config.json';
import announcements from './data/announcements.json';
import advertisements from './data/advertisements.json';
import { localRead } from '/@/utils/local-util';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const';

export const isMockEnabled = () => import.meta.env.VITE_APP_USE_MOCK === 'true';

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const toInt = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
};

/** Build the common paginated response shape */
const paginate = (records, params = {}) => {
  const current = toInt(params.current, 1);
  const size = toInt(params.size, 10);
  const total = records.length;
  const pages = total === 0 ? 0 : Math.ceil(total / size);
  const start = (current - 1) * size;
  return {
    current,
    size,
    total,
    pages,
    records: records.slice(start, start + size),
    totalAmount: null,
  };
};

/** Strip the query string from a URL path */
const normalizePath = (url = '') => url.split('?')[0].replace(/\/+$/, '') || '/';

/** Parse an axios request body, which may be a JSON string or an object */
const parseBody = (data) => {
  if (!data) return {};
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data;
};

// ------------------------------------------------------------------
// Job search / filtering
// ------------------------------------------------------------------

const filterJobs = (params = {}) => {
  let list = [...jobs];
  if (params.industry) {
    list = list.filter((job) => job.industry === params.industry);
  }
  if (params.jobCategory) {
    list = list.filter((job) => job.jobCategory === params.jobCategory);
  }
  if (params.keyword) {
    const kw = String(params.keyword).toLowerCase();
    list = list.filter(
      (job) =>
        (job.jobTitle || '').toLowerCase().includes(kw) ||
        (job.companyName || '').toLowerCase().includes(kw) ||
        (job.jobCategoryShow || '').toLowerCase().includes(kw)
    );
  }
  // firstJobId: pin it to the top
  if (params.firstJobId) {
    const id = Number(params.firstJobId);
    const idx = list.findIndex((job) => job.id === id);
    if (idx > 0) {
      const [hit] = list.splice(idx, 1);
      list.unshift(hit);
    }
  }
  return list;
};

const findJobDetail = (id) => {
  return jobDetails[id] || jobDetails[Number(id)] || null;
};

const filterResumes = (params = {}) => {
  let list = [...resumes];
  if (params.industry) {
    list = list.filter((r) => r.industry === params.industry);
  }
  if (params.jobCategory) {
    list = list.filter((r) => r.jobCategory === params.jobCategory);
  }
  if (params.keyword) {
    const kw = String(params.keyword).toLowerCase();
    list = list.filter((r) => (r.jobTitle || '').toLowerCase().includes(kw) || (r.name || '').toLowerCase().includes(kw));
  }
  return list;
};

const findResumeDetail = (id) => {
  const numId = Number(id);
  return resumes.find((item) => item.id === numId) || null;
};

// ------------------------------------------------------------------
// Auth / login flow (demo only)
// ------------------------------------------------------------------

// Demo accounts. Sign in with any of these emails; password and captcha
// can be anything. The chosen account decides which center you land on.
const DEMO_ACCOUNTS = {
  'jobseeker@example.com': {
    token: 'mock-token-jobseeker',
    userType: 1, // Job Seeker -> user-center
    username: 'Demo Job Seeker',
    email: 'jobseeker@example.com',
    telegramAccount: '@demo_jobseeker',
    countryCode: '+86',
    phone: '13100000001',
    inviteCode: 'DEMO-JS',
    status: 1,
  },
  'company@example.com': {
    token: 'mock-token-company',
    userType: 2, // Recruiter -> enterprise-center
    username: 'Demo Recruiter',
    email: 'company@example.com',
    telegramAccount: '@demo_company',
    countryCode: '+86',
    phone: '13100000002',
    inviteCode: 'DEMO-CO',
    status: 1,
  },
  'inviter@example.com': {
    token: 'mock-token-inviter',
    userType: 3, // Inviter -> invite-center
    username: 'Demo Inviter',
    email: 'inviter@example.com',
    telegramAccount: '@demo_inviter',
    countryCode: '+86',
    phone: '13100000003',
    inviteCode: 'DEMO-IN',
    status: 1,
  },
};

// Map a token back to its account (used by /userinfo).
const accountByToken = (token) => Object.values(DEMO_ACCOUNTS).find((a) => a.token === token) || null;

// Build a self-contained SVG captcha as a base64 data URL. No backend needed,
// and each call produces a fresh image so the "refresh" affordance works.
const makeCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
  const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);
  const glyphs = code
    .split('')
    .map((ch, i) => {
      const x = 14 + i * 24;
      const y = rand(26, 32);
      const rot = rand(-18, 18);
      const hue = rand(0, 360);
      return `<text x="${x}" y="${y}" font-size="26" font-family="monospace" font-weight="bold" fill="hsl(${hue},60%,45%)" transform="rotate(${rot} ${x} ${y})">${ch}</text>`;
    })
    .join('');
  const lines = Array.from({ length: 4 }, () => {
    const hue = rand(0, 360);
    return `<line x1="${rand(0, 30)}" y1="${rand(0, 40)}" x2="${rand(70, 100)}" y2="${rand(0, 40)}" stroke="hsl(${hue},50%,70%)" stroke-width="1"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40"><rect width="100" height="40" fill="#f2f4f7"/>${lines}${glyphs}</svg>`;
  // Use encodeURIComponent + unescape so btoa handles the UTF-8 SVG safely.
  const base64 = typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(svg))) : svg;
  return {
    captchaKey: `captcha:mock:${Date.now()}:${code}`,
    captchaImage: `data:image/svg+xml;base64,${base64}`,
  };
};

// First demo account is what an unknown email falls back to on login.
const resolveLoginAccount = (email) => DEMO_ACCOUNTS[String(email || '').toLowerCase()] || DEMO_ACCOUNTS['jobseeker@example.com'];

const topCategories = [
  { itemKey: 'job_category:web3_blockchain:web3_dev', name: 'Web3 Development' },
  { itemKey: 'job_category:Web3 PM', name: 'Web3 Product Manager' },
  { itemKey: 'job_category:web3_blockchain:blockchain_marketing', name: 'Blockchain Marketing' },
  { itemKey: 'job_category:web3_blockchain:bd', name: 'Web3 BD & Marketing' },
  { itemKey: 'job_category:web3_blockchain:web3_ops', name: 'Web3 Ecosystem Operations' },
  { itemKey: 'job_category:tech_product:qa', name: 'QA' },
  { itemKey: 'job_category:function_support:hrbp', name: 'HRBP' },
  { itemKey: 'job_category:tech_product:fullstack', name: 'Full-stack Development' },
];

// ------------------------------------------------------------------
// Route table: key is `METHOD /path`, value is (config) => unwrapped business data
// ------------------------------------------------------------------

const routes = {
  'GET /api/job/list': ({ params }) => paginate(filterJobs(params), params),
  'GET /api/job/recommend': ({ params }) => paginate(filterJobs(params), params),
  'GET /api/job/my-collections': ({ params }) => paginate([], params),
  'GET /api/job/hot': ({ params }) => ({
    pageResult: paginate(filterJobs({ ...params, isHot: 1 }), params),
    topCategories,
  }),

  'GET /api/base/dictionary/items': ({ params }) => {
    const typeCode = params?.typeCode;
    return typeCode ? dictionaries[typeCode] || [] : [];
  },

  'GET /api/admin/system/site-config': () => siteConfig,
  'GET /api/system/announcements/latest': () => announcements,
  'GET /api/system/advertisements': () => advertisements,

  'GET /api/resume/list': ({ params }) => paginate(filterResumes(params), params),
  'GET /api/resume/my-list': ({ params }) => paginate([], params),

  // --- Auth: captcha (login + the three registration scenes) ---
  'GET /api/auth/captcha/login': () => makeCaptcha(),
  'GET /api/auth/captcha/jobseeker': () => makeCaptcha(),
  'GET /api/auth/captcha/company': () => makeCaptcha(),
  'GET /api/auth/captcha/invite': () => makeCaptcha(),

  // --- Auth: login / register all return { token } and auto sign-in ---
  'POST /api/auth/login/email/captcha': ({ data }) => {
    const body = parseBody(data);
    const account = resolveLoginAccount(body.email);
    return { token: account.token };
  },
  'POST /api/auth/register/jobseeker': () => ({ token: DEMO_ACCOUNTS['jobseeker@example.com'].token }),
  'POST /api/auth/register/company': () => ({ token: DEMO_ACCOUNTS['company@example.com'].token }),
  'POST /api/auth/register/invite': () => ({ token: DEMO_ACCOUNTS['inviter@example.com'].token }),
  'POST /api/auth/check-existence': () => ({ success: true }),
  'POST /api/auth/password/forgot/reset': () => ({ success: true }),
  'POST /api/auth/password/forgot/send-email': () => ({ success: true }),
  'POST /api/auth/logout': () => ({ success: true }),

  // --- Auth: current user, resolved from the stored demo token ---
  'GET /api/auth/userinfo': () => {
    const token = localRead(LocalStorageKeyConst.USER_TOKEN);
    const account = accountByToken(token);
    if (!account) {
      return { __error: { code: 2008, message: 'Missing auth token' } };
    }
    return {
      avatar: '',
      username: account.username,
      userType: account.userType,
      email: account.email,
      telegramAccount: account.telegramAccount,
      countryCode: account.countryCode,
      phone: account.phone,
      inviteCode: account.inviteCode,
      status: account.status,
      lastLoginTime: '2026-06-29 09:00:00',
      userDetails: { menus: [] },
    };
  },

  // --- Message: unread counts (drives the bell badge) ---
  'GET /api/message/unread-count-by-type': () => ({
    total: 0,
    systemCount: 0,
    applicationCount: 0,
    jobRecommendCount: 0,
  }),

  // --- Job Seeker center: account settings (drives the resume-edit header) ---
  'GET /api/user-center/account-settings': () => ({
    avatar: '',
    englishName: 'Demo Job Seeker',
    position: '',
    phone: '13100000001',
    phonePublic: 1,
    email: 'jobseeker@example.com',
    emailVerified: 1,
    telegramAccount: '@demo_jobseeker',
  }),

  // --- Job Seeker center: my resumes ---
  'GET /api/user-center/my-resumes': ({ params }) => {
    const records = resumes.slice(0, 6).map((r, i) => ({
      id: r.id,
      sequence: i + 1,
      resumeName: r.jobTitle || `Resume ${i + 1}`,
      applicationCount: (r.id || 0) % 7,
      isPublic: r.isPublic ?? 1,
      status: r.status ?? 1,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
    return paginate(records, params);
  },

  // --- Recruiter center: company profile (empty -> shows the edit form) ---
  'GET /api/company/info': () => ({
    managerAvatar: '',
    managerNickname: 'Demo Recruiter',
    managerOccupation: '',
    managerTelegramAccount: '@demo_company',
    managerEmail: 'company@example.com',
    managerOtherAccount: undefined,
    managerOtherAccountValue: '',
    companyLogo: '',
    companyName: 'Demo Company',
    industry: 'industry_sector:web3',
    companyWebsite: '',
    companySize: 'recruitment_number:21_50',
    companyBenefits: [],
    companyIntroduction: '',
    companyShowcaseImages: [],
    welfareImages: [],
  }),

  // --- Inviter center: earnings overview / yesterday / details / withdrawals ---
  'GET /api/invite/earnings/overview': () => ({
    resumeEarnings: 320.5,
    inviteShareEarnings: 88.0,
    totalEarnings: 408.5,
    withdrawnEarnings: 200.0,
    lockedEarnings: 8.5,
    availableEarnings: 200.0,
  }),
  'GET /api/invite/earnings/yesterday': () => ({
    resumeEarnings: 12.0,
    inviteShareEarnings: 3.0,
    totalEarnings: 15.0,
    todayTotalEarnings: 6.5,
  }),
  'GET /api/invite/earnings/details': ({ params }) => paginate([], params),
  'GET /api/invite/withdraw/list': ({ params }) => paginate([], params),
};

// Dynamic paths (with an id segment)
const dynamicRoutes = [
  {
    test: (method, path) => method === 'GET' && /^\/api\/job\/(company\/)?\d+$/.test(path),
    handler: (config, path) => {
      const id = path.split('/').pop();
      const detail = findJobDetail(id);
      if (!detail) {
        return { __error: { code: 1000, message: 'Job not found' } };
      }
      return detail;
    },
  },
  {
    test: (method, path) => method === 'GET' && /^\/api\/resume\/\d+$/.test(path),
    handler: (config, path) => {
      const id = path.split('/').pop();
      const detail = findResumeDetail(id);
      if (!detail) {
        return { __error: { code: 1000, message: 'Resume not found' } };
      }
      return detail;
    },
  },
  {
    // Contact HR / negotiate: return a demo Telegram contact
    test: (method, path) => method === 'POST' && /^\/api\/job\/\d+\/negotiate$/.test(path),
    handler: () => ({
      applicationId: null,
      canContact: true,
      telegramUrl: 'https://t.me/demo_hr',
      managerOtherAccounts: ['more_accounts:telegram:@demo_hr'],
    }),
  },
];

// ------------------------------------------------------------------
// Entry point
// ------------------------------------------------------------------

/**
 * Handle a single mock request.
 * @returns {Promise<any>} Resolves to the unwrapped business data; for an
 *   unmatched route, GET resolves to an empty shape and writes resolve to a
 *   generic success, so the demo never crashes on a missing endpoint.
 */
export const handleMockRequest = async (config = {}) => {
  const method = (config.method || 'get').toUpperCase();
  const path = normalizePath(config.url || '');
  await delay();

  const key = `${method} ${path}`;
  let result;

  if (routes[key]) {
    result = routes[key](config);
  } else {
    const dyn = dynamicRoutes.find((r) => r.test(method, path));
    if (dyn) {
      result = dyn.handler(config, path);
    }
  }

  // Unmatched: writes return a generic success, reads return an empty shape, so the demo never crashes
  if (result === undefined) {
    if (method === 'GET') {
      return null;
    }
    return { success: true, message: 'OK (mock)' };
  }

  // Business error (e.g. detail not found): mirror the interceptor's reject
  if (result && result.__error) {
    return Promise.reject({ data: result.__error });
  }

  return result;
};
