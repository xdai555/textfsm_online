<template>
  <el-dialog
    title="广而告之——书籍推荐"
    v-model="visible"
    width="50%"
    :before-close="handleClose"
    class="book-dialog"
  >
    <div class="book-columns">
      <div class="book-col">
        <h3 class="book-title book-title--blue">《Python网络运维自动化》</h3>
        <p>💪公众号 @NetDevOps加油站 九净老师出品</p>
        <p>📢网络工程师升级必读</p>
        <p>🔥十余年 NetDevOps 实战经验全公开</p>
        <p>📖历时 4 轮迭代重构</p>
        <p>🤞浓缩 40 万字手稿精华</p>
        <p>✅零基础到实战</p>
        <p>💻文/图/代码三结合</p>
        <p>🚀京东自营，特惠购买，赶快下单吧！</p>
        <p><a href="https://item.jd.com/14933278.html" target="_blank">点击购买</a></p>
      </div>
      <div class="book-col">
        <h3 class="book-title book-title--green">《网络工程师的AI之路：基于大语言模型的运维实战》</h3>
        <p>🚀首部LLM网络运维实战指南，让AI从"黑科技"变成工程师的高效工具！</p>
        <p>🔧详解LangChain模块，教你集成LLM构建智能运维工具链</p>
        <p>🌐支持云端ChatGPT与本地LLaMA/DeepSeek等模型，满足不同需求</p>
        <p>📚采用RAG技术，通过外部知识库提升LLM应答准确性</p>
        <p>🛠️运用MCP策略实现多模型协作，优化复杂问题处理流程</p>
        <p>💡真实案例覆盖配置生成、日志分析等场景，提供可复现代码</p>
        <p>🚀京东自营，特惠购买，赶快下单吧！</p>
        <p><a href="https://u.jd.com/YDwsheV" target="_blank">点击购买</a></p>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" size="small" @click="handleClose">知道了，这就去下单</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)

const EXPIRY_DAYS = 15
const STORAGE_KEY = 'textfsm-visit-data'

function checkVisit() {
  const now = Date.now()
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    visible.value = true
    setExpiry(now)
    return
  }
  try {
    const data = JSON.parse(stored)
    if (now > data.expiry) {
      visible.value = true
      setExpiry(now)
    }
  } catch {
    visible.value = true
    setExpiry(now)
  }
}

function setExpiry(now) {
  const expiry = now + EXPIRY_DAYS * 24 * 60 * 60 * 1000
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ visited: true, expiry }))
}

function handleClose() {
  visible.value = false
}

defineExpose({ open: () => { visible.value = true } })

onMounted(() => checkVisit())
</script>

<style scoped>
.book-columns {
  display: flex;
  gap: 20px;
}
.book-col {
  flex: 1;
  text-align: center;
}
.book-col:first-child {
  border-right: 1px solid var(--el-border-color-lighter);
  padding-right: 20px;
}
.book-col:last-child {
  padding-left: 20px;
}
.book-title {
  margin: 0 0 8px;
}
.book-title--blue {
  color: var(--el-color-primary);
}
.book-title--green {
  color: var(--el-color-success);
}
.book-col p {
  margin: 0 0 8px;
}
.book-col p:last-child {
  margin-bottom: 0;
}
.book-col a:hover {
  text-decoration: underline;
}
.dialog-footer {
  text-align: center;
}
@media (max-width: 640px) {
  .book-columns {
    flex-direction: column;
  }
  .book-col:first-child {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
    padding-bottom: 16px;
  }
  .book-col:last-child {
    padding-left: 0;
    padding-top: 16px;
  }
}
</style>

<style>
.book-dialog .el-dialog__header {
  text-align: center;
}
</style>
