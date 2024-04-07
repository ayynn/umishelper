<template>
    <div class="flex flex-col">
        <h4 class="text-sm m-0 mb-2">{{ language['MostUsedMenus'] }}: </h4>
        <div class="flex gap-2 mb-2 min-h-6">
            <el-tag v-for="item in mostUsedQuickNaviList" :key="item.id" class="cursor-pointer" closable
                @close="removeMostUsedMenu" @click="openMostusedMenu(item.id)">{{ item.name }}</el-tag>
        </div>
        <h4 class="text-sm m-0 mb-2">{{ language['QuickNavi'] }}: </h4>
        <el-select multiple value-key="appCode" @change="quickNavi" class="box-border mb-2"
            popper-class="umis-contentpage-menu-popper" v-model="quickNaviDest">
            <template #header>
                <el-input v-model="selectFilter" placeholder="搜索应用" @input="selectFilterChange"></el-input>
            </template>
            <el-option-group v-for="group in appList" :key="group.code" :label="group.name">
                <template v-for="item in group.apps" :key="item.appCode">
                    <el-option :value="item" :label="item.name" v-show="item.show">
                        <div class="flex items-center cursor-pointer hover:shadow-md">
                            <el-image class="w-8 h-8 m-2"
                                :src="item.iconUrl || store.urlOrigin + '/statics/images/app/default_icon.png'" />
                            <span>
                                {{ item.name }}
                            </span>
                            <el-icon size="16" class="absolute right-10 hover:text-primary"
                                @click="addMostUsedMenuTag(item, $event)">
                                <Plus />
                            </el-icon>
                        </div>
                    </el-option>
                </template>
            </el-option-group>
        </el-select>
        <h4 class="text-sm m-0 mb-2">{{ language['ChangeGateway'] }}: </h4>
        <div class="flex gap-2 mb-2 min-h-6">
            <el-select v-model="currentMenhu" @change="menhuChange">
                <el-option v-for="item in menhuList" :key="item.id" :label="item" :value="item" />
            </el-select>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useUserStore } from '../store/user'
import request from '@/lib/request'
import { postHelperMessage } from '../utils/postMessage';
import pinyin from 'chinese-to-pinyin'
import { Plus } from '@element-plus/icons-vue';
import { useGetLang } from '../lang/getLang';

const store = useUserStore()

const language = useGetLang('QuickNavi')

const appList = ref<any[]>([])

const flattedApp = computed(() => {
    return appList.value.flatMap(item => item.apps)
})

const selectFilter = ref('')

const mostUsedQuickNaviList = ref([])

const quickNaviDest = ref([])
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
            item.apps = item.apps.filter(s => s.privilegeType == 'Menu')
            item.apps.forEach(s => {
                if(s.appCode == 'COP'){
                    s.appCode=s.privilegeCode
                }
                s.searchPinyin = pinyin(s.name, { removeTone: true, removeSpace: true })
                s.show = true
            })
        })
        console.log('data with pinyin', data)
        appList.value = data
    }
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

async function quickNavi(e: any[]) {
    const activeIdsInHelper = e.map(item => {
        if (item.appCode == 'COP') {
            return item.privilegeCode
        }
        return item.appCode
    })
    const activeidsInApp = await getCurrentActiveMenu()
    const idsInHelperButNotInApp = activeIdsInHelper.filter(item => !activeidsInApp.includes(item))
    const idsInAppButNotInHelper = activeidsInApp.filter(item => !activeIdsInHelper.includes(item))

    idsInHelperButNotInApp.forEach(element => {
        postHelperMessage({
            type: 'openmenu',
            data: {
                appCode: element
            }
        })
    });

    idsInAppButNotInHelper.forEach(e => {
        postHelperMessage({
            type: 'closemenu',
            data: {
                appCode: e
            }
        })
    })
}

function selectFilterChange(e: string) {
    const searchLetters = '^.*' + e.trim().split('').join('.*') + '.*$'
    const reg = new RegExp(searchLetters)
    flattedApp.value.forEach(item => {
        const pinyinSearch = item.searchPinyin
        if (reg.test(pinyinSearch)) {
            item.show = true
        } else if (item.name.includes(e)) {
            item.show = true
        } else {
            item.show = false
        }
    })
}
function addMostUsedMenuTag(itemInfo: any, event: any) {
    event.stopPropagation();
    let id = null;
    if (itemInfo.appCode == 'COP') {
        id = itemInfo.privilegeCode
    } else {
        id = itemInfo.appCode
    }

    mostUsedQuickNaviList.value.push({
        id,
        name: itemInfo.name
    })
    chrome.storage.local.set({
        [mostUsedMenuStorageId]: mostUsedQuickNaviList.value
    })
}

const mostUsedMenuStorageId = `${store.urlOrigin}_mostUsedQuickNaviList`

function syncMostUsedQuickNaviList() {
    chrome.storage.local.get([mostUsedMenuStorageId], (res) => {
        let info = res[mostUsedMenuStorageId]
        if (info) {
            const watcher = watch(flattedApp, nv => {
                if (nv) {
                    const infoArr = []
                    for (const key in info) {
                        infoArr[key] = info[key]
                    }
                    mostUsedQuickNaviList.value = infoArr.filter(item => {
                        if (flattedApp.value.find(app => app.appCode == item.id || app.privilegeCode == item.id)) {
                            return true
                        } else {
                            return false
                        }
                    })
                    watcher && watcher()
                }
            })
        }
    }
    )
}
function openMostusedMenu(id: string) {
    console.log('menu id', id)
    const openItem = flattedApp.value.find(item => {
        if (item.appCode == 'COP') {
            return item.privilegeCode == id
        }
        return item.appCode == id
    })

    if (!openItem) return
    if (quickNaviDest.value.includes(openItem)) return
    quickNaviDest.value.push(openItem)
    quickNavi(quickNaviDest.value)
}

function removeMostUsedMenu(item) {
    mostUsedQuickNaviList.value.splice(mostUsedQuickNaviList.value.indexOf(item), 1)
    chrome.storage.local.set({
        [mostUsedMenuStorageId]: mostUsedQuickNaviList.value
    })
}

const menhuList=ref([])
const currentMenhu=ref('')

function menhuChange(title){
    postHelperMessage({
        type:'selectGlobalBoxItem',
        data:{
            title
        }
    })
}

async function getGlobalBoxItems(){
    chrome.tabs.sendMessage(store.tabId,{
        type: 'getGlobalBoxItems'
    },{},(res)=>{
        menhuList.value=res.titleArr
        currentMenhu.value=res.defaultTitle
    })
}


onMounted(() => {
    syncMostUsedQuickNaviList()
    getAllAvailableApps()
    getGlobalBoxItems()
})
</script>