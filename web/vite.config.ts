import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { resolve, dirname } from 'node:path'
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from 'node:fs'

const R = (p: string) => resolve(__dirname, '..', p)

/* ---------- 多入口：与现网 URL 完全一致 ---------- */
const pages = [
  'index.html',
  'library.html',
  'download.html',
  'install.html',
  'resources.html',
  'learn/index.html',
  'learn/about.html',
  'learn/archive.html',
  'learn/beginner.html',
  'learn/calendar.html',
  'learn/contest.html',
  'learn/course-algo.html',
  'learn/course-algo2.html',
  'learn/course-gongkao.html',
  'learn/course-python.html',
  'learn/courses.html',
  'learn/ecommerce.html',
  'learn/exams.html',
  'learn/gongkao.html',
  'learn/paths.html',
  'learn/quiz.html',
  'learn/red.html',
  'learn/search.html',
  'learn/skills.html',
  'learn/socialism.html',
]

const input = Object.fromEntries(
  pages
    .filter((p) => statSync(resolve(__dirname, p), { throwIfNoEntry: false })?.isFile())
    .map((p) => [p.replace(/\.html$/, '').replace(/\//g, '_'), resolve(__dirname, p)])
)

/* ---------- 根目录静态资产 → dist（原样直通，保持 URL） ---------- */
const staticDirs = [
  'study-data',
  'learn/data',
  'learn/files',
  'learn/red',
  'multiskill',
  'videos',
  'video-ext',
  'video-factory',
  'docs',
  'exam',
  'lab',
  'app',
  'icons',
]

function copyDirTargets(dirs: string[]) {
  const out: { src: string; dest: string }[] = []
  for (const d of dirs) out.push({ src: resolve(__dirname, '../' + d + '/**/*'), dest: d })
  return out
}

const staticFiles = [
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  '.nojekyll',
  'study.html',
  'viewer.html',
  'install-tip.js',
  'sw-reg.js',
  'learn/style.css',
  'learn/searchidx.js',
  'learn/kc-learn.js',
  'learn/pdfview.html',
].map((f) => ({ src: resolve(__dirname, '../' + f), dest: dirname(f) }))

export default defineConfig({
  base: '/knowledge-commons/',
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({ targets: [...copyDirTargets(staticDirs), ...staticFiles], silent: true }),
    /* 构建后：把带 hash 的构建产物注入 sw.js 预缓存清单 */
    {
      name: 'kc-sw-manifest',
      closeBundle() {
        const dist = resolve(__dirname, 'dist')
        const swSrc = readFileSync(R('sw.js'), 'utf-8')
        const assets: string[] = []
        const walk = (dir: string, prefix: string) => {
          for (const f of readdirSync(dir, { withFileTypes: true })) {
            if (f.name.startsWith('.')) continue
            const rel = prefix + f.name
            if (f.isDirectory()) walk(resolve(dir, f.name), rel + '/')
            else if (/^assets\//.test(rel) && /\.(js|css|woff2?)$/.test(f.name)) assets.push('./' + rel)
          }
        }
        walk(dist, '')
        const sw = swSrc.replace(
          /\/\* @@ASSETS@@[^*]*\*\//,
          assets.map((a) => JSON.stringify(a)).join(',\n  ')
        )
        mkdirSync(dist, { recursive: true })
        writeFileSync(resolve(dist, 'sw.js'), sw)
      },
    },
  ],
  build: {
    rollupOptions: { input },
    chunkSizeWarningLimit: 1500,
  },
})
