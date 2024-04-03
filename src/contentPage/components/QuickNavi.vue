<template>
    <label>
        <span class="text-sm">快速导航: </span>
        <el-select value-key="url" @change="quickNavi" class="p-4 box-border" popper-class="umis-contentpage-menu-popper" v-model="quickNaviDest">
            <el-option-group v-for="group in appList" :key="group.code" :label="group.name">
                <el-option v-for="item in group.apps" :key="item.appCode" :value="item">
                    <div class="flex items-center cursor-pointer hover:shadow-md">
                        <el-image class="w-8 h-8 m-2"
                            :src="item.iconUrl || store.urlOrigin + '/statics/images/app/default_icon.png'" />
                        <span>
                            {{ item.name }}
                        </span>
                    </div>
                </el-option>
            </el-option-group>
            <template #prefix>
                <div>
                    {{ quickNaviDest?.name }}
                </div>
            </template>
        </el-select>
    </label>
</template>

<script lang="ts"setup>
import { ref, onMounted,toRaw } from 'vue'
import { useUserStore } from '../store/user'
import request from '@/lib/request'
import { postHelperMessage } from '../utils/postMessage';

const store = useUserStore()

const appList = ref<any[]>([])

const quickNaviDest=ref(null)
async function getAllAvailableApps() {
    const { data, success } = await request<any[]>({
        url: '/api/private/portal/menu/queryApp',
        method: 'GET',
        params: {
            includeAll: true
        }
    })
    console.log('applist', data, success)
    if (success) appList.value = data
}

function quickNavi(e){
    console.log(e)
    postHelperMessage({
        type: 'openmenu',
        data: toRaw(e)
    })
}

onMounted(()=>{
    getAllAvailableApps()
})
</script>