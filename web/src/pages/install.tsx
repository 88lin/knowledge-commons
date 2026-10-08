/* 知识公社 · iOS 直装页 —— React 版（Release 签名状态检查 + 一键安装） */
import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import './install.css'

const REPO = '88lin/knowledge-commons'
const FALLBACK_MAN = `https://github.com/${REPO}/releases/latest/download/manifest.plist`

type State =
  | { k: 'checking' }
  | { k: 'ready'; tag: string; manifest: string; ipa?: string; ipaSize?: number }
  | { k: 'none' }
  | { k: 'unknown' }

function Page() {
  const [st, setSt] = useState<State>({ k: 'checking' })

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rel: any) => {
        const assets = rel.assets || []
        const hit = assets.find((a: any) => a.name === 'manifest.plist')
        if (!hit) return setSt({ k: 'none' })
        const ipa = assets.find((a: any) => /signed\.ipa$/.test(a.name))
        setSt({
          k: 'ready',
          tag: rel.tag_name,
          manifest: `https://github.com/${REPO}/releases/download/${rel.tag_name}/manifest.plist`,
          ipa: ipa?.name,
          ipaSize: ipa?.size,
        })
      })
      .catch(() => setSt({ k: 'unknown' }))
  }, [])

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const itms = (url: string) => 'itms-services://?action=download-manifest&url=' + encodeURIComponent(url)

  return (
    <>
      <div className="topbar"><div className="topbar-in">
        <div className="emblem">知</div>
        <div><div className="site-name">iPhone 直装 · OTA 一键安装</div><div style={{ fontSize: 12, opacity: '.85', marginTop: 2 }}>签名发布后 · 点一下就能装到 iPhone / iPad</div></div>
        <div className="spacer"></div>
      </div></div>

      <div className="main">
        <div className="hero">
          <h1>知识公社 · iOS 直装</h1>
          <p>本页读取 GitHub Releases 上<b>最新已签名 IPA</b> 的安装清单（manifest.plist），
          在 iPhone 的 Safari 中打开即可<b>免数据线、免电脑</b>安装。<br />
          全流程由 <code>sign-ios</code> 工作流自动完成：构建 → 签名 → 发布安装清单 → 本页立即可用。</p>
        </div>

        {!isIOS && (
          <div id="iosBanner">⚠️ 当前不是 iPhone / iPad。请用手机 Safari 打开本页才能一键安装；电脑上可先复制本页链接发到手机。</div>
        )}

        <div className="panel">
          <div className="p-hd"><h2>① 一键安装</h2></div>
          <div className="p-bd">
            {st.k === 'checking' && (
              <div className="status st-unknown"><span className="dot"></span><span>正在检查发布状态…</span></div>
            )}
            {st.k === 'ready' && (
              <>
                <div className="status st-ready"><span className="dot"></span><span><b>已发布已签名版本</b>（Release: {st.tag}）—— 下面直接装：</span></div>
                <a className="install-btn live" href={itms(st.manifest)}>安装 · 知识公社</a>
                <div className="install-meta">
                  {st.ipa ? `IPA: ${st.ipa}（${Math.round((st.ipaSize || 0) / 1048576)} MB） · ` : ''}manifest: {st.manifest}
                </div>
              </>
            )}
            {st.k === 'none' && (
              <>
                <div className="status st-none"><span className="dot"></span><span><b>最新 Release 还没有已签名 IPA</b>——尚未配置证书 Secrets 或还没跑过 sign-ios。现在可走「备用路线」侧载；配好后本页自动点亮。</span></div>
                <a className="install-btn dead" href={FALLBACK_MAN} onClick={(e) => e.preventDefault()}>暂无签名版 · 点击无效，请走备用路线</a>
                <div className="install-meta">manifest: {FALLBACK_MAN}（404）</div>
              </>
            )}
            {st.k === 'unknown' && (
              <>
                <div className="status st-unknown"><span className="dot"></span><span>发布状态未知（网络或 API 限流）。可直接尝试安装按钮；若提示无法安装，说明签名版尚未发布。</span></div>
                <a className="install-btn live" href={itms(FALLBACK_MAN)}>尝试安装（可能尚未发布）</a>
                <div className="install-meta">manifest: {FALLBACK_MAN}</div>
              </>
            )}
            {st.k !== 'none' && (
              <div className="warn">
                <b>首次安装后必须信任证书</b>：设置 → 通用 → VPN与设备管理 → 找到对应开发者/企业证书 → 「信任」。
                不信任会提示「无法验证 App」。证书掉签后重新打开本页安装最新版即可。
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="p-hd"><h2>② 检查清单（装不上时按此排查）</h2></div>
          <div className="p-bd">
            <ol className="steps">
              <li>确认用的是 <b>iPhone / iPad 上的 Safari</b>（微信里打开会失败）。</li>
              <li>确认最新 Release 里有 <code>*-signed.ipa</code> 和 <code>manifest.plist</code>（本页状态会显示；没有 = 还没签名发布）。</li>
              <li>提示「无法连接到 itms-services」→ 多半是清单尚未发布或网络问题，稍后重试。</li>
              <li>安装后提示无法打开 → 到「设置 → 通用 → VPN与设备管理」<b>信任证书</b>。</li>
              <li>证书失效（打开闪退/提示损坏）→ 回到本页重新安装最新签名版。</li>
              <li>以上都不行 → 用免直装的老办法：电脑 + Sideloadly / AltStore 侧载（见下载页）。</li>
            </ol>
          </div>
        </div>

        <div className="panel">
          <div className="p-hd"><h2>③ 「任何人都能安装」有哪几条路（实话版）</h2></div>
          <table className="mat">
            <tr><th>路线</th><th>谁能装</th><th>成本 / 门槛</th><th>稳定性</th><th>本项目支持</th></tr>
            <tr>
              <td><b>App Store 上架</b></td>
              <td><span className="ok">真正的任何人</span></td>
              <td>苹果开发者账号 $99/年 + 审核（内容/隐私/版权全套合规）</td>
              <td><span className="ok">最稳</span></td>
              <td>需你自己的账号提交，本仓库可提供源码与构建产物</td>
            </tr>
            <tr>
              <td><b>TestFlight 外测</b></td>
              <td><span className="ok">近似任何人</span>（1 万名额，需安装 TestFlight + 邀请链接）</td>
              <td>$99/年 + Beta 审核</td>
              <td><span className="ok">稳</span></td>
              <td>需你的开发者账号操作 App Store Connect</td>
            </tr>
            <tr>
              <td><b>企业证书 OTA 直装</b></td>
              <td><span className="ok">任何人</span>（装完信任证书即可）</td>
              <td>Apple Enterprise Program $299/年，<b>仅限本公司员工内部分发</b>；外发违反苹果条款，证书可能被吊销</td>
              <td><span className="mid">条款风险</span></td>
              <td>✅ <b>本页 + sign-ios 就是为它准备的</b>：配好企业证书 Secrets 即全自动发布直装链接</td>
            </tr>
            <tr>
              <td><b>Ad Hoc 签名</b></td>
              <td><span className="no">不是任何人</span>（最多 100 台注册 UDID 的设备）</td>
              <td>$99/年 + 逐台登记设备 UDID</td>
              <td><span className="ok">稳</span></td>
              <td>✅ 同上，sign-ios 支持；适合小圈子内测</td>
            </tr>
            <tr>
              <td><b>第三方超级签 / TF签</b></td>
              <td><span className="ok">任何人</span>（按台/按次付费给服务商）</td>
              <td>付费给签名服务商；证书来源灰色、<b>随时可能掉签</b>，谨防跑路与隐私风险</td>
              <td><span className="mid">易掉签</span></td>
              <td>把服务商用 p12 给你的方式接入 sign-ios 亦可；风险自担</td>
            </tr>
            <tr>
              <td><b>免费 Apple ID（Sideloadly / AltStore / SideStore）</b></td>
              <td><span className="mid">每人自己签</span>（7 天，SideStore 可手机端自续；AltServer 同 Wi-Fi 自动续 ≈ 无限）</td>
              <td>0 元</td>
              <td><span className="mid">7 天续签</span></td>
              <td>✅ 免签名 IPA 长期提供（build-ios），下载页有保姆教程</td>
            </tr>
            <tr>
              <td><b>TrollStore（特定 iOS 版本）</b></td>
              <td><span className="mid">装过 TrollStore 的设备</span>永久直装</td>
              <td>依赖设备系统版本漏洞</td>
              <td><span className="mid">看版本</span></td>
              <td>直接用本页的 signed IPA 即可</td>
            </tr>
          </table>
          <p className="note">
            结论：想要<b>合法且稳定地「发链接给任何人装」</b>，正规路只有 App Store / TestFlight；
            想要<b>不审核直接 OTA</b>，就得用企业证书（苹果条款限定内部分发）或 Ad Hoc（限 100 台）。
            本仓库把「签名 → 发布清单 → 一键直装」整条流水线做好了，证书类型由你决定；
            <b>证书不外传</b>——p12 只进你的仓库 Secrets，全程在 GitHub 与本机 zsign 处理。
          </p>
        </div>

        <div className="panel">
          <div className="p-hd"><h2>④ 不想花钱？免费路线（0 元）照样能用</h2></div>
          <div className="p-bd">
            <ol className="steps" style={{ marginBottom: 12 }}>
              <li><b>Sideloadly / AltStore + 免费 Apple ID</b>：电脑拖入免签名 IPA，7 天一签；开着 AltServer 同 Wi-Fi 会<b>自动续签</b>，等于无限用。</li>
              <li><b>SideStore</b>：开源免电脑方案，手机上自己续签（iOS 14–16），初次配置稍繁琐。</li>
              <li><b>TrollStore（巨魔）</b>：兼容机型（约 iOS 14.0–16.6.1 部分设备）装一次<b>永久有效</b>——免费直装的唯一形态。</li>
              <li>⚠️ 网上流传的「免费共享企业证书」几天就会被苹果吊销，还可能随时失效，<b>不要当主力</b>。</li>
            </ol>
            <div className="links">
            </div>
          </div>
        </div>
      </div>

      <footer><div className="foot-in">OTA 直装依赖 itms-services（苹果官方分发机制）· 证书与描述文件版权归其持有者<br />
      </div></footer>
    </>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
