<template>
    <div class="box-border flex flex-col w-full" :style="{
        height:'calc(100vh - 62px)'
    }">
        <Header />
        <QuickNavi />
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from './store/user'
import request from '@/lib/request'
import Header from './components/Header.vue';
import QuickNavi from './components/QuickNavi.vue';

const store = useUserStore()


function registerOpenCloseEvent() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        store.toggleHelper(message.status)
        sendResponse()
        return true
    })
}

onMounted(() => {
    registerOpenCloseEvent()
})

</script>
<style lang="less">
.umis-contentpage-menu-popper{
    .el-select-dropdown__item{
        height: 54px;
    }
}
</style>