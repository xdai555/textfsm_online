import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

const controllers = {}

async function abortableRequest(key, config) {
  if (controllers[key]) controllers[key].abort()
  const controller = new AbortController()
  controllers[key] = controller
  try {
    const res = await api({ ...config, signal: controller.signal })
    return res.data
  } catch (e) {
    if (axios.isCancel(e)) return undefined
    throw e
  } finally {
    if (controllers[key] === controller) controllers[key] = null
  }
}

export function fetchList(apiPath, params, dataKey) {
  return abortableRequest('list', { url: apiPath, method: 'get', params })
    .then(res => res?.data[dataKey])
}

export function parseTextFSM(rawText, templateText) {
  return abortableRequest('parse', {
    url: '/parser',
    method: 'post',
    data: { raw_text: rawText, template_text: templateText }
  })
}

function toSharePayload(data) {
  return {
    raw_text: data.rawText, template_text: data.templateText,
    source_value: data.sourceValue, platform_value: data.platformValue,
    template_value: data.templateValue
  }
}

export function getShare(shareId) {
  return abortableRequest('share', { url: `/getShare/${shareId}`, method: 'get' })
}

export function createShare(data) {
  return abortableRequest('share_action', {
    url: '/createShare', method: 'post',
    data: toSharePayload(data)
  })
}

export function updateShare(shareId, data) {
  return abortableRequest('share_action', {
    url: `/updateShare/${shareId}`, method: 'post',
    data: toSharePayload(data)
  })
}
