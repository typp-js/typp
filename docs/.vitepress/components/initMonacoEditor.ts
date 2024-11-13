import { extraLibs } from '#define/extraLibs.ts'
import { trimIndent } from '#utils/trimIndent.ts'

import type Monaco from 'monaco-editor'

const forkTheme = (monaco: typeof Monaco) => {
  monaco.editor.defineTheme('vs-fork', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', background: 'f6f6f6' }
    ],
    colors: {}
  })
}

export const initMonacoEditor = (
  editor: Monaco.editor.IStandaloneCodeEditor,
  monaco: typeof Monaco,
  options?: {
    store?: boolean
  }
) => {
  forkTheme(monaco)

  const disposes: (() => void)[] = []

  const ts = monaco.languages.typescript
  const ls = monaco.languages.typescript.typescriptDefaults
  const libs: typeof extraLibs = [
    {
      filePath: 'file:///env.d.ts',
      content: trimIndent(`
        import { typp } from '@typp/core';
        import '@typp/validator';

        declare global {
          var t: typeof typp;
        }
        export {};
      `)
    },
    ...extraLibs
  ]
  libs.forEach(({ filePath, content }) => {
    const suffix = filePath.split('/').pop()!.split('.').pop() ?? ''

    const uri = monaco.Uri.parse(filePath)
    const model = monaco.editor.getModel(uri)
    if (model) {
      model.setValue(content)
      return
    }

    monaco.editor.createModel(
      content,
      ({
        ts: 'typescript',
        js: 'javascript',
        json: 'json'
      } as Record<string, string>)[suffix] ?? 'text',
      uri
    )
  })
  const packages = extraLibs.filter(({ filePath }) =>
    filePath.startsWith('file:///node_modules/')
    && filePath.endsWith('package.json')
  ).map(({ filePath, content }) => ({
    path: filePath.replace(/\/package.json$/, ''),
    name: filePath
      .replace(/^file:\/\/\/node_modules\//, '')
      .replace(/\/package.json$/, ''),
    json: JSON.parse(content) as {
      name: string
      exports: Record<string, unknown>
      // TODO
      // imports: Record<string, unknown>
    }
  }))
  const paths: Record<string, string[]> = {}
  packages.forEach(({ path, name, json: { exports } }) => {
    Object
      .entries(exports)
      .forEach(([key, value]) => {
        paths[key.replace(/^\./, name)] = (
          Array.isArray(value) ? value : [value]
        )
          .map(i => typeof i === 'string' ? i : i.import)
          .map(i => i.replace(/^\./, path))
      })
  })
  ls.setCompilerOptions({
    ...ls.getCompilerOptions(),
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    resolveJsonModule: true,
    paths
  })
  const hash = location.hash.slice(1)
  const content = options.store && hash ? decodeURIComponent(atob(hash)) : editor.getValue()
  setTimeout(() => {
    editor.setValue(content)
  }, 100)

  if (options.store) {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const model = editor.getModel()
      const uri = model?.uri
      if (!model || !uri) return

      const content = model.getValue()
      history.pushState(null, '', `#${btoa(encodeURIComponent(content))}`)
      navigator.clipboard.writeText(content)
    })
  }

  void (async () => {
    const model = editor.getModel()
    const uri = model?.uri
    if (!model || !uri) return

    const getWorker = await monaco.languages.typescript.getTypeScriptWorker()
    const worker = await getWorker(uri)

    disposes.push(
      monaco.languages.registerInlayHintsProvider('typescript', {
        provideInlayHints: async (model) => {
          const queryPositions: [
            {
              lineNumber: number
              column: number
            },
            {
              lineNumber: number
              column: number
            }
          ][] = []
          model
            .getLinesContent()
            .forEach((line, index) => {
              const match = /([\s\S]*\/\/\s*)_\?/g.exec(line)
              if (match) {
                queryPositions.push([
                  {
                    lineNumber: index + 1 + 1,
                    column: match.index + match[1].length + 1 + 1
                  },
                  {
                    lineNumber: index + 1,
                    column: match[1].length + 1 + 2
                  }
                ])
              }
            })
          return {
            hints: await Promise.all([
              ...queryPositions.map(async ([queryPosition, position]) => {
                const result = await worker.getQuickInfoAtPosition(
                  `file:///${uri.fsPath}`,
                  model.getOffsetAt(queryPosition)
                ) as {
                  displayParts?: { text: string }[]
                } | undefined
                return {
                  label: result
                    ?.displayParts
                    ?.map(({ text }: { text: string }) => text)
                    .join('')
                    .replace(/\n */g, '␊')
                    // eslint-disable-next-line no-control-regex
                    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
                    ?? '',
                  position
                } as Monaco.languages.InlayHint
              })
            ]),
            dispose: () => void 0
          }
        }
      }).dispose
    )

    const zoneIds: string[] = []
    editor.onDidChangeModelContent(async () => {
      const model = editor.getModel()
      const uri = model?.uri
      if (!model || !uri) return

      const diagnostics = [
        ...await worker.getSyntacticDiagnostics(`file:///${uri.fsPath}`),
        ...await worker.getSemanticDiagnostics(`file:///${uri.fsPath}`)
      ]
      editor.changeViewZones((accessor) => {
        zoneIds.forEach(id => accessor.removeZone(id))
        diagnostics.forEach(({ start, messageText }) => {
          const pos = model.getPositionAt(start!)
          const domNode = document.createElement('div')
          domNode.classList.add('mtk20')
          domNode.textContent = typeof messageText === 'string'
            ? messageText
            : (function leafMessageText(m: typeof messageText): string {
              if (m.next && m.next.length > 0) {
                return leafMessageText(m.next[0])
              }
              return m.messageText
            })(messageText)
          zoneIds.push(accessor.addZone({
            afterLineNumber: pos.lineNumber - 1,
            heightInLines: 1,
            domNode
          }))
        })
      })
    })
  })()

  return () => {
    disposes.forEach(dispose => dispose())
  }
}
