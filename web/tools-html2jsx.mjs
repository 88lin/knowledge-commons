#!/usr/bin/env node
/* HTML → JSX 粗稿转换器：把 learn/ 原页面内容提取为 React 页面组件骨架 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, basename } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')

const ENTITIES = {
  nbsp: '\u00a0', copy: '\u00a9', middot: '\u00b7', mdash: '\u2014', ndash: '\u2013',
  hellip: '\u2026', ldquo: '\u201c', rdquo: '\u201d', lsquo: '\u2018', rsquo: '\u2019',
  laquo: '\u00ab', raquo: '\u00bb', times: '\u00d7', deg: '\u00b0', bull: '\u2022',
  prime: '\u2032', Prime: '\u2033', ensp: '\u2002', emsp: '\u2003', thin: '\u2009',
}

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&([a-zA-Z]+);/g, (m, name) => ENTITIES[name] ?? m)
}

const STYLE_KEYS = new Set(['color', 'font', 'margin', 'padding', 'background', 'border', 'width', 'height', 'display', 'flex', 'text-align', 'letter-spacing', 'line-height', 'max-width', 'overflow'])

function styleToObject(css) {
  const out = []
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    let k = decl.slice(0, i).trim()
    const v = decl.slice(i + 1).trim()
    if (!k || !v) continue
    // 非 JSX 支持的 css 属性直接跳过成字符串形式也可以，但 React style 驼峰即可
    k = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    out.push(`${k}: ${JSON.stringify(decodeEntities(v))}`)
  }
  return `{{ ${out.join(', ')} }}`
}

function convertTag(m) {
  let tag = m
  // 属性重写
  tag = tag.replace(/\bclass="/g, 'className="')
  tag = tag.replace(/\bfor="/g, 'htmlFor="')
  // 内联样式
  tag = tag.replace(/style="([^"]*)"/g, (_, css) => `style=${styleToObject(css)}`)
  // 实体
  tag = decodeEntities(tag)
  return tag
}

function htmlToJsx(html) {
  let s = html
  // HTML 注释 → JSX 注释
  s = s.replace(/<!--([\s\S]*?)-->/g, (m) => `{/*${m.slice(4, -4)}*/}`)
  // 自闭合标签
  s = s.replace(/<(br|hr|img|input|source|track|area|base|col|embed|wbr)((?:[^<>])*?)\/?>/gi, (m, t, attrs) => {
    if (m.endsWith('/>')) return m
    return `<${t}${attrs} />`.replace(/\s+/g, ' ')
  })
  // 标签内属性转换（对每个标签做一次）
  s = s.replace(/<[a-zA-Z][^<>]*>/g, convertTag)
  // 文本实体
  s = decodeEntities(s)
  // 最后：<pre><code> 代码块整体转义（须在实体解码之后；已验证块内无嵌套标签）
  const esc = (c) =>
    c
      .replace(/&(?![a-zA-Z]+;|#\d+;)/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\{/g, '&#123;')
      .replace(/\}/g, '&#125;')
  s = s.replace(/(<pre[^>]*>)(<code[^>]*>)([\s\S]*?)(<\/code>)(<\/pre>)/gi, (m, a, b, c, d, e) => a + b + esc(c) + d + e)
  s = s.replace(/(<pre[^>]*>)([\s\S]*?)(<\/pre>)/gi, (m, a, c, z) => (/<code/.test(c) ? m : a + esc(c) + z))
  return s
}

function extract(file) {
  const src = readFileSync(file, 'utf-8')
  const body = src.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? ''
  const scripts = [...body.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])
  let content = body.replace(/<script(?![^>]*src)[^>]*>[\s\S]*?<\/script>/g, '')
  // 去掉外壳：topbar / hero / tabs
  content = content.replace(/<div class="topbar">[\s\S]*?<\/div>\s*/i, '')
  content = content.replace(/<header class="hero">[\s\S]*?<\/header>\s*/i, '')
  content = content.replace(/<nav class="tabs">[\s\S]*?<\/nav>\s*/i, '')
  // wrap 内容
  const wrap = content.match(/<div class="wrap"[^>]*>([\s\S]*)<\/div>\s*$/i)?.[1]
  if (wrap) content = wrap
  // footer（class="note"）
  const foot = content.match(/<footer class="note">([\s\S]*?)<\/footer>/i)?.[1] ?? ''
  if (foot) content = content.replace(/<footer class="note">[\s\S]*?<\/footer>/i, '{__FOOTER__}')
  return { content: content.trim(), scripts, foot: foot.trim(), raw: src }
}

const files = process.argv.slice(2)
for (const f of files) {
  const { content, scripts, foot } = extract(resolve(process.cwd(), f))
  const name = basename(f, '.html')
  const jsx = htmlToJsx(content)
  const footJsx = foot ? htmlToJsx(foot) : ''
  const out = `/* ===== 自动转换粗稿：${name} —— 需人工精修 ===== */
/* eslint-disable */
import { createRoot } from 'react-dom/client'
import '../theme.css'
import { Layout } from '../components/Layout'

function Page() {
  return (
    <Layout
      active=""
      title=""
    >
${jsx
  .split('\n')
  .map((l) => '      ' + l)
  .join('\n')}
    </Layout>
  )
}

createRoot(document.getElementById('root')!).render(<Page />)

/* ---- 原内联脚本（待 React 化） ---- */
${scripts.map((s) => '/*\n' + s + '\n*/').join('\n')}

/* ---- 原 footer ---- */
${footJsx ? '/*\n' + footJsx + '\n*/' : ''}
`
  const dest = resolve(ROOT, 'web/src/pages/draft-' + name + '.tsx')
  mkdirSync(resolve(ROOT, 'web/src/pages'), { recursive: true })
  writeFileSync(dest, out)
  console.log('draft:', dest)
}
