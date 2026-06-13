<template>
  <el-button class="download-btn" :icon="Download" size="small" text bg circle @click="handleDownload" />
</template>

<script setup>
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  content: { type: String, default: '' },
  filename: { type: String, default: 'download.txt' }
})

function handleDownload() {
  if (!props.content.trim()) {
    ElMessage({ message: t('download.noContent'), type: 'info', plain: true })
    return
  }
  ElMessage({ message: t('download.starting'), type: 'info', plain: true })
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
