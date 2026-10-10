import { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { BiliVideo, biliLink } from "../components/BiliVideo";
import { nav } from "../nav";
function useSearchIdx() {
  const [idx, setIdx] = useState(null);
  useEffect(() => {
    if (window.SEARCH_IDX) {
      setIdx(window.SEARCH_IDX);
      return;
    }
    const s = document.createElement("script");
    s.src = (import.meta.env.BASE_URL || '/') + 'searchidx.js';
    s.onload = () => setIdx(window.SEARCH_IDX || []);
    s.onerror = () => setIdx([]);
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);
  return idx;
}
function Page() {
  const idx = useSearchIdx();
  const [q, setQ] = useState("");
  useEffect(() => {
    const m = location.search.match(/[?&]q=([^&]*)/);
    if (m) setQ(decodeURIComponent(m[1]));
  }, []);
  const hits = useMemo(() => {
    if (!idx || !q.trim()) return null;
    const key = q.trim();
    return idx.filter((it) => (it.t + " " + (it.k || "")).indexOf(key) >= 0).slice(0, 80);
  }, [idx, q]);
  return <Layout
    active="总目"
    kicker="SEARCH · 全站检索"
    title="全站检索"
    lines={["\u8BFE\u7A0B / \u7BC7\u76EE / \u8D44\u6599 / B \u7AD9\u7CBE\u9009 \u2014\u2014 \u4E00\u641C\u5373\u4E2D"]}
    badges={["1600+ \u6761\u7D22\u5F15", "\u6807\u9898 + \u5173\u952E\u8BCD\u5339\u914D"]}
  ><form className="searchbar" onSubmit={(e) => e.preventDefault()}><input
    name="q"
    placeholder="输入关键词，如：动态规划 / 毛选 / 专升本 / B站"
    autoComplete="off"
    autoFocus
    value={q}
    onChange={(e) => setQ(e.target.value)}
  /><button type="submit">检索</button></form><div className="card">{idx == null ? <p className="small">索引加载中…</p> : !q.trim() ? <p className="small">输入关键词开始检索。也可以从 <a href="#/learn/archive">总目</a> 浏览全库。</p> : hits && hits.length ? <><p className="small">共 {hits.length} 条：</p><ul className="list">{hits.map((it, i) => <li key={i}><span className="t"><a href={it.u} dangerouslySetInnerHTML={{ __html: esc(it.t) }} /></span><span className="n">{esc(it.g || "")}</span></li>)}</ul></> : <p className="small">没有找到「{esc(q)}」。试试更短的关键词。</p>}</div></Layout>;
}
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
export default Page;
