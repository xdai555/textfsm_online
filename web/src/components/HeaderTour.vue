<template>
  <el-tour v-model="open" :mask="{ color: 'rgba(0,0,0,0.15)' }" @close="onClose" @finish="onClose">
    <el-tour-step
      :target="layoutBtn"
      title="布局切换"
      description="点击切换编辑器的水平与垂直分栏布局"
      placement="bottom"
    />
    <el-tour-step
      :target="wrapBtn"
      title="自动换行"
      description="切换编辑器是否自动换行，关闭后可横向滚动查看长行"
      placement="bottom"
    />
    <el-tour-step
      :target="fontSizeArea"
      title="字号调整"
      description="点击数字直接修改字号，或使用加减按钮微调"
      placement="bottom"
    />
    <el-tour-step
      :target="shareBtn"
      title="分享链接"
      description="生成临时分享链接，与他人共享你的模板和解析结果"
      placement="bottom"
    />
  </el-tour>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  layoutBtn: { type: Object, default: null },
  wrapBtn: { type: Object, default: null },
  fontSizeArea: { type: Object, default: null },
  shareBtn: { type: Object, default: null }
})

const open = ref(false)
const STORAGE_KEY = 'textfsm-tour-done'

function onClose() {
  localStorage.setItem(STORAGE_KEY, 'true')
}

onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    open.value = true
  }
})

defineExpose({
  open: () => { open.value = true }
})
</script>
