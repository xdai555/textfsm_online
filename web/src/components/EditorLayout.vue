<template>
  <Splitpanes class="default-theme" :horizontal="editorStore.horizontal" style="height: 100%">
    <Pane min-size="10">
      <el-card shadow="never" class="editor-card">
        <EditorPane
          v-model="templateStore.rawText"
          placeholder="请输入原始 CLI 内容"
          :is-dark="editorStore.isDark"
          :font-size="editorStore.fontSize"
          ext="txt"
        />
      </el-card>
    </Pane>
    <Pane min-size="10">
      <el-card shadow="never" class="editor-card">
        <EditorPane
          v-model="templateStore.templateText"
          placeholder="请输入 TextFSM 模板内容"
          :is-dark="editorStore.isDark"
          :font-size="editorStore.fontSize"
          :lang-textfsm="true"
          ext="textfsm"
        />
      </el-card>
    </Pane>
    <Pane min-size="10">
      <el-card shadow="never" class="editor-card" :class="{ 'editor-card--error': templateStore.parseError }">
        <EditorPane
          :model-value="templateStore.result"
          placeholder="尚未匹配到结果..."
          :read-only="true"
          :is-dark="editorStore.isDark"
          :font-size="editorStore.fontSize"
          :lang-json="!templateStore.parseError"
          ext="json"
          :error="templateStore.parseError"
        />
      </el-card>
    </Pane>
  </Splitpanes>
</template>

<script setup>
import { Splitpanes, Pane } from 'splitpanes'
import EditorPane from './EditorPane.vue'
import { useTemplateStore } from '../stores/template'
import { useEditorStore } from '../stores/editor'

const templateStore = useTemplateStore()
const editorStore = useEditorStore()
</script>

<style scoped>
.editor-card {
  height: 100%;
  --el-card-border-radius: 10px;
}
.editor-card :deep(.el-card__body) {
  height: 100%;
  padding: 0;
  border-radius: 10px;
  overflow: hidden;
}
.editor-card--error {
  border-color: var(--el-color-danger-light-5);
}
.editor-card--error :deep(.el-card__body) {
  border-color: var(--el-color-danger-light-5);
}
</style>
