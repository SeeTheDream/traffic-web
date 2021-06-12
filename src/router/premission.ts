import router from './index'
// @ts-ignore
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        // @ts-ignore
        document.title = to.meta.title
    }
    NProgress.start()
    next()
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})
