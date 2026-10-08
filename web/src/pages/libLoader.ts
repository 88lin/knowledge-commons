/* 资源总库数据加载：app/library-data.js（window.LIB_DATA）懒加载 */
import { useEffect, useState } from 'react'

export interface LibItem {
  t: string; u: string; d: string; g: number; s?: string
  ty?: string; f?: string; o?: string; w?: number
}

export interface LibData {
  gen?: string
  groups: string[]
  items: LibItem[]
}

const EMPTY: LibData = { groups: [], items: [] }

export function loadLibData(): LibData {
  const [data, setData] = useState<LibData>(
    () => (window as any).LIB_DATA || EMPTY
  )
  useEffect(() => {
    if ((window as any).LIB_DATA) return
    const s = document.createElement('script')
    s.src = 'app/library-data.js'
    s.onload = () => setData((window as any).LIB_DATA || EMPTY)
    s.onerror = () => setData(EMPTY)
    document.body.appendChild(s)
    return () => { s.remove() }
  }, [])
  return data
}
