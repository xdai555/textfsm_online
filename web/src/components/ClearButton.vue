<template>
  <el-button class="clear-btn" :icon="Delete" size="small" text bg circle @click="handleClear" />
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
  transition: opacity 0.2s;
}
</style>
