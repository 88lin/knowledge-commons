# clients/macos —— macOS 便携 App

与 Windows EXE / Linux 同构的单文件方案：WKWebView 加载包内
`study.html`，完全离线可用；关闭窗口即退出。

- 产物：`CloudStudy.app` 打包为 zip（**arm64 + x86_64 通用二进制**，Apple Silicon / Intel 通吃）
- 本地 ad-hoc 签名（`codesign -s -`），本机可直接运行
- 最低系统：macOS 12

## 构建（需 macOS）

```sh
sh clients/macos/build.sh study.html dist/CloudStudy-macos.zip
```

或云端：Actions → **build-macos**（macos-latest 运行器，产物自动传 Release）。

## 首次打开（Gatekeeper 提示）

从网上下载的 zip 解压后首次打开，macOS 可能提示「无法验证开发者」：

1. 右键（按住 Control 点按）`CloudStudy.app` → 「打开」→ 再点「打开」；或
2. 系统设置 → 隐私与安全性 → 底部「仍要打开」。

## 说明

- 视频/图解走仓库 `videos/` + `multiskill/` 目录或站内在线源，与 EXE 版策略一致
- 内嵌内容与 Web / APK / iOS 完全同源（同一份 `study.html`）
- 如需正式公证（notarization），把开发者证书与 `NOTARY_*` secrets 配到仓库后即可扩展 CI
