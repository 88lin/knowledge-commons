import { useEffect, useMemo, useState } from "react";
import { loadLibData } from "./libLoader";
function Page() {
  const data = loadLibData();
  const [curG, setCurG] = useState(-1);
  const [curS, setCurS] = useState("");
  const [q, setQ] = useState("");
  useEffect(() => {
    const _hp = location.hash.indexOf('?')
    const h = _hp >= 0 ? decodeURIComponent(location.hash.slice(_hp + 1)).trim() : '';
    if (!h) return;
    if (/^g=\d+$/.test(h) && +h.slice(2) < data.groups.length) setCurG(+h.slice(2));
    else setQ(h);
  }, [data]);
  const subs = useMemo(() => {
    const seen = [];
    for (const x of data.items) {
      if ((curG < 0 || x.g === curG) && x.s && !seen.includes(x.s)) seen.push(x.s);
    }
    return seen;
  }, [data, curG]);
  const hits = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return data.items.filter((x) => {
      if (curG >= 0 && x.g !== curG) return false;
      if (curS && x.s !== curS) return false;
      if (ql && (x.t + " " + x.d + " " + (x.s || "") + " " + (x.ty || "")).toLowerCase().indexOf(ql) < 0) return false;
      return true;
    });
  }, [data, curG, curS, q]);
  const countIn = (g, s) => data.items.filter((x) => (g < 0 || x.g === g) && (!s || x.s === s)).length;
  return <><div className="topbar"><div className="topbar-in"><div className="emblem">知</div><div><div className="site-name">资源总库 · 全网免费学习资源精选</div><div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>世赛 · 算法 · 升学 · 公考 · 古籍 · 课程 · IT —— 免费且靠谱的，都在这里</div></div><div className="spacer" /><button className="btn" onClick={() => location.hash = "#/learn/index"}>返回门户</button><button className="btn" onClick={() => location.hash = "#/resources"}>B站精选</button></div></div><div className="main"><div className="panel"><div className="p-hd"><h2>精选资源 <span style={{ fontSize: 13, color: "#8a94a6", fontWeight: 400 }}>共 {hits.length} 条</span></h2><div className="searchbar"><input
    placeholder="搜索名称 / 简介 / 子类…"
    autoComplete="off"
    value={q}
    onChange={(e) => setQ(e.target.value)}
  /></div></div><div className="groups" id="groups"><span className={["gchip", curG < 0 ? "on" : ""].join(" ")} onClick={() => {
    setCurG(-1);
    setCurS("");
  }}>
              全部（{data.items.length}）
            </span>{data.groups.map((g, i) => <span key={i} className={["gchip", curG === i ? "on" : ""].join(" ")} onClick={() => {
    setCurG(i);
    setCurS("");
  }}>{g}（{countIn(i)}）
              </span>)}</div>{subs.length > 0 && <div className="subgroups" id="subgroups"><span className={["schip", curS === "" ? "on" : ""].join(" ")} onClick={() => setCurS("")}>子类·全部</span>{subs.map((s) => <span key={s} className={["schip", curS === s ? "on" : ""].join(" ")} onClick={() => setCurS(s)}>{s}（{countIn(curG, s)}）
                </span>)}</div>}<div className="list" id="list">{hits.map((x, i) => <a key={i} className="item" href={x.u} target="_blank" rel="noopener"><div className="t">{x.t}</div><div className="d">{x.d}</div><div className="m"><span className="s">{x.s || ""}</span><span>{x.ty || ""}</span><span>{x.f || ""}</span><span>{x.o || ""}</span>{x.w ? <span className="warn">国际网络</span> : null}</div></a>)}</div>{hits.length === 0 && <div className="empty" id="empty">没有匹配的资源</div>}<div className="legend" id="legend">
            标注说明：<b>免费程度</b>「完全免费 / 免费(注册) / 部分免费」；<b>可离线</b>「可下载 / App缓存 / 本地部署 / 在线」；
            <span className="warn" style={{ fontSize: 11, borderRadius: 3, padding: "2px 7px", color: "#a13a2a", background: "#fbeae6" }}>国际网络</span>
            表示该站境外访问更快或直连不稳，其余默认中国大陆可直连。
          </div><div className="note">
            收录原则：免费、官方、无版权风险优先；中国大陆可直连优先。数据更新：{data.gen || "\u2014"}。
          </div></div></div></>;
}
export default Page;
