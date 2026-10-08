/* 知识公社 · 公务员考试 —— React 版（由旧页面迁移） */
import { createRoot } from 'react-dom/client'
import '../theme.css'
import { Layout } from '../components/Layout'
import { SearchBar } from '../components/SearchBar'

function Page() {
  return (
    <Layout
active="公考"
      kicker="CIVIL SERVICE EXAM"
      title="公务员考试"
      lines={["行测 · 申论 · 面试 —— 真题、题库、路线，全部整理好了"]}
    >
      <section>
          <h2 className="sec"> 图形推理真题库（本地收录 · 354 题逐题解析）</h2>
          <div className="card">
            <p>行测判断推理中最拉分、也最适合刷题突破的模块。本机内置完整题库：<b>354 道真题</b>，
            含解题思路、技巧点拨、题图标注、限时挑战（2018–2024 国考 / 聂佳刷题组 / 立体拼合等）。</p>
            <a className="btn red" href="files/tuxing/index.html">开始刷图形推理（354 题）</a>
            <p className="small">建议节奏：每天 20 题，先做后看解析；一周后进入限时模式。</p>
          </div>
        </section>
      
        <section>
          <h2 className="sec"> 真题大库 · 在线仓库导航</h2>
          <div className="card">
            <p className="small">网上有志愿者整理了近十年的国考/省考真题（免费开源）。以下为精选大库（需要联网打开）：</p>
            <ul className="list">
              <li><span className="t"><a href="https://github.com/ERRRC/xingcezhenti">2016–2026 国考 + 省考 · 全部行测真题（ERRRC/xingcezhenti）</a></span><span className="n">GitHub</span></li>
              <li><span className="t"><a href="https://github.com/ERRRC/kaogongzhentizhengliu">2016–2026 真题按考点重组 · 深度标注笔记（ERRRC）</a></span><span className="n">GitHub</span></li>
              <li><span className="t"><a href="https://github.com/Yaoyuan-Zhang319/AdministrativeAptitudeTest">近二十年公务员行测真题与答案（含国考/省考/选调）</a></span><span className="n">GitHub</span></li>
              <li><span className="t"><a href="https://github.com/linfukai186-arch/gongkao-tiku">公考刷题库：国考、省考、事业编历年真题</a></span><span className="n">GitHub</span></li>
            </ul>
            <p className="small">在 GitHub 页面点绿色「Code → Download ZIP」即可下载全部真题。</p>
          </div>
        </section>
      
        <section>
          <h2 className="sec"> 备考路线（从零开始）</h2>
          <div className="card">
            <div className="pill"><b>第 0 步 · 认清考试</b><br />国考：10 月报名、11–12 月笔试（行测 + 申论）。省考：多数省份次年 2–3 月笔试。<br />
            先做一套近年真题（不限时），知道自己离分数线差多少。</div>
            <div className="pill"><b>第 1 步 · 行测打地基（1–2 个月）</b><br />
            五大模块投入产出比排序：<b>资料分析 &gt; 判断推理 &gt; 言语理解 &gt; 数量关系 &gt; 常识</b>。<br />
            资料分析先练「速算 + 找数」；判断推理主攻图形推理（本页题库）与逻辑判断；常识放在碎片时间。</div>
            <div className="pill"><b>第 2 步 · 申论方法论（1 个月）</b><br />归纳概括 → 综合分析 → 提出对策 → 应用文写作 → 大作文。每天精读 1 篇范文，抄 1 段金句。<br />
            核心心法：<b>答案都在材料里</b>，学会「找点、分类、缩写」。</div>
            <div className="pill"><b>第 3 步 · 套题实战（1–2 个月）</b><br />上午行测、下午申论，全真模拟；建立错题本，只记录「为什么错、下次怎么识别」。</div>
            <div className="pill"><b>第 4 步 · 冲刺</b><br />复盘错题 + 保持手感；考前一周不刷新题，只过错题与常识积累。</div>
            <p className="small">更详细的版本见「学习路线」页。</p>
          </div>
        </section>
      
        <section>
          <h2 className="sec">官方与工具</h2>
          <div className="card">
            <a className="btn" href="http://www.scs.gov.cn/">国家公务员局（报名/公告）</a>
            <a className="btn ghost" href="https://www.offcn.com/">中公教育（资料）</a>
            <a className="btn ghost" href="https://www.huatu.com/">华图教育（资料）</a>
          </div>
        </section>
      
        
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
