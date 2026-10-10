import { useState } from "react";
import { Layout } from "../components/Layout";
import { BiliVideo, biliLink } from "../components/BiliVideo";
import { nav } from "../nav";
import { CAL } from "../data/calData";
import { useLocalState } from "../hooks/useLocalState";
function Page() {
  const [favs, setFavs] = useLocalState("kc-cal-favs", {});
  const [onlyFav, setOnlyFav] = useState(false);
  const [open, setOpen] = useState({});
  const toggleFav = (k) => setFavs((f) => {
    const n = { ...f };
    if (n[k]) delete n[k];
    else n[k] = 1;
    return n;
  });
  const favCount = Object.keys(favs).length;
  return <Layout
    active="日历"
    kicker="CALENDAR · 年度节奏"
    title="全年考试日历"
    lines={["\u9AD8\u8003 / \u4E13\u5347\u672C / \u8003\u7814 / \u516C\u8003 / \u6559\u8D44 / \u6CD5\u8003 / \u8F6F\u8003 / \u56DB\u516D\u7EA7 / \u8BA1\u7B97\u673A\u7B49\u7EA7\u2014\u2014\u4E00\u5E74 12 \u4E2A\u6708\u7684\u62A5\u540D\u4E0E\u7B14\u8BD5\u8282\u594F\u3002"]}
    badges={["\u6309\u6708\u901F\u67E5", "\u9644\u5B98\u65B9\u5165\u53E3", "\u6BCF\u5E74\u5FAA\u73AF\u53EF\u7528"]}
  ><div className="calfilter"><button type="button" id="fall" className={["fbtn", !onlyFav ? "on" : ""].join(" ")} onClick={() => setOnlyFav(false)}>
          全部（{CAL.reduce((a, m) => a + m.ex.length, 0)} 项）
        </button><button type="button" id="ffav" className={["fbtn", onlyFav ? "on" : ""].join(" ")} onClick={() => setOnlyFav(true)}>
          ★ 我的关注（{favCount}）
        </button></div><div id="months">{CAL.map((M) => {
    const rows = M.ex.filter((e) => !onlyFav || favs[M.m + "|" + e[0]]);
    if (!rows.length) return null;
    const isOpen = open[M.m] || onlyFav;
    return <div key={M.m} className={["mrow", isOpen ? "open" : ""].join(" ")}><div className="mhd" onClick={() => setOpen((o) => ({ ...o, [M.m]: isOpen ? void 0 : 1 }))}><span className="mon">{M.m}</span><b>{M.ex.map((e) => e[0]).slice(0, 3).join(" \xB7 ")}{M.ex.length > 3 ? " \u7B49" : ""}</b><span className="cnt">{M.ex.length} 项</span></div><div className="mbd"><table className="ex"><thead><tr><th>考试</th><th>常规时段与要点</th><th>官方入口</th></tr></thead><tbody>{rows.map((e) => {
      const k = M.m + "|" + e[0];
      return <tr key={k} className={favs[k] ? "faved" : ""}><td><span className="star" onClick={() => toggleFav(k)}>{favs[k] ? "\u2605" : "\u2606"}</span>{e[0]}</td><td>{e[1]}</td><td>{e[2]}</td></tr>;
    })}</tbody></table></div></div>;
  })}</div></Layout>;
}
export default Page;
