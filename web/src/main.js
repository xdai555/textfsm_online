import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'splitpanes/dist/splitpanes.css'
import './styles/global.css'
import App from './App.vue'
import IconGithub from './components/icons/IconGithub.vue'

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.component('IconGithub', IconGithub)
app.mount('#app')
