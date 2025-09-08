import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCodemirror from 'vue-codemirror'
import { Container, Footer, Switch, Col, Main, Select, Option, Button, InputNumber, Tooltip, Alert, Dialog, Input, Tag, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import ElementUI from 'element-ui'

Vue.use(VueCodemirror)
Vue.use(Container)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Switch)
Vue.use(Col)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(InputNumber)
Vue.use(Tooltip)
Vue.use(Alert)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Tag)
// Vue.use(ElementUI)

Vue.prototype.$message = Message

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
