import { createApp } from 'vue'
import App from './App.vue'
// @ts-ignore
import router from '@/router'
import '@/router/premission'

// @ts-ignore
import store from '@/store'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')

function loadModuleFile() {
    import('@/components/filters').then(m => {
        m.loadFilter(app)
    })
    import('@/components/el-registry').then(m => {
        m.loadElementUi(app)
    })
}
loadModuleFile()

app.config.errorHandler = (err, vm, info) => {
    // 处理错误
    console.error(err, vm, info)
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
}
export default app




