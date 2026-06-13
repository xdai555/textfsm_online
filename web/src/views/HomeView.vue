<template>
  <div class="app-container">
    <div class="app-header-wrap">
      <AppHeader />
    </div>
    <el-main>
      <EditorLayout />
    </el-main>
    <el-footer>
      <AppFooter />
    </el-footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTemplateStore } from '../stores/template'
import AppHeader from '../components/AppHeader.vue'
import EditorLayout from '../components/EditorLayout.vue'
import AppFooter from '../components/AppFooter.vue'

const templateStore = useTemplateStore()
onMounted(() => templateStore.fetchSourceList())
</script>

<style scoped>
.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.app-header-wrap {
  flex-shrink: 0;
}
:deep(.el-main) {
  flex: 1;
  padding: 8px !important;
  overflow: hidden;
}
:deep(.el-footer) {
  height: auto !important;
  flex-shrink: 0;
  padding: 0 !important;
}
</style>
