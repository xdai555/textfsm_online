<template>
  <el-card shadow="never" class="header-card">
    <div class="header-brand">TextFSM Online</div>

    <div class="header-center">
      <el-tooltip placement="bottom" effect="light">
        <template #content>
          ntc-templates: 由 <a href="https://github.com/networktocode/ntc-templates" target="_blank">@networktocode</a>主导的网络设备TextFSM开源模板库<br/>
          Elinpf: ntc-templates 的分支仓库，由 <a href="https://github.com/Elinpf/ntc-templates" target="_blank">@Elinpf</a>更新的国内主流厂商TextFSM模板<br/>
          <br/>
          两者在支持的模板数量、具体的模板内容上会有差异，请根据实际情况使用或者修改
        </template>
        <el-icon class="info-icon" size="16"><InfoFilled /></el-icon>
      </el-tooltip>

      <el-select
        v-model="templateStore.sourceValue"
        filterable
        placeholder="Source"
        class="header-select"
        :loading="templateStore.listLoading"
        @focus="templateStore.sourceOptions.length === 0 && templateStore.fetchSourceList()"
        @change="templateStore.fetchPlatformList()"
      >
        <el-option v-for="item in templateStore.sourceOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-select
        v-model="templateStore.platformValue"
        filterable
        placeholder="Platform"
        class="header-select"
        :loading="templateStore.listLoading"
        @focus="templateStore.sourceValue && templateStore.platformOptions.length === 0 && templateStore.fetchPlatformList()"
        @change="templateStore.fetchTemplateList()"
      >
        <el-option v-for="item in templateStore.platformOptions" :key="item" :label="item" :value="item" />
      </el-select>

      <el-select
        v-model="templateStore.templateValue"
        filterable
        placeholder="TextFSM 模板"
        class="header-select header-select--wide"
        no-data-text="请先选择 Platform"
        :loading="templateStore.listLoading"
        @focus="templateStore.platformValue && templateStore.templateOptions.length === 0 && templateStore.fetchTemplateList()"
        @change="templateStore.fetchLoadTemplate()"
      >
        <el-option v-for="item in templateStore.templateOptions" :key="item" :label="item" :value="item" />
      </el-select>
    </div>

    <div class="header-right">
      <el-tooltip :content="editorStore.horizontal ? '切换为垂直布局' : '切换为水平布局'" placement="bottom">
        <button ref="layoutBtn" class="icon-btn" @click="editorStore.horizontal = !editorStore.horizontal">
          <el-icon><Rank /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip :content="editorStore.lineWrapping ? '关闭自动换行' : '开启自动换行'" placement="bottom">
        <el-switch
          ref="wrapBtn"
          v-model="editorStore.lineWrapping"
          class="wrap-switch"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
        />
      </el-tooltip>
      <div ref="fontSizeArea" class="font-size-ctrl">
        <button class="icon-btn"
          @click="editorStore.fontSize = Math.max(10, editorStore.fontSize - 1)">
          <el-icon><ZoomOut /></el-icon>
        </button>
        <el-tooltip content="点击修改字号" placement="bottom">
          <button class="font-size-value"
          @click="editFontSize"
          @blur="commitFontSize"
          @keydown.enter="$event.target.blur()"
          :contenteditable="editingFontSize"
          @input="pendingFontSize = Number($event.target.textContent) || editorStore.fontSize"
          v-text="editorStore.fontSize"
        ></button>
      </el-tooltip>
        <button class="icon-btn"
          @click="editorStore.fontSize = Math.min(50, editorStore.fontSize + 1)">
          <el-icon><ZoomIn /></el-icon>
        </button>
      </div>
      <el-tooltip :content="themeTooltip" placement="bottom">
        <button class="icon-btn" @click="editorStore.toggleTheme()">
          <transition name="theme-icon" mode="out-in">
            <el-icon v-if="editorStore.mode === 'system'" key="system"><Monitor /></el-icon>
            <el-icon v-else-if="editorStore.mode === 'light'" key="sun"><Sunny /></el-icon>
            <el-icon v-else key="moon"><Moon /></el-icon>
          </transition>
        </button>
      </el-tooltip>
      <el-tooltip content="生成分享链接" placement="bottom">
        <button ref="shareBtn" class="icon-btn" @click="shareStore.openShareDialog()">
          <el-icon><Share /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip v-if="enableBookPromo" content="书籍推荐" placement="bottom">
        <button class="icon-btn" @click="emit('openBookPromo')">
          <el-icon><Reading /></el-icon>
        </button>
      </el-tooltip>
      <el-tooltip placement="bottom" effect="light">
        <template #content>
          - 本站点支持本地部署，点击查看：<a href="https://github.com/xdai555/textfsm_online" target="_blank">GitHub</a>、<a href="https://gitee.com/xdai555/textfsm_online" target="_blank">Gitee</a><br/>
          - 编辑窗口间的分割条支持拖动和双击
        </template>
        <a href="https://github.com/xdai555/textfsm_online" target="_blank" class="icon-btn">
          <el-icon><IconGithub /></el-icon>
        </a>
      </el-tooltip>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { InfoFilled, Rank, ZoomOut, ZoomIn, Sunny, Moon, Monitor, Share, Reading, Check, Close } from '@element-plus/icons-vue'
