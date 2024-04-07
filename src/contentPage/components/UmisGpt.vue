<template>
    <div>
        <el-form label-position="top" label-suffix=":" label-width="100px">
            <el-form-item :label="lang['Question']">
                <div class="flex items-center w-full">
                    <el-input @compositionstart="toggleComposition(true)" @compositionend="toggleComposition(false)"
                        @keydown="keydownEvent" ref="textarearef" class="flex-1 min-h-10" type="textarea"
                        :autosize="{ minRows: 1 }" :placeholder="lang['AskQuestions']" v-model="searchText" clearable>
                    </el-input>
                    <el-icon class="cursor-pointer w-10 mr-4 text-center text-gray-400 h-full hover:text-primary"
                        size="24" @click="search">
                        <Search />
                    </el-icon>
                </div>
            </el-form-item>
            <el-form-item :label="lang['Answer']">
                <div class="min-h-20 w-full border border-solid border-gray-300 rounded">
                    <VueMarkDown :source="gptresult" />
                </div>
            </el-form-item>
            <div v-if="loading" class="w-full h-10" v-loading="loading"></div>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, reactive, watch, computed, getCurrentInstance, onMounted, inject, nextTick } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { useUserStore } from '../store/user';
import { fetchEventSource } from '@microsoft/fetch-event-source'
import VueMarkDown from 'vue-markdown-render'
import type { InputInstance } from 'element-plus'
import { useGetLang } from '../lang/getLang';

const lang = useGetLang('UmisGpt')

const emits = defineEmits()
const { proxy } = getCurrentInstance()

const store = useUserStore()

const searchText = ref()
const gptresult = ref('')

const loading = ref(false)

const currentController = ref(null)

const textarearef = ref<InputInstance>()

const setActiveMenuTab: (index: string) => void = inject('setActiveMenuTab')

async function search(e) {
    e && e.preventDefault()
    gptresult.value = ''
    if (currentController.value) currentController.value.abort()
    const controller = new AbortController()
    const signal = controller.signal
    currentController.value = controller

    fetchEventSource(`${store.urlOrigin}/gpt/v3/es`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: searchText.value,
            systemContent: ""
        }),
        signal,
        onmessage(event) {
            if (event.data == '[DONE]') {
                currentController.value = null
                loading.value = false
                return
            } else {
                gptresult.value += event.data.replaceAll('<br>', '\n')
            }
        },
        async onclose() {
            controller.abort()
            currentController.value = null
            loading.value = false
        },
        onerror: (e) => {
            controller.abort()
            currentController.value = null
            loading.value = false
        }
    })
}

function registerChromeRuntimeMessageEvent() {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.type == 'UMIS_GPT_SEARCH') {
            console.log('umis gpt search', request, sender)
            store.toggleHelper()
            setActiveMenuTab('2')
            searchText.value = request.selectedText
            setTimeout(() => {
                textarearef.value.resizeTextarea()
            }, 200);
        }
        sendResponse()
        return true
    })
}
function keydownEvent(e: KeyboardEvent) {
    console.log('key down event', e)
    if (e.key == 'Enter') {
        if (!e.shiftKey && !compositionStatus.value) {
            search(null)
            e.preventDefault()
            return
        }
    }
}

const compositionStatus = ref(false)

function toggleComposition(e) {
    compositionStatus.value = e
    console.log('compositionstartEvent', e)
}

onMounted(() => {
    registerChromeRuntimeMessageEvent()
})

</script>
<style scoped lang="less"></style>