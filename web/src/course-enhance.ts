/* ============================================================
   知识公社 · 课程页学习增强（kc-learn.js 的 React 迁移版）
   ------------------------------------------------------------
   对静态转换的课程内容做 DOM 增强：
   · .lesson 讲卡 → 注入「学完 ✓」按钮 + 顶部进度条 + 悬浮「下一讲」
   · .qz 小测 → 点选即判（对错 + 解析 + 抖动动画）
   · 学完一册 → 庆祝 toast +（可选）跳下一册
   localStorage 键与旧版完全兼容：kc:course:<file> / kc:index
   ============================================================ */
import { useEffect } from 'react'
import { loadJSON, saveJSON } from './hooks/useLocalState'

const INDEX_KEY = 'kc:index'

export function useKCEnhancer(courseId: string, nextUrl?: string) {
  useEffect(() => {
    const lessons = Array.from(document.querySelectorAll<HTMLElement>('.lesson'))
    if (!lessons.length) return

    const key = 'kc:course:' + courseId
    const st = loadJSON<{ done?: Record<string, 1> }>(key, {})
    st.done = st.done || {}

    lessons.forEach((L, i) => {
      if (!L.id) L.id = 'l' + (i + 1)
    })

    /* ---- 顶部进度条 ---- */
    let prog = document.getElementById('kc-progress') as HTMLDivElement | null
    if (!prog) {
      prog = document.createElement('div')
      prog.id = 'kc-progress'
      prog.className = 'kc-progress'
      prog.innerHTML = '<i></i>'
      document.body.appendChild(prog)
    }
    const bar = prog.querySelector('i') as HTMLElement

    /* ---- toast ---- */
    let toastEl = document.getElementById('kc-toast') as HTMLDivElement | null
    if (!toastEl) {
      toastEl = document.createElement('div')
      toastEl.id = 'kc-toast'
      document.body.appendChild(toastEl)
    }
    let toastTimer = 0
    const toast = (msg: string) => {
      toastEl!.textContent = msg
      toastEl!.classList.add('on')
      window.clearTimeout(toastTimer)
      toastTimer = window.setTimeout(() => toastEl!.classList.remove('on'), 2400)
    }

    const count = () => Object.keys(st.done).length
    const allDone = () => count() >= lessons.length
    const nextLesson = () => lessons.find((L) => !st.done![L.id]) ?? null

    /* ---- 悬浮按钮 ---- */
    let fab = document.getElementById('kc-fab') as HTMLButtonElement | null
    if (!fab) {
      fab = document.createElement('button')
      fab.id = 'kc-fab'
      fab.type = 'button'
      document.body.appendChild(fab)
    }
    const refreshFab = () => {
      const sub = document.createElement('span')
      sub.className = 'sub'
      sub.textContent = `进度 ${count()}/${lessons.length} 讲`
      fab!.innerHTML = ''
      fab!.appendChild(sub)
      fab!.append(allDone() ? '继续下一册 →' : '下一讲 ↧')
      fab!.classList.toggle('alldone', allDone())
    }
    fab.onclick = () => {
      const nx = nextLesson()
      if (nx) {
        nx.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (nextUrl) location.href = nextUrl
      else toast('已到最后一讲 ✓')
    }

    const refresh = () => {
      bar.style.width = (count() / lessons.length) * 100 + '%'
      refreshFab()
    }

    /* ---- 同步首页「继续学习」索引 ---- */
    const syncIndex = () => {
      const idx = loadJSON<Record<string, unknown>>(INDEX_KEY, {})
      if (count() === 0) {
        if (idx[courseId]) {
          delete idx[courseId]
          saveJSON(INDEX_KEY, idx)
        }
        return
      }
      const nx = nextLesson()
      idx[courseId] = {
        title: document.title.replace(/ · 知识公社.*$/, ''),
        done: count(),
        total: lessons.length,
        ts: Date.now(),
        url: location.pathname.split('/').pop(),
        nextId: nx ? nx.id : null,
      }
      saveJSON(INDEX_KEY, idx)
    }

    /* ---- 完成按钮 ---- */
    lessons.forEach((L) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'kc-done'
      b.textContent = st.done![L.id] ? '✓ 本讲已学完（点击撤销）' : '标记本讲学完 ✓'
      b.onclick = () => {
        if (st.done![L.id]) delete st.done![L.id]
        else {
          st.done![L.id] = 1
          if (allDone()) toast(`🎉 本册 ${lessons.length} 讲全部学完，厉害！`)
        }
        saveJSON(key, st)
        syncIndex()
        b.textContent = st.done![L.id] ? '✓ 本讲已学完（点击撤销）' : '标记本讲学完 ✓'
        L.classList.toggle('kc-ldone', !!st.done![L.id])
        refresh()
      }
      L.appendChild(b)
      if (st.done![L.id]) L.classList.add('kc-ldone')
    })

    /* ---- 小测接管 ---- */
    document.addEventListener('click', function (e) {
      const t = e.target as HTMLElement
      if (!t.classList.contains('qz-o')) return
      const box = t.closest('.qz') as HTMLElement | null
      if (!box || box.dataset.done) return
      const pick = +t.dataset.a!
      if (pick === 1) {
        box.dataset.done = '1'
        box.classList.add('done')
        t.classList.add('ok')
        const why = box.querySelector('.qz-why')
        if (why) (why as HTMLElement).hidden = false
      } else {
        t.classList.add('no')
        window.setTimeout(() => t.classList.remove('no'), 450)
      }
    })

    /* ---- 深链：#l3 直接定位并高亮 ---- */
    const hash = location.hash.slice(1)
    if (hash) {
      const target = lessons.find((L) => L.id === hash)
      if (target) window.setTimeout(() => target.scrollIntoView({ block: 'start' }), 60)
    }

    refresh()
    return () => {
      prog.remove()
      fab.remove()
    }
  }, [courseId, nextUrl])
}
