<template>
  <el-tooltip v-model:visible="tipVisible" :content="t('scrollTop')" placement="top">
    <el-button class="scroll-top-btn" :icon="ArrowUp" size="small" text bg circle @click="handleScrollTop" />
  </el-tooltip>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ArrowUp } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  editorView: { type: Object, default: null },
  visible: { type: Boolean, default: false }
})

const tipVisible = ref(false)
let shown = false

watch(() => props.visible, (val) => {
  if (val && !shown) {
    tipVisible.value = true
    shown = true
    setTimeout(() => { tipVisible.value = false }, 1000)
  }
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
