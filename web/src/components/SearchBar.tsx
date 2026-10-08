import { useState, type FormEvent } from 'react'

/** 全站检索框（原各页内联 onsubmit 表单的 React 化） */
export function SearchBar({ placeholder = '全站检索：课程 · 篇目 · 资料…' }: { placeholder?: string }) {
  const [q, setQ] = useState('')
  const go = (e: FormEvent) => {
    e.preventDefault()
    const v = q.trim()
    if (v) location.href = 'search.html?q=' + encodeURIComponent(v)
  }
  return (
    <form className="searchbar" onSubmit={go}>
      <input name="q" placeholder={placeholder} autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} />
      <button type="submit">检索</button>
    </form>
  )
}
