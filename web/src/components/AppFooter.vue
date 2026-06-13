<template>
  <div class="app-footer">
    <span class="footer-links">
      <a href="https://beian.miit.gov.cn/" target="_blank" data-tip="京ICP备2022010024号">京ICP备2022010024号</a>
      <span class="footer-sep">|</span>
      <a href="https://github.com/xdai555/" target="_blank" data-tip="Copyright © @xdai555">@xdai555</a>
      <span class="footer-sep">|</span>
      <a href="https://mp.weixin.qq.com/s/ZA_CXNL2O4zSGEpr26KV5A" target="_blank" data-tip="@NetDevOps加油站：深入浅出TextFSM 终极版教程">TextFSM 教程</a>
      <span class="footer-sep">|</span>
      <a href="https://netaxe.github.io/" target="_blank" data-tip="@iflytek/NetAxe：国产网络自动化领域解决方案框架">NetAxe</a>
      <span class="footer-sep">|</span>
      <a href="https://support.qq.com/products/447487/" target="_blank">反馈</a>
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
  position: relative;
}
.footer-links a:hover {
  color: var(--el-color-primary);
}
.footer-links a[data-tip]:hover::after {
  content: attr(data-tip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  color: var(--el-text-color-regular);
  box-shadow: var(--el-box-shadow-light);
  z-index: 100;
}
.footer-sep {
  margin: 0 2px;
  color: var(--el-border-color);
}
</style>
