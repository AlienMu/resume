/* eslint-disable */
/**
 * Mock 数据生成器（一次性脚本，开源用）
 *
 * 读取 mock-raw/ 下从真实接口拉取的样本 + result.json，
 * 输出脱敏后的静态 mock 数据到 src/mock/data/。
 *
 * - 字典（dictionary）保持原样：不含 PII，是 UI 渲染的基础数据。
 * - 公司名/Logo：替换为虚构公司。
 * - 简历的姓名、电话、Telegram、邮箱等 PII：全部替换为假数据。
 * - 职位详情：真实接口需登录，这里基于列表记录合成。
 *
 * 用法：node src/mock/generate.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const RAW = path.join(ROOT, 'mock-raw');
const OUT = path.join(__dirname, 'data');

const readRaw = (file) => JSON.parse(fs.readFileSync(path.join(RAW, file), 'utf8'));
const writeData = (file, obj) => {
  fs.writeFileSync(path.join(OUT, file), JSON.stringify(obj, null, 2) + '\n');
  console.log('  ->', path.relative(ROOT, path.join(OUT, file)));
};

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// ------------------------------------------------------------------
// 1. 字典：原样保留（typeCode -> items）
// ------------------------------------------------------------------
const DICT_FILES = fs
  .readdirSync(RAW)
  .filter((f) => f.startsWith('dict-') && f.endsWith('.json'));

const dictionaries = {};
for (const f of DICT_FILES) {
  const typeCode = f.replace(/^dict-/, '').replace(/\.json$/, '');
  dictionaries[typeCode] = readRaw(f).data || [];
}
writeData('dictionaries.json', dictionaries);

// ------------------------------------------------------------------
// 2. 公司脱敏映射
// ------------------------------------------------------------------
const FAKE_COMPANIES = [
  'Nimbus Labs',
  'Aurora Exchange',
  'Meridian Tech',
  'Polaris Capital',
  'Vertex Global',
  'Lumen Digital',
  'Cobalt Network',
  'Zephyr Trading',
  'Helix Ventures',
  'Quanta Labs',
  'Solstice Pay',
  'Orbit Studio',
  'Vanta Group',
  'Crest Finance',
  'Nova Chain',
];
const FAKE_LOGO = 'https://placehold.co/120x120/4f7cff/ffffff?text=';
const FAKE_COMPANY_IMG = 'https://placehold.co/176x120/e6edf2/8d8f99?text=Office';
const FAKE_WELFARE_IMG = 'https://placehold.co/176x120/d6e7ff/4f7cff?text=Welfare';
const FAKE_AVATAR = 'https://placehold.co/80x80/cdd6e0/525b73?text=HR';

const jobsRaw = readRaw('job-list-full.json').data.records || [];

// companyId -> 虚构公司信息（稳定映射）
const companyMap = new Map();
let companyIdx = 0;
const fakeCompany = (companyId) => {
  if (!companyMap.has(companyId)) {
    const name = FAKE_COMPANIES[companyIdx % FAKE_COMPANIES.length];
    companyIdx += 1;
    companyMap.set(companyId, {
      companyName: name,
      companyLogo: FAKE_LOGO + encodeURIComponent(name.charAt(0)),
      website: `https://www.${name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.example.com`,
    });
  }
  return companyMap.get(companyId);
};

// ------------------------------------------------------------------
// 3. 职位列表（脱敏公司名）
// ------------------------------------------------------------------
const jobs = jobsRaw.map((j) => {
  const c = fakeCompany(j.companyId);
  return {
    ...j,
    companyName: c.companyName,
    companyLogo: c.companyLogo,
  };
});
writeData('jobs.json', jobs);

// ------------------------------------------------------------------
// 4. 职位详情（基于列表合成，真实详情接口需登录）
// ------------------------------------------------------------------
const SAMPLE_DELTA = (title) =>
  JSON.stringify({
    ops: [
      { insert: `岗位职责：\n`, attributes: { bold: true } },
      { insert: `1. 负责${title}相关的核心业务推进与落地；\n` },
      { insert: `2. 与跨部门团队协作，对接海外合作伙伴；\n` },
      { insert: `3. 跟踪行业动态，输出可执行的方案。\n\n` },
      { insert: `任职要求：\n`, attributes: { bold: true } },
      { insert: `1. 相关领域工作经验，具备良好的英文沟通能力；\n` },
      { insert: `2. 自驱、结果导向，适应远程协作节奏。\n` },
    ],
  });

const COMPANY_BENEFITS = ['远程办公', '弹性工作', '股权激励', '带薪年假', '海外团建', 'U本位结算'];
const LANGUAGES = ['英语', '中文', '粤语'];

const jobDetails = {};
for (const j of jobs) {
  const c = companyMap.get(j.companyId) || {};
  jobDetails[j.id] = {
    ...j,
    salaryRangeShow: j.salaryRange,
    languageRequirementsShow: LANGUAGES.slice(0, (j.id % 3) + 1),
    workLocationShow: j.country || '全球',
    hrName: 'Alex',
    hrAvatar: FAKE_AVATAR,
    website: c.website || 'https://www.example.com',
    companySizeShow: j.recruitmentNumberShow || '50人以上',
    companyBenefitsShow: COMPANY_BENEFITS.slice(0, (j.id % 4) + 2),
    description: SAMPLE_DELTA(j.jobTitle),
    introduction: JSON.stringify({
      ops: [{ insert: `${c.companyName || '该公司'} 是一家专注于海外业务的科技公司，团队分布在全球多个地区，倡导远程协作与结果导向的工作文化。\n` }],
    }),
    companyImages: [FAKE_COMPANY_IMG + '+1', FAKE_COMPANY_IMG + '+2'],
    welfareImages: [FAKE_WELFARE_IMG + '+1', FAKE_WELFARE_IMG + '+2'],
    managerOtherAccounts: ['more_accounts:telegram:@demo_hr'],
    isApplied: false,
  };
}
writeData('job-details.json', jobDetails);

// ------------------------------------------------------------------
// 5. 简历列表 + 详情（PII 全部脱敏）
// ------------------------------------------------------------------
const resumesRaw = JSON.parse(fs.readFileSync(path.join(ROOT, 'result.json'), 'utf8')).data || [];

const FAKE_NAMES = ['Leo', 'Mia', 'Ethan', 'Sophie', 'Noah', 'Ava', 'Lucas', 'Emma', 'Ryan', 'Chloe', 'Jack', 'Lily', 'Owen', 'Zoe', 'Max'];
const fakeExperience = (jobTitle) =>
  JSON.stringify({
    ops: [
      {
        insert:
          `1. 拥有 ${jobTitle || '相关领域'} 多年从业经验，主导过多个海外项目；\n` +
          `2. 擅长跨团队协作与远程沟通，工作语言为中英文；\n` +
          `3. 结果导向，期望加入有全球视野的团队。\n`,
      },
    ],
  });

const resumes = resumesRaw.map((r, i) => {
  const name = FAKE_NAMES[i % FAKE_NAMES.length];
  return {
    ...r,
    userId: 900000 + i,
    name,
    englishName: name,
    phone: `1310000${String(1000 + i).slice(-4)}`,
    phoneCountryCode: '86',
    telegram: `@demo_${name.toLowerCase()}`,
    email: `${name.toLowerCase()}@example.com`,
    avatar: null,
    otherAccount: null,
    otherAccountValue: null,
    otherAccountShow: null,
    moreAccounts: null,
    selfIntroduction: r.selfIntroduction || null,
    experienceContent: r.experienceContent && r.experienceContent.length > 10 ? r.experienceContent : fakeExperience(r.jobTitle),
    resumeFile: [],
  };
});
writeData('resumes.json', resumes);

// ------------------------------------------------------------------
// 6. 站点配置 / 公告 / 广告（脱敏联系方式与外链图片）
// ------------------------------------------------------------------
const site = readRaw('site-config.json').data || {};
const sanitizeImg = (img, label) =>
  img ? { ...img, imageUrl: `https://placehold.co/210x65/4f7cff/ffffff?text=${label}` } : img;
const siteConfig = {
  ...site,
  footerCooperationTelegram: 'https://t.me/demo',
  footerCooperationEmail: 'contact@example.com',
  sidebarCustomerTelegram: 'https://t.me/demo',
  logoImage: sanitizeImg(site.logoImage, 'Logo'),
  faviconImage: site.faviconImage ? { ...site.faviconImage, imageUrl: 'https://placehold.co/32x32/4f7cff/ffffff?text=R' } : site.faviconImage,
  invitationImage: site.invitationImage
    ? { ...site.invitationImage, imageUrl: 'https://placehold.co/1100x700/d6e7ff/4f7cff?text=Invite' }
    : site.invitationImage,
  paymentAddressInfo: site.paymentAddressInfo
    ? { ...site.paymentAddressInfo, address: 'TDemoAddressXXXXXXXXXXXXXXXXXXXXXX', qrcodeUrl: 'https://placehold.co/250x250/eeeeee/333333?text=QR' }
    : site.paymentAddressInfo,
};
writeData('site-config.json', siteConfig);

const announcements = readRaw('announcements.json').data || [];
writeData('announcements.json', announcements);

const adsRaw = readRaw('advertisements.json').data || {};
const ads = {
  ...adsRaw,
  records: (adsRaw.records || []).map((a) => ({
    ...a,
    contactInfo: 'demo',
    linkUrl: 'https://example.com',
    imageUrl: (a.imageUrl || []).map((img) => ({ ...img, url: 'https://placehold.co/600x300/4f7cff/ffffff?text=Ad' })),
  })),
};
writeData('advertisements.json', ads);

console.log('\nMock 数据生成完成。');
