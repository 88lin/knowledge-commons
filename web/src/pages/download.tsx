/* 知识公社 · 全平台下载页 —— React 版（由旧页面迁移） */
import { createRoot } from 'react-dom/client'
import './download.css'

function Page() {
  return (
    <>
    
    <div className="topbar"><div className="topbar-in">
      <div className="emblem">知</div>
      <div><div className="site-name">全平台下载 · 一个内容源，六个平台</div><div style={{ fontSize: "12px", opacity: ".85", marginTop: "2px" }}>Android APK · iOS IPA · Windows EXE · macOS · Linux · Web（PWA）</div></div>
      <div className="spacer"></div>
      <button className="btn" onClick={() => { location.href = 'learn/index.html' }}>返回门户</button>
      <button className="btn" onClick={() => { location.href = 'https://github.com/88lin/knowledge-commons' }}>GitHub 仓库</button>
    </div></div>
    
    <div className="main">
      <div className="hero">
        <h1>知识公社 · 全端安装包</h1>
        <p>同一份内容源（<b>study.html + 视频 + 全技能库</b>）构建六个平台的客户端：<b>Android APK</b>、<b>iOS IPA</b>、<b>Windows EXE</b>、<b>macOS App</b>、<b>Linux 可执行文件</b>、<b>Web / PWA</b>。
        桌面便携版双击即用（免安装），移动端完整版全量离线，网页版「添加到主屏幕」等于常青 App——版本永远最新。</p>
        <div className="badges"><span>完全离线</span><span>完全开源</span><span>同源构建</span><span>六端同发</span><span>持续集成</span></div>
      </div>
    
      <div className="panel">
        <div className="p-hd"><h2>① 网页版 · 零安装（推荐先用这个）</h2></div>
        <div className="grid">
          <div className="card">
            <h3>在线学习 <span className="plat">Web / PWA</span></h3>
            <p>浏览器直接打开，全站离线缓存；「添加到主屏幕 / 安装」后获得独立图标与全屏体验，四端一个体验，随源更新。</p>
            <div className="links">
              <a className="lbtn solid" href="learn/">进入知识公社</a>
              <a className="lbtn" href="study.html">资料中心 · 全技能库</a>
            </div>
          </div>
          <div className="card">
            <h3>资源总库 <span className="plat">Web</span></h3>
            <p>全网免费学习资源精选（399 条 · 八大门类）：世赛官方标准、算法 Wiki、升学真题、公考题库、古籍全文、MOOC、IT 工具与职业考证——分类可搜，直连/离线逐条标注。</p>
            <div className="links"><a className="lbtn" href="library.html">打开资源总库</a></div>
          </div>
        </div>
      </div>
    
      <div className="panel">
        <div className="p-hd"><h2>② 客户端安装包 · Releases 下载</h2></div>
        <div className="grid">
          <div className="card">
            <h3>Android <span className="plat">APK · 全量离线</span></h3>
            <p>完整版 APK（视频全量打包），安装即用、断网可学。设置里允许「安装未知来源」即可安装。</p>
            <div className="links">
              <a className="lbtn solid" href="https://github.com/88lin/knowledge-commons/releases">下载 APK</a>
              <a className="lbtn" href="https://github.com/88lin/knowledge-commons/actions/workflows/build-android.yml">CI 出包</a>
            </div>
          </div>
          <div className="card">
            <h3>Windows <span className="plat">EXE · 单文件</span></h3>
            <p>绿色单文件，双击即用、无需安装：释放学习中心到临时目录并调起默认浏览器，便携无痕。</p>
            <div className="links">
              <a className="lbtn solid" href="https://github.com/88lin/knowledge-commons/releases">下载 EXE</a>
              <a className="lbtn" href="https://github.com/88lin/knowledge-commons/actions/workflows/build-windows.yml">CI 出包</a>
            </div>
          </div>
          <div className="card">
            <h3>macOS <span className="plat">App · Apple Silicon + Intel</span></h3>
            <p>便携 <code>.app</code>（通用二进制），WKWebView 离线渲染；首次打开如提示「无法验证开发者」，右键 → 打开即可。</p>
            <div className="links">
              <a className="lbtn solid" href="https://github.com/88lin/knowledge-commons/releases">下载 macOS 版</a>
              <a className="lbtn" href="https://github.com/88lin/knowledge-commons/actions/workflows/build-macos.yml">CI 出包</a>
            </div>
          </div>
          <div className="card">
            <h3>Linux <span className="plat">ELF · musl 静态</span></h3>
            <p>单个可执行文件，任意发行版（Ubuntu / Arch / openSUSE / Alpine…）双击或终端运行，零依赖。</p>
            <div className="links">
              <a className="lbtn solid" href="https://github.com/88lin/knowledge-commons/releases">下载 Linux 版</a>
              <a className="lbtn" href="https://github.com/88lin/knowledge-commons/actions/workflows/build-linux.yml">CI 出包</a>
            </div>
          </div>
          <div className="card" id="ios">
            <h3>iOS <span className="plat">IPA · 直装 / 免签名 / 已签名</span></h3>
            <p>完整版 IPA（视频全量）。签名发布后可走<b>iPhone 直装页</b>（免电脑、点链接即装）；免签名版用 Sideloadly / AltStore 配自己的 Apple ID 侧载（7 天免费）。</p>
            <div className="links">
              <a className="lbtn solid" href="install.html">iPhone 一键直装</a>
              <a className="lbtn green" href="https://github.com/88lin/knowledge-commons/actions/workflows/sign-ios.yml">CI 出包（已签名）</a>
              <a className="lbtn" href="https://github.com/88lin/knowledge-commons/releases">下载 IPA</a>
              <a className="lbtn" href="https://github.com/88lin/knowledge-commons/actions/workflows/build-ios.yml">CI 出包（免签）</a>
            </div>
          </div>
          <div className="card">
            <h3>全部源码与历史版本 <span className="plat">GitHub</span></h3>
            <p>所有产物的最终下载点都在 Releases；每个平台的构建脚本与工作流全部开源，可自行复现。</p>
            <div className="links">
              <a className="lbtn" href="https://github.com/88lin/knowledge-commons/releases">Releases 总入口</a>
              <a className="lbtn" href="https://github.com/88lin/knowledge-commons/actions">Actions 全部工作流</a>
            </div>
          </div>
        </div>
      </div>
    
      <div className="panel">
        <div className="p-hd"><h2>③ iOS 签名 · 在电脑上搞定（三条路线）</h2></div>
        <table className="sign">
          <tr><th>路线</th><th>你有什么</th><th>怎么做</th><th>有效期</th></tr>
          <tr>
            <td><b>A · 免费 Apple ID</b></td>
            <td>只有 Apple ID（0 元）</td>
            <td>电脑装 Sideloadly → 拖入 <b>unsigned IPA</b> → 填 Apple ID → Start；手机「设置→通用→VPN与设备管理」信任证书</td>
            <td>7 天（AltStore 可自动续签）</td>
          </tr>
          <tr>
            <td><b>B · 电脑本机签名</b></td>
            <td>开发者证书 <code>.p12</code> + 描述文件 <code>.mobileprovision</code></td>
            <td>Windows 一键脚本（自动下载 zsign）：<span style={{ color: "#6b7280" }}>见下方命令行</span>；macOS/Linux 用 zsign 官方二进制同参数</td>
            <td>按证书（个人开发者 1 年 / 企业 1 年）</td>
          </tr>
          <tr>
            <td><b>C · 云端全自动</b></td>
            <td>仓库 Secrets 配好证书三项</td>
            <td>Actions → <b>sign-ios</b> → Run workflow：构建 + 签名 + 自动发布 OTA 安装清单（manifest.plist），产物 <code>*-signed.ipa</code>；配合 <a style={{ color: "#1a4d8f" }} href="install.html">直装页</a>，对方用 iPhone Safari 打开即可免电脑安装</td>
            <td>按证书</td>
          </tr>
        </table>
        <div className="cmd">cd clients\ios
    .\sign.ps1 -Ipa .\zhishi-gongshe-v3.0-ios-full-unsigned.ipa -P12 .\cert.p12 -P12Pass 'p12密码' -Prov .\app.mobileprovision</div>
        <p className="note">
          证书从哪来：Apple Developer Program（99 美元/年）在 developer.apple.com 创建 App ID（<code>com.cloudstudy.app</code> 或用 <code>-BundleId</code> 改写）、生成描述文件并导出 p12；
          企业证书或合规签名服务同理。zsign 是开源跨平台签名工具（<a style={{ color: "#1a4d8f" }} href="https://github.com/zhlynn/zsign" target="_blank" rel="noopener">zhlynn/zsign</a>），全程本地执行，证书不外传。
          完整文档见仓库 <a style={{ color: "#1a4d8f" }} href="https://github.com/88lin/knowledge-commons/blob/main/clients/ios/README.md" target="_blank" rel="noopener">clients/ios/README.md</a>。
        </p>
      </div>
    
      <div className="panel">
        <div className="p-hd"><h2>④ 从源码自己出包</h2></div>
        <p className="note" style={{ paddingTop: "12px" }}>
          仓库 → Actions → 选对应工作流 → Run workflow（<code>upload_release</code> 填 tag 即自动传 Releases）：
          <b>build-android</b> / <b>build-ios</b> / <b>sign-ios</b> / <b>build-windows</b> / <b>build-macos</b> / <b>build-linux</b>。
          本地出包脚本见 <a style={{ color: "#1a4d8f" }} href="https://github.com/88lin/knowledge-commons/tree/main/clients" target="_blank" rel="noopener">clients/ 目录</a>（Windows/Linux 需 zig，macOS/iOS 需 Xcode，Android 需 SDK）。
        </p>
      </div>
    </div>
    
    <footer><div className="foot-in">知识公社 · 知识共享 —— 我为人人，人人为我<br />
    六端同源 · 完全开源（MIT License）· 版权归各资料原始作者与机构所有<br />
    <a style={{ color: "#d7deea" }} href="https://github.com/88lin/knowledge-commons" target="_blank" rel="noopener">GitHub 仓库</a></div></footer>
    
    </>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
