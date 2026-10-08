/* ============================================================
   知识公社 · 学习引擎 v2（React 版）
   由 kc-learn.js 迁移：进度 / 小测 / 下一讲 / 继续学习
   localStorage 键与旧版完全兼容 —— 老用户进度无损保留。
   ============================================================ */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { loadJSON, saveJSON, useScrollTop } from './hooks/useLocalState'

const INDEX_KEY = 'kc:index'

export interface LessonInfo {
  id: string
  title: string
}

function useCourseIndex(courseId: string, title: string, lessons: LessonInfo[], done: Record<string, 1>) {
  const total = lessons.length
  const count = Object.keys(done).length
  useEffect(() => {
    const idx = loadJSON<Record<string, unknown>>(INDEX_KEY, {})
    if (count === 0) {
      if (idx[courseId]) {
        delete idx[courseId]
        saveJSON(INDEX_KEY, idx)
      }
      return
    }
    const next = lessons.find((l) => !done[l.id]) ?? null
    idx[courseId] = {
      title,
      done: count,
      total,
      ts: Date.now(),
      url: courseId,
      nextId: next ? next.id : null,
    }
    saveJSON(INDEX_KEY, idx)
  }, [courseId, title, count, total, lessons, done])
}

/* ---------- 课程页包装：顶部进度条 + 悬浮「下一讲」按钮 ---------- */
export function CoursePage({
  courseId,
  title,
  lessons,
  done,
  onToggle,
  nextUrl,
  children,
}: {
  courseId: string
  title: string
  lessons: LessonInfo[]
  done: Record<string, 1>
  onToggle: (id: string) => void
  nextUrl?: string
  children: ReactNode
}) {
  useCourseIndex(courseId, title, lessons, done)
  const total = lessons.length
  const count = Object.keys(done).length
  const allDone = total > 0 && count >= total
  const showFab = useScrollTop(320)
  const next = lessons.find((l) => !done[l.id])

  const pct = total ? (count / total) * 100 : 0

  return (
    <>
      {/* 顶部进度条 */}
      <div id="kc-progress" className="kc-progress">
        <i style={{ width: pct + '%' }} />
      </div>
      {children}
      {/* 悬浮按钮：下一讲 / 继续下一册 */}
      <button
        id="kc-fab"
        type="button"
        onClick={() => {
          if (next) {
            document.getElementById(next.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return
          }
          if (nextUrl) location.href = nextUrl
        }}
        className={['kc-fab', allDone ? 'alldone' : '', showFab ? 'show' : ''].join(' ')}
      >
        <span className="sub">进度 {count}/{total} 讲</span>
        {allDone ? '继续下一册 →' : '下一讲 ↧'}
      </button>
    </>
  )
}

/* ---------- 讲卡：完成按钮 ---------- */
export function DoneButton({ id, done, onToggle }: { id: string; done: boolean; onToggle: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={[
        'inline-block mx-0 my-4 rounded-[8px] px-[15px] py-2 text-[13.5px] leading-[1.4] tracking-[1px] cursor-pointer',
        'transition-colors duration-200',
        done
          ? 'border-[1.5px] border-solid border-[#4c6b4f] bg-[#f2f7f0] text-[#3c5a3f]'
          : 'border-[1.5px] border-dashed border-[#cbb98f] bg-[#fffdf8] text-[#7c6a48] hover:border-[#9e2b25] hover:text-[#7c1f1a]',
      ].join(' ')}
    >
      {done ? '✓ 已学完' : '标记学完这一讲'}
    </button>
  )
}

/* ---------- 小测（单题） ---------- */
export interface QuizData {
  q: string
  options: string[]
  answer: number
  why?: string
}

export function QuizBox({ data, onCorrect }: { data: QuizData; onCorrect?: () => void }) {
  const [picked, setPicked] = useState<number | null>(null)
  const [wrong, setWrong] = useState<number | null>(null)
  const finished = picked != null
  const timer = useRef<number>()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const pick = (i: number) => {
    if (finished) return
    if (i === data.answer) {
      setPicked(i)
      onCorrect?.()
    } else {
      setWrong(i)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setWrong(null), 450)
    }
  }

  return (
    <div className={['qz', finished ? 'done' : ''].join(' ')}>
      <div className="qz-q">{data.q}</div>
      {data.options.map((o, i) => (
        <button
          key={i}
          type="button"
          onClick={() => pick(i)}
          disabled={finished}
          className={[
            'qz-o',
            finished && i === data.answer ? 'ok' : '',
            wrong === i ? 'no' : '',
          ].join(' ')}
        >
          {o}
        </button>
      ))}
      {finished && data.why && <div className="qz-why">✓ {data.why}</div>}
    </div>
  )
}

/* ---------- 入口页「继续学习」 ---------- */
export function ResumeCard() {
  const arr = useMemo(() => {
    const idx = loadJSON<Record<string, { title: string; done: number; total: number; ts: number; url: string; nextId: string | null }>>(INDEX_KEY, {})
    return Object.values(idx)
      .filter((v) => v && v.url && v.total)
      .sort((a, b) => (b.ts || 0) - (a.ts || 0))
  }, [])
  if (!arr.length) {
    return (
      <div className="text-[14px] text-[#7c7466]">
        还没有学习记录 ——{' '}
        <a href="course-algo.html">从第一课开始：算法竞赛 · 第 1 讲 →</a>
      </div>
    )
  }
  const it = arr[0]
  const link = it.url + (it.nextId ? '#' + it.nextId : '')
  const pct = Math.round((it.done / it.total) * 100)
  return (
    <div className="kc-resume-card">
      <span className="kc-r-k">继续学习</span>
      <a className="kc-r-t" href={link}>
        {it.title} · 已学 {it.done}/{it.total} 讲 →
      </a>
      <span className="kc-r-bar">
        <i style={{ width: pct + '%' }} />
      </span>
    </div>
  )
}
