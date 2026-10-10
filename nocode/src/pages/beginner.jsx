import { useState } from "react";
import { Layout } from "../components/Layout";
import { BiliVideo, biliLink } from "../components/BiliVideo";
import { nav } from "../nav";
import { LESSONS } from "../data/beginnerLessons";
function LessonBlock({ L }) {
  const [open, setOpen] = useState(false);
  return <section className={["lesson", open ? "open" : ""].join(" ")}><div className="lesson-hd" onClick={() => setOpen(!open)}><span className="no">{L.n}</span><span><b>{L.t}</b><br /><span className="tag">{L.g}</span></span><span className="arr">{open ? "\u25BC \u6536\u8D77 \xB7 \u89C6\u9891 + \u56FE\u6587\u8BB2\u4E49" : "\u25B6 \u5C55\u5F00 \xB7 \u89C6\u9891 + \u56FE\u6587\u8BB2\u4E49"}</span></div>{open && <div className="lesson-bd"><div className="vwrap"><BiliVideo n={L.n} /></div><ul className="klist">{L.pts.map(([k, v], i) => <li key={i}><b>{k}：</b>{v}</li>)}</ul><div className="lkbar"><a href={nav(L.u)}>直达板块 →</a><a href={`#/learn/quiz#${L.n}`}>测一测 →</a><a href={biliLink(L.n)}>在 B 站打开本集</a><a href="#/learn/archive">总目</a></div></div>}</section>;
}
function Lessons() {
  const base = LESSONS.filter((l) => l.sec !== "adv");
  const adv = LESSONS.filter((l) => l.sec === "adv");
  const render = (list) => list.map((L) => <LessonBlock key={L.n} L={L} />);
  return <><h2 className="sec">基础篇 · 开篇导览与九大板块第一课</h2>{render(base)}{adv.length > 0 && <h2 className="sec">进阶篇 · 从会到会考</h2>}{render(adv)}</>;
}
function Page() {
  return <Layout
    active="学堂"
    kicker="START HERE · 零基础"
    title="零基础学堂"
    lines={["\u4E5D\u5927\u677F\u5757\uFF0C\u6BCF\u4E2A\u677F\u5757\u4E00\u8282\u300C\u7B2C\u4E00\u8BFE\u300D+ \u4E09\u8282\u8FDB\u9636\u8BFE\uFF1A\u89C6\u9891 + \u56FE\u6587\u8BB2\u4E49 + \u4ECA\u5929\u5C31\u80FD\u505A\u7684\u4E00\u4EF6\u4E8B\u3002", "\u4E0D\u8BBE\u95E8\u69DB\uFF0C\u4E0D\u8BBA\u57FA\u7840\u2014\u2014\u770B\u5B8C\u8FD9\u4E00\u8BFE\uFF0C\u4F60\u5C31\u5DF2\u7ECF\u4E0D\u662F\u96F6\u57FA\u7840\u4E86\u3002"]}
    badges={["16 \u8282\u8BFE\uFF08\u5BFC\u89C8 1 + \u57FA\u7840 9 + \u8FDB\u9636 6\uFF09", "\u6BCF\u8BFE\u4E00\u4E2A\u52A8\u624B\u4F5C\u4E1A", "\u5168\u90E8\u514D\u8D39\u79BB\u7EBF"]}
  ><div className="card" style={{ marginBottom: "14px" }}><b>学完一课？去 <a href="#/learn/quiz">学堂自测</a> 用 5 道题检验一下（即时判分 + 解析，成绩存本机）。</b></div><div className="goal">
        不知道从哪开始，就从这个页面开始。每一课回答同一个套路的三件事：<b>这是什么</b>、<b>今天第一步做什么</b>、<b>学完去哪</b>。视频已托管至哔哩哔哩（新窗口播放，高清不卡顿），图文讲义随课附上。
      </div><div id="lessons"><Lessons /></div><section><h2 className="sec">毕业去向 · 任选一个板块深入</h2><div className="grid"><a className="mod" href="#/learn/skills"><div className="ico">技</div><b>世界技能大赛</b><div className="desc">六大领域 50 赛项三件套：总纲（读）· 视频（看）· 模拟训练（练）。</div><div className="meta">50 赛项 · 全离线</div></a><a className="mod green" href="#/learn/courses"><div className="ico">课</div><b>原创课程</b><div className="desc">算法 13 讲 · Python 8 讲 · 行测 6 讲，从零讲到能上手。</div><div className="meta">27 讲 · 配套题库</div></a><a className="mod gold" href="#/library"><div className="ico">库</div><b>资源总库</b><div className="desc">九大板块 580 条全网免费资源，分类可搜，直连与离线性逐条标注。</div><div className="meta">持续补充</div></a></div></section></Layout>;
}
export default Page;
