# CLAUDE.md

本文件为 Claude Code 提供项目上下文。项目即将开源，需要补充 mock 数据以便脱离后端独立运行。

## 项目简介

「海外聘」(webjob) —— 面向海外招聘场景的 Web 前端。三类用户角色：

- **求职者 (PERSON)** —— 管理简历、投递职位、查看投递反馈。
- **招聘者 / 企业 (COMPANY)** —— 发布职位、检索简历、查看投递、套餐充值。
- **邀请者 (INVITED)** —— 上传简历获取邀请奖励、提现。

## 技术栈

- 构建：Vite 5 + `vite-plugin-pages`（文件路由）+ `vite-plugin-svg-icons`
- 框架：Vue 3.4（`<script setup>`）+ Vue Router 4 + Pinia 2（`pinia-plugin-persistedstate` 持久化）
- UI：Ant Design Vue 4.2.5
- 国际化：vue-i18n 9，语言包 `src/i18n/lang/{zh-CN,en-US}`
- HTTP：axios 1.6，封装于 `src/lib/axios.js`
- 其他：echarts、@antv/x6（流程图）、quill / tinymce（富文本）、video.js / flv.js、ali-oss / cos-js-sdk-v5（对象存储上传）、crypto-js / sm-crypto（加解密）
- Node >= 18，包管理 pnpm

## 常用命令

```bash
pnpm localhost       # 本地环境 (vite --mode localhost)
pnpm dev             # 开发环境 (vite --mode development)
pnpm build:prod      # 生产构建（含 seo:generate 预构建）
pnpm build:dev       # 开发环境构建
pnpm seo:generate    # 生成 SEO 静态页 (node generate-seo-pages.js)
```

代码质量由 husky + lint-staged 在提交时触发：`*.{js,vue}` 走 prettier + eslint，`*.{less,css}` 走 stylelint。无单元测试框架。

## 环境变量

各 `.env.*` 文件控制 `VITE_APP_API_URL`（后端基址）等。开源后真实后端不可用，mock 数据需替代这些接口。关键变量：

- `VITE_APP_API_URL` —— API 基址，axios `baseURL` 来源
- `VITE_APP_PROJECT_TITLE` —— 页面标题

## 目录结构

```
src/
  api/            # 按业务域划分的接口层（每个目录一个 index.js）
    auth/         # 登录、注册、验证码、找回密码、用户信息
    resume/       # 简历 CRUD、教育/项目/技能/工作经历子资源、投递(delivery.js)
    job/          # 企业职位管理 + 公共职位检索/收藏
    application/  # 投递申请（求职者投递、企业收件箱、状态流转、统计）
    company/      # 企业信息、余额、财务流水、套餐、存储、简历浏览/下载记录
    user-center/  # 求职者个人中心：仪表盘、我的职位/简历、充值
    invite/       # 邀请者：收益、提现、邀请码、邀请简历上传
    message/      # 站内信：列表、未读数、已读/删除
    account/      # 账号设置：邮箱/密码/英文名/头像
    base/         # 字典(dictionary)、站点配置(site-config)
    system/       # 广告、公告
    upload/       # 文件上传（封装压缩 + OSS）
  lib/
    axios.js      # axios 实例 + 请求/响应拦截器（见下「请求约定」）
    encrypt.js    # 响应解密（DATA_TYPE_ENUM.ENCRYPT）
  constants/
    api-const.js          # 业务枚举（用户类型、职位/投递/简历状态、性别、套餐等）
    common-const.js       # 通用常量（分页、菜单类型、APPID='resume'、404/403 路径）
    local-storage-key-const.js  # localStorage key（前缀 hwp_）
  store/modules/
    system/user.js   # 登录态、用户信息、未读消息、站点配置（siteConfig）
    system/region.js # 地区
    work/saerch.js   # 职位搜索聚合条件（注意拼写 saerch）
    company/index.js
  router/
    index.js         # 路由守卫：按 userType 鉴权三类中心路由 + 动态菜单构建
    routers.js       # 静态路由（home/404/403）
    router-menus.js  # 菜单树构建
  views/
    home/            # 首页
    work/            # 职位检索（index + 搜索/详情/侧栏/简历选择弹窗组件）
    talent/          # 人才（[id].vue 文件路由详情页）
    login/           # 登录注册
    user-center/     # 求职者中心
    enterprise-center/ # 企业中心
    invite-center/   # 邀请者中心
    40X/             # 403 / 404
  layout/            # 主框架（header / footer / top-menu / announcement）
  i18n/lang/         # zh-CN / en-US
```

## 路径别名

`/@/` → `src/`（见 `vite.config.mjs`）。导入一律用 `import x from '/@/xxx'`。

## 请求约定（`src/lib/axios.js`）

