import { readFileSync, readdirSync } from 'node:fs'
import { transform } from 'esbuild'
const dir = 'src/pages'
for (const f of readdirSync(dir).filter((x) => x.endsWith('.tsx') && !x.startsWith('draft'))) {
  try {
    await transform(readFileSync(`${dir}/${f}`, 'utf8'), { loader: 'tsx' })
  } catch (e) {
    const first = e.errors?.[0]?.text ?? ''
    const loc = e.errors?.[0]?.location ? `${e.errors[0].location.line}:${e.errors[0].location.column}` : '?'
    console.log(`${f}  ${loc}  ${first}`)
  }
}
