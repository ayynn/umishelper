import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

const messages = {
    en,
    zh
}

const i18n = createI18n({
    legacy: false, // VUE3 组合式API
    locale: 'zh', // 默认cn语言环境
    fallbackLocale: 'en',  //备用语言环境
    messages
})

export default i18n