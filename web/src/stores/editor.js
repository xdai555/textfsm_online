import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { usePreferredDark, useMediaQuery, useLocalStorage } from '@vueuse/core'

export const useEditorStore = defineStore('editor', () => {
  const mode = useLocalStorage('textfsm-theme-mode', 'system')
  const preferredDark = usePreferredDark()
  const isDark = computed(() => {
    if (mode.value === 'dark') return true
    if (mode.value === 'light') return false
    return preferredDark.value
  })

  watch(isDark, (dark) => {
    document.documentElement.classList.toggle('dark', dark)
  }, { immediate: true })

  const fontSize = useLocalStorage('textfsm-font-size', 13, { serializer: { read: Number, write: String } })

  const isNarrow = useMediaQuery('(max-width: 768px)')
  const horizontal = ref(false)

  watch(isNarrow, (narrow) => {
    horizontal.value = narrow
  }, { immediate: true })

  const THEME_CYCLE = ['system', 'light', 'dark']

  function toggleTheme() {
    const idx = THEME_CYCLE.indexOf(mode.value)
    mode.value = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]
  }

  return { isDark, mode, fontSize, horizontal, toggleTheme }
})
