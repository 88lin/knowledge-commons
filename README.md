# 知识公社 · Knowledge Commons

> **让每一个人都能免费学习。**
> 竞赛真题 · 升学考试 · 公务员 · 红色经典 · 世界技能大赛 —— 完全离线、完全开源。

不设门槛，不论基础：只要想学，这里全都有。

把散落各处的公开学习资源收集、分类、编好「从零到精通」的路线，装进同一个 App / 网站里——让"不知道去哪学、从哪开始"的人，打开就能学。

**立即使用**

- 网页版（无需安装）：https://taimabenji.github.io/knowledge-commons/learn/
  　· 手机/电脑浏览器打开后，可直接「添加到主屏幕 / 安装」——独立图标、全屏、离线可用，等于一个 App（PWA），且版本永远最新
- 资料中心（全技能库 · 单文件）：https://taimabenji.github.io/knowledge-commons/study.html
- 全平台下载页：https://taimabenji.github.io/knowledge-commons/download.html
  　· Android APK / iOS IPA（含电脑签名三路线）/ Windows EXE / macOS App / Linux 单文件 / Web 六端矩阵
- 下载安装包：[Releases](../../releases) —— 六端产物统一发布

![知识公社首页](docs/screenshots/home.png)

## 内容总览

| 板块 | 内容 |
|---|---|
| 课程（原创编写） | 算法竞赛 13 讲 · Python 入门 8 讲 · 行测入门 6 讲 —— 从零开始，学完能上手 |
| 竞赛真题 | Codeforces 11425 题 + AtCoder 9600 题（离线可搜索）；ICPC 世界总决赛题解 158 份；CCPC 题面；蓝桥杯题解 168 份；天梯赛解析 28 份 |
| 升学考试 | 高考数学真卷 ×4（内置阅读器）；辽宁专升本备考助手 |
| 公务员考试 | 图形推理真题库 354 题逐题解析；国考 / 省考资料导航 |
| 红色经典 | 《毛泽东选集》第 1–5 卷全文 229 篇 + 毛泽东诗词 90 首，全部离线可读 |
| 世界技能大赛 | 六大领域 50 个赛项：**总纲（读）· 总纲课视频（看）· 模拟训练（练）三件套站内直达**；另含 62 集视频课与真题资料库 |
| 学习路线 | 算法竞赛 / 公务员 / 专升本 / 高考：四份「从零到精通」分阶段路线图 |
| 资源总库 | 全网免费学习资源 399 条精选（八大板块）：世赛官方标准与真题直链、模拟器与靶场、算法 Wiki 与开源书、升学真题官方渠道、公考题库、马列古籍全文、MOOC 与 IT 工具、职业考证与语言——分类可搜，直连 / 离线性逐条标注 |
| 总目 · 全站检索 | 站内全库一页直达；离线全站索引（课程 / 篇目 / 资料一搜即中） |

![世赛专区](docs/screenshots/skills.png)

## 特性

- **完全离线**：全部内容无需联网（Android 全量包约 560 MB）
- **加到桌面即装即用**：网页版为完整 PWA —— 浏览器打开即可安装到主屏幕/桌面，独立图标、离线可用、随源更新，四个系统一个体验
- **站内直达**：从首页到任一赛项、任一篇目、任一真题，全部站内一跳可达，不跳第三方
- **六端同源**：Android / iOS / Windows / macOS / Linux / Web 由同一内容源构建，GitHub Actions 一键出包
- **iOS 签名一条龙**：免签名 IPA（Sideloadly/AltStore 免费 Apple ID 侧载）＋ 电脑本机 zsign 签名脚本（Windows `sign.ps1`）＋ 云端 `sign-ios` 工作流（配证书 Secrets 自动出已签名 IPA）
- **全量质检**：每轮发布前对全部视频逐部解码体检（当前 112 部视频 0 错误）、页面逐项实测
- **开源共建**：内容与构建流程全部开源，欢迎补充与修正

## 目录结构

