<template>
  <el-tooltip content="清空" placement="left">
    <el-button class="clear-btn" :icon="Delete" size="small" text bg circle @click="handleClear" />
  </el-tooltip>
</template>

<script setup>
import { Delete } from '@element-plus/icons-vue'

const emit = defineEmits(['clear'])

function handleClear() {
  emit('clear')
}
</script>

<style scoped>
.clear-btn {
  opacity: 0.6;
  transition: opacity 0.2s;
}
</style>
