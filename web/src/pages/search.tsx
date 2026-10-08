/* 知识公社 · 全站检索 —— React 版（searchidx.js 懒加载，1600+ 条索引） */
import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import '../theme.css'
import { Layout } from '../components/Layout'

interface IdxItem { t: string; u: string; g?: string; k?: string }

function useSearchIdx() {
  const [idx, setIdx] = useState<IdxItem[] | null>(null)
  useEffect(() => {
    // searchidx.js 由根目录 learn/ 静态直通部署（与页面同目录），挂 window.SEARCH_IDX
    if ((window as any).SEARCH_IDX) {
      setIdx((window as any).SEARCH_IDX)
      return
    }
    const s = document.createElement('script')
    s.src = 'searchidx.js'
    s.onload = () => setIdx((window as any).SEARCH_IDX || [])
    s.onerror = () => setIdx([])
    document.body.appendChild(s)
    return () => { s.remove() }
  }, [])
  return idx
}

function Page() {
  const idx = useSearchIdx()
  const [q, setQ] = useState('')

  useEffect(() => {
    const m = location.search.match(/[?&]q=([^&]*)/)
    if (m) setQ(decodeURIComponent(m[1]))
  }, [])

  const hits = useMemo(() => {
    if (!idx || !q.trim()) return null
    const key = q.trim()
    return idx.filter((it) => (it.t + ' ' + (it.k || '')).indexOf(key) >= 0).slice(0, 80)
  }, [idx, q])

  return (
    <Layout
      active="总目"
      kicker="SEARCH · 全站检索"
      title="全站检索"
      lines={['课程 / 篇目 / 资料 / B 站精选 —— 一搜即中']}
      badges={['1600+ 条索引', '标题 + 关键词匹配']}
    >
      <form className="searchbar" onSubmit={(e) => e.preventDefault()}>
        <input
          name="q"
          placeholder="输入关键词，如：动态规划 / 毛选 / 专升本 / B站"
          autoComplete="off"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit">检索</button>
      </form>

      <div className="card">
        {idx == null ? (
          <p className="small">索引加载中…</p>
        ) : !q.trim() ? (
          <p className="small">输入关键词开始检索。也可以从 <a href="archive.html">总目</a> 浏览全库。</p>
        ) : hits && hits.length ? (
          <>
            <p className="small">共 {hits.length} 条：</p>
            <ul className="list">
              {hits.map((it, i) => (
                <li key={i}>
                  <span className="t"><a href={it.u} dangerouslySetInnerHTML={{ __html: esc(it.t) }} /></span>
                  <span className="n">{esc(it.g || '')}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="small">没有找到「{esc(q)}」。试试更短的关键词。</p>
        )}
      </div>
    </Layout>
  )
}

function esc(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
}

createRoot(document.getElementById('root')!).render(<Page />)
