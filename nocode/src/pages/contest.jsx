import { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { BiliVideo, biliLink } from "../components/BiliVideo";
import { nav } from "../nav";
function useLazyData(src, globalName) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (window[globalName]) {
      setData(window[globalName]);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => setData(window[globalName] || []);
    s.onerror = () => setData([]);
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, [src, globalName]);
  return data;
}
const PAGE = 40;
const fmt = (n) => n >= 1e4 ? (n / 1e4).toFixed(1) + "\u4E07" : "" + n;
function ProblemPager({ data, placeholder, link }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    if (!data) return [];
    if (!q) return data;
    const k = q.toLowerCase();
    return data.filter((p) => ((p[2] || "") + "").toLowerCase().indexOf(k) >= 0 || ((p[4] || "") + "").toLowerCase().indexOf(k) >= 0);
  }, [data, q]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const cur = Math.min(page, pages);
  const seg = filtered.slice((cur - 1) * PAGE, cur * PAGE);
  if (!data) return <p className="small" style={{ padding: 10 }}>题库加载中…</p>;
  if (!seg.length) return <div className="small" style={{ padding: 10 }}>没有匹配的题目</div>;
  return <><input className="search" placeholder={placeholder} value={q} onChange={(e) => {
    setQ(e.target.value);
    setPage(1);
  }} /><div>{seg.map((p, i) => <a key={i} className="rs-item" href={link(p)} target="_blank" rel="noopener"><span className="idx">{p[0]}{p[1]}</span><span className="t" style={{ flex: 1, minWidth: 0 }}><span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p[2] || ""}</span>{p[4] ? <span className="tags">{p[4]}</span> : null}</span>{p[3] ? <span className="rt">{p[3]}</span> : null}</a>)}</div><div className="pnav"><button type="button" disabled={cur <= 1} onClick={() => setPage(cur - 1)}>← 上一页</button><span> 第 {cur} / {pages} 页 · 共 {filtered.length} 题 </span><button type="button" disabled={cur >= pages} onClick={() => setPage(cur + 1)}>下一页 →</button></div></>;
}
function Page() {
  const cf = useLazyData((import.meta.env.BASE_URL || '/') + 'learn/data/cf.js', 'CF_DATA');
  const ac = useLazyData((import.meta.env.BASE_URL || '/') + 'learn/data/atcoder.js', 'AC_DATA');
  return <Layout
    active="竞赛"
    kicker="CONTEST · 真题中心"
    title="竞赛真题中心"
    lines={["Codeforces 6000+ \u9898 \xB7 AtCoder ABC/ARC \u5168\u7CFB\u5217 \u2014\u2014 \u5728\u7EBF\u5224\u9898\u3001\u514D\u8D39\u6CE8\u518C\u3001\u9898\u89E3\u4E30\u5BCC\u3002"]}
    badges={["CF \u6309\u96BE\u5EA6\u53EF\u641C", "AtCoder \u6309\u6BD4\u8D5B\u6D4F\u89C8", "\u70B9\u51FB\u76F4\u8FBE\u539F\u9898"]}
  ><section><h2 className="sec">Codeforces <span className="small">· 全球最大算法竞赛平台</span></h2><div className="card"><p className="small" style={{ margin: "0 0 8px" }}>共 {cf ? fmt(cf.length) : "\u2026"} 题 · 建议从 800-1200 分档开始</p><ProblemPager
    data={cf}
    placeholder="搜索题名 / 标签（如：dp、greedy、图论、1600）…"
    link={(p) => `https://codeforces.com/problemset/problem/${p[0]}/${p[1]}`}
  /></div></section><section><h2 className="sec">AtCoder <span className="small">· 日本人气算法平台（ABC 每周一场）</span></h2><div className="card"><ProblemPager
    data={ac}
    placeholder="搜索题名（如：DP、ABC…）"
    link={(p) => `https://atcoder.jp/contests/${p[1]}/tasks/${p[0]}`}
  /></div></section></Layout>;
}
export default Page;
