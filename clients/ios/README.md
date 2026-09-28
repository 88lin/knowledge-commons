# CloudStudy · iOS 端（unsigned IPA 云端构建）

与 Android/Windows/Web **同一份内容源**（根目录 `study.html` + `videos/` + `multiskill/`），
在 GitHub Actions 的 macOS 运行器上编译为免签名 `.ipa`，配合 [Sideloadly](https://sideloadly.io/) /
[AltStore](https://altstore.io/) 用你自己的 Apple ID 侧载安装。

## 构建（云端，推荐）

仓库 → Actions → **build-ios** → Run workflow：

| 输入 | 说明 |
|---|---|
| `variant` | `lite`（仅文档，约 15MB）/ `full`（含全部视频，约 500MB） |
| `upload_release` | 填 Release tag（如 `v3.0`）则构建完成后自动上传到 Releases |

产物：`CloudStudy-v3.0-ios-unsigned.ipa`（artifact 或 Release 附件）。

## 本机侧载（iOS 设备）

1. 电脑安装 Sideloadly，iPhone 用数据线连接（或 Wi-Fi 配对）
2. 把 `.ipa` 拖进 Sideloadly，填自己的 Apple ID → Start
3. 手机「设置 → 通用 → VPN与设备管理」信任证书
4. 免费 Apple ID 签名 7 天有效，到期用 Sideloadly 一键刷新（AltStore 可自动续签）

## 本机构建（macOS）

```sh
sh clients/ios/stage.sh full         # 或 lite
brew install xcodegen
cd clients/ios && xcodegen generate
xcodebuild -project CloudStudy.xcodeproj -scheme CloudStudy \
  -configuration Release -sdk iphoneos -derivedDataPath build \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO build
mkdir -p ipa/Payload && cp -R build/Build/Products/Release-iphoneos/CloudStudy.app ipa/Payload/
python3 pack_ipa.py ipa CloudStudy.ipa    # 中文文件名带 UTF-8 标志，侧载工具兼容
```

## 说明

- 免签名 IPA 无法直接安装，必须经 Sideloadly/AltStore 等工具用个人证书重签（Apple 限制）。
- App 内视频为本地相对路径播放（`videos/…`、`multiskill/…`），与 Web/APK 完全同构。
- 外部链接（如有）自动跳系统浏览器；其余全部离线。