import { useTemplateStore } from '../stores/template'
import { useEditorStore } from '../stores/editor'
import { useShareStore } from '../stores/share'
import { enableBookPromo } from '../utils/feature'

const templateStore = useTemplateStore()
const editorStore = useEditorStore()
const shareStore = useShareStore()

const layoutBtn = ref(null)
const wrapBtn = ref(null)
const fontSizeArea = ref(null)
const shareBtn = ref(null)

defineExpose({ layoutBtn, wrapBtn, fontSizeArea, shareBtn })

const emit = defineEmits(['openBookPromo'])

const themeTooltip = computed(() => {
  const labels = { system: '跟随系统', light: '浅色', dark: '深色' }
  return labels[editorStore.mode]
})

const editingFontSize = ref(false)
const pendingFontSize = ref(13)

function editFontSize() {
  pendingFontSize.value = editorStore.fontSize
  editingFontSize.value = true
}

function commitFontSize() {
  editingFontSize.value = false
  const v = Math.min(50, Math.max(10, pendingFontSize.value))
  editorStore.fontSize = v
}
</script>

<style scoped>
.header-card {
  --el-card-border-radius: 0;
  border-top: none;
  border-left: none;
  border-right: none;
}
.header-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 4px 12px;
  gap: 6px;
}
.header-brand {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}
.header-center {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  justify-content: center;
}
.info-icon {
  color: var(--el-text-color-secondary);
  cursor: help;
  flex-shrink: 0;
}
.header-select {
  flex: 1;
  min-width: 80px;
  max-width: 160px;
}
.header-select--wide {
  max-width: 240px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
@media (max-width: 768px) {
  .header-card :deep(.el-card__body) {
    padding: 4px 8px;
    gap: 4px;
  }
  .header-brand {
    font-size: 13px;
  }
  .header-select {
    min-width: 60px;
    max-width: none;
  }
  .header-select--wide {
    flex: 2;
  }
  .font-size-ctrl {
    display: none;
  }
}
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--el-text-color-regular);
  border-radius: 6px;
  transition: background-color 0.2s, color 0.2s;
}
.icon-btn:hover {
  background: var(--el-fill-color-light);
  color: var(--el-color-primary);
}
.wrap-switch {
  --el-switch-on-color: var(--el-text-color-regular);
  --el-switch-off-color: var(--el-fill-color);
  --el-switch-core-border-color: var(--el-border-color);
}
.wrap-switch:hover {
  --el-switch-on-color: var(--el-color-primary);
}
.icon-btn img,
.icon-btn svg {
  width: 18px;
  height: 18px;
}
.icon-btn .el-icon {
  font-size: 18px;
}
.font-size-ctrl {
  display: flex;
  align-items: center;
  gap: 2px;
}
.font-size-value {
  min-width: 22px;
  height: 20px;
  padding: 0 2px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  border: none;
  outline: none;
  cursor: pointer;
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-light);
  border-radius: 4px;
  transition: background-color 0.2s;
  line-height: 20px;
  -moz-appearance: textfield;
  white-space: nowrap;
}
.font-size-value:hover {
  background: var(--el-fill-color);
}
.font-size-value[contenteditable="true"] {
  cursor: text;
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
}
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.theme-icon-enter-from {
  transform: rotate(-90deg) scale(0.6);
  opacity: 0;
}
.theme-icon-leave-to {
  transform: rotate(90deg) scale(0.6);
  opacity: 0;
}
</style>
