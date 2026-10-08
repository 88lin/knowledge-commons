/* 知识公社 · 学习资源库 · B 站精选 —— React 版（app/resource-data.js 懒加载） */
import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import './resources.css'

interface ResItem { t: string; b: string; a: string; g: string; p?: number; d?: string }
interface ResData { items: ResItem[] }
const EMPTY: ResData = { items: [] }

function useResData() {
  const [data, setData] = useState<ResData>(() => (window as any).RES_DATA || EMPTY)
  useEffect(() => {
    if ((window as any).RES_DATA) return
    const s = document.createElement('script')
    s.src = 'app/resource-data.js'
    s.onload = () => setData((window as any).RES_DATA || EMPTY)
    s.onerror = () => setData(EMPTY)
    document.body.appendChild(s)
    return () => { s.remove() }
  }, [])
  return data
}

const fmtP = (p?: number) => (p == null ? '' : p >= 1e8 ? (p / 1e8).toFixed(1) + '亿' : p >= 1e4 ? (p / 1e4).toFixed(1) + '万' : '' + p)

function Page() {
  const data = useResData()
  const [curG, setCurG] = useState('全部')
  const [q, setQ] = useState('')

  const groups = useMemo(() => {
    const gs: Record<string, number> = { 全部: data.items.length }
    for (const x of data.items) gs[x.g] = (gs[x.g] || 0) + 1
    return Object.entries(gs)
  }, [data])

  const hits = useMemo(() => {
    const ql = q.trim().toLowerCase()
    return data.items.filter((x) => {
      if (curG !== '全部' && x.g !== curG) return false
      if (ql && !(x.t + ' ' + x.a).toLowerCase().includes(ql)) return false
      return true
    })
  }, [data, curG, q])

  return (
    <>
      <div className="topbar"><div className="topbar-in">
        <div className="emblem">云</div>
        <div><div className="site-name">学习资源库 · B 站精选</div><div style={{ fontSize: 12, opacity: '.85', marginTop: 2 }}>装机 / 计算机科学 / 编译原理 / 云计算进阶</div></div>
        <div className="spacer"></div>
        <button className="btn" onClick={() => { location.href = 'learn/beginner.html' }}>零基础学堂</button>
        <button className="btn" onClick={() => { location.href = 'learn/calendar.html' }}>考试日历</button>
        <button className="btn" onClick={() => { location.href = 'index.html' }}>返回门户</button>
        <button className="btn" onClick={() => { location.href = 'library.html' }}>资源总库</button>
      </div></div>

      <div className="main">
        <div className="panel">
          <div className="p-hd">
            <h2>精选资源 <span style={{ fontSize: 13, color: '#8a94a6', fontWeight: 400 }}>共 {hits.length} 条</span></h2>
            <div className="searchbar">
              <input id="q" placeholder="搜索标题 / UP 主…" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          <div className="groups" id="groups">
            {groups.map(([g, n]) => (
              <span key={g} className={['gchip', g === curG ? 'on' : ''].join(' ')} onClick={() => setCurG(g)}>
                {g}（{n}）
              </span>
            ))}
          </div>
          <div className="list" id="list">
            {data.items.length === 0 ? (
              <p style={{ padding: 20, color: '#8a94a6' }}>数据加载中…</p>
            ) : (
              hits.map((x) => (
                <a key={x.b} className="item" href={`https://www.bilibili.com/video/${x.b}`} target="_blank" rel="noopener">
                  <div className="t">{x.t}</div>
                  <div className="a">{x.a}</div>
                  <div className="m">
                    <span className="g">{x.g}</span>
                    {x.p ? <span>▶ {fmtP(x.p)}</span> : null}
                    {x.d ? <span>⏱ {x.d}</span> : null}
                  </div>
                </a>
              ))
            )}
          </div>
          {data.items.length > 0 && hits.length === 0 && <div className="empty" id="empty">没有匹配的资源</div>}
        </div>
      </div>

      <footer><div className="foot-in">条目信息收集自哔哩哔哩公开页面，仅供学习交流 · 视频版权归原作者与 UP 主所有</div></footer>
    </>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
