/* 知识公社 · 课程总览 —— React 版（由旧页面迁移） */
import { createRoot } from 'react-dom/client'
import '../theme.css'
import { Layout } from '../components/Layout'
import { SearchBar } from '../components/SearchBar'
import { ResumeCard } from '../learn-engine'

function Page() {
  return (
    <Layout
active="课程"
      kicker="COURSES · OPEN &amp; READY"
      title="课程总览"
      lines={["每一讲都可以直接在本页学习：讲解 + 代码 + 例题 + 练习指引。", "不用再去别处找资料 —— 打开、往下读、跟着做，就是完整的学习闭环。"]}
    >
      <div className="card" style={{ marginBottom: "14px" }}><b>先上零基础学堂：</b>九大板块各一节第一课 + 进阶篇，共 15 节视频课——<a href="beginner.html">进入学堂 →</a></div><div className="card"><ResumeCard /></div>
        <section>
          <h2 className="sec">现在就能开始的课程</h2>
          <div className="card">
            <p style={{ marginTop: "0" }}><b>目录</b></p>
            <ul className="list">
              <li><span className="t"><a href="course-algo.html">一、 算法竞赛 · 从零到精通（13 讲）</a><br />
                <span className="small">第 1–7 讲在同页；第 8–13 讲发布中，已开放的是完整第一季（复杂度 / 数组 / 排序二分 / 前缀和 / 栈队列 / 递归 DFS / BFS / 贪心 / DP / 图论 / 并查集 MST / 刷题路线）。</span></span><span className="n">进行中</span></li>
              <li><span className="t"><a href="course-algo2.html">├ 第 8–13 讲 分册</a> <span className="small">（BFS · 贪心 · DP · 图论 · 并查集 · 路线图）</span></span><span className="n">进行中</span></li>
              <li><span className="t"><a href="course-python.html">二、 Python 极速入门（8 讲）</a><br />
                <span className="small">从装环境到能提交第一道在线判题，8 天走完。</span></span><span className="n">完整</span></li>
              <li><span className="t"><a href="course-gongkao.html">三、 公考行测 · 入门六讲</a><br />
                <span className="small">得分地图 / 资料分析 / 图形推理 / 逻辑判断 / 言语理解 / 捡分策略。</span></span><span className="n">完整</span></li>
            </ul>
          </div>
        </section>
      
        <section>
          <h2 className="sec">配套的"练"与"考"</h2>
          <div className="card">
            <p>学完就练，练完就测——本站内已备好：</p>
            <ul className="list">
              <li><span className="t"><a href="contest.html">在线题库索引（CF 11425 题 + AtCoder 9600 题）</a><br /><span className="small">离线可搜索，做完去对应平台提交。</span></span><span className="n">练</span></li>
              <li><span className="t"><a href="files/tuxing/index.html">图形推理题库（354 题 · 含限时挑战）</a></span><span className="n">练</span></li>
              <li><span className="t"><a href="exams.html">高考真题卷（PDF 直接阅读）</a></span><span className="n">考</span></li>
              <li><span className="t"><a href="../study.html">资料中心：全技能库 · 50 赛项模拟训练（十题交互评分）</a></span><span className="n">练</span></li>
            </ul>
          </div>
        </section>
      
        <section>
          <h2 className="sec">更新计划（持续添加）</h2>
          <div className="card">
            <ul className="list">
              <li>算法竞赛：第二季（数据结构进阶 / 数论 / 字符串 / 高级 DP）</li>
              <li>公考：申论六讲（归纳概括 → 大作文）</li>
              <li>升学：高考数学专题精讲、专升本各科强化</li>
              <li>红色经典导读：毛选名篇精读计划</li>
            </ul>
          </div>
        </section>
      
        
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
