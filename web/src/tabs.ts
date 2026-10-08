/* 全站导航（书卷签条）—— 与原 learn/ 页面一致 */
export interface Tab {
  label: string
  href: string
}

export const TABS: Tab[] = [
  { label: '首页', href: '/learn/index.html' },
  { label: '学堂', href: '/learn/beginner.html' },
  { label: '日历', href: '/learn/calendar.html' },
  { label: '总目', href: '/learn/archive.html' },
  { label: '课程', href: '/learn/courses.html' },
  { label: '竞赛', href: '/learn/contest.html' },
  { label: '升学', href: '/learn/exams.html' },
  { label: '公考', href: '/learn/gongkao.html' },
  { label: '世赛', href: '/learn/skills.html' },
  { label: '红色', href: '/learn/red.html' },
  { label: '实践', href: '/learn/socialism.html' },
  { label: '创业', href: '/learn/ecommerce.html' },
  { label: '路线', href: '/learn/paths.html' },
  { label: '资源', href: '/library.html' },
  { label: '下载', href: '/download.html' },
  { label: '简章', href: '/learn/about.html' },
]

/** 开发态路由（生产为 /knowledge-commons 前缀） */
export const BASE = import.meta.env.BASE_URL
export const h = (path: string) => BASE + path.replace(/^\//, '')
