<template>
    <div class="popupwrapper">
        <header>
            <el-image src="../icons/umisicon.png" />
        </header>
        <div class="toggleButton" v-if="!ifInMainSite">
            <el-button @click="goToUMIS">Go to Main Site</el-button>
        </div>
        <div class="toggleButton" v-else>
            <el-button @click="toggleHelper">Open Helper</el-button>
            <el-button @click="toggleHelper">Close helper</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
const ifInMainSite = ref()
function toggleHelper() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: 'toggleHelper'
        }).catch(err => {
            console.log(err)
            ElMessage.warning({
                message: 'Fail to establish helper',
            })
        })
    })
}
function goToUMIS() {
    chrome.tabs.create({
        url: 'https://smartoffice.beyondbit.com:2001/portal/',
        active: true
    })
}

onMounted(async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const currentActiveTab = tabs[0]
    if (currentActiveTab.url.includes('beyondbit.com')) {
        ifInMainSite.value = true
    } else {
        ifInMainSite.value = false
    }
})

</script>
<style>
body {
    margin: 0px;
}
</style>
<style lang="less" scoped>
.popupwrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 200px;
    box-sizing: border-box;
    padding: 10px;
    background-color: #4982fc;

    :deep(.el-image) {
        width: 48px;
        height: 48px;
        margin: 10px;
    }
}

.toggleButton {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    gap: 5px;
}

:deep(.el-button+.el-button) {
    margin-left: 0px;
}
</style>