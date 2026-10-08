import { useCallback, useEffect, useState } from 'react'

/** localStorage 安全读写（与原版 kc-learn.js 行为一致：静默失败） */
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? '')
    return v == null ? fallback : (v as T)
  } catch {
    return fallback
  }
}

export function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 隐私模式等：静默 */
  }
}

/** localStorage 支持的 state */
export function useLocalState<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => loadJSON(key, initial))
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setV((prev) => {
        const n = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        saveJSON(key, n)
        return n
      })
    },
    [key]
  )
  return [v, set] as const
}

/** 回到顶部按钮 */
export function useScrollTop(threshold = 320) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > threshold)
    window.addEventListener('scroll', on, { passive: true })
    on()
    return () => window.removeEventListener('scroll', on)
  }, [threshold])
  return show
}

export function scrollTop(smooth = true) {
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
}