- 实例 `baseURL = VITE_APP_API_URL`，超时 100s。
- 请求拦截：注入静态头 `{ client: 'resume', terminal: 0 }`；有 token 时加 `Authorization: Bearer <token>`（token 取自 localStorage `hwp_user_token`）。
- 响应拦截：
  - 仅处理 `content-type: application/json`，否则原样返回（用于文件流）。
  - `dataType === 10`（ENCRYPT）的响应体经 `decryptData` 解密后 `JSON.parse`。
  - **成功判定**：`code ∈ {0, 200}` 或响应体不含 `code` 字段时，直接 resolve `res.data`（业务代码拿到的是脱壳后的 `data`，不是整个响应体）。
  - `code === 2008`：token 失效，清理本地存储 + cookie 并跳首页。
  - 其余非成功码：`message.error` 弹出 `res.message`。
- 默认导出方法：`get/post/put/patch/delete/request/postDownload/getDownload`。各 api 文件混用 `axios.request({method,url,...})` 与 `axios.get/post(url, params)` 两种写法。

> Mock 时需保证返回结构与「脱壳后的 data」一致——即直接返回业务数据本身，而非 `{code, data, message}` 包裹（因为拦截器已脱壳，但 mock 若走真实拦截器则需带 `code`/`data`）。具体策略见下。

## 通用数据结构

- 分页响应（`RecordsResult<T>`）：`{ size, total, current, pages, records: T[] }`
- 分页请求：`{ current, size, ...filters }`
- 通用响应：`{ message, success }`（部分接口）

## 核心枚举（`src/constants/api-const.js`）

| 枚举 | 取值 |
|---|---|
| `USER_TYPE_ENUM` | 1=求职者 PERSON / 2=招聘者 COMPANY / 3=邀请者 INVITED |
| `JOB_STATUS_ENUM` | 0=已关闭 / 1=招聘中 / 2=暂停招聘 / 4=草稿 |
| `JOB_TYPE_ENUM` | fulltime / parttime / remote(实习) / flexible |
| `APPLICATION_STATUS_ENUM` | 1=待查看 / 2=已查看 / 3=已沟通 / 4=不合适 / 5=已取消 |
| `RESUME_STATUS_ENUM` | 0=禁用 / 1=正常 / 2=待审核 / 3=冻结 / 4=草稿 |
| `RESUME_HIGH_VALUE_ENUM` | 0=普通 / 1=高价值 |
| `GENDER_ENUM` | 0=女 / 1=男（注意 common-const 另有 0=未知/1=男/2=女 版本，按文件区分） |
| `PROFICIENCY_ENUM` | 1=了解 / 2=熟悉 / 3=精通 |
| `PUBLIC_STATUS_ENUM` | 0=隐藏 / 1=公开 |
| `MESSAGE_TYPE_ENUM` | 1=系统通知 / 2=投递通知 / 3=职位推荐 |
| `READ_STATUS_ENUM` | 0=未读 / 1=已读 |
| `FINANCE_TRANSACTION_TYPE_ENUM` | 1=充值 / 2=消费 / 3=邀请奖励 / 4=提现 |
| `PACKAGE_TYPE_ENUM` | 1=查看简历 / 2=职位刷新 / 3=组合套餐 |
| `ORDER_STATUS_ENUM` | 0=待支付 / 1=已支付 / 2=已取消 / 3=已退款 |
| `PAYMENT_METHOD_ENUM` | alipay / wechat |
| `ACCOUNT_TYPE_ENUM` | Wechat / Linkedin / WhatsApp / Line / Facebook / X/Twitter / Discord / other |

## 站点配置（`useUserStore().siteConfig`）

由 `getSiteConfig()`（`/api/admin/system/site-config`）拉取，含 logo/favicon/邀请图、收款地址二维码、提现费率/最低提现额、合作 Telegram/Email、`otherItems`（企业冻结天数、轮播广告数、免费发布职位数）等。Mock 必备项。

## 字典（`getDictionary` → `/api/base/dictionary/items`）

行业、职位分类、薪资区间、招聘人数、工作方式、经验要求、学历、工作地点（三级地区）等下拉选项均来自字典 `itemKey`。职位/简历表单大量依赖，mock 需提供完整字典项。

## 开源 / Mock 工作要点（待办背景）

1. 真实后端开源后不可访问，需要 mock 层让项目可独立启动。
2. Mock 应覆盖：登录/用户信息、字典、站点配置、职位列表/详情、简历 CRUD、投递、消息、企业/求职者/邀请者各中心仪表盘与列表。
3. 注意响应拦截器的「脱壳」逻辑：mock 实现需与 `code ∈ {0,200}` + `data` 包裹结构兼容，或在 axios 层做拦截。
4. 项目内已有 `openapi.json`（28KB）、`result.json`（75KB）可作为接口契约 / 真实数据形态参考来生成 mock。

## 约定与风格

- 组件用 `<script setup>`，Composition API。
- API 文件带详尽 JSDoc（参数、字段、返回类型），新增接口请保持同样注释密度。
- 文案中英双语，新增文案需同步 `zh-CN` 与 `en-US`。
- 提交信息走 commitlint（conventional），如 `feat:` / `fix:` / `refactor:`。
- 注意历史拼写：搜索 store 文件名为 `saerch.js`。
