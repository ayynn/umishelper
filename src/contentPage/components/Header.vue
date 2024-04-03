<template>
    <div class="flex justify-between items-center p-3">
        <div class="flex justify-center items-center">
            <el-image class="w-12 h-12 rounded-full"
                :src="`${store.urlOrigin}/api/bua/avatar/getHeadPhoto?userUid=${store.userInfo?.userUid}`"></el-image>
            <div class="ml-3 text-base">{{ store.userInfo?.name }}</div>
        </div>
        <div>
            <el-icon size="24" class="hover:text-[#409eff] cursor-pointer" @click="store.toggleHelper(false)">
                <Right />
            </el-icon>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '../store/user';
import { Right } from '@element-plus/icons-vue'
const store = useUserStore()
</script>