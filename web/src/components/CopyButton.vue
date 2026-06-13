<template>
  <el-button class="copy-btn" :icon="CopyDocument" size="small" text bg circle @click="handleCopy" />
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  content: { type: String, default: '' }
})

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.content)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = props.content
    ta.style.cssText = 'position:fixed;opacity:0'
    ta.setAttribute('readonly', '')
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  ElMessage({ message: t('copy.copied'), type: 'success', plain: true })
}
</script>

<style scoped>
.copy-btn {
  transition: opacity 0.2s;
}
</style>
