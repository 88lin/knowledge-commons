/* 知识公社 · 零基础学堂 —— React 版（16 节课 · 数据驱动 + 展开交互） */
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import '../theme.css'
import './beginner.css'
import { Layout } from '../components/Layout'
import { LESSONS, type BegL } from '../data/beginnerLessons'

function LessonBlock({ L }: { L: BegL }) {
  const [open, setOpen] = useState(false)
  return (
    <section className={['lesson', open ? 'open' : ''].join(' ')}>
      <div className="lesson-hd" onClick={() => setOpen(!open)}>
        <span className="no">{L.n}</span>
        <span>
          <b>{L.t}</b>
          <br />
          <span className="tag">{L.g}</span>
        </span>
        <span className="arr">▶ 展开 · 视频 + 图文讲义</span>
      </div>
      {open && (
        <div className="lesson-bd">
          <div className="vwrap">
            <video controls preload="none" src={`../videos/beginner/epb${L.n}.mp4`} />
          </div>
          <ul className="klist">
            {L.pts.map(([k, v], i) => (
              <li key={i}><b>{k}：</b>{v}</li>
            ))}
          </ul>
          <div className="lkbar">
            <a href={L.u}>直达板块 →</a>
            <a href={`quiz.html#${L.n}`}>测一测 →</a>
            <a href={`../videos/beginner/epb${L.n}.mp4`}>本集视频（新窗口播放）</a>
            <a href="archive.html">总目</a>
          </div>
        </div>
      )}
    </section>
  )
}

function Lessons() {
  const base = LESSONS.filter((l) => l.sec !== 'adv')
  const adv = LESSONS.filter((l) => l.sec === 'adv')
  const render = (list: BegL[]) =>
    list.map((L) => <LessonBlock key={L.n} L={L} />)
  return (
    <>
      <h2 className="sec">基础篇 · 开篇导览与九大板块第一课</h2>
      {render(base)}
      {adv.length > 0 && <h2 className="sec">进阶篇 · 从会到会考</h2>}
      {render(adv)}
    </>
  )
}

function Page() {
  return (
    <Layout
      active="学堂"
      kicker="START HERE · 零基础"
      title="零基础学堂"
      lines={['九大板块，每个板块一节「第一课」+ 三节进阶课：视频 + 图文讲义 + 今天就能做的一件事。', '不设门槛，不论基础——看完这一课，你就已经不是零基础了。']}
      badges={['16 节视频课（导览 1 + 基础 9 + 进阶 6）', '每课一个动手作业', '全部免费离线']}
    >
      <div className="card" style={{ marginBottom: '14px' }}>
        <b>学完一课？去 <a href="quiz.html">学堂自测</a> 用 5 道题检验一下（即时判分 + 解析，成绩存本机）。</b>
      </div>
      <div className="goal">
        不知道从哪开始，就从这个页面开始。每一课回答同一个套路的三件事：<b>这是什么</b>、<b>今天第一步做什么</b>、<b>学完去哪</b>。视频由本站 video-factory 流水线从分镜脚本自动生成，图文讲义随课附上。
      </div>
      <div id="lessons">
        <Lessons />
      </div>

      <section>
        <h2 className="sec">毕业去向 · 任选一个板块深入</h2>
        <div className="grid">
          <a className="mod" href="skills.html"><div className="ico">技</div><b>世界技能大赛</b><div className="desc">六大领域 50 赛项三件套：总纲（读）· 视频（看）· 模拟训练（练）。</div><div className="meta">50 赛项 · 全离线</div></a>
          <a className="mod green" href="courses.html"><div className="ico">课</div><b>原创课程</b><div className="desc">算法 13 讲 · Python 8 讲 · 行测 6 讲，从零讲到能上手。</div><div className="meta">27 讲 · 配套题库</div></a>
          <a className="mod gold" href="../library.html"><div className="ico">库</div><b>资源总库</b><div className="desc">九大板块 580 条全网免费资源，分类可搜，直连与离线性逐条标注。</div><div className="meta">持续补充</div></a>
        </div>
      </section>
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
