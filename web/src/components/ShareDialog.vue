<template>
  <el-dialog
    :title="shareStore.dialogMode === 'link' ? t('share.titleLink') : t('share.titleOption')"
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
        <span>{{ t('share.createdAt') }}<el-text tag="span">{{ formatLocalTime(shareStore.createdAt) }}</el-text></span>
        <span>{{ t('share.expiresAt') }}<el-text type="danger" tag="span">{{ formatLocalTime(shareStore.expiresAt) }}</el-text></span>
      </div>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        class="share-alert"
      >
        <template #default>
          <span class="share-alert-text">{{ t('share.alertText') }}</span>
        </template>
      </el-alert>
    </template>

    <template v-else>
      <p class="share-option-desc">{{ t('share.optionDesc') }}</p>
      <el-space direction="vertical" :size="8" fill class="share-option-btns">
        <el-button type="primary" @click="shareStore.updateCurrentShare()">
          {{ t('share.updateBtn') }}
        </el-button>
        <el-button type="success" @click="shareStore.createNewShare()">
          {{ t('share.createBtn') }}
        </el-button>
      </el-space>
    </template>

    <template #footer v-if="shareStore.dialogMode === 'link'">
      <div class="dialog-footer">
        <el-button type="primary" @click="shareStore.closeShareDialog()">{{ t('share.confirmBtn') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useShareStore } from '../stores/share'
import CopyButton from './CopyButton.vue'
import { useI18n } from 'vue-i18n'
import { getCurrentLocale } from '../i18n'

const { t } = useI18n()
const shareStore = useShareStore()

function formatLocalTime(dateTimeStr) {
  if (!dateTimeStr) return t('share.timeUnknown')
  const d = new Date(dateTimeStr + 'Z')
  if (isNaN(d.getTime())) return t('share.timeInvalid')
  const appLocale = getCurrentLocale()
  return d.toLocaleString(appLocale === 'en' ? 'en-US' : 'zh-CN', {
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
