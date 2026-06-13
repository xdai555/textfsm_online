import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import en from './en.json'

const STORAGE_KEY = 'textfsm-locale'
const SUPPORTED_LOCALES = ['zh-CN', 'en']

const LOCALE_ATTRS = {
  'zh-CN': { htmlLang: 'zh-CN', title: 'TextFSM 在线解析 - xdai.vip', ogLocale: 'zh_CN' },
  en:      { htmlLang: 'en',     title: 'TextFSM Online Parser - xdai.vip', ogLocale: 'en_US' }
}

function detectLocale() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && SUPPORTED_LOCALES.includes(stored)) return stored
  const navLang = navigator.language || ''
  if (navLang.startsWith('zh')) return 'zh-CN'
  if (navLang.startsWith('en')) return 'en'
  return 'zh-CN'
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'zh-CN',
  warnHtmlMessage: false,
  messages: { 'zh-CN': zhCN, en }
})

export function getCurrentLocale() {
  return i18n.global.locale.value
}

export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)

  const attrs = LOCALE_ATTRS[locale]
  document.documentElement.setAttribute('lang', attrs.htmlLang)
  document.title = attrs.title
  if (ogLocaleMeta) ogLocaleMeta.setAttribute('content', attrs.ogLocale)
}

const ogLocaleMeta = document.querySelector('meta[property="og:locale"]')

export const t = i18n.global.t

setLocale(i18n.global.locale.value)

export default i18n
