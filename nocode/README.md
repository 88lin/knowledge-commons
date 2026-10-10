# NoCode 版（小程序版）—— knowledge-commons 裁剪迁移

> 上游唯一源：kc-pr/（GitHub: 88lin/knowledge-commons）。
> 本目录是**快照**，上游更新后重跑 `node tools/nocode-build.mjs` 再生成，绝不在平台 IDE 里直接改代码。

## 与上游的差异（自动转换 + 手工层）

| 项 | 上游 web/ | nocode/ |
|---|---|---|
| 语言 | TypeScript | JavaScript（esbuild 剥类型） |
| 路由 | 27 个多入口 HTML | React Router 6 HashRouter 单页 |
| Tailwind | v4（@theme） | 纯编译 CSS（视觉全靠 kc-* 自定义类，不依赖 TW） |
| 视频 | 打包在 dist（1.1G） | B 站内嵌 iframe（`src/videos.js` 配置 BV 号），兜底外链原站 |
| 大静态目录 | study-data/multiskill/red/files/exam… | 外链 `STATIC`（src/site.js 可配） |
| PWA/sw.js/install-tip | 有 | 砍掉（平台域名下无意义） |
| 保留数据 | app/library-data.js(171K)、learn/searchidx.js(431K) | 拷入 public/，容器无压力 |

## 重新生成流程

1. 上游改动合入 kc-pr 后：`node tools/nocode-build.mjs`
2. `cd nocode && npm run build` 本地验证
3. 给 BV 号：编辑 `src/videos.js`（epb1 → BVxxx 清单即可，脚本注释里说明格式）
4. 把 nocode/ 源码整体粘进 NoCode 平台 IDE（或按平台要求分文件粘贴）

## 平台脚手架要求（朋友确认的三件事）

- IDE 能粘贴多文件/整个 src
- 静态文件上传限额 ≥ 1MB（library-data.js 171K、searchidx.js 431K）
- 发布域名国内直连情况（决定 STATIC 用原站还是也镜像）
