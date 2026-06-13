<template>
  <el-button class="download-btn" :icon="Download" size="small" text @click="handleDownload" />
</template>

<script setup>
import { Download } from '@element-plus/icons-vue'

const props = defineProps({
  content: { type: String, default: '' },
  ext: { type: String, default: 'txt' }
})

function handleDownload() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const blob = new Blob([props.content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${ts}.${props.ext}`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
</script>

<style scoped>
.download-btn {
  transition: opacity 0.2s;
}
</style>
