import { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { BiliVideo, biliLink } from "../components/BiliVideo";
import { nav } from "../nav";
import { QZ } from "../data/quizData";
import { loadJSON, saveJSON } from "../hooks/useLocalState";
const BEST_KEY = "kc-quiz-best";
function Stage({ L, onFinish }) {
  const qs = useMemo(() => [...L.qs].sort(() => Math.random() - 0.5).slice(0, 5), [L]);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    setStep(0);
    setPicked(null);
    setCorrect(0);
    setFinished(false);
  }, [L]);
  const Q = qs[step];
  const pick = (i) => {
    if (picked != null) return;
    setPicked(i);
    if (i === Q.a) setCorrect((c) => c + 1);
    window.setTimeout(() => {
      if (step + 1 >= qs.length) {
        setFinished(true);
        onFinish(correct + (i === Q.a ? 1 : 0));
      } else {
        setStep((s) => s + 1);
        setPicked(null);
      }
    }, 1500);
  };
  if (finished) {
    return <div className="card2 score"><div className="smsg">
          本课自测：<b>{correct} / {qs.length}</b>{correct === qs.length ? " \u2014\u2014 \u6EE1\u5206\uFF0C\u624E\u5B9E\uFF01" : correct >= 3 ? " \u2014\u2014 \u8FC7\u5173\uFF0C\u53EF\u518D\u5237\u4E00\u8F6E\u3002" : " \u2014\u2014 \u5EFA\u8BAE\u56DE\u770B\u8BB2\u4E49\u518D\u6765\u3002"}</div><div className="btnrow"><button type="button" className="act" onClick={() => {
      setStep(0);
      setPicked(null);
      setCorrect(0);
      setFinished(false);
    }}>再测一轮</button><button type="button" className="act" onClick={() => {
      const nx = QZ[QZ.indexOf(L) + 1];
      if (nx) location.hash = location.hash.split('?')[0] + '?n=' + nx.n;
    }}>下一课 →</button></div></div>;
  }
  return <div className="card2"><div className="pbar"><i style={{ width: step / qs.length * 100 + "%" }} /></div><div className="qno">{L.n} · {L.t} · 第 {step + 1} / {qs.length} 题</div><div className="qt" key={step}>{Q.q}</div>{Q.o.map((o, i) => <button
    key={i}
    type="button"
    className={["opt", picked != null && i === Q.a ? "ok" : "", picked === i && i !== Q.a ? "bad" : ""].join(" ")}
    onClick={() => pick(i)}
  >{String.fromCharCode(65 + i)}. {o}</button>)}{picked != null && <div className="exp show">{Q.e}</div>}</div>;
}
function Page() {
  const [best, setBest] = useState(() => loadJSON(BEST_KEY, {}));
  const [cur, setCur] = useState(() => {
    const h = (location.hash.split('?')[1] || '').replace(/^n=/, '');
    if (/^(0[0-9]|1[0-5])$/.test(h)) {
      const i = QZ.findIndex((L) => L.n === h);
      if (i >= 0) return i;
    }
    return -1;
  });
  useEffect(() => {
    if (cur >= 0) location.hash = location.hash.split('?')[0] + '?n=' + QZ[cur].n;
  }, [cur]);
  return <Layout
    active="学堂"
    kicker="SELF-CHECK · 学堂自测"
    title="学堂自测"
    lines={["\u6BCF\u4E00\u8BFE 5 \u9053\u9009\u62E9\u9898\uFF0C\u7B54\u5B8C\u7ACB\u523B\u77E5\u9053\u5BF9\u9519\u4E0E\u539F\u56E0\u3002"]}
    badges={["16 \u8BFE \xB7 128 \u9898", "\u5373\u65F6\u5224\u5206 + \u89E3\u6790", "\u6210\u7EE9\u5B58\u672C\u673A"]}
  ><div id="chips">{QZ.map((L, i) => <span key={L.n} className={["chip", i === cur ? "on" : ""].join(" ")} onClick={() => setCur(i)}>{L.t}{best[L.n] != null && <span className="best"> 最高 {best[L.n]}/5</span>}</span>)}</div><div id="stage">{cur < 0 ? <div className="card2" style={{ textAlign: "center", color: "#64748b" }}>
            ↑ 从上方选择一门课开始自测（推荐顺序：从第 00 课开始）
          </div> : <Stage
    key={QZ[cur].n}
    L={QZ[cur]}
    onFinish={(score) => {
      const n = QZ[cur].n;
      setBest((b) => {
        const nb = { ...b, [n]: Math.max(b[n] ?? 0, score) };
        saveJSON(BEST_KEY, nb);
        return nb;
      });
    }}
  />}</div></Layout>;
}
export default Page;
