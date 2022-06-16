import Vue from 'vue'
import { Button, Dialog, Dropdown, DropdownMenu, DropdownItem, Input, Message } from 'element-ui'
import VueClipboard from 'vue-clipboard2'
import App from './App.vue'

Vue.prototype.$ELEMENT = { size: 'small' }
Vue.prototype.$message = Message
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Input)
Vue.use(VueClipboard)

new Vue({
  el: '#app',
  render: h => h(App)
})
