<template>
  <div class="playground">
    <div class="top-bar">
      <div class="left"></div>
      <div class="right">
        <span
          class="material-symbols-rounded"
          @click="editable = !editable"
        >{{ editable ? 'lock_open' : 'lock' }}</span>
        <span
          class="material-symbols-rounded"
          @click="copy"
        >content_copy{{ copyStatusSuffix }}</span>
        <span class="material-symbols-rounded">link</span>
        <span class="material-symbols-rounded">report</span>
        <span class="material-symbols-rounded">open_in_new</span>
      </div>
    </div>
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
    <div class="bottom-bar">
      <div class="left">
        <span class="material-symbols-rounded">keyboard_double_arrow_down</span>
      </div>
      <span>Powered by <a
          href="https://microsoft.github.io/monaco-editor/"
          target="_blank"
        >Monaco Editor</a>.&nbsp;&nbsp;</span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.playground {
  --radius: 8px;
  --shadow: 0 8px 16px rgba(0, 0, 0, .1);

  display: flex;
  flex-direction: column;

  margin-top: 20px;
  min-height: 150px;

  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0));
  transition: .2s;
  &:hover {
    filter: drop-shadow(var(--shadow));
  }
  &.xl {
    .top-bar, .bottom-bar {
      > .left, > .right {
        .material-symbols-rounded {
          padding: 12px;
          font-size: 24px;
        }
      }
    }
  }
}
.dark .playground {
  --shadow: 0 8px 16px rgba(0, 0, 0, .4);
}
.top-bar, .bottom-bar {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);

  font-size: 12px;
  overflow: hidden;
  > .left, > .right {
    display: flex;
    align-items: center;

    .material-symbols-rounded {
      padding: 4px;

      font-size: 18px;
      user-select: none;
      cursor: pointer;

      transition: .2s;
      &:hover {
        color: var(--vp-c-brand-1);
        background-color: var(--vp-c-bg);
      }
    }
  }
}
.top-bar {
  border-radius: var(--radius) var(--radius) 0 0;
  border-bottom: none;
}
.bottom-bar {
  border-radius: 0 0 var(--radius) var(--radius);
  border-top: none;
}
.editor {
  flex: 1;
  height: 0 !important;

  border: 1px solid var(--vp-c-divider);
}
.playground > :deep(.language-ts) {
  display: none !important;
}
</style>
<script lang="ts" setup>
import { Editor } from '@guolao/vue-monaco-editor'

import type Monaco from 'monaco-editor'
import { useData } from 'vitepress'
import {
  VNode,
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch
} from 'vue'

import { trimIndent } from '#utils/trimIndent.ts'
import { initMonacoEditor } from './initMonacoEditor'

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
const editable = ref(false)
const editorRef = ref<Monaco.editor.IStandaloneCodeEditor>()
const copyStatusSuffix = ref('')

const navigator = window.navigator
const copy = () => {
  try {
    navigator.clipboard.writeText(trimmedCode.value)
    copyStatusSuffix.value = 'check'
    setTimeout(() => {
      copyStatusSuffix.value = ''
    }, 1000)
  } catch {
    copyStatusSuffix.value = 'report'
  }
}

const [vnode] = slots.default()
vnode.props ??= {}
vnode.props.id = `playground-${uuid.value}`

const trimmedCode = computed(() => trimIndent(code.value.trim()) + '\n')
const theme = computed(() => data.isDark.value ? 'vs-dark' : 'vs-fork')

const MONACO_EDITOR_OPTIONS:
  Monaco.editor.IStandaloneEditorConstructionOptions = {
    tabSize: 2,

    readOnly: !editable.value,
    // https://github.com/microsoft/monaco-editor/issues/311#issuecomment-578026465
    renderValidationDecorations: 'on',

    automaticLayout: true,

    minimap: { enabled: false },
    fontSize: 14
  }

watch(
  () => editable.value,
  (value) => {
    if (!editorRef.value) return

    editorRef.value.updateOptions({ readOnly: !value })
  }
)

const disposes = reactive<(() => void)[]>([])

const onEditorMounted = (
  editor: Monaco.editor.IStandaloneCodeEditor,
  monaco: typeof Monaco
) => {
  editorRef.value = editor
  disposes.push(initMonacoEditor(editor, monaco))
}

onMounted(() => {
  code.value =
    document.querySelector(`#playground-${uuid.value} > pre`)!.textContent ?? ''
})
onUnmounted(() => {
  disposes.forEach(dispose => dispose())
})
</script>
