<template>
  <div class="editor-pane" :class="{ 'editor-pane--error': props.error }">
    <div class="action-btn-wrap">
      <DownloadButton :content="currentContent()" :ext="props.ext" />
      <CopyButton :content="currentContent()" />
    </div>
    <div v-show="scrolled" class="scroll-top-btn-wrap">
      <ScrollTopButton :editor-view="editorView" :visible="scrolled" />
    </div>
    <div ref="editorContainer" class="editor-wrap"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { EditorView, keymap, lineNumbers, placeholder as cmPlaceholder } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { textfsm } from '../lang/textfsm.js'
import CopyButton from './CopyButton.vue'
import DownloadButton from './DownloadButton.vue'
import ScrollTopButton from './ScrollTopButton.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  readOnly: { type: Boolean, default: false },
  isDark: { type: Boolean, default: false },
  fontSize: { type: Number, default: 13 },
  lineWrapping: { type: Boolean, default: true },
  langJson: { type: Boolean, default: false },
  langTextfsm: { type: Boolean, default: false },
  ext: { type: String, default: 'txt' },
  error: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const editorContainer = ref(null)
const scrolled = ref(false)
let editorView = null

function currentContent() {
  if (editorView) return editorView.state.doc.toString()
  return props.modelValue
}

function onEditorScroll() {
  if (!editorView) return
  scrolled.value = editorView.scrollDOM.scrollTop > 60
}

const themeCompartment = new Compartment()
const fontSizeCompartment = new Compartment()
const readOnlyCompartment = new Compartment()
const langCompartment = new Compartment()
const placeholderCompartment = new Compartment()
const wrappingCompartment = new Compartment()

const staticExtensions = [
  lineNumbers(),
  history(),
  keymap.of([...defaultKeymap, ...historyKeymap]),
  EditorView.updateListener.of(update => {
    if (update.docChanged && !props.readOnly) {
      emit('update:modelValue', update.state.doc.toString())
    }
  })
]

function themeExtensions() {
  return props.isDark ? oneDark : []
}

function fontSizeExtensions() {
  return EditorView.theme({
    '&': { height: '100%' },
    '.cm-scroller': { overflow: 'auto' },
    '.cm-content': { fontSize: props.fontSize + 'px' },
    '.cm-gutters': { fontSize: props.fontSize + 'px' }
  })
}

function readOnlyExtensions() {
  return EditorState.readOnly.of(props.readOnly)
}

function langExtensions() {
  const exts = []
  if (props.langJson) exts.push(json())
  if (props.langTextfsm) exts.push(textfsm())
  return exts
}

function placeholderExtensions() {
  return props.placeholder ? cmPlaceholder(props.placeholder) : []
}

function wrappingExtensions() {
  return props.lineWrapping ? EditorView.lineWrapping : []
}

onMounted(() => {
  if (!editorContainer.value) return
  editorView = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        ...staticExtensions,
        themeCompartment.of(themeExtensions()),
        fontSizeCompartment.of(fontSizeExtensions()),
        readOnlyCompartment.of(readOnlyExtensions()),
        langCompartment.of(langExtensions()),
        placeholderCompartment.of(placeholderExtensions()),
        wrappingCompartment.of(wrappingExtensions())
      ]
    }),
    parent: editorContainer.value
  })
  editorView.scrollDOM.addEventListener('scroll', onEditorScroll)
})

onUnmounted(() => {
  editorView?.scrollDOM?.removeEventListener('scroll', onEditorScroll)
  editorView?.destroy()
})

watch(() => props.modelValue, (newVal) => {
  if (editorView && editorView.state.doc.toString() !== newVal) {
    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: newVal }
    })
  }
})

watch(() => props.isDark, () => {
  if (!editorView) return
  editorView.dispatch({
    effects: themeCompartment.reconfigure(themeExtensions())
  })
})

watch(() => props.fontSize, () => {
  if (!editorView) return
  editorView.dispatch({
    effects: fontSizeCompartment.reconfigure(fontSizeExtensions())
  })
})

watch(() => props.readOnly, () => {
  if (!editorView) return
  editorView.dispatch({
    effects: readOnlyCompartment.reconfigure(readOnlyExtensions())
  })
})

watch([() => props.langJson, () => props.langTextfsm], () => {
  if (!editorView) return
  editorView.dispatch({
    effects: langCompartment.reconfigure(langExtensions())
  })
})

watch(() => props.placeholder, () => {
  if (!editorView) return
  editorView.dispatch({
    effects: placeholderCompartment.reconfigure(placeholderExtensions())
  })
})

watch(() => props.lineWrapping, () => {
  if (!editorView) return
  editorView.dispatch({
    effects: wrappingCompartment.reconfigure(wrappingExtensions())
  })
})
</script>

<style scoped>
.editor-pane {
  height: 100%;
  position: relative;
}
.editor-wrap {
  height: 100%;
}
.editor-wrap :deep(.cm-editor) {
  height: 100%;
}
.action-btn-wrap {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 10;
  display: flex;
  gap: 0;
  opacity: 0;
  transition: opacity 0.2s;
}
.editor-pane:hover .action-btn-wrap {
  opacity: 1;
}
.scroll-top-btn-wrap {
  position: absolute;
  bottom: 6px;
  right: 6px;
  z-index: 10;
}
.editor-pane--error :deep(.cm-content) {
  color: var(--el-color-danger);
}
</style>
