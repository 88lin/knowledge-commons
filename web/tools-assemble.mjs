/* 把 draft-*.tsx 组装为正式页面：注入 Layout 元信息 + 通用修正 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const PAGES = resolve(import.meta.dirname, 'src/pages')

/* 每页 Layout 元信息（从原 HTML 提取） */
const META = {
  index: { active: '首页', kicker: 'KNOWLEDGE COMMONS', title: '知识公社',
    lines: ['竞赛真题 · 升学考试 · 公务员 · 红色经典 · 职业技能 · 资源总库', '从零到精通，点开就能学；不设门槛，不论基础。'],
    motto: '「读书是学习，使用也是学习，<i>而且是更重要的学习</i>。」' },
  about: { active: '简章', kicker: 'ABOUT · WHY', title: '平台简章',
    lines: ['一个把公开学习资源收拢到一处、免费开放的个人项目。'] },
  beginner: { active: '学堂', kicker: 'START HERE · 零基础', title: '零基础学堂',
    lines: ['九大板块，每个板块一节「第一课」+ 三节进阶课：视频 + 图文讲义 + 今天就能做的一件事。', '不设门槛，不论基础——看完这一课，你就已经不是零基础了。'],
    badges: ['16 节视频课（导览 1 + 基础 9 + 进阶 6）', '每课一个动手作业', '全部免费离线'] },
  calendar: { active: '日历', kicker: 'CALENDAR · 年度节奏', title: '全年考试日历',
    lines: ['高考 / 专升本 / 考研 / 公考 / 教资 / 法考 / 软考 / 四六级 / 计算机等级——一年 12 个月的报名与笔试节奏。'],
    badges: ['按月速查', '附官方入口', '每年循环可用'] },
  contest: { active: '竞赛', kicker: 'PROGRAMMING CONTESTS', title: '竞赛真题中心',
    lines: ['ACM/ICPC · Codeforces · AtCoder · 蓝桥杯 · 天梯赛 · CCPC · 数学建模'] },
  courses: { active: '课程', kicker: 'COURSES · OPEN &amp; READY', title: '课程总览',
    lines: ['每一讲都可以直接在本页学习：讲解 + 代码 + 例题 + 练习指引。', '不用再去别处找资料 —— 打开、往下读、跟着做，就是完整的学习闭环。'] },
  ecommerce: { active: '创业', kicker: 'E-COMMERCE PLAYBOOK · 2026-10', title: '电商创业 · 实战中心',
    lines: ['境内境外 · 平台实价 · 选品 SOP · 合规税务 · 90 天作战地图 —— 所有关键数字联网核实，随政策更新'] },
  exams: { active: '升学', kicker: 'EXAMS · FROM ZERO', title: '升学考试',
    lines: ['高考真题 · 专升本备考 · 中小学课程资源 —— 不花一分钱，一样能学'] },
  gongkao: { active: '公考', kicker: 'CIVIL SERVICE EXAM', title: '公务员考试',
    lines: ['行测 · 申论 · 面试 —— 真题、题库、路线，全部整理好了'] },
  paths: { active: '路线', kicker: 'ROADMAPS · START FROM ZERO', title: '从零到精通 · 学习路线',
    lines: ['算法竞赛 / 公务员 / 专升本 / 高考 —— 四个方向，四份路线图'] },
  quiz: { active: '学堂', kicker: 'SELF-CHECK · 学堂自测', title: '学堂自测',
    lines: ['每一课 5 道选择题，答完立刻知道对错与原因。'],
    badges: ['16 课 · 128 题', '即时判分 + 解析', '成绩存本机'] },
  red: { active: '红色', kicker: 'CLASSIC TEXTS', title: '红色经典',
    lines: ['《毛泽东选集》五卷 · 毛泽东诗词 —— 全文离线可读'] },
  skills: { active: '世赛', kicker: 'WORLDSKILLS', title: '世界技能大赛',
    lines: ['两年一届，被誉为「技能奥林匹克」；第 48 届于 2026 年 9 月在上海举行。', '六大领域、50 个赛项，每个赛项配齐三件套——<b>读</b>项目总纲 · <b>看</b>总纲课视频 · <b>练</b>模拟训练。'],
    badges: ['六大领域', '50 个赛项', '50 部总纲课', '50 套模拟训练', '全部离线'] },
  socialism: { active: '实践', kicker: 'SOCIALIST PRACTICE · GRADUATE RESEARCH', title: '社会主义实践 · 研究中心',
    lines: ['全领域研究地图 · 全网资源整合 · 新闻理论阵地 · 实证数据入口 —— 研究生级，一站直达'] },
  archive: { active: '总目', plain: true },
  search: { active: '', plain: true },
  'course-algo': { active: '课程', kicker: 'ALGORITHM CONTEST · ZERO TO HERO', title: '算法竞赛 · 从零到精通 · 13 讲',
    lines: ['面向零基础的完整讲解：每讲都有知识点、可运行的代码模板、经典例题和练习指引。', '建议节奏：<b>每天一讲 + 当天完成对应练习</b>；13 天走完基础盘，然后按最后一讲的刷题路线持续推进。'] },
  'course-algo2': { active: '课程', kicker: 'ALGORITHM CONTEST · PART 2', title: '算法竞赛 · 从零到精通（第 8–13 讲）',
    lines: ['BFS · 贪心 · 动态规划入门 · 图论入门 · 并查集与最小生成树 · 刷题路线图'] },
  'course-python': { active: '课程', kicker: 'PYTHON · ZERO TO RUNNING', title: 'Python 极速入门 · 8 讲',
    lines: ['零基础、每天一讲，8 天写出自己的小程序；每讲都可以直接复制代码运行。'] },
  'course-gongkao': { active: '课程', kicker: 'CIVIL SERVICE · START HERE', title: '公考行测 · 入门六讲',
    lines: ['先搞懂"考什么、怎么拿分"，再上强度。内附本站图形推理题库的刷题安排。'] },
}

