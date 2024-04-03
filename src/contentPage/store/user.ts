import { defineStore } from 'pinia'
import { computed, ComputedRef } from 'vue'
import request from '@/lib/request'
import { postHelperMessage } from '../utils/postMessage'

interface State {
    url: InstanceType<typeof URL> | null,
    urlOrigin: string,
    userInfo: any | null
    token: string
    tabId: number
}

export const useUserStore = defineStore('user', {
    state: () => {
        const state: State = {
            url: null,
            urlOrigin: '',
            userInfo: null,
            token: null,
            tabId: null
        }
        return state
    },
    actions: {
        toggleHelper(status: boolean) {
            postHelperMessage({
                type: 'toggleHelper',
                status
            })
        },
        setCookieAndUserinfo() {
            const that = this
            chrome.tabs.getCurrent((tab) => {
                that.tabId = tab.id
            })
            chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
                const u = new URL(tabs[0]?.url)
                that.url = u
                that.urlOrigin = u.origin
                const cookies = await chrome.cookies.get({
                    name: '_sso_token',
                    url: that.urlOrigin
                })
                if (cookies.value) {
                    that.token = cookies.value
                    const { data, success } = await request<any>({ url: `/api/private/bua/user/getUserForMultiUnit`, method: 'GET' })
                    if (success) {
                        that.userInfo = data
                        console.log('userinfo', that.userInfo)
                    }
                }
            })
        }
    },
})
