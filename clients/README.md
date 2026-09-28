# clients/ —— CloudStudy 多端统一工程

**一个内容源，四端同构发布。** 所有平台共用根目录的 `study.html`（单文件学习中心）
与内容资产（`videos/`、`multiskill/`），由 GitHub Actions 云端流水线构建。

| 端 | 产物 | 构建方式 | 工作流 |
|---|---|---|---|
| Android | `CloudStudy-v3.0-android-lite.apk`（仅文档）/ `-full.apk`（全视频离线） | ubuntu + aapt2/d8/apksigner（仓库自带模板） | `.github/workflows/build-android.yml` |
| iOS | `CloudStudy-v3.0-ios-<variant>-unsigned.ipa`（免签名，Sideloadly/AltStore 侧载） | macOS + XcodeGen + xcodebuild | `.github/workflows/build-ios.yml` |
| Windows | `CloudStudy-v3.0-windows-x64.exe`（单文件，双击即用） | ubuntu + zig 交叉编译 | `.github/workflows/build-windows.yml` |
| Web | `study.html`（单文件）/ GitHub Pages 门户 | 直接分发 / Pages 托管 | — |

## 内容基线

- 单文件学习中心：根目录 `study.html`（由 `tools/build_liquid.py` 从全站文档生成，3159 篇）
- 视频：`videos/`（62 集：机房 15 + 教程 18 + 进阶 29）+ `multiskill/<领域>/<赛项>/总纲课.mp4`（50 集）
- 模拟训练：`multiskill/<领域>/<赛项>/模拟训练.html`（50 个，十题交互评分）
- 引用全部为**相对路径**（`videos/…`、`multiskill/…`），在 Web / APK assets / iOS bundle / 桌面目录下均直接可用

## 云端出包（推荐）

GitHub → Actions → 选 `build-android` / `build-ios` / `build-windows` → Run workflow：
- `variant`：`lite`（15MB 级，仅文档+模拟训练）/ `full`（全视频离线）
- `upload_release`：填 `v3.0` 等 tag → 构建完成自动上传到 Releases

## 本地出包

```sh
# Windows EXE（需 zig）：sh clients/windows/build.sh study.html dist/CloudStudy.exe
# iOS（需 macOS）：见 clients/ios/README.md
# Android（需 Android SDK）：见 clients/android/README.md
```

> 历史设备端构建脚本仍在 `tools/rebuild_apk.sh` / `tools/rebuild_full.sh`（存档参考）。
