# Resume PC

**English** | [中文](#中文)

A frontend for an overseas-focused job / recruitment platform (Vue 3 + Vite + Ant Design Vue).

This repository is an open-source demo: it ships with a built-in frontend mock data layer and **runs standalone without any backend**. All companies, candidates, and contact details in the mock data are fictional.

## Tech Stack

- Vue 3 with `<script setup>`
- Vite 5
- Ant Design Vue 4
- Pinia (state management)
- Vue Router 4
- Vue I18n (Chinese / English)
- Axios

## Quick Start

```bash
# Install dependencies (pnpm recommended)
pnpm install

# Start the demo (mock data is on by default, no backend needed)
pnpm dev
```

Then open `http://localhost:8082`.

## Mock Data

In demo mode every request is intercepted by the frontend mock layer (`src/mock/`) and served from bundled static data:

- Toggle: env variable `VITE_APP_USE_MOCK`, defaults to `true` in dev / localhost / production modes
- Data files: `src/mock/data/*.json`
- Interception point: `src/lib/axios.js` short-circuits before the real request is sent
- Coverage: job list / detail / hot / recommended, resume list / detail, dictionaries, site config, announcements, ads

To disable mock (connect a real backend): set `VITE_APP_USE_MOCK` to `false` in the relevant env file and configure `VITE_APP_API_URL`.

## Build

```bash
pnpm build:dev    # development build
pnpm build:prod   # production build
```

## Project Structure

```
src/
├── api/          # API definitions grouped by business domain
├── components/   # shared / business components
├── constants/    # enums and constants
├── i18n/         # internationalization
├── lib/          # axios, crypto and other base libs
├── mock/         # frontend mock data layer (for the open-source demo)
├── router/       # routing
├── store/        # Pinia
├── utils/        # utilities
└── views/        # pages
```

See [CLAUDE.md](./CLAUDE.md) for more architecture notes.

## License

[MIT](./LICENSE)

---

<a name="中文"></a>

# Resume PC（中文）

[English](#resume-pc) | **中文**

一个面向海外招聘场景的求职 / 招聘平台前端（Vue 3 + Vite + Ant Design Vue）。

本仓库为开源 Demo 版本：内置前端 Mock 数据层，**无需后端即可独立运行**，其中的公司、求职者、联系方式等均为虚拟数据。

## 技术栈

- Vue 3 + `<script setup>`
- Vite 5
- Ant Design Vue 4
- Pinia（状态管理）
- Vue Router 4
- Vue I18n（中 / 英）
- Axios

## 快速开始

```bash
# 安装依赖（推荐 pnpm）
pnpm install

# 启动 Demo（默认开启 Mock 数据，无需后端）
pnpm dev
```

启动后访问 `http://localhost:8082`。

## Mock 数据

Demo 模式下所有请求由前端 Mock 层（`src/mock/`）拦截，返回内置的静态数据：

- 开关：环境变量 `VITE_APP_USE_MOCK`，dev / localhost / production 模式默认为 `true`
- 数据文件：`src/mock/data/*.json`
- 拦截位置：`src/lib/axios.js` 在真实请求发起前短路
- 覆盖范围：职位列表 / 详情 / 热门 / 推荐、简历列表 / 详情、字典、站点配置、公告、广告

关闭 Mock（接入真实后端）：将对应 env 文件中的 `VITE_APP_USE_MOCK` 设为 `false`，并配置 `VITE_APP_API_URL`。

## 构建

```bash
pnpm build:dev    # 开发环境构建
pnpm build:prod   # 生产环境构建
```

## 目录结构

```
src/
├── api/          # 按业务域划分的接口定义
├── components/   # 通用 / 业务组件
├── constants/    # 枚举与常量
├── i18n/         # 国际化
├── lib/          # axios、加密等基础库
├── mock/         # 前端 Mock 数据层（开源 Demo 用）
├── router/       # 路由
├── store/        # Pinia
├── utils/        # 工具方法
└── views/        # 页面
```

更多架构说明见 [CLAUDE.md](./CLAUDE.md)。

## License

[MIT](./LICENSE)
