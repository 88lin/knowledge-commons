/* 知识公社 · 根首页（门户跳转） —— React 版 */
import { createRoot } from 'react-dom/client'
import '../theme.css'
import { Topbar, Hero, Footer } from '../components/Layout'

function Page() {
  return (
    <>
      <Topbar />
      <Hero
        kicker="KNOWLEDGE COMMONS"
        title="知识公社"
        lines={[
          '竞赛真题 · 升学考试 · 公务员 · 红色经典 · 世界技能大赛 · 电商创业 · 资源总库',
          '从零到精通，点开就能学；不设门槛，不论基础。',
        ]}
        motto={'「读书是学习，使用也是学习，而且是更重要的学习。」'}
        badges={['完全离线', '完全开源', '站内直达', '六端同源']}
      />
      <div className="wrap">
        <div className="actionbar">
          <a className="actbtn" href="learn/index.html">进入知识公社</a>
          <a className="actbtn" href="learn/beginner.html">零基础学堂 · 15 节视频课</a>
          <a className="actbtn ghost" href="study.html">资料中心 · 全技能库</a>
        </div>
        <h2 className="sec">站内直达</h2>
        <div className="card"><ul className="list">
          <li><span className="t"><a href="learn/skills.html">世界技能大赛 · 六大领域 50 赛项（总纲 / 视频 / 训练）</a></span><span className="n">赛</span></li>
          <li><span className="t"><a href="learn/contest.html">算法竞赛 · ICPC / CCPC / 蓝桥 / 天梯 / Codeforces / AtCoder</a></span><span className="n">竞</span></li>
          <li><span className="t"><a href="learn/exams.html">升学考试 · 高考 / 专升本 / 考研真题与备考工具</a></span><span className="n">升</span></li>
          <li><span className="t"><a href="learn/gongkao.html">公务员 · 行测申论真题与题库</a></span><span className="n">公</span></li>
          <li><span className="t"><a href="learn/red.html">红色经典 · 毛选五卷 · 毛泽东诗词</a></span><span className="n">红</span></li>
          <li><span className="t"><a href="learn/courses.html">原创课程 · 算法竞赛 / Python / 公考行测</a></span><span className="n">课</span></li>
          <li><span className="t"><a href="learn/archive.html">总目 · 站内全库一页直达</a></span><span className="n">总</span></li>
          <li><span className="t"><a href="learn/search.html">全站检索 · 课程 / 篇目 / 资料一搜即中</a></span><span className="n">检</span></li>
          <li><span className="t"><a href="learn/beginner.html">零基础学堂 · 九大板块第一课（视频课）</a></span><span className="n">学</span></li>
          <li><span className="t"><a href="learn/ecommerce.html">电商创业 · 实战中心 · 2026 实价手册与 90 天作战地图</a></span><span className="n">创</span></li>
          <li><span className="t"><a href="library.html">资源总库 · 全网免费学习资源精选（787 条）</a></span><span className="n">库</span></li>
          <li><span className="t"><a href="download.html">全平台下载 · APK / IPA / EXE / macOS / Linux / Web</a></span><span className="n">下</span></li>
        </ul></div>
        <Footer>
          开源于 <a href="https://github.com/88lin/knowledge-commons">github.com/88lin/knowledge-commons</a>
          {'\u3000·\u3000'}MIT License{'\u3000·\u3000'}知识公社 · 知识共享
        </Footer>
      </div>
    </>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
