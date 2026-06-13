<template>
  <el-config-provider :size="'small'" :locale="epLocale">
    <HomeView />
  </el-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import HomeView from './views/HomeView.vue'

const { locale } = useI18n()

const epLocale = computed(() => locale.value === 'en' ? en : zhCn)
</script>
