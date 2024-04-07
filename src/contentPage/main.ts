import { createApp, watch } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { useUserStore } from './store/user'
import i18n from './lang'

const pinia = createPinia()
const app = createApp(App).use(ElementPlus).use(pinia).use(i18n)

const store = useUserStore()
store.setCookieAndUserinfo()

const watcher = watch(() => store.token, nv => {
    if (nv) {
        app.mount('#app')
        watcher()
    }
})