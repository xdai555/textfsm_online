<template>
  <div class="app-container">
    <div class="app-header-wrap">
      <AppHeader ref="appHeaderRef" @open-book-promo="openBookPromo" />
    </div>
    <el-main>
      <EditorLayout />
    </el-main>
    <el-footer>
      <AppFooter />
    </el-footer>
    <ShareDialog />
    <BookPromoDialog v-if="enableBookPromo" ref="bookPromoRef" />
    <HeaderTour
      :layout-btn="appHeaderRef?.layoutBtn"
      :wrap-btn="appHeaderRef?.wrapBtn"
      :font-size-area="appHeaderRef?.fontSizeArea"
      :share-btn="appHeaderRef?.shareBtn"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTemplateStore } from '../stores/template'
import { useShareStore } from '../stores/share'
import AppHeader from '../components/AppHeader.vue'
import EditorLayout from '../components/EditorLayout.vue'
import AppFooter from '../components/AppFooter.vue'
import ShareDialog from '../components/ShareDialog.vue'
import BookPromoDialog from '../components/BookPromoDialog.vue'
import HeaderTour from '../components/HeaderTour.vue'
import { enableBookPromo } from '../utils/feature'

const templateStore = useTemplateStore()
const shareStore = useShareStore()
const bookPromoRef = ref(null)
const appHeaderRef = ref(null)

onMounted(() => {
  templateStore.fetchSourceList()

  shareStore.initFromURL()
  if (shareStore.currentShareId) shareStore.loadShareData()
})

function openBookPromo() {
  if (bookPromoRef.value) bookPromoRef.value.open()
}
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
