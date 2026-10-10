import { Hero, Footer } from "../components/Layout";
function Page() {
  return <><Hero
    kicker="KNOWLEDGE COMMONS"
    title="知识公社"
    lines={[
      "\u7ADE\u8D5B\u771F\u9898 \xB7 \u5347\u5B66\u8003\u8BD5 \xB7 \u516C\u52A1\u5458 \xB7 \u7EA2\u8272\u7ECF\u5178 \xB7 \u4E16\u754C\u6280\u80FD\u5927\u8D5B \xB7 \u7535\u5546\u521B\u4E1A \xB7 \u8D44\u6E90\u603B\u5E93",
      "\u4ECE\u96F6\u5230\u7CBE\u901A\uFF0C\u70B9\u5F00\u5C31\u80FD\u5B66\uFF1B\u4E0D\u8BBE\u95E8\u69DB\uFF0C\u4E0D\u8BBA\u57FA\u7840\u3002"
    ]}
    motto={"\u300C\u8BFB\u4E66\u662F\u5B66\u4E60\uFF0C\u4F7F\u7528\u4E5F\u662F\u5B66\u4E60\uFF0C\u800C\u4E14\u662F\u66F4\u91CD\u8981\u7684\u5B66\u4E60\u3002\u300D"}
    badges={["\u5B8C\u5168\u79BB\u7EBF", "\u5B8C\u5168\u5F00\u6E90", "\u7AD9\u5185\u76F4\u8FBE", "\u516D\u7AEF\u540C\u6E90"]}
  /><div className="wrap"><div className="actionbar"><a className="actbtn" href="#/learn/index">进入知识公社</a><a className="actbtn" href="#/learn/beginner">零基础学堂 · 15 节视频课</a><a className="actbtn ghost" href="https://88lin.github.io/knowledge-commons/study.html">资料中心 · 全技能库</a></div><h2 className="sec">站内直达</h2><div className="card"><ul className="list"><li><span className="t"><a href="#/learn/skills">世界技能大赛 · 六大领域 50 赛项（总纲 / 视频 / 训练）</a></span><span className="n">赛</span></li><li><span className="t"><a href="#/learn/contest">算法竞赛 · ICPC / CCPC / 蓝桥 / 天梯 / Codeforces / AtCoder</a></span><span className="n">竞</span></li><li><span className="t"><a href="#/learn/exams">升学考试 · 高考 / 专升本 / 考研真题与备考工具</a></span><span className="n">升</span></li><li><span className="t"><a href="#/learn/gongkao">公务员 · 行测申论真题与题库</a></span><span className="n">公</span></li><li><span className="t"><a href="#/learn/red">红色经典 · 毛选五卷 · 毛泽东诗词</a></span><span className="n">红</span></li><li><span className="t"><a href="#/learn/courses">原创课程 · 算法竞赛 / Python / 公考行测</a></span><span className="n">课</span></li><li><span className="t"><a href="#/learn/archive">总目 · 站内全库一页直达</a></span><span className="n">总</span></li><li><span className="t"><a href="#/learn/search">全站检索 · 课程 / 篇目 / 资料一搜即中</a></span><span className="n">检</span></li><li><span className="t"><a href="#/learn/beginner">零基础学堂 · 九大板块第一课（视频课）</a></span><span className="n">学</span></li><li><span className="t"><a href="#/learn/ecommerce">电商创业 · 实战中心 · 2026 实价手册与 90 天作战地图</a></span><span className="n">创</span></li><li><span className="t"><a href="#/library">资源总库 · 全网免费学习资源精选（787 条）</a></span><span className="n">库</span></li></ul></div><Footer /></div></>;
}
export default Page;
