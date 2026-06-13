<template>
  <div class="app-footer">
    <span class="footer-links">
      <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2022010024号</a>
      <span class="footer-sep">|</span>
      <a href="https://github.com/xdai555/" target="_blank">Copyright © <el-icon :size="14"><IconGithub /></el-icon></a>
      <span class="footer-sep">|</span>
      <el-tooltip :content="t('footer.textfsmTutorialTooltip')" placement="top" :show-after="300">
        <a href="https://mp.weixin.qq.com/s/ZA_CXNL2O4zSGEpr26KV5A" target="_blank">{{ t('footer.textfsmTutorial') }}</a>
      </el-tooltip>
      <span class="footer-sep">|</span>
      <el-tooltip :content="t('footer.netaxeTooltip')" placement="top" :show-after="300">
        <a href="https://netaxe.github.io/" target="_blank">{{ t('footer.netaxe') }}</a>
      </el-tooltip>
      <span class="footer-sep">|</span>
      <a href="https://support.qq.com/products/447487/" target="_blank">{{ t('footer.feedback') }}</a>
      <span class="footer-sep">|</span>
      <a class="lang-switch" @click="toggleLocale">{{ locale === 'en' ? '中文' : 'English' }}</a>
    </span>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { setLocale } from '../i18n'

const { locale, t } = useI18n()

function toggleLocale() {
  setLocale(locale.value === 'en' ? 'zh-CN' : 'en')
}
</script>

<style scoped>
.app-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.footer-links a {
  color: var(--el-text-color-regular);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  cursor: pointer;
}
.footer-links a:hover {
  color: var(--el-color-primary);
}
.footer-sep {
  margin: 0 2px;
  color: var(--el-border-color);
}
</style>
