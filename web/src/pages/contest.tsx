/* 知识公社 · 竞赛真题中心 —— React 版（CF / AtCoder 题库懒加载 + 分页搜索） */
import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import '../theme.css'
import { Layout } from '../components/Layout'

type Pb = (string | number)[] // [contestId, problemId, title, rating, tags?]

function useLazyData(src: string, globalName: string) {
  const [data, setData] = useState<Pb[] | null>(null)
  useEffect(() => {
    if ((window as any)[globalName]) {
      setData((window as any)[globalName])
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.onload = () => setData((window as any)[globalName] || [])
    s.onerror = () => setData([])
    document.body.appendChild(s)
    return () => { s.remove() }
  }, [src, globalName])
  return data
}

const PAGE = 40
const fmt = (n: number) => (n >= 10000 ? (n / 10000).toFixed(1) + '万' : '' + n)

function ProblemPager({ data, placeholder, link }: { data: Pb[] | null; placeholder: string; link: (p: Pb) => string }) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!data) return []
    if (!q) return data
    const k = q.toLowerCase()
    return data.filter((p) => ((p[2] || '') + '').toLowerCase().indexOf(k) >= 0 || ((p[4] || '') + '').toLowerCase().indexOf(k) >= 0)
  }, [data, q])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const cur = Math.min(page, pages)
  const seg = filtered.slice((cur - 1) * PAGE, cur * PAGE)

  if (!data) return <p className="small" style={{ padding: 10 }}>题库加载中…</p>
  if (!seg.length) return <div className="small" style={{ padding: 10 }}>没有匹配的题目</div>
  return (
    <>
      <input className="search" placeholder={placeholder} value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
      <div>
        {seg.map((p, i) => (
          <a key={i} className="rs-item" href={link(p)} target="_blank" rel="noopener">
            <span className="idx">{p[0]}{p[1]}</span>
            <span className="t" style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p[2] || ''}</span>
              {p[4] ? <span className="tags">{p[4]}</span> : null}
            </span>
            {p[3] ? <span className="rt">{p[3]}</span> : null}
          </a>
        ))}
      </div>
      <div className="pnav">
        <button type="button" disabled={cur <= 1} onClick={() => setPage(cur - 1)}>← 上一页</button>
        <span> 第 {cur} / {pages} 页 · 共 {filtered.length} 题 </span>
        <button type="button" disabled={cur >= pages} onClick={() => setPage(cur + 1)}>下一页 →</button>
      </div>
    </>
  )
}

function Page() {
  const cf = useLazyData('data/cf.js', 'CF_DATA')
  const ac = useLazyData('data/atcoder.js', 'AC_DATA')
  return (
    <Layout
      active="竞赛"
      kicker="CONTEST · 真题中心"
      title="竞赛真题中心"
      lines={['Codeforces 6000+ 题 · AtCoder ABC/ARC 全系列 —— 在线判题、免费注册、题解丰富。']}
      badges={['CF 按难度可搜', 'AtCoder 按比赛浏览', '点击直达原题']}
    >
      <section>
        <h2 className="sec">Codeforces <span className="small">· 全球最大算法竞赛平台</span></h2>
        <div className="card">
          <p className="small" style={{ margin: '0 0 8px' }}>共 {cf ? fmt(cf.length) : '…'} 题 · 建议从 800-1200 分档开始</p>
          <ProblemPager
            data={cf}
            placeholder="搜索题名 / 标签（如：dp、greedy、图论、1600）…"
            link={(p) => `https://codeforces.com/problemset/problem/${p[0]}/${p[1]}`}
          />
        </div>
      </section>
      <section>
        <h2 className="sec">AtCoder <span className="small">· 日本人气算法平台（ABC 每周一场）</span></h2>
        <div className="card">
          <ProblemPager
            data={ac}
            placeholder="搜索题名（如：DP、ABC…）"
            link={(p) => `https://atcoder.jp/contests/${p[1]}/tasks/${p[0]}`}
          />
        </div>
      </section>
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
