import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'splitpanes/dist/splitpanes.css'
import './styles/global.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
