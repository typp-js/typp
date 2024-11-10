<template>
  <div class="playground">
    <slot />
    <Editor
      class="editor"
      language="typescript"
      v-model:path="path"
      v-model:theme="theme"
      v-model:value="trimmedCode"
      :options="MONACO_EDITOR_OPTIONS"
      @mount="onEditorMounted"
    />
  </div>
</template>
<style scoped>
.playground {
  margin-top: 20px;
  min-height: 150px;
}
.playground > :deep .language-ts {
  display: none !important;
}
</style>
<script lang="ts" setup>
import { Editor } from '@guolao/vue-monaco-editor'

import type Monaco from 'monaco-editor'
import { useData } from 'vitepress'
import { ref, computed, reactive, onUnmounted, VNode, onMounted } from 'vue'

import { extraLibs } from '#define/extraLibs.ts'

const props = defineProps({
  global: {
    type: Boolean,
    default: false
  }
})
const slots = defineSlots<{
  default: () => VNode[]
}>()
const data = useData()
const uuid = ref(Math.random().toString(36).slice(2))
const path = ref(`file:///index.${uuid.value}.ts`)
const code = ref('')

const [vnode] = slots.default()
vnode.props ??= {}
vnode.props.id = `playground-${uuid.value}`

const trimIndent = (code: string) => {
  const lines = code.split('\n')
  const indent = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)![0].length)
    .reduce((min, indent) => Math.min(min, indent), Infinity)
  return lines.map((line) => line.slice(indent)).join('\n')
}

const trimmedCode = computed(() => trimIndent(code.value.trim()) + '\n')
const theme = computed(() => data.isDark.value ? 'vs-dark' : 'vs-fork')

const MONACO_EDITOR_OPTIONS:
  Monaco.editor.IStandaloneEditorConstructionOptions = {
    tabSize: 2,

    readOnly: true,
    // https://github.com/microsoft/monaco-editor/issues/311#issuecomment-578026465
    renderValidationDecorations: 'on',

    automaticLayout: true,

    minimap: { enabled: false },
    fontSize: 14
  }

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

const disposes = reactive<(() => void)[]>([])

const onEditorMounted = (
  editor: Monaco.editor.IStandaloneCodeEditor,
  monaco: typeof Monaco
) => {
  forkTheme(monaco)

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
  setTimeout(() => {
    editor.setValue(trimmedCode.value)
  }, 100)
  ;(async () => {
    const getWorker = await monaco.languages.typescript.getTypeScriptWorker()
    const worker = await getWorker(monaco.Uri.parse(path.value))

    disposes.push(monaco.languages.registerInlayHintsProvider('typescript', {
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
                path.value,
                model.getOffsetAt(queryPosition)
              )
              return {
                label: result
                  .displayParts
                  .map(({ text }: { text: string }) => text)
                  .join('')
                  .replace(/\n */g, "␊")
                  .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""),
                position
              } as Monaco.languages.InlayHint
            })
          ]),
          dispose: () => void 0
        }
      }
    }).dispose)

    const model = editor.getModel()!
    const diagnostics = [
      ...await worker.getSyntacticDiagnostics(path.value),
      ...await worker.getSemanticDiagnostics(path.value)
    ]
    editor.changeViewZones((accessor) => {
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
        accessor.addZone({
          afterLineNumber: pos.lineNumber - 1,
          heightInLines: 1,
          domNode
        })
      })
    })
  })()
}

onMounted(() => {
  code.value = document.querySelector(`#playground-${uuid.value} > pre`)!.textContent ?? ''
})
onUnmounted(() => {
  disposes.forEach(dispose => dispose())
})
</script>
