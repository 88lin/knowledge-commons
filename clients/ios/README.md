# CloudStudy · iOS 端（unsigned IPA 云端构建）

与 Android/Windows/Web **同一份内容源**（根目录 `study.html` + `videos/` + `multiskill/`），
在 GitHub Actions 的 macOS 运行器上编译为免签名 `.ipa`，配合 [Sideloadly](https://sideloadly.io/) /
[AltStore](https://altstore.io/) 用你自己的 Apple ID 侧载安装。

## 构建（云端，推荐）

仓库 → Actions → **build-ios** → Run workflow：

| 输入 | 说明 |
|---|---|
| `upload_release` | 填 Release tag（如 `v3.0`）则构建完成后自动上传到 Releases |

产物：`zhishi-gongshe-v3.0-ios-full-unsigned.ipa`（artifact 或 Release 附件）。

## 本机侧载（iOS 设备）

1. 电脑安装 Sideloadly，iPhone 用数据线连接（或 Wi-Fi 配对）
2. 把 `.ipa` 拖进 Sideloadly，填自己的 Apple ID → Start
3. 手机「设置 → 通用 → VPN与设备管理」信任证书
4. 免费 Apple ID 签名 7 天有效，到期用 Sideloadly 一键刷新（AltStore 可自动续签）

## 本机构建（macOS）

```sh
sh clients/ios/stage.sh               # 铺入完整版资源（视频+图解+模拟训练）
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

## 在电脑上签名（Windows / Linux / macOS，zsign）

三种路线，按你手上有什么选：

### A. 没有开发者账号 —— 免费 Apple ID（7 天）

用上面「本机侧载」：Sideloadly / AltStore 拖入 unsigned IPA 即可，无需 p12。

### B. 有开发者证书（.p12 + 描述文件）—— 电脑本机一键签

Windows（PowerShell，自动下载官方 zsign Windows 版）：

```powershell
cd clients\ios
.\sign.ps1 -Ipa .\zhishi-gongshe-v3.0-ios-full-unsigned.ipa `
           -P12 .\cert.p12 -P12Pass '你的p12密码' -Prov .\app.mobileprovision
# 可选：-BundleId com.your.app   # 描述文件 Bundle ID 不是 com.cloudstudy.app 时改写
# 可选：-Out .\my-signed.ipa
```

macOS / Linux 直接用 zsign 官方二进制：

```sh
zsign -k cert.p12 -p '密码' -m app.mobileprovision -o signed.ipa unsigned.ipa
```

- 描述文件需覆盖 `com.cloudstudy.app`（或用 `-b` 改写 IPA 的 Bundle ID 迎合你的证书）
- 产物用 Sideloadly / 爱思 / AltStore 安装；设备需信任对应证书
- 证书来源：Apple Developer（99 美元/年，1 年有效）、企业证书、或合规的签名服务

### C. 云端全自动 —— Actions 出已签名 IPA

仓库 Secrets 配好三项后，Actions → **sign-ios** → Run workflow：

| Secret | 内容 |
|---|---|
| `IOS_P12_B64` | `cert.p12` 的 base64：`[Convert]::ToBase64String([IO.File]::ReadAllBytes('cert.p12'))` |
| `IOS_P12_PASS` | p12 密码 |
| `IOS_MP_B64` | `app.mobileprovision` 的 base64（同上命令） |

构建 + 签名 + 上传一气呵成，产物 `zhishi-gongshe-v3.0-ios-full-signed.ipa`；工作流结束后自动删除日志中的证书临时文件。

### D. 签名之后怎么让「别人拿到链接就能装」（OTA 直装）

`sign-ios` 在 `upload_release` 非空时会**自动生成 `manifest.plist`（苹果 OTA 安装清单）并随同一个 Release 一起上传**，指向该 Release 里的已签名 IPA。配合站内直装页：

1. 跑完 sign-ios（带 tag，如 `v3.1`）→ Release 里同时有 `*-signed.ipa` 和 `manifest.plist`
2. 把 **https://taimabenji.github.io/knowledge-commons/install.html** 发给任何人
3. 对方用 iPhone 的 Safari 打开 → 点「安装」→ 「设置 → 通用 → VPN与设备管理」信任证书 → 完成

直装页自动探测最新 Release 是否含 manifest：没有则显示「尚未发布」并回退到 Sideloadly 路线。

> **谁能装，取决于证书类型**（详见直装页矩阵）：
> - **企业证书**（Apple Enterprise，$299/年）：任何人可装，但苹果条款限定「仅限本公司员工内部分发」，外发有吊销风险
> - **Ad Hoc**（$99/年）：最多 100 台注册 UDID 的设备，小圈子内测
> - **TestFlight / App Store**：合法面向公众，需你自己的开发者账号与审核
> - **第三方超级签**：把服务商给的 p12 接入 sign-ios 亦可，掉签风险自担
>
> 证书只进仓库 Secrets / 本机 zsign，全程不经过第三方服务器。
