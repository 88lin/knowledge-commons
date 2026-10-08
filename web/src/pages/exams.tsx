/* 知识公社 · 升学考试 —— React 版（由旧页面迁移） */
import { createRoot } from 'react-dom/client'
import '../theme.css'
import { Layout } from '../components/Layout'
import { SearchBar } from '../components/SearchBar'

function Page() {
  return (
    <Layout
active="升学"
      kicker="EXAMS · FROM ZERO"
      title="升学考试"
      lines={["高考真题 · 专升本备考 · 中小学课程资源 —— 不花一分钱，一样能学"]}
    >
      <section>
          <h2 className="sec">高考 · 历年真题卷（本地收录）</h2>
          <div className="card">
            <p className="small">已收录近年数学真题卷（PDF 原卷，点击即可在应用内打开阅读）：</p>
            <ul className="list">
              <li><span className="t"><a href="pdfview.html?f=files/gaokao/2025全国一卷.pdf">2025 · 全国一卷 · 数学</a></span><span className="n">PDF</span></li>
              <li><span className="t"><a href="pdfview.html?f=files/gaokao/2025全国二卷.pdf">2025 · 全国二卷 · 数学</a></span><span className="n">PDF</span></li>
              <li><span className="t"><a href="pdfview.html?f=files/gaokao/2025北京数学.pdf">2025 · 北京卷 · 数学</a></span><span className="n">PDF</span></li>
              <li><span className="t"><a href="pdfview.html?f=files/gaokao/2026全国一卷数学_4.pdf">2026 · 全国一卷 · 数学</a></span><span className="n">PDF</span></li>
            </ul>
            <p className="small">更多科目/年份持续补充中。你也可以在<b>学习路线 → 高考</b>页找到完整的复习安排。</p>
          </div>
        </section>
      
        <section>
          <h2 className="sec">专升本 · 备考助手（本地收录 · 可离线）</h2>
          <div className="card">
            <ul className="list">
              <li><span className="t"><a href="files/zsb/index.html">辽宁专升本（计算机组）备考助手</a><br /><span className="small">77 条考点精讲 · 316 道练习题 · 英语单词本（含每日打卡与自测解析）</span></span><span className="n">本地</span></li>
              <li><span className="t"><a href="https://www.gaokao.cn/zhuanshengben">各省专升本政策与报名入口汇总</a> <span className="small">（软科/掌上高考）</span></span><span className="n">导航</span></li>
            </ul>
            <p className="small">专升本各省政策差异大：先查清「你所在省份的考试科目 + 参考教材」，再按「学习路线 → 专升本」的节奏推进即可。</p>
          </div>
        </section>
      
        <section>
          <h2 className="sec">中小学 · 国家官方免费课堂</h2>
          <div className="card">
            <p>如果是从零（甚至是给孩子）开始学，最权威的路径是教育部官方的<b>国家中小学智慧教育平台</b>——小学到高中全部主要学科的名师课程，全部免费：</p>
            <a className="btn red" href="https://basic.smartedu.cn/">打开国家中小学智慧教育平台</a>
            <a className="btn ghost" href="https://basic.smartedu.cn/syncClassroom">同步课堂（按教材章节）</a>
            <p className="small">建议：每科先看「同步课程」跟课本走一遍，再用「精品课」加深，最后用「作业」板块自测。</p>
          </div>
        </section>
      
        <section>
          <h2 className="sec">大学 · 公开课与自学</h2>
          <div className="card">
            <a className="btn" href="https://www.icourse163.org/">中国大学MOOC（数千门课）</a>
            <a className="btn" href="https://www.xuetangx.com/">学堂在线</a>
            <a className="btn ghost" href="https://www.nlc.cn/">国家数字图书馆（免费阅读）</a>
          </div>
        </section>
      
        
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
