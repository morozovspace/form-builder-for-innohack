import Vue from "vue"
import ElementUI from "element-ui"
import "@/assets/styles/element-variables.scss"
const components = {}

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
Vue.use(ElementUI)
