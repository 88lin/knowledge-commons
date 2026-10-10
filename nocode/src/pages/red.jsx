import { Layout } from "../components/Layout";
import { BiliVideo, biliLink } from "../components/BiliVideo";
import { nav } from "../nav";
function Page() {
  return <Layout
    active="红色"
    kicker="CLASSIC TEXTS"
    title="红色经典"
    lines={["\u300A\u6BDB\u6CFD\u4E1C\u9009\u96C6\u300B\u4E94\u5377 \xB7 \u6BDB\u6CFD\u4E1C\u8BD7\u8BCD \u2014\u2014 \u5168\u6587\u79BB\u7EBF\u53EF\u8BFB"]}
  ><section><h2 className="sec">《毛泽东选集》第 1–5 卷 · 全文在线读</h2><div className="card"><p>全书 <b>229 篇文章</b>按五卷编排，全部收录于本机、完全离线可读。建议从名篇入手，
            再按卷序通读：</p><ul className="list"><li><span className="t"><a href="https://88lin.github.io/knowledge-commons/learn/red/maoxuan.html#中国社会各阶级的分析">《中国社会各阶级的分析》</a>（1925）——「谁是我们的敌人？谁是我们的朋友？这个问题是革命的首要问题。」</span><span className="n">名篇</span></li><li><span className="t"><a href="https://88lin.github.io/knowledge-commons/learn/red/maoxuan.html#实践论">《实践论》</a>《矛盾论》（1937）—— 认识论与方法论的两座高峰</span><span className="n">必读</span></li><li><span className="t"><a href="https://88lin.github.io/knowledge-commons/learn/red/maoxuan.html#论持久战">《论持久战》</a>（1938）—— 战略思维的教科书</span><span className="n">必读</span></li><li><span className="t"><a href="https://88lin.github.io/knowledge-commons/learn/red/maoxuan.html#为人民服务">《为人民服务》</a>《纪念白求恩》《愚公移山》（1944–45）—— 「老三篇」</span><span className="n">短篇</span></li><li><span className="t"><a href="https://88lin.github.io/knowledge-commons/learn/red/maoxuan.html#新民主主义论">《新民主主义论》</a>《论联合政府》《论人民民主专政》—— 理论体系的建立</span><span className="n">深读</span></li></ul><a className="btn red" href="https://88lin.github.io/knowledge-commons/learn/red/maoxuan.html">打开《毛泽东选集》全文（含目录）</a><a className="btn ghost" href="https://88lin.github.io/knowledge-commons/learn/red/poems.html">毛泽东诗词全集</a><p className="small">《毛泽东选集》收录了 1925–1957 年间的重要著作；文末附各篇写作背景说明。示例阅读顺序：「老三篇」→《实践论》《矛盾论》→《论持久战》→ 按卷通读。</p></div></section><section><h2 className="sec">为什么读经典</h2><div className="card"><p>《实践论》讲「知行合一」，《矛盾论》讲「抓主要矛盾」，这两篇几乎是所有领域通用的方法论；
            《论持久战》教人把眼光放长、把节奏看清——无论考试、竞赛还是做事，都用得上。</p><p className="small">读法建议：第一遍通读抓大意；第二遍带着自己的问题重读；重要的段落摘抄成卡片。</p><p className="small">想把经典读出<b>研究</b>来？去<a href="#/learn/socialism">社会主义实践 · 研究生研究中心</a>：全领域研究地图、选题库、数据与文献入口一站备齐。</p></div></section><section><h2 className="sec">权威理论学习网站</h2><div className="card"><a className="btn" href="https://www.marxists.org/chinese/">中文马克思主义文库</a><a className="btn ghost" href="http://www.qstheory.cn/">求是网</a><a className="btn ghost" href="http://theory.people.com.cn/">人民网理论频道</a><a className="btn ghost" href="https://www.12371.cn/">共产党员网</a></div></section></Layout>;
}
export default Page;
