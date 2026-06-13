<template>
  <el-button class="scroll-top-btn" :icon="ArrowUp" size="small" text bg circle @click="handleScrollTop" />
</template>

<script setup>
import { ArrowUp } from '@element-plus/icons-vue'

const props = defineProps({
  editorView: { type: Object, default: null }
})

function handleScrollTop() {
  if (props.editorView) {
    props.editorView.scrollDOM.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.scroll-top-btn {
  transition: opacity 0.2s;
}
</style>
