<template>
  <div class="app-footer">
    <span class="footer-links">
      <a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2022010024号</a>
      <span class="footer-sep">|</span>
      <a href="https://github.com/xdai555/" target="_blank">Copyright © <el-icon :size="14"><IconGithub /></el-icon></a>
      <span class="footer-sep">|</span>
      <a href="https://mp.weixin.qq.com/s/ZA_CXNL2O4zSGEpr26KV5A" target="_blank">@NetDevOps加油站：深入浅出TextFSM 终极版教程</a>
      <span class="footer-sep">|</span>
      <a href="https://netaxe.github.io/" target="_blank">@iflytek/NetAxe：国产网络自动化领域解决方案框架</a>
      <span class="footer-sep">|</span>
      <a href="https://support.qq.com/products/447487/" target="_blank">意见反馈</a>
    </span>
  </div>
</template>

<script setup>
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
}
.footer-links a:hover {
  color: var(--el-color-primary);
}
.footer-sep {
  margin: 0 2px;
  color: var(--el-border-color);
}
</style>
