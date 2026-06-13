import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/shared'
import { ElMessage } from 'element-plus'
import { fetchList, parseTextFSM } from '../api'

export const useTemplateStore = defineStore('template', () => {
  const sourceOptions = ref([])
  const sourceValue = ref('')
  const platformOptions = ref([])
  const platformValue = ref('')
  const templateOptions = ref([])
  const templateValue = ref('')

  const rawText = ref('')
  const templateText = ref('')
  const result = ref('')
  const parseError = ref(false)

  const listLoading = ref(false)
  const parseLoading = ref(false)

  watch(sourceValue, () => {
    platformOptions.value = []
    platformValue.value = ''
    templateOptions.value = []
    templateValue.value = ''
  })

  watch(platformValue, () => {
    templateOptions.value = []
    templateValue.value = ''
  })

  async function loadList(apiPath, params, dataKey, optionsRef, errorMsg) {
    listLoading.value = true
    try {
      optionsRef.value = await fetchList(apiPath, params, dataKey)
    } catch {
      optionsRef.value = []
      ElMessage.error(errorMsg)
    } finally {
      listLoading.value = false
    }
  }

  function fetchSourceList() {
    return loadList('/getSourceList', null, 'source_list', sourceOptions, '加载 Source 列表失败')
  }

  function fetchPlatformList() {
    if (!sourceValue.value) return
    return loadList('/getPlatformList', { source: sourceValue.value }, 'platform_list', platformOptions, '加载 Platform 列表失败')
  }

  function fetchTemplateList() {
    if (!platformValue.value || !sourceValue.value) return
    return loadList('/getTemplateList', { platform: platformValue.value, source: sourceValue.value }, 'template_list', templateOptions, '加载 Template 列表失败')
  }

  async function fetchLoadTemplate() {
    if (!templateValue.value || !sourceValue.value) return
    listLoading.value = true
    try {
      templateText.value = await fetchList('/loadTemplate', { template: templateValue.value, source: sourceValue.value }, 'content')
    } catch {
      ElMessage.error('加载模板内容失败')
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
      if (data && data.msg) {
        parseError.value = true
        result.value = data.msg
      } else {
        result.value = JSON.stringify(data, null, 2)
      }
    } catch {
      parseError.value = true
      result.value = '网络错误，请检查后端服务'
      ElMessage.error('解析请求失败')
    } finally {
      parseLoading.value = false
    }
  }

  const debouncedParse = useDebounceFn(fetchParseTextFSM, 300)
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
