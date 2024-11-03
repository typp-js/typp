<template>
  <div class="playground">
    <Editor
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
  padding: 4px 0;
  padding-right: 4px;
  height: 200px;
}
</style>
<script lang="ts" setup>
import { Editor } from '@guolao/vue-monaco-editor'

import type Monaco from 'monaco-editor'
import { useData } from 'vitepress'
import { ref, computed } from 'vue'

import { extraLibs } from '#define/extraLibs.ts'

const props = defineProps<{
  code: string
}>()
const data = useData()
const path = ref('file:///index.ts')

const trimIndent = (code: string) => {
  const lines = code.split('\n')
  const indent = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)![0].length)
    .reduce((min, indent) => Math.min(min, indent), Infinity)
  return lines.map((line) => line.slice(indent)).join('\n')
}

const trimmedCode = computed(() => trimIndent(props.code.trim()) + '\n')
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

const onEditorMounted = (
  editor: Monaco.editor.IStandaloneCodeEditor,
  monaco: typeof Monaco
) => {
  forkTheme(monaco)

  const ts = monaco.languages.typescript
  const ls = monaco.languages.typescript.typescriptDefaults
  editor.setValue('')
  extraLibs.forEach(({ filePath, content }) => {
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
      name: string,
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
}
</script>
