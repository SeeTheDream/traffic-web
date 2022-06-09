import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/router/premission'
// import ElementPlus from "element-plus";
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import store from '@/store'


const app = createApp(App)
app.use(router)
app.use(store)
// app.use(ElementPlus, { size: 'small', zIndex: 3000, locale: zhCn, })
app.config.globalProperties.$ELEMENT = {
    size: 'small',
    locale: zhCn
}

app.mount('#app')

function loadModuleFile() {
    import('@/components/filters').then(m => {
        m.loadFilter(app)
    })
}
loadModuleFile()

app.config.errorHandler = (err, vm, info) => {
    // 处理错误
    console.error(err, vm, info)
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
}
export default app




