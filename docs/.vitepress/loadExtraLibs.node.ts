import { readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

interface ExtraLib {
  filePath: string
  content: string
}

export const extraLibs: ExtraLib[] = []

const __dirname = new URL('.', import.meta.url).pathname
const resolveRoot = (...paths: string[]) => resolve(__dirname, '../../', ...paths)
readdirSync(resolveRoot('./packages'))
  .forEach((path) => {
    const resolveByPkg = (...paths: string[]) => resolveRoot('./packages', path, ...paths)
    const { name } = JSON.parse(readFileSync(resolveByPkg('package.json'), 'utf-8')) as { name: string }
    const children = readdirSync(resolveByPkg('.'))
      .filter(p => ['node_modules', 'tests', 'dist', 'lib'].every(d => !p.includes(d)))
    ;[...children].forEach((child) => {
      const p = resolveByPkg(child)
      if (statSync(p).isFile()) {
        return
      }
      children.push(...readdirSync(resolveByPkg(child), { recursive: true }).map(c => `${child}/${c}`))
    })
    children.forEach((child) => {
      const filepath = resolveByPkg(child)
      if (statSync(filepath).isDirectory()) return
      if (!/\.(?:(?:d\.)?tsx?|jsx?|json)$/.test(filepath)) return

      extraLibs.push({
        filePath: `file:///node_modules/${name}/${child}`,
        content: readFileSync(filepath, 'utf-8')
      })
    })
  })
