/* 知识公社 · 学堂自测 —— React 版（16 课 · 80 题，数据由 learn/quiz.html 迁移） */
import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import '../theme.css'
import './quiz.css'
import { Layout } from '../components/Layout'
import { QZ, type QuizL } from '../data/quizData'
import { loadJSON, saveJSON } from '../hooks/useLocalState'

const BEST_KEY = 'kc-quiz-best'

function Stage({ L, onFinish }: { L: QuizL; onFinish: (score: number) => void }) {
  const qs = useMemo(() => [...L.qs].sort(() => Math.random() - 0.5).slice(0, 5), [L])
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setStep(0); setPicked(null); setCorrect(0); setFinished(false)
  }, [L])

  const Q = qs[step]

  const pick = (i: number) => {
    if (picked != null) return
    setPicked(i)
    if (i === Q.a) setCorrect((c) => c + 1)
    window.setTimeout(() => {
      if (step + 1 >= qs.length) {
        setFinished(true)
        onFinish(correct + (i === Q.a ? 1 : 0))
      } else {
        setStep((s) => s + 1)
        setPicked(null)
      }
    }, 1500)
  }

  if (finished) {
    return (
      <div className="card2 score">
        <div className="smsg">
          本课自测：<b>{correct} / {qs.length}</b>
          {correct === qs.length ? ' —— 满分，扎实！' : correct >= 3 ? ' —— 过关，可再刷一轮。' : ' —— 建议回看讲义再来。'}
        </div>
        <div className="btnrow">
          <button type="button" className="act" onClick={() => { setStep(0); setPicked(null); setCorrect(0); setFinished(false) }}>再测一轮</button>
          <button type="button" className="act" onClick={() => { const nx = QZ[QZ.indexOf(L) + 1]; if (nx) location.hash = '#' + nx.n }}>下一课 →</button>
        </div>
      </div>
    )
  }

  return (
    <div className="card2">
      <div className="pbar"><i style={{ width: (step / qs.length) * 100 + '%' }} /></div>
      <div className="qno">{L.n} · {L.t} · 第 {step + 1} / {qs.length} 题</div>
      <div className="qt" key={step}>{Q.q}</div>
      {Q.o.map((o, i) => (
        <button
          key={i}
          type="button"
          className={['opt', picked != null && i === Q.a ? 'ok' : '', picked === i && i !== Q.a ? 'bad' : ''].join(' ')}
          onClick={() => pick(i)}
        >
          {String.fromCharCode(65 + i)}. {o}
        </button>
      ))}
      {picked != null && <div className="exp show">{Q.e}</div>}
    </div>
  )
}

function Page() {
  const [best, setBest] = useState<Record<string, number>>(() => loadJSON(BEST_KEY, {}))
  const [cur, setCur] = useState<number>(() => {
    const h = location.hash.replace('#', '')
    if (/^(0[0-9]|1[0-5])$/.test(h)) {
      const i = QZ.findIndex((L) => L.n === h)
      if (i >= 0) return i
    }
    return -1
  })

  useEffect(() => {
    if (cur >= 0) location.hash = '#' + QZ[cur].n
  }, [cur])

  return (
    <Layout
      active="学堂"
      kicker="SELF-CHECK · 学堂自测"
      title="学堂自测"
      lines={['每一课 5 道选择题，答完立刻知道对错与原因。']}
      badges={['16 课 · 128 题', '即时判分 + 解析', '成绩存本机']}
    >
      <div id="chips">
        {QZ.map((L, i) => (
          <span key={L.n} className={['chip', i === cur ? 'on' : ''].join(' ')} onClick={() => setCur(i)}>
            {L.t}
            {best[L.n] != null && <span className="best"> 最高 {best[L.n]}/5</span>}
          </span>
        ))}
      </div>
      <div id="stage">
        {cur < 0 ? (
          <div className="card2" style={{ textAlign: 'center', color: '#64748b' }}>
            ↑ 从上方选择一门课开始自测（推荐顺序：从第 00 课开始）
          </div>
        ) : (
          <Stage
            key={QZ[cur].n}
            L={QZ[cur]}
            onFinish={(score) => {
              const n = QZ[cur].n
              setBest((b) => {
                const nb = { ...b, [n]: Math.max(b[n] ?? 0, score) }
                saveJSON(BEST_KEY, nb)
                return nb
              })
            }}
          />
        )}
      </div>
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
