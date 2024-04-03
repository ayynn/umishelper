<template>
    <div class="flex flex-col m-4">
        <h4 class="text-sm m-0 mb-2">快速导航: </h4>
        <el-select multiple value-key="appCode" @change="quickNavi" class="box-border"
            popper-class="umis-contentpage-menu-popper" v-model="quickNaviDest">
            <el-option-group v-for="group in appList" :key="group.code" :label="group.name">
                <el-option v-for="item in group.apps" :key="item.appCode" :value="item" :label="item.name">
                    <div class="flex items-center cursor-pointer hover:shadow-md">
                        <el-image class="w-8 h-8 m-2"
                            :src="item.iconUrl || store.urlOrigin + '/statics/images/app/default_icon.png'" />
                        <span>
                            {{ item.name }}
                        </span>
                    </div>
                </el-option>
            </el-option-group>
        </el-select>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRaw } from 'vue'
import { useUserStore } from '../store/user'
import request from '@/lib/request'
import { postHelperMessage } from '../utils/postMessage';

const store = useUserStore()

const appList = ref<any[]>([])

const quickNaviDest = ref(null)
async function getAllAvailableApps() {
    const { data, success } = await request<any[]>({
        url: '/api/private/portal/menu/queryApp',
        method: 'GET',
        params: {
            includeAll: true
        }
    })
    if (success) {
        data.forEach(item => {
            item.apps=item.apps.filter(s=>s.privilegeType=='Menu')
        })
        appList.value = data}
}

async function getCurrentActiveMenu() {
    return new Promise<any[]>(resolve => {
        chrome.tabs.sendMessage(store.tabId, {
            type: 'getCurrentOpenMenu'
        }, {}, (res) => {
            resolve(res)
        })
    })
}

async function quickNavi(e:any[]) {
    const activeIdsInHelper=e.map(item=>{
        if(item.appCode=='COP'){
            return item.privilegeCode
        }
        return item.appCode
    })
    const activeidsInApp=await getCurrentActiveMenu()
    const idsInHelperButNotInApp=activeIdsInHelper.filter(item=>!activeidsInApp.includes(item))
    const idsInAppButNotInHelper=activeidsInApp.filter(item=>!activeIdsInHelper.includes(item))

    idsInHelperButNotInApp.forEach(element => {
        postHelperMessage({
            type:'openmenu',
            data:{
                appCode:element
            }
        })
    });

    idsInAppButNotInHelper.forEach(e=>{
        postHelperMessage({
            type:'closemenu',
            data:{
                appCode:e
            }
        })
    })
}

onMounted(() => {
    getAllAvailableApps()
})
</script>