<template>
  <Splitpanes class="default-theme" :horizontal="editorStore.horizontal" style="height: 100%">
    <Pane min-size="10">
      <el-card shadow="never" class="editor-card">
        <EditorPane
          v-model="templateStore.rawText"
          :placeholder="t('editor.placeholderRaw')"
          :is-dark="editorStore.isDark"
          :font-size="editorStore.fontSize"
          :line-wrapping="editorStore.lineWrapping"
          filename="rawcontent.txt"
          @clear="templateStore.rawText = ''"
        />
      </el-card>
    </Pane>
    <Pane min-size="10">
      <el-card shadow="never" class="editor-card">
        <EditorPane
          v-model="templateStore.templateText"
          :placeholder="t('editor.placeholderTemplate')"
          :is-dark="editorStore.isDark"
          :font-size="editorStore.fontSize"
          :line-wrapping="editorStore.lineWrapping"
          :lang-textfsm="true"
          filename="template.textfsm"
          @clear="templateStore.templateText = ''"
        />
      </el-card>
    </Pane>
    <Pane min-size="10">
      <el-card shadow="never" class="editor-card" :class="{ 'editor-card--error': templateStore.parseError }">
        <EditorPane
          :model-value="templateStore.result"
          :placeholder="t('editor.placeholderResult')"
          :read-only="true"
          :is-dark="editorStore.isDark"
          :font-size="editorStore.fontSize"
          :line-wrapping="editorStore.lineWrapping"
          :lang-json="!templateStore.parseError"
          filename="result.json"
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
