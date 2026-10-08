/* 知识公社 · 平台简章 —— React 版（由旧页面迁移） */
import { createRoot } from 'react-dom/client'
import '../theme.css'
import { Layout } from '../components/Layout'
import { SearchBar } from '../components/SearchBar'

function Page() {
  return (
    <Layout
active="简章"
      kicker="ABOUT · WHY"
      title="平台简章"
      lines={["一个把公开学习资源收拢到一处、免费开放的个人项目。"]}
    >
      <section>
          <h2 className="sec">名字的来处</h2>
          <div className="card">
            <p><b>知识公社 · Knowledge Commons</b></p>
            <p>「知识公地」（Knowledge Commons）是当代世界知识共享运动的名字——从开源软件到维基百科，
            从公开课程到开放科学，无数人正在把"知识归公、人人可用"从理想做成日常。</p>
            <p>「公社」则承自巴黎公社以来的共产主义传统：一群人不为私利，把东西拿出来共用，共同做事、共同所有。</p>
            <p>两个字放在一起，说的是同一件事：<b>知识应当是人类共同的财产</b>。</p>
          </div>
        </section>
      
        <section>
          <h2 className="sec">做什么</h2>
          <div className="card">
            <ul className="list">
              <li><span className="t"><b>收拢</b><br /><span className="small">把散落各处的公开资源（真题、课程、经典文献、试题索引）收集、分类、离线化，装进一个软件里。</span></span></li>
              <li><span className="t"><b>写成次第</b><br /><span className="small">每一条路线都写成"从零到精通"的分阶段计划，配上一讲一讲直接能学的课程，而不是丢给你一个链接。</span></span></li>
              <li><span className="t"><b>全部开源</b><br /><span className="small">代码公开、内容公开、流程公开。任何人都可以复制、修改、传播——也可以参与共建。</span></span></li>
            </ul>
          </div>
        </section>
      
        <section>
          <h2 className="sec">里面有什么</h2>
          <div className="card">
            <ul className="list">
              <li><span className="t">课程：算法竞赛十三讲、Python 八讲、公考行测六讲（持续添加）</span></li>
              <li><span className="t">竞赛：Codeforces 11425 题 · AtCoder 9600 题离线索引、ICPC/CCPC/蓝桥/天梯题解资料</span></li>
              <li><span className="t">升学：高考真题卷、专升本备考助手、国家智慧教育平台直达</span></li>
              <li><span className="t">公考：图形推理 354 题题库、国考省考真题大库导航</span></li>
              <li><span className="t">红色经典：《毛泽东选集》1–5 卷全文 229 篇、诗词 90 首</span></li>
              <li><span className="t">职业技能：世界技能大赛 50 赛项学习包、62 集视频课、模拟训练</span></li>
              <li><span className="t">资源总库：全网免费学习资源 580 条精选（九大板块，含职业考证与数字人文视听），分类可搜、逐条标注直连与离线性</span></li>
            </ul>
          </div>
        </section>
      
        <section>
          <h2 className="sec">为什么开源</h2>
          <div className="card">
            <p>开源不是招牌，是做法：代码公开、内容公开、流程公开，任何人可以复制、修改、传播。</p>
            <p>信息差不是靠口号消掉的，是靠把它摆到阳光底下。我们把东西都摆出来——谁需要，谁拿走，
            谁觉得缺了什么，谁就补上。</p>
            <p className="small">仓库：<a href="https://github.com/88lin/knowledge-commons">GitHub · 88lin/knowledge-commons</a>（许可见仓库内 LICENSE）</p>
          </div>
        </section>
      
        <section>
          <h2 className="sec">这些话，记在这里</h2>
          <div className="card">
            <div className="quote">每个人的自由发展，是一切人自由发展的条件。<span className="src">—— 马克思、恩格斯《共产党宣言》</span></div>
            <div className="quote">你要知道梨子的滋味，你就得变革梨子，亲口吃一吃。<span className="src">—— 毛泽东《实践论》</span></div>
            <div className="quote">读书是学习，使用也是学习，而且是更重要的学习。<span className="src">—— 毛泽东《中国革命战争的战略问题》</span></div>
            <div className="quote">世上无难事，只要肯登攀。<span className="src">—— 毛泽东《水调歌头 · 重上井冈山》</span></div>
            <div className="quote">没有调查，没有发言权。<span className="src">—— 毛泽东《反对本本主义》</span></div>
          </div>
        </section>
      
        <section>
          <h2 className="sec">最近更新</h2>
          <div className="card"><ul className="list">
            <li><span className="t">零基础学堂：九大板块第一课 + 进阶篇，共 15 节视频课（分镜脚本开源，可一键重渲）</span><span className="n">学</span></li>
            <li><span className="t">资源总库：580 条全网免费学习资源（九大板块），全库链接体检通过</span><span className="n">库</span></li>
            <li><span className="t">全站检索：1700+ 条索引（含 B站精选 713 条），课程 / 篇目 / 资源一搜即中</span><span className="n">检</span></li>
            <li><span className="t">世赛专区：50 赛项三件套 + 真题资料库；健康·法律·公民服务官方平台 12 条</span><span className="n">新</span></li>
            <li><span className="t">完整更新日志见 GitHub 仓库 README</span><span className="n">志</span></li>
          </ul></div>
        </section>
      
        
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