```
├── learn/          # 知识公社门户（课程/竞赛/升学/公考/红色/世赛/路线/总目/检索）
├── study.html      # 资料中心：全技能库 + 视频课 + 真题库（单文件应用）
├── download.html   # 全平台下载页（六端矩阵 + iOS 签名指南）
├── multiskill/     # 世界技能大赛 50 赛项学习包（总纲 / 视频 / 模拟训练 / 图解）
├── videos/         # 62 集视频课与图解
├── docs/ exam/     # 课程文档与真题资料
├── clients/        # 六端客户端工程（android / ios / windows / macos / linux）
├── tools/          # 构建工具与质检脚本（资源名修复 / 视频体检 等）
└── .github/        # GitHub Actions 工作流（android / ios / sign-ios / windows / macos / linux / 视频）
```

## 构建与质检

- **云端**：GitHub Actions —— `build-android` / `build-ios` / `sign-ios` / `build-windows` / `build-macos` / `build-linux`（workflow_dispatch，可指定上传到 Release；`sign-ios` 需配置 `IOS_P12_B64` / `IOS_P12_PASS` / `IOS_MP_B64` 三个 Secrets）
- **本地**：`clients/android/build_ci.sh` 在装有 Android SDK 的环境可直接构建；`clients/windows` 与 `clients/linux` 需 zig；`clients/macos` 与 `clients/ios` 需 macOS + Xcode；Windows 本机签 IPA：`clients/ios/sign.ps1`（zsign）
- **质检**：`tools/qc/full_media_probe.py <目录>` 对全部视频逐部解码体检（0 错误为通过）
- **资源名说明**：部分 Android WebView 无法访问含非 ASCII 字符的资源路径，构建流程中的 `tools/android_namefix.py` 会把中文资源名转义为 `_uXXXX` 并同步改写引用（详见脚本注释）

## 数据来源与致谢

题库索引来自 Codeforces 公开 API 与 kenkoooo AtCoder Problems；
题解 / 笔记 / 真题来自公众分享的开源仓库（ACMFinalsSolutions、LanQiaoCode_Python、tianti_learning_notes、maoxuan-wiki 等）；
官方资源直达国家中小学智慧教育平台、国家数字图书馆、中国政府网等。

各资料的版权归其原始作者与机构所有。本项目仅做**收集、分类与离线化**，供个人学习交流使用，请勿用于商业用途。

## 参与共建

- 发现内容错误、想补充资料、或想参与开发 —— 欢迎开 Issue / PR
- 想加入的内容（新的科目、省份真题、赛事资料）都可以提出，收集到就会加进来

## 最近更新

- **2026-10-04**：资源总库扩至 **399 条**（新增 65 条，全网检索 + 逐条在线核验、与存量零重复），新增第八大板块「**职业考证·语言**」（教资 / 会计·CPA / 法考 / 医考护考 / 软考 / 四六级考研英语 / 雅思托福 / JLPT 等 23 条官方渠道）；世赛、算法、升学、公考、红色古籍、开放课程、IT 工具七组各增补 5–8 条（中国大百科全书网络版、故宫名画记、硅基流动、公考雷达等）
- **2026-10-03（二）**：全平台拉满——新增 macOS App（通用二进制）与 Linux 单文件（musl 静态）构建工作流，六端矩阵齐发；新增站内「全平台下载页」download.html（含 iOS 签名三条路线指南）；iOS 电脑签名落地：Windows 一键脚本 `clients/ios/sign.ps1`（自动下载 zsign）+ 云端 `sign-ios` 签名工作流（p12/描述文件 Secrets）
- **2026-10-03**：新增「资源总库」（library.html）——七大板块 334 条全网免费学习资源精选（世赛官方赛项页 / WSOS 标准 / 技术描述 PDF 直链、国赛规程赛卷、模拟器与漏洞靶场、算法竞赛 Wiki / 免费教材 / 开源模板库、升学与公考官方真题渠道、马列与古籍全文库、MOOC / 电子书 / IT 文档与工具），全部人工检索核验，标注免费程度、可离线性与直连性；已接入门户导航、总目、世赛专区与 PWA 预缓存
- **2026-09-28**：新增「世赛」专区（50 赛项三件套站内直达）、「总目」与全站检索；原创课程上线；全量视频解码质检与修复（112 部 0 错误）

## 理念

知识并不稀缺，稀缺的是「知道去哪找、从哪开始」。
我们希望把信息差一个个消掉，让知识回归它本来的位置——**属于每一个人**。

> 无产者在这个革命中失去的只是锁链。他们获得的将是整个世界。
> **全世界无产者，联合起来！**
