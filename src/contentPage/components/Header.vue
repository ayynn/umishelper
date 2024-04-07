<template>
    <div class="list-none flex items-center justify-between space-x-2 p-4">
        <div class="flex items-center space-x-2">
            <span :class="{
                'text-primary': locale === 'zh',
                'cursor-pointer': true
            }" @click="$emit('changeLang', 'zh')">中</span>
            <span :class="{
                'text-primary': locale === 'en',
                'cursor-pointer': true
            }" @click="$emit('changeLang', 'en')">En</span>
        </div>
        <div @click="toggleExpandFold">
            <el-icon size="24" class="cursor-pointer hover:text-primary">
                <template v-if="toggleStatus">
                    <Fold />
                </template>
                <template v-else>
                    <Expand />
                </template>
            </el-icon>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '../store/user';
import { Expand, Fold } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue';
const { locale } = useI18n()
console.log(locale)
const store = useUserStore()

const toggleStatus = ref(false)

function toggleExpandFold() {
    chrome.tabs.sendMessage(store.tabId, {
        type: 'toggleExpandFold'
    }, {}, res => {
        console.log('response toggle status', res)
        toggleStatus.value = res
    })
}

defineEmits({
    changeLang: (type: 'zh' | 'en') => { }
})
</script>