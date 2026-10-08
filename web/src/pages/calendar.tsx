/* 知识公社 · 全年考试日历 —— React 版（收藏存本机） */
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import '../theme.css'
import './calendar.css'
import { Layout } from '../components/Layout'
import { CAL } from '../data/calData'
import { useLocalState } from '../hooks/useLocalState'

function Page() {
  const [favs, setFavs] = useLocalState<Record<string, 1>>('kc-cal-favs', {})
  const [onlyFav, setOnlyFav] = useState(false)
  const [open, setOpen] = useState<Record<string, 1>>({})

  const toggleFav = (k: string) =>
    setFavs((f) => {
      const n = { ...f }
      if (n[k]) delete n[k]
      else n[k] = 1
      return n
    })

  const favCount = Object.keys(favs).length

  return (
    <Layout
      active="日历"
      kicker="CALENDAR · 年度节奏"
      title="全年考试日历"
      lines={['高考 / 专升本 / 考研 / 公考 / 教资 / 法考 / 软考 / 四六级 / 计算机等级——一年 12 个月的报名与笔试节奏。']}
      badges={['按月速查', '附官方入口', '每年循环可用']}
    >
      <div className="calfilter">
        <button type="button" id="fall" className={['fbtn', !onlyFav ? 'on' : ''].join(' ')} onClick={() => setOnlyFav(false)}>
          全部（{CAL.reduce((a, m) => a + m.ex.length, 0)} 项）
        </button>
        <button type="button" id="ffav" className={['fbtn', onlyFav ? 'on' : ''].join(' ')} onClick={() => setOnlyFav(true)}>
          ★ 我的关注（{favCount}）
        </button>
      </div>
      <div id="months">
        {CAL.map((M) => {
          const rows = M.ex.filter((e) => !onlyFav || favs[M.m + '|' + e[0]])
          if (!rows.length) return null
          const isOpen = open[M.m] || onlyFav
          return (
            <div key={M.m} className={['mrow', isOpen ? 'open' : ''].join(' ')}>
              <div className="mhd" onClick={() => setOpen((o) => ({ ...o, [M.m]: isOpen ? undefined! : 1 }))}>
                <span className="mon">{M.m}</span>
                <b>{M.ex.map((e) => e[0]).slice(0, 3).join(' · ')}{M.ex.length > 3 ? ' 等' : ''}</b>
                <span className="cnt">{M.ex.length} 项</span>
              </div>
              <div className="mbd">
                <table className="ex">
                  <thead>
                    <tr><th>考试</th><th>常规时段与要点</th><th>官方入口</th></tr>
                  </thead>
                  <tbody>
                    {rows.map((e) => {
                      const k = M.m + '|' + e[0]
                      return (
                        <tr key={k} className={favs[k] ? 'faved' : ''}>
                          <td>
                            <span className="star" onClick={() => toggleFav(k)}>{favs[k] ? '★' : '☆'}</span>
                            {e[0]}
                          </td>
                          <td>{e[1]}</td>
                          <td>{e[2]}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
