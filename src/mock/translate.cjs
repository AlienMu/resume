/* eslint-disable */
/**
 * Mock 数据中文转英文（一次性脚本，开源用）
 *
 * 就地转换 src/mock/data/*.json：
 * - 所有 `xxShow` 字段：用字典 itemAlias（英文别名）按 itemKey 反查替换。
 * - jobTitle / 富文本 / 枚举显示文案 / 公告 / 广告：用下方翻译表替换。
 *
 * 字典本身（dictionaries.json）的 itemName 也替换为 itemAlias，使下拉选项显示英文。
 *
 * 用法：node src/mock/translate.cjs
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'data');
const read = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
const write = (f, obj) => fs.writeFileSync(path.join(DIR, f), JSON.stringify(obj, null, 2) + '\n');

// ------------------------------------------------------------------
// 1. 字典：建立 itemKey -> itemAlias 映射；并把 itemName 改成英文别名
// ------------------------------------------------------------------
const dictionaries = read('dictionaries.json');
const aliasByKey = {};

const walkDict = (items) => {
  for (const it of items) {
    if (it.itemKey && it.itemAlias) aliasByKey[it.itemKey] = it.itemAlias;
    if (it.itemName && it.itemAlias) it.itemName = it.itemAlias; // 下拉显示英文
    if (Array.isArray(it.children) && it.children.length) walkDict(it.children);
  }
};
Object.values(dictionaries).forEach((items) => walkDict(items));

// 把 itemKey 反查英文；查不到时回退到手工表或原值
const showByKey = (key, fallback) => aliasByKey[key] || fallback;

// ------------------------------------------------------------------
// 2. 手工翻译表
// ------------------------------------------------------------------
const JOB_TITLES = {
  '会计/审计/财务相关职位': 'Accounting / Audit / Finance',
  '内容文案写手': 'Content Copywriter',
  '澳洲BD&CM': 'Australia BD & CM',
  '资管风控主管': 'Asset Management Risk Control Lead',
  '借贷运营': 'Lending Operations',
  '渠道运营': 'Channel Operations',
  'P2P BD': 'P2P BD',
  'web3钱包增长运营（高级,偏活动运营）': 'Web3 Wallet Growth Ops (Senior, Campaign-focused)',
  '台湾KOL BD': 'Taiwan KOL BD',
  '海外商务（广告投放方向）': 'Overseas BD (Ad Placement)',
  'VIP运营': 'VIP Operations',
  '中文区BD': 'Chinese Region BD',
  '薪酬绩效专家（2名）': 'Compensation & Performance Specialist (2)',
  'HRBP（3名）': 'HRBP (3)',
  'SDL': 'SDL',
  '资深数仓工程师': 'Senior Data Warehouse Engineer',
  'Web3战略与研究': 'Web3 Strategy & Research',
  '钱包高级SRE': 'Wallet Senior SRE',
  'K8S专家': 'Kubernetes Specialist',
  'DBA': 'DBA',
  'Devops运维开发': 'DevOps Engineer',
  '现货Java开发': 'Spot Trading Java Developer',
  '中台/CRM的Golang开发': 'Middle Platform / CRM Golang Developer',
  'Rust开发': 'Rust Developer',
  '钱包开发': 'Wallet Developer',
  '[海外远程/实习] 全栈+AI': '[Remote/Intern] Full-stack + AI',
  '理财Java（香港/马来西亚）': 'Wealth Management Java (HK/Malaysia)',
  '资深管理后台Java（base马来西亚）': 'Senior Admin Backend Java (Malaysia)',
  '财务Java 远程': 'Finance Java (Remote)',
  '法币Java 远程': 'Fiat Java (Remote)',
  '性能优化Java 远程': 'Performance Java (Remote)',
  '区块链安全开发（新加坡）': 'Blockchain Security Developer (Singapore)',
  '资深区块链开发（新加坡）': 'Senior Blockchain Developer (Singapore)',
  '安卓架构': 'Android Architect',
  '前端架构师': 'Frontend Architect',
  '测试工程师（币圈/金融经验）': 'QA Engineer (Crypto/Finance)',
  'Golang工程师': 'Golang Engineer',
  '运营专员（越南市场）': 'Operations Specialist (Vietnam)',
  '运营负责人': 'Head of Operations',
  '产品负责人': 'Head of Product',
  '交易产品经理': 'Trading Product Manager',
  'KOL开发': 'KOL Development',
  '运维工程师': 'Operations & Maintenance Engineer',
  '商务总监': 'BD Director',
  '大客户经理': 'Key Account Manager',
  '海外Twitter运营': 'Overseas Twitter Operations',
  '站内流量运营': 'On-site Traffic Operations',
  '用户产品经理': 'User Product Manager',
  '合规产品经理': 'Compliance Product Manager',
  '区块链技术负责人': 'Head of Blockchain Engineering',
  'Web3/区块链/投融资': 'Web3 / Blockchain / Investment',
  'Web3/区块链/智能合约开发': 'Web3 / Blockchain / Smart Contract Development',
  '职能/后勤/HRBP': 'Function / Support / HRBP',
  'Web3/区块链/DApp全栈/前端开发': 'Web3 / Blockchain / DApp Full-stack & Frontend',
  'Web3/区块链/Web3市场与商务': 'Web3 / Blockchain / Marketing & BD',
  'Web3/区块链/web3社区运营': 'Web3 / Blockchain / Community Operations',
  'Web3/区块链/Web3UI/UE': 'Web3 / Blockchain / UI/UX',
  'Web3/区块链/Web3经营管理': 'Web3 / Blockchain / Business Management',
  'Web3/区块链/Web3战略与研究': 'Web3 / Blockchain / Strategy & Research',
  'Web3/区块链/数据分析师': 'Web3 / Blockchain / Data Analyst',
  'Web3产品/开发/后端开发': 'Web3 Product / Backend Development',
  'Web3生态运营/web3社区运营': 'Web3 Ecosystem / Community Operations',
  'Web3生态运营/交易所运营': 'Web3 Ecosystem / Exchange Operations',
  'Web3生态运营/web3社媒运营': 'Web3 Ecosystem / Social Media Operations',
  'Web3产品/开发/web3产品助理': 'Web3 Product / Product Assistant',
  'Web3战略与研究/区块链研究员': 'Web3 Strategy & Research / Blockchain Researcher',
  'Web3安全与合规/风控专员': 'Web3 Security & Compliance / Risk Specialist',
};
const tTitle = (t) => JOB_TITLES[t] || t;

// 国家/地区自由文本（非字典字段）
const COUNTRY = {
  全球: 'Global',
  其他: 'Other',
  马来西亚: 'Malaysia',
  越南: 'Vietnam',
  中国: 'China',
  中国香港: 'Hong Kong',
  中国台湾: 'Taiwan',
  新加坡: 'Singapore',
  菲律宾: 'Philippines',
  泰国: 'Thailand',
  日本: 'Japan',
  美国: 'United States',
  英国: 'United Kingdom',
};
const tCountry = (t) => COUNTRY[t] || t;

// 公司福利
const BENEFITS = {
  远程办公: 'Remote Work',
  弹性工作: 'Flexible Hours',
  股权激励: 'Equity Incentive',
  带薪年假: 'Paid Annual Leave',
  海外团建: 'Overseas Team Building',
  U本位结算: 'Stablecoin Payroll',
};
const LANGS = { 英语: 'English', 中文: 'Chinese', 粤语: 'Cantonese' };

// 性别 / 简历状态
const GENDER = { 男: 'Male', 女: 'Female', 未知: 'Unknown' };
const RESUME_STATUS = { 正常: 'Active', 禁用: 'Disabled', 待审核: 'Pending Review', 冻结: 'Frozen', 草稿: 'Draft' };

// ------------------------------------------------------------------
// 3. 富文本（Quill Delta）——整体替换为英文模板
// ------------------------------------------------------------------
const jobDescDelta = (title) =>
  JSON.stringify({
    ops: [
      { insert: 'Responsibilities:\n', attributes: { bold: true } },
      { insert: `1. Drive and deliver core ${title} initiatives end to end;\n` },
      { insert: '2. Collaborate cross-functionally and work with overseas partners;\n' },
      { insert: '3. Track industry trends and produce actionable plans.\n\n' },
      { insert: 'Requirements:\n', attributes: { bold: true } },
      { insert: '1. Relevant experience with strong English communication skills;\n' },
      { insert: '2. Self-driven, results-oriented, comfortable with remote collaboration.\n' },
    ],
  });

const jobIntroDelta = (company) =>
  JSON.stringify({
    ops: [
      {
        insert: `${company} is a technology company focused on overseas business, with a globally distributed team that values remote collaboration and a results-driven culture.\n`,
      },
    ],
  });

const resumeExpDelta = (title) =>
  JSON.stringify({
    ops: [
      {
        insert:
          `1. Years of hands-on experience in ${title || 'the field'}, having led multiple overseas projects;\n` +
          '2. Skilled in cross-team collaboration and remote communication; working languages Chinese and English;\n' +
          '3. Results-oriented, looking to join a team with a global vision.\n',
      },
    ],
  });

// ------------------------------------------------------------------
// 4. 转换各文件
// ------------------------------------------------------------------

// jobs.json
const jobs = read('jobs.json').map((j) => ({
  ...j,
  jobTitle: tTitle(j.jobTitle),
  industryShow: showByKey(j.industry, j.industryShow),
  jobCategoryShow: showByKey(j.jobCategory, j.jobCategoryShow),
  jobNatureShow: showByKey(j.jobNature, j.jobNatureShow),
  workExperienceShow: showByKey(j.workExperience, j.workExperienceShow),
  educationRequiredShow: showByKey(j.educationRequired, j.educationRequiredShow),
  recruitmentNumberShow: showByKey(j.recruitmentNumber, j.recruitmentNumberShow),
  salaryRange: showByKey(j.expectedSalary, j.salaryRange),
  country: tCountry(j.country),
}));
write('jobs.json', jobs);

// job-details.json
const detailsObj = read('job-details.json');
for (const id of Object.keys(detailsObj)) {
  const d = detailsObj[id];
  const title = tTitle(d.jobTitle);
  detailsObj[id] = {
    ...d,
    jobTitle: title,
    industryShow: showByKey(d.industry, d.industryShow),
    jobCategoryShow: showByKey(d.jobCategory, d.jobCategoryShow),
    jobNatureShow: showByKey(d.jobNature, d.jobNatureShow),
    workExperienceShow: showByKey(d.workExperience, d.workExperienceShow),
    educationRequiredShow: showByKey(d.educationRequired, d.educationRequiredShow),
    recruitmentNumberShow: showByKey(d.recruitmentNumber, d.recruitmentNumberShow),
    salaryRange: showByKey(d.expectedSalary, d.salaryRange),
    salaryRangeShow: showByKey(d.expectedSalary, d.salaryRangeShow),
    country: tCountry(d.country),
    workLocationShow: tCountry(d.workLocationShow),
    companySizeShow: showByKey(d.recruitmentNumber, d.companySizeShow),
    languageRequirementsShow: (d.languageRequirementsShow || []).map((l) => LANGS[l] || l),
    companyBenefitsShow: (d.companyBenefitsShow || []).map((b) => BENEFITS[b] || b),
    description: jobDescDelta(title),
    introduction: jobIntroDelta(d.companyName),
  };
}
write('job-details.json', detailsObj);

// resumes.json
const resumes = read('resumes.json').map((r) => ({
  ...r,
  jobTitle: tTitle(r.jobTitle),
  genderShow: GENDER[r.genderShow] || r.genderShow,
  statusShow: RESUME_STATUS[r.statusShow] || r.statusShow,
  nationalityShow: showByKey(r.nationality, tCountry(r.nationalityShow)),
  jobCategoryShow: showByKey(r.jobCategory, r.jobCategoryShow),
  workYearsShow: showByKey(r.workYears, r.workYearsShow),
  educationShow: showByKey(r.education, r.educationShow),
  currentLocationShow: showByKey(r.currentLocation, tCountry(r.currentLocationShow)),
  expectedCountryShow: showByKey(r.expectedCountry, tCountry(r.expectedCountryShow)),
  abroadWillingnessShow: showByKey(r.abroadWillingness, r.abroadWillingnessShow),
  workStyleShow: showByKey(r.workStyle, r.workStyleShow),
  jobStatusShow: showByKey(r.jobStatus, r.jobStatusShow),
  currentSalaryShow: showByKey(r.currentSalary, r.currentSalaryShow),
  expectedSalaryShow: showByKey(r.expectedSalary, r.expectedSalaryShow),
  experienceContent: resumeExpDelta(tTitle(r.jobTitle)),
}));
write('resumes.json', resumes);

// dictionaries.json（itemName 已替换为英文别名）
write('dictionaries.json', dictionaries);

// announcements.json
const ANNOUNCE = {
  防骗指南: {
    title: 'Anti-Fraud Guide',
    content:
      '[Anti-Fraud Guide] Before remote interviews and onboarding, always do reverse due diligence on the company to avoid content theft, unpaid wages and similar issues.',
  },
  企业用户可免费发布招聘职位: {
    title: 'Employers Can Post Jobs for Free',
    content:
      'Attention employers: newly registered company accounts can post job openings for free! Register now to unlock the free posting benefit.',
  },
};
const TYPE_NAME = { 系统公告: 'System Notice', 投递通知: 'Application Notice', 职位推荐: 'Job Recommendation' };
const STATUS_NAME = { 启用: 'Enabled', 禁用: 'Disabled' };
const DISPLAY_NAME = { 展示: 'Visible', 隐藏: 'Hidden' };
const announcements = read('announcements.json').map((a) => {
  const tr = ANNOUNCE[a.title] || {};
  return {
    ...a,
    title: tr.title || a.title,
    content: tr.content || a.content,
    typeName: TYPE_NAME[a.typeName] || a.typeName,
    statusName: STATUS_NAME[a.statusName] || a.statusName,
    appDisplayStatusName: DISPLAY_NAME[a.appDisplayStatusName] || a.appDisplayStatusName,
  };
});
write('announcements.json', announcements);

// advertisements.json
const AD_TITLE = { 轮播1: 'Carousel 1', 轮播2: 'Carousel 2', 小图左: 'Small Left', 小图右: 'Small Right' };
const AD_STATUS = { 展示: 'Visible', 隐藏: 'Hidden' };
const AD_DISPLAY = { 展示中: 'Displaying', 已过期: 'Expired', 未开始: 'Not Started' };
const adsRaw = read('advertisements.json');
const ads = {
  ...adsRaw,
  records: (adsRaw.records || []).map((a) => ({
    ...a,
    title: AD_TITLE[a.title] || a.title,
    statusName: AD_STATUS[a.statusName] || a.statusName,
    displayStatusName: AD_DISPLAY[a.displayStatusName] || a.displayStatusName,
  })),
};
write('advertisements.json', ads);

// site-config.json（sizeLimit 文案）
const SIZE = {
  '限制500k以内': 'Up to 500KB',
  '限制100k以内': 'Up to 100KB',
  '限制1M以内': 'Up to 1MB',
};
const site = read('site-config.json');
const fixSize = (img) => {
  if (!img) return img;
  if (img.sizeLimit) img.sizeLimit = SIZE[img.sizeLimit] || img.sizeLimit;
  if (img.qrcodeSizeLimit) img.qrcodeSizeLimit = SIZE[img.qrcodeSizeLimit] || img.qrcodeSizeLimit;
  return img;
};
['logoImage', 'faviconImage', 'invitationImage', 'paymentAddressInfo'].forEach((k) => fixSize(site[k]));
write('site-config.json', site);

console.log('Mock 数据已转换为英文。');
