<template>
  <el-tour v-model="open" :mask="{ color: 'rgba(0,0,0,0.15)' }" @close="onClose" @finish="onClose">
    <el-tour-step
      :target="layoutBtn"
      :title="t('tour.layoutTitle')"
      :description="t('tour.layoutDesc')"
      placement="bottom"
    />
    <el-tour-step
      :target="wrapBtn"
      :title="t('tour.wrapTitle')"
      :description="t('tour.wrapDesc')"
      placement="bottom"
    />
    <el-tour-step
      :target="fontSizeArea"
      :title="t('tour.fontSizeTitle')"
      :description="t('tour.fontSizeDesc')"
      placement="bottom"
    />
    <el-tour-step
      :target="shareBtn"
      :title="t('tour.shareTitle')"
      :description="t('tour.shareDesc')"
      placement="bottom"
    />
  </el-tour>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
