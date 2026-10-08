# React + Vite + Tailwind 改造说明

> 本次改造把门户层（learn/ 20 页 + 根级 7 页）迁移到 `web/` 下的 React + Vite + TypeScript + Tailwind CSS 4 工程，**所有 URL 与旧版完全一致**，外链、SEO、PWA 缓存路径零破坏。

## 一、改了什么

| 层 | 旧 | 新 |
|---|---|---|
| 门户 27 页 | 手写 HTML + kc-learn.js DOM 增强 | `web/src/pages/*.tsx` React 组件 |
| 样式 | learn/style.css v4 | `web/src/theme.css`（Tailwind 4 `@theme` token + 旧类名兼容层，书院风 v5 像素级复刻） |
| 学习引擎 | kc-learn.js | `src/course-enhance.ts` + `src/learn-engine.tsx`（localStorage 键完全兼容，老用户进度无损） |
| 题库/数据 | 页面内联 script | `src/data/*.ts`（quiz 128 题 / 日历 / 学堂 16 课）+ 大数据仍走静态 JS 懒加载 |
| PWA | sw.js 手写清单 | 构建插件自动注入带 hash 产物清单（`@@ASSETS@@` 占位符） |
| study.html / pdfview | 单文件应用 | 保持原样直通部署（无需 React 化） |

**页面迁移清单**（其余纯静态页由转换工具自动平移）：

- 课程×4：学习引擎接入（完成按钮/进度条/小测/下一讲 FAB/深链）—— 顺手修了旧版「下一册」跳转选择器 `aref*=` 笔误（从未生效）
- quiz：128 题状态机（抽题→判分→解析→最高分存本机→深链 `#05`）
- calendar：12 月日历 + ★收藏（localStorage）
- search：1896 条索引懒加载
- contest：CF 9400+ / AtCoder 题库懒加载 + 分页搜索
- beginner：16 节课数据驱动 + 展开交互
- library：787 条资源总库（分组/子类/全文检索/深链 `#g=N`）
- install：iOS 直装 Release 状态机
- resources：B 站精选（分组/搜索/播放量格式化）
- download：全平台下载页

## 二、目录结构

```
web/
├── index.html / library.html / download.html / install.html / resources.html   # 根级入口（薄壳）
├── learn/*.html                 # learn/ 下 20 个入口（薄壳，URL 与旧版一致）
├── vite.config.ts               # 多入口 + 静态直通 + SW 清单注入
├── src/
│   ├── theme.css                # Tailwind 4 主题（书院风 v5 + 旧类名兼容）
│   ├── components/Layout.tsx    # Topbar / Hero / Tabs / Footer
│   ├── components/SearchBar.tsx
│   ├── course-enhance.ts        # 课程页学习增强（DOM 增强式）
│   ├── learn-engine.tsx         # 学习引擎组件（QuizBox / ResumeCard 等）
│   ├── hooks/useLocalState.ts   # localStorage state
│   ├── data/                    # quiz / calendar / beginner 数据
│   └── pages/                   # 27 个页面组件
└── tools-html2jsx.mjs 等        # 迁移工具（可复用于新页面）
```

## 三、如何使用

```bash
cd web
npm install      # 首次
npm run dev      # 本地开发 http://localhost:5173
npm run build    # 产出 web/dist/
```

## 四、部署（GitHub Actions）

已添加 `.github/workflows/deploy-web.yml`：
1. push 到 main 自动构建
2. 仓库根静态资产原样部署（videos 等大文件不重复拷贝）
3. dist 覆盖 React 页面 + sw.js（含自动生成的预缓存清单）

**需要一次性设置**：GitHub 仓库 → Settings → Pages → Source 选 **GitHub Actions**。

> 旧的 deploy 方式（如直接 push docs/ 或其他 workflow）请停用，避免互相覆盖。

## 五、验证记录（2026-10-09）

- `vite build` 27 页全部通过，共享 chunk gzip ≈ 47KB
- 无头浏览器实测：首页/课程/quiz/calendar/search/contest/library 全部渲染正常、交互可用、控制台零报错
- 实测数据：library 787 条、search 1896 条索引、course-algo 完成按钮写入 localStorage 且进度条同步
- VLM 截图审查三张关键页：排版/数据/交互全部 OK

## 六、后续建议

- tools/build_liquid.py 生成的 study.html 维持现状；如需 React 化可复用 study-data/ 的 chunk 机制
- 新增页面优先在 web/src/pages/ 新建 + 入口 HTML 薄壳，旧转换工具不再需要