for (const file of readdirSync(PAGES)) {
  const m = file.match(/^draft-(.+)\.tsx$/)
  if (!m) continue
  const name = m[1]
  const meta = META[name]
  if (!meta) { console.log('skip (no meta):', name); continue }
  const src = readFileSync(resolve(PAGES, file), 'utf-8')

  /* 提取 children：Layout 标签之间的内容 */
  const body = src.match(/>\n([\s\S]*?)\n    <\/Layout>/)?.[1]
  if (!body) { console.log('!! no body:', name); continue }

  let content = body

  /* 通用修正 1：搜索表单 → SearchBar 组件 */
  content = content.replace(
    /<form className="searchbar"[\s\S]*?<\/form>/,
    '<SearchBar />'
  )
  /* 通用修正 2：kc-resume 容器 → ResumeCard */
  content = content.replace(
    /<div className="card" id="kc-resume"><\/div>/,
    '<div className="card"><ResumeCard /></div>'
  )
  /* 通用修正 3：footer 占位 → Layout 默认页脚 */
  content = content.replace('{__FOOTER__}', '')

  const heroProps = meta.plain
    ? ''
    : [
        `active=${JSON.stringify(meta.active ?? '')}`,
        `kicker=${JSON.stringify(meta.kicker ?? '')}`,
        `title=${JSON.stringify(meta.title)}`,
        meta.lines ? `lines={[${meta.lines.map((l) => JSON.stringify(l)).join(', ')}]}` : '',
        meta.badges ? `badges={[${meta.badges.map((b) => JSON.stringify(b)).join(', ')}]}` : '',
        meta.motto ? `motto={<span dangerouslySetInnerHTML={{ __html: ${JSON.stringify(meta.motto)} }} />}` : '',
      ]
        .filter(Boolean)
        .join('\n      ')

  const needsResume = /ResumeCard/.test(content)
  const out = `/* 知识公社 · ${meta.title ?? name} —— React 版（由旧页面迁移） */
import { createRoot } from 'react-dom/client'
import '../theme.css'
import { Layout } from '../components/Layout'
import { SearchBar } from '../components/SearchBar'
${needsResume ? "import { ResumeCard } from '../learn-engine'\n" : ''}
function Page() {
  return (
    <Layout
${meta.plain ? `active=${JSON.stringify(meta.active ?? '')}` : heroProps}
    >
${content}
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)
`
  writeFileSync(resolve(PAGES, name + '.tsx'), out)
  console.log('ok:', name)
}
