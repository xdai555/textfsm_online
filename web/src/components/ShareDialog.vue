<template>
  <el-dialog
    :title="shareStore.dialogMode === 'link' ? '分享链接' : '分享选项'"
    v-model="shareStore.dialogVisible"
    width="520px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="shareStore.closeShareDialog()"
  >
    <template v-if="shareStore.dialogMode === 'link'">
      <el-input v-model="shareStore.shareLink" readonly>
        <template #append>
          <CopyButton :content="shareStore.shareLink" />
        </template>
      </el-input>
      <div class="share-time">
        <span>创建时间：<el-text tag="span">{{ formatLocalTime(shareStore.createdAt) }}</el-text></span>
        <span>过期时间：<el-text type="danger" tag="span">{{ formatLocalTime(shareStore.expiresAt) }}</el-text></span>
      </div>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        class="share-alert"
      >
        <template #default>
          <span class="share-alert-text">分享链接仅用于临时存储，任何持有链接的人都可查看或更新内容，请勿分享给非信任用户。</span>
        </template>
      </el-alert>
    </template>

    <template v-else>
      <p class="share-option-desc">您正在查看一个分享链接，可以选择以下操作：</p>
      <el-space direction="vertical" :size="8" fill class="share-option-btns">
        <el-button type="primary" @click="shareStore.updateCurrentShare()">
          更新当前链接（覆盖内容 · 延长7天）
        </el-button>
        <el-button type="success" @click="shareStore.createNewShare()">
          创建新链接（生成全新链接）
        </el-button>
      </el-space>
    </template>

    <template #footer v-if="shareStore.dialogMode === 'link'">
      <div class="dialog-footer">
        <el-button type="primary" @click="shareStore.closeShareDialog()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useShareStore } from '../stores/share'
import CopyButton from './CopyButton.vue'

const shareStore = useShareStore()

function formatLocalTime(dateTimeStr) {
  if (!dateTimeStr) return '未知'
  const d = new Date(dateTimeStr + 'Z')
  if (isNaN(d.getTime())) return '无效时间'
  return d.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  })
}
</script>

<style scoped>
.share-time {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.share-alert {
  margin-top: 16px;
}
.share-option-desc {
  margin: 0 0 16px;
}
.share-option-btns {
  width: 100%;
}
.share-option-btns .el-button {
  width: 100%;
}
.dialog-footer {
  text-align: center;
}
</style>
