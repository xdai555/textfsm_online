import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createShare, updateShare, getShare } from '../api'
import { useTemplateStore } from './template'
import { ElMessage } from 'element-plus'
import { t } from '../i18n'

export const useShareStore = defineStore('share', () => {
  const currentShareId = ref(null)
  const shareLink = ref('')
  const createdAt = ref(null)
  const expiresAt = ref(null)
  const dialogVisible = ref(false)
  const dialogMode = ref('link')
  const loadedFromURL = ref(false)
  let lastPayload = null

  function initFromURL() {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('shareId')
    if (id) {
      currentShareId.value = id
      loadedFromURL.value = true
    }
  }

  async function loadShareData() {
    if (!currentShareId.value) return
    try {
      const data = await getShare(currentShareId.value)
      if (data.error) {
        ElMessage.error(t('shareStore.errorNotFound'))
        return
      }
      const ts = useTemplateStore()
      ts.rawText = data.raw_text || ''
      ts.templateText = data.template_text || ''
      ts.sourceValue = data.source_value || ''
      ts.platformValue = data.platform_value || ''
      ts.templateValue = data.template_value || ''
      createdAt.value = data.created_at
      expiresAt.value = data.expires_at
      if (ts.platformValue && ts.sourceValue) ts.fetchTemplateList()
    } catch {
      ElMessage.error(t('shareStore.errorLoad'))
    }
  }

  function _buildPayload() {
    const ts = useTemplateStore()
    return {
      rawText: ts.rawText, templateText: ts.templateText,
      sourceValue: ts.sourceValue, platformValue: ts.platformValue,
      templateValue: ts.templateValue
    }
  }

  async function openShareDialog() {
    if (loadedFromURL.value) {
      dialogMode.value = 'option'
      dialogVisible.value = true
      return
    }
    const payload = _buildPayload()
    if (currentShareId.value && _payloadEqual(payload, lastPayload)) {
      dialogMode.value = 'link'
      dialogVisible.value = true
      return
    }
    await createNewShare()
  }

  function _onShareSuccess(data, payload) {
    currentShareId.value = data.share_id
    shareLink.value = `${window.location.origin}${window.location.pathname}?shareId=${data.share_id}`
    createdAt.value = data.created_at
    expiresAt.value = data.expires_at
    lastPayload = payload
    dialogMode.value = 'link'
    dialogVisible.value = true
  }

  async function createNewShare() {
    const payload = _buildPayload()
    try {
      const data = await createShare(payload)
      if (data?.share_id) {
        _onShareSuccess(data, payload)
      } else {
        ElMessage.error(t('shareStore.errorCreate'))
      }
    } catch {
      ElMessage.error(t('shareStore.errorCreate'))
    }
  }

  async function updateCurrentShare() {
    if (!currentShareId.value) return
    const payload = _buildPayload()
    try {
      const data = await updateShare(currentShareId.value, payload)
      if (data?.share_id) {
        _onShareSuccess(data, payload)
      } else {
        ElMessage.error(t('shareStore.errorUpdate'))
        dialogVisible.value = false
      }
    } catch {
      ElMessage.error(t('shareStore.errorUpdate'))
      dialogVisible.value = false
    }
  }

  function _payloadEqual(a, b) {
    if (!a || !b) return false
    return Object.keys(a).every(k => a[k] === b[k])
  }

  function closeShareDialog() {
    dialogVisible.value = false
  }

  return {
    currentShareId, shareLink, createdAt, expiresAt,
    dialogVisible, dialogMode,
    initFromURL, loadShareData, openShareDialog,
    createNewShare, updateCurrentShare, closeShareDialog
  }
})
