<template>
    <ElConfigProvider :locale="elementLang">
        <div class="box-border flex flex-col w-full h-screen">
            <Header @changeLang="cL" />
            <el-tabs @tab-click="tabClick" v-model="activeMenu" class="h-0 flex-1 flex flex-col">
                <el-tab-pane v-for="item in menus" :label="item.label" :name="item.index" :key="item.index">
                    <component :is="item.component"></component>
                </el-tab-pane>
            </el-tabs>
        </div>
    </ElConfigProvider>
</template>
<script setup lang="ts">
import { onMounted, ref, defineAsyncComponent, provide, watch, computed } from 'vue'
import { useUserStore } from './store/user'
import Header from './components/Header.vue';
import { ElConfigProvider } from 'element-plus';
import { zhCn, en } from 'element-plus/es/locale/index.mjs';
import { useI18n } from 'vue-i18n';
import { getLangKey } from './lang/getLang'

const store = useUserStore()

const activeMenu = ref('1')

const { tm, locale } = useI18n()
const getLang = computed(() => {
    return tm
})

provide(getLangKey, getLang)
const language = computed(() => {
    return getLang.value('QuickNavi')
})

const elementLang = ref(zhCn)

function registerOpenCloseEvent() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.type == 'toggleHelper') {
            store.toggleHelper()
        }
        sendResponse()
        return true
    })
}

function setActiveMenuTab(index: string) {
    activeMenu.value = index
}

provide('setActiveMenuTab', setActiveMenuTab)

const menus = ref([
    {
        index: '1',
        label: computed(() => {
            return language.value['QuickNavi']
        }),
        component: defineAsyncComponent(() => import('./components/QuickNavi.vue'))
    },
    {
        index: '2',
        label: 'Umis Gpt',
        component: defineAsyncComponent(() => import('./components/UmisGpt.vue'))
    }
])

function tabClick(tab) {
    console.log('select menu index', tab, menus)
}

function cL(lang) {
    chrome.storage.local.set({
        lang
    })
    elementLang.value =
        lang == 'zh' ? zhCn : en
    locale.value = lang
}

onMounted(async () => {
    const { lang } = await chrome.storage.local.get(['lang'])
    if (lang) {
        elementLang.value = lang == 'zh' ? zhCn : en
        locale.value = lang
    }
    registerOpenCloseEvent()
})

</script>
<style lang="less">
.umis-contentpage-menu-popper {
    .el-select-dropdown__item {
        height: 54px;
    }
}
</style>
<style lang="less" scoped>
:deep(.el-tabs__content) {
    @apply w-full h-0 flex-1 overflow-scroll box-border p-3;
}

:deep(.el-tabs__header) {
    @apply pl-3;
}
</style>