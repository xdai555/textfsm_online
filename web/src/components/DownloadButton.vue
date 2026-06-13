<template>
  <el-button class="download-btn" :icon="Download" size="small" text bg circle @click="handleDownload" />
</template>

<script setup>
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  content: { type: String, default: '' },
  filename: { type: String, default: 'download.txt' }
})

function handleDownload() {
  if (!props.content.trim()) {
    ElMessage({ message: '暂无内容可下载保存', type: 'info', plain: true })
    return
  }
  ElMessage({ message: '即将下载保存', type: 'info', plain: true })
  setTimeout(() => {
    const ts = new Date().toISOString().replace(/[-T:.]/g, '').slice(0, 14)
    const dot = props.filename.lastIndexOf('.')
    const name = dot > 0 ? `${props.filename.slice(0, dot)}_${ts}${props.filename.slice(dot)}` : `${props.filename}_${ts}`
    const blob = new Blob([props.content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, 1000)
}
</script>

<style scoped>
.download-btn {
  transition: opacity 0.2s;
}
</style>
