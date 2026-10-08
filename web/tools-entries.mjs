/* 生成各页面 Vite 入口 HTML（保持原 URL 与 PWA 头） */
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const TITLES = {
  index: '知识公社 · 从零到精通', about: '平台简章 · 知识公社',
  archive: '总目 · 知识公社', beginner: '零基础学堂 · 每个板块的第一课 · 知识公社',
  calendar: '全年考试日历 · 知识公社', contest: '竞赛真题中心 · 知识公社',
  courses: '课程总览 · 知识公社', ecommerce: '电商创业 · 实战中心 - 知识公社',
  exams: '升学考试 · 知识公社', gongkao: '公务员考试 · 知识公社',
  paths: '从零到精通 · 学习路线 · 知识公社', quiz: '学堂自测 · 16 课测验 · 知识公社',
  red: '红色经典 · 知识公社', search: '检索 · 知识公社',
  skills: '世赛 · 世界技能大赛全技能库 · 知识公社', socialism: '社会主义实践 · 研究生研究中心 · 知识公社',
  'course-algo': '算法竞赛 · 从零到精通 13 讲 · 知识公社', 'course-algo2': '算法竞赛 · 8-13 讲 · 知识公社',
  'course-python': 'Python 极速入门 · 8 讲 · 知识公社', 'course-gongkao': '公考行测 · 入门六讲 · 知识公社',
}

const shell = (title, page, depth) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title>
<meta name="theme-color" content="#9e2b25">
<meta name="color-scheme" content="light">
<link rel="manifest" href="${depth}manifest.json">
<link rel="apple-touch-icon" href="${depth}icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="${depth}icons/icon-192.png">
<script defer src="${depth}sw-reg.js"></script>
<script defer src="${depth}install-tip.js"></script>
<script type="module" src="/src/pages/${page}.tsx"></script>
</head>
<body>
<div id="root"></div>
</body>
</html>
`

const WEB = resolve(import.meta.dirname)
for (const [name, title] of Object.entries(TITLES)) {
  const dir = resolve(WEB, 'learn')
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, name + '.html'), shell(title, name, '../'))
}
/* 根首页入口 */
writeFileSync(resolve(WEB, 'index.html'), shell('知识公社 · Knowledge Commons', 'home', ''))
console.log('entries done:', Object.keys(TITLES).length + 1)
