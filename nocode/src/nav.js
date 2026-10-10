import { STATIC } from './site'

/* ---- 数据驱动 URL → HashRouter 路由（learn 上下文） ----
 * 用于页面数据字段（如 beginnerLessons 的 u）里的站内相对路径。 */
const TAB = new Set([
  'index', 'about', 'archive', 'beginner', 'calendar', 'contest', 'course-algo',
  'course-algo2', 'course-gongkao', 'course-python', 'courses', 'ecommerce',
  'exams', 'gongkao', 'paths', 'quiz', 'red', 'search', 'skills', 'socialism',
  'library', 'install', 'resources',
])

export function nav(u) {
  if (!u || /^(#|https?:|mailto:|data:|itms-)/.test(u)) return u
  let path = u, hash = ''
  const hi = u.indexOf('#')
  if (hi >= 0) { hash = u.slice(hi); path = u.slice(0, hi) }
  if (!path.endsWith('.html')) return STATIC + '/learn/' + path.replace(/^\.\//, '') + hash

  const name = path.replace(/\.html$/, '')
  if (name === 'library' || name === '../library')
    return '#/library' + (hash ? '?' + hash.slice(1) : '')
  if (name.startsWith('../')) return `${STATIC}/${name.slice(3)}.html${hash}`
  if (name.startsWith('learn/')) return `#/${name}${hash}`
  if (TAB.has(name)) return `#/learn/${name}${hash}`
  return `${STATIC}/learn/${path}${hash}`
}
