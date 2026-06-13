import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/shared'
import { ElMessage } from 'element-plus'
import { fetchList, parseTextFSM } from '../api'
import { t } from '../i18n'

const STORAGE_KEYS = {
  rawText: 'textfsm_raw_text',
  templateText: 'textfsm_template_text',
  sourceValue: 'textfsm_source',
  platformValue: 'textfsm_platform',
  templateValue: 'textfsm_template'
}

function loadFromStorage(key) {
  return localStorage.getItem(key) || ''
}

function saveToStorage(key, value) {
  if (value) localStorage.setItem(key, value)
  else localStorage.removeItem(key)
}

export const useTemplateStore = defineStore('template', () => {
  const sourceOptions = ref([])
  const sourceValue = ref(loadFromStorage(STORAGE_KEYS.sourceValue))
  const platformOptions = ref([])
  const platformValue = ref(loadFromStorage(STORAGE_KEYS.platformValue))
  const templateOptions = ref([])
  const templateValue = ref(loadFromStorage(STORAGE_KEYS.templateValue))

  const rawText = ref(loadFromStorage(STORAGE_KEYS.rawText))
  const templateText = ref(loadFromStorage(STORAGE_KEYS.templateText))
  const result = ref('')
  const parseError = ref(false)

  const listLoading = ref(false)
  const parseLoading = ref(false)

  watch(sourceValue, (val) => {
    saveToStorage(STORAGE_KEYS.sourceValue, val)
    platformOptions.value = []
    platformValue.value = ''
    templateOptions.value = []
    templateValue.value = ''
  })

  watch(platformValue, (val) => {
    saveToStorage(STORAGE_KEYS.platformValue, val)
    templateOptions.value = []
    templateValue.value = ''
  })

  watch(templateValue, (val) => saveToStorage(STORAGE_KEYS.templateValue, val))
  watch(rawText, (val) => saveToStorage(STORAGE_KEYS.rawText, val))
  watch(templateText, (val) => saveToStorage(STORAGE_KEYS.templateText, val))

  async function loadList(apiPath, params, dataKey, optionsRef, errorMsg) {
    listLoading.value = true
    try {
      optionsRef.value = await fetchList(apiPath, params, dataKey)
    } catch {
      optionsRef.value = []
      ElMessage.error(typeof errorMsg === 'function' ? errorMsg() : errorMsg)
    } finally {
      listLoading.value = false
    }
  }

  function fetchSourceList() {
    return loadList('/getSourceList', null, 'source_list', sourceOptions, () => t('template.errorLoadSource'))
  }

  function fetchPlatformList() {
    if (!sourceValue.value) return
    return loadList('/getPlatformList', { source: sourceValue.value }, 'platform_list', platformOptions, () => t('template.errorLoadPlatform'))
  }

  function fetchTemplateList() {
    if (!platformValue.value || !sourceValue.value) return
    return loadList('/getTemplateList', { platform: platformValue.value, source: sourceValue.value }, 'template_list', templateOptions, () => t('template.errorLoadTemplate'))
  }

  async function fetchLoadTemplate() {
    if (!templateValue.value || !sourceValue.value) return
    listLoading.value = true
    try {
      templateText.value = await fetchList('/loadTemplate', { template: templateValue.value, source: sourceValue.value }, 'content')
    } catch {
      ElMessage.error(t('template.errorLoadContent'))
    } finally {
      listLoading.value = false
    }
  }

  async function fetchParseTextFSM() {
    if (!rawText.value || !templateText.value) {
      result.value = ''
      return
    }
    parseLoading.value = true
    parseError.value = false
    try {
      const data = await parseTextFSM(rawText.value, templateText.value)
      if (!data) return
      if (data.msg) {
        parseError.value = true
        result.value = data.msg
      } else {
        result.value = JSON.stringify(data, null, 2)
      }
    } catch {
      parseError.value = true
      result.value = t('template.errorNetwork')
      ElMessage.error(t('template.errorParse'))
    } finally {
      parseLoading.value = false
    }
  }

  const debouncedParse = useDebounceFn(fetchParseTextFSM, 500)
  watch([rawText, templateText], debouncedParse)

  return {
    sourceOptions, sourceValue,
    platformOptions, platformValue,
    templateOptions, templateValue,
    rawText, templateText, result, parseError,
    listLoading, parseLoading,
    fetchSourceList, fetchPlatformList, fetchTemplateList,
    fetchLoadTemplate, fetchParseTextFSM
  }
})
