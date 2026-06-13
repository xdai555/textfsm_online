import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

let lastController = null

export async function request(config) {
  if (lastController) lastController.abort()
  const controller = new AbortController()
  lastController = controller
  try {
    const res = await api({ ...config, signal: controller.signal })
    return res.data
  } catch (e) {
    if (axios.isCancel(e)) return undefined
    throw e
  } finally {
    if (lastController === controller) lastController = null
  }
}

export function fetchList(apiPath, params, dataKey) {
  return request({ url: apiPath, method: 'get', params })
    .then(res => res.data[dataKey])
}

export function parseTextFSM(rawText, templateText) {
  return request({
    url: '/parser',
    method: 'post',
    data: { raw_text: rawText, template_text: templateText }
  })
}
